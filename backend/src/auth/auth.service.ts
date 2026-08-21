import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import { DataSource, IsNull, Repository } from 'typeorm';

import { toPublicUser } from '../shared/utils/public-user.utils';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AccessTokenPayload, AuthResponse } from './auth.types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmailWithPassword(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Já existe uma conta cadastrada com este e-mail.');
    }

    const passwordHash = await hash(registerDto.password, 12);
    try {
      const user = await this.usersService.create(registerDto.name, registerDto.email, passwordHash);
      return this.createSession(user);
    } catch (error) {
      if (this.isUniqueConstraintViolation(error)) {
        throw new ConflictException('Já existe uma conta cadastrada com este e-mail.');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmailWithPassword(loginDto.email);
    const passwordMatches = user ? await compare(loginDto.password, user.passwordHash) : false;
    if (!user || !passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    return this.createSession(user);
  }

  async refresh(rawRefreshToken: string): Promise<AuthResponse> {
    const tokenHash = this.hashRefreshToken(rawRefreshToken);
    return this.dataSource.transaction(async (manager) => {
      const tokenRepository = manager.getRepository(RefreshToken);
      const storedToken = await tokenRepository.findOne({
        where: { tokenHash },
        lock: { mode: 'pessimistic_write' }
      });
      if (!storedToken || storedToken.revokedAt || storedToken.expiresAt <= new Date()) {
        throw new UnauthorizedException('O token de atualização expirou ou já foi utilizado.');
      }

      const user = await manager.getRepository(User).findOne({
        where: { id: storedToken.userId, isActive: true }
      });
      if (!user) {
        throw new UnauthorizedException('A conta associada ao token não está ativa.');
      }

      storedToken.revokedAt = new Date();
      await tokenRepository.save(storedToken);
      return this.createSession(user, tokenRepository);
    });
  }

  async logout(rawRefreshToken: string) {
    await this.refreshTokensRepository.update(
      { tokenHash: this.hashRefreshToken(rawRefreshToken), revokedAt: IsNull() },
      { revokedAt: new Date() }
    );
  }

  private async createSession(
    user: User,
    tokenRepository: Repository<RefreshToken> = this.refreshTokensRepository
  ): Promise<AuthResponse> {
    const accessPayload: AccessTokenPayload = { sub: user.id, email: user.email, role: user.role };
    const expiresIn = this.configService.getOrThrow<string>(
      'JWT_ACCESS_EXPIRES_IN'
    ) as JwtSignOptions['expiresIn'];
    const accessToken = await this.jwtService.signAsync(accessPayload, { expiresIn });
    const refreshToken = randomBytes(48).toString('base64url');
    const refreshTokenDays = this.configService.getOrThrow<number>('REFRESH_TOKEN_DAYS');
    const expiresAt = new Date(Date.now() + refreshTokenDays * 24 * 60 * 60 * 1000);

    await tokenRepository.save(
      tokenRepository.create({
        tokenHash: this.hashRefreshToken(refreshToken),
        userId: user.id,
        expiresAt,
        revokedAt: null
      })
    );

    return { accessToken, refreshToken, user: toPublicUser(user) };
  }

  private hashRefreshToken(refreshToken: string) {
    return createHash('sha256').update(refreshToken).digest('hex');
  }

  private isUniqueConstraintViolation(error: unknown) {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
  }
}
