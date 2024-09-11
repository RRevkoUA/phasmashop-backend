import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as portscanner from 'portscanner';

export async function createTestingModule(dbName: string, appPort: number) {
  const dbPort = parseInt(process.env.DB_URL.split(':').pop());
  let mongoServer: MongoMemoryServer;
  const isAppPortOpen = await portscanner
    .checkPortStatus(appPort)
    .catch((err) => {
      Logger.error(err);
      return undefined;
    });
  isAppPortOpen === 'open' ? (appPort += 1) : appPort;
  Logger.log(isAppPortOpen);
  const isDbPortOpen = await portscanner
    .checkPortStatus(dbPort)
    .catch((err) => {
      Logger.error(err);
      return undefined;
    });
  Logger.log(isDbPortOpen);
  if (isDbPortOpen === 'closed') {
    Logger.log('MongoDB is not running... run MongoDB');
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbPath: './test/database',
        port: dbPort,
      },
      binary: { version: '5.0.3' },
    }).catch((err) => {
      Logger.error(err);
      return undefined;
    });
  }
  const mongoUri: string = mongoServer
    ? mongoServer.getUri() + dbName
    : 'mongodb://localhost:' + dbPort + '/' + dbName;
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

  return { app, mongoServer };
}
