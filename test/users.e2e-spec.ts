import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { SignupAuthDto } from 'src/auth/dto';
import { faker } from '@faker-js/faker';
import * as pactum from 'pactum';
import mongoose from 'mongoose';

describe('AuthController E2E Test', () => {
  let app: INestApplication;
  const host = `http://localhost:${process.env.APP_PORT}/`;
  const dto: SignupAuthDto = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
    phone: '+1610' + faker.helpers.fromRegExp('[0-9]{7}'),
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
    const db = mongoose.connection.db;
    await db.dropDatabase();
    mongoose.connection.close();

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(process.env.APP_PORT);
    pactum.request.setBaseUrl(host);
  });

  afterAll(async () => {
    app.close();
  });

  describe('users/me e2e testing', () => {
    const uri = 'users/';
    const path = uri + 'me';
    it('Should not get user UNAUTHORIZED', () => {
      return pactum
        .spec()
        .get(path)
        .withBody(dto)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });

    it.todo('Should not patch user UNAUTHORIZED');
    it.todo('Should not delete user UNAUTHORIZED');

    it.todo('Should signup new user, and get him');
    it.todo('Should patch user`s phone');
    it.todo('Should patch user`s password');
    it.todo('Should signin to user, and get him by new password');
    it.todo('Should delete user');
    it.todo('Should not get user UNAUTHORIZED');
  });
});
