import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

export async function createTestingModule(dbName: string, appPort: number) {
  const dbPort = parseInt(process.env.DB_URL.split(':').pop());

  const mongoUri: string = 'mongodb://localhost:' + dbPort + '/' + dbName;
  Logger.log(mongoUri);
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [MongooseModule.forRoot(mongoUri), AppModule],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.init();
  await app.listen(appPort);
  Logger.log(`Server is running on http://localhost:${appPort}`);

  return { app };
}
