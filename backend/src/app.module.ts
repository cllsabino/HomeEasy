import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EngagementModule } from './engagement/engagement.module';
import { HealthModule } from './health/health.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { SchedulesModule } from './schedules/schedules.module';
import { ServicesModule } from './services/services.module';
import { UsersModule } from './users/users.module';
import { validateEnvironment } from './config/environment.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('DATABASE_HOST'),
        port: configService.getOrThrow<number>('DATABASE_PORT'),
        database: configService.getOrThrow<string>('DATABASE_NAME'),
        username: configService.getOrThrow<string>('DATABASE_USER'),
        password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
        autoLoadEntities: true,
        synchronize: false
      })
    }),
    DatabaseModule,
    HealthModule,
    UsersModule,
    AuthModule,
    ServicesModule,
    ProfessionalsModule,
    SchedulesModule,
    MarketplaceModule,
    EngagementModule
  ]
})
export class AppModule {}
