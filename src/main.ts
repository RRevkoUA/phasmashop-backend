import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DecryptionMiddleware } from './common/middlewares';
import * as bodyParser from 'body-parser';
import { EncryptionInterceptor } from './common/interceptor/encryption.interceptor';

async function bootstrap() {
  const logLevels = JSON.parse(process.env.LOG_LEVELS || '[]');
  const config = new DocumentBuilder()
    .setTitle('Phasmashop swagger api')
    .setDescription('pet project api testing, and representation')
    .setVersion('1.0')
    .build();

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.setGlobalPrefix(process.env.APP_GLOBAL_PREFIX);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.APP_SWAGGER_PATH, app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: process.env.APP_ORIGIN,
    credentials: true,
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.useGlobalInterceptors(new EncryptionInterceptor());

  app.use(new DecryptionMiddleware().use);
  app.useLogger(logLevels);

  await app.listen(process.env.APP_PORT);
  Logger.log(
    `Server running on http://127.0.0.1:${process.env.APP_PORT}`,
    'NestApplication',
  );
  Logger.log(
    `Swagger running on http://127.0.0.1:${process.env.APP_PORT}/${process.env.APP_SWAGGER_PATH}`,
    'NestApplication',
  );
}
bootstrap();
