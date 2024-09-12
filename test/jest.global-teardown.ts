import { Logger } from '@nestjs/common';
import { mongoServer } from './jest.global-setup';

export default async function globalTeardown() {
  Logger.log('Jest teardown');
  await mongoServer.stop();
}
