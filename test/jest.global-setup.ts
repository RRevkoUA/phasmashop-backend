import { Logger } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export default async function globalSetup() {
  const dbPort = parseInt(process.env.DB_URL.split(':').pop());
  Logger.log('Jest setup');

  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbPath: './test/database',
      port: dbPort,
    },
    binary: { version: '5.0.3' },
  })
    .then((server) => {
      Logger.log(
        'MongoDB server is running on port ' + server.instanceInfo.port,
      );
      return server;
    })
    .catch((err) => {
      Logger.error(err);
      return undefined;
    });
}

export { mongoServer };
