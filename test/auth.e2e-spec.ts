import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { SignupAuthDto, SigninAuthDto } from 'src/auth/dto';
import * as pactum from 'pactum';
import mongoose from 'mongoose';

describe('AuthController E2E Test', () => {
  let app: INestApplication;
  const host = `http://localhost:${process.env.APP_PORT}/`;

  beforeAll(async () => {
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
    mongoose.connection.dropCollection(process.env.DB_URL);
    pactum.request.setBaseUrl(host);
  });

  afterAll(async () => {
    app.close();
  });
  describe('auth', () => {
    describe('Signup testing', () => {
      const uri = 'signup/';
      const dto: SignupAuthDto = {
        email: 'goored@mail.com',
        password: 'goodpawwssword123',
        username: 'Usernamgge123',
      };

      it('Should signUp new user', () => {
        const path = uri;
        return pactum
          .spec()
          .post(path)
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED);
      });
    });
  });
});
