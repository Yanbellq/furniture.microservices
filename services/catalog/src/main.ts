import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { AppModule } from '@/core/app.module';
import { getCorsConfig, getValidationConfig } from '@/core/config';
import { LoggingInterceptor } from '@/core/interceptors';

import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const logger = new Logger();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe(getValidationConfig()));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors(getCorsConfig(config));

  // Вмикаємо версійність
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', // Всі ендпоінти отримають /v1/ автоматично
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('@Gyp6.sale - Furniture.Wholesale API')
    .setDescription('API CATALOG service for Furniture.Wholesale')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    jsonDocumentUrl: 'swagger.json',
    yamlDocumentUrl: '/openapi.yaml',
  });

  const port = config.getOrThrow<number>('HTTP_PORT');
  const host = config.getOrThrow<string>('HTTP_HOST');

  await app.listen(port);

  logger.log(`Backend CATALOG service started: ${host}/api`);
  logger.log(`Swagger: ${host}/docs`);
}

bootstrap().catch(err => {
  new Logger('Bootstrap').error(err);
  process.exit(1);
});
