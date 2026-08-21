import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const frontendOrigins = configService
    .getOrThrow<string>('FRONTEND_ORIGINS')
    .split(',')
    .map((origin) => origin.trim());

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.enableCors({ origin: frontendOrigins, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  await app.listen(configService.get<number>('PORT', 3000));
}

void bootstrap();
