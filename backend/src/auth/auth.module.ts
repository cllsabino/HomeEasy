import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { AccessTokenGuard } from './access-token.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshToken } from './refresh-token.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET')
      })
    }),
    TypeOrmModule.forFeature([RefreshToken]),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: AccessTokenGuard }]
})
export class AuthModule {}
