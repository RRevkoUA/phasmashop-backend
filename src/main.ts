import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import {
  EncryptionMiddleware,
  DecryptionMiddleware,
} from './common/middlewares';
import * as bodyParser from 'body-parser';

async function bootstrap() {
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

  app.use(new EncryptionMiddleware().use);
  app.use(new DecryptionMiddleware().use);

  await app.listen(process.env.APP_PORT);
}
bootstrap();
