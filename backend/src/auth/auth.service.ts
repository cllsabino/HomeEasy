import {
  BadRequestException,
  ConflictException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import { DataSource, IsNull, Repository } from 'typeorm';

import { toPublicUser } from '../shared/utils/public-user.utils';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { AccessTokenPayload, AuthResponse } from './auth.types';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleIdentityService } from './google-identity.service';
import { RefreshToken } from './refresh-token.entity';
import { PasswordResetToken } from './password-reset-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly googleIdentityService: GoogleIdentityService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokensRepository: Repository<PasswordResetToken>
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmailWithPassword(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Já existe uma conta cadastrada com este e-mail.');
    }

    const passwordHash = await hash(registerDto.password, 12);
    try {
      const user = await this.usersService.create(
        registerDto.name,
        registerDto.email,
        passwordHash,
        registerDto.birthDate
      );
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

  async loginWithGoogle(googleLoginDto: GoogleLoginDto): Promise<AuthResponse> {
    const identity = await this.googleIdentityService.verify(googleLoginDto.idToken);
    let user = await this.usersService.findByGoogleSubject(identity.subject);

    if (!user) {
      user = await this.usersService.findByEmailWithPassword(identity.email);
      if (user?.googleSubject && user.googleSubject !== identity.subject) {
        throw new UnauthorizedException('Este e-mail já está vinculado a outra conta Google.');
      }
      if (user) {
        user = await this.usersService.linkGoogleSubject(user.id, identity.subject);
      } else {
        if (!googleLoginDto.birthDate) {
          throw new BadRequestException('Informe sua data de nascimento para criar uma conta com Google.');
        }
        const generatedPasswordHash = await hash(randomBytes(48).toString('base64url'), 12);
        user = await this.usersService.create(
          identity.name,
          identity.email,
          generatedPasswordHash,
          googleLoginDto.birthDate,
          identity.subject
        );
      }
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

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      return { message: 'Se existir uma conta com este e-mail, enviaremos as instruções de recuperação.' };
    }

    const rawToken = randomBytes(48).toString('base64url');
    const token = await this.passwordResetTokensRepository.save(
      this.passwordResetTokensRepository.create({
        tokenHash: this.hashRefreshToken(rawToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        usedAt: null
      })
    );
    try {
      await this.mailService.sendPasswordReset(user.email, rawToken);
    } catch {
      await this.passwordResetTokensRepository.delete(token.id);
      throw new ServiceUnavailableException(
        'O serviço de e-mail está indisponível. Tente novamente mais tarde.'
      );
    }
    return { message: 'Se existir uma conta com este e-mail, enviaremos as instruções de recuperação.' };
  }

  async resetPassword(rawToken: string, password: string) {
    const tokenHash = this.hashRefreshToken(rawToken);
    await this.dataSource.transaction(async (manager) => {
      const token = await manager.findOne(PasswordResetToken, {
        where: { tokenHash },
        lock: { mode: 'pessimistic_write' }
      });
      if (!token || token.usedAt || token.expiresAt <= new Date()) {
        throw new UnauthorizedException('O link de recuperação expirou ou já foi utilizado.');
      }
      const passwordHash = await hash(password, 12);
      await manager.update(User, { id: token.userId }, { passwordHash });
      token.usedAt = new Date();
      await manager.save(token);
      await manager.update(
        RefreshToken,
        { userId: token.userId, revokedAt: IsNull() },
        { revokedAt: new Date() }
      );
    });
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
