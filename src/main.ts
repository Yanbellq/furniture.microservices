import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/core/app.module';
import { useContainer } from 'class-validator';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from '@/core/interceptors';
import { getCorsConfig, getValidationConfig } from '@/core/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const logger = new Logger();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(getValidationConfig()));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors(getCorsConfig(config));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('@Gyp6.sale - Furniture.Wholesale API')
    .setDescription('API Backend for Furniture.Wholesale')
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

  logger.log(`Backend started: ${host}/api`);
  logger.log(`Swagger: ${host}/docs`);
}

bootstrap().catch((err) => {
  new Logger('Bootstrap').error(err);
  process.exit(1);
});
