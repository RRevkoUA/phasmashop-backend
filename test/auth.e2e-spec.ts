import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { SignupAuthDto } from 'src/auth/dto';
import * as pactum from 'pactum';
import mongoose from 'mongoose';

describe('AuthController E2E Test', () => {
  let app: INestApplication;
  const host = `http://localhost:${process.env.APP_PORT}/`;
  const dto: SignupAuthDto = {
    email: 'goored@mail.com',
    password: 'goodpawwssword123',
    username: 'Usernamgge123',
  };

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
    pactum.request.setBaseUrl(host);
  });

  afterAll(async () => {
    await mongoose.connect(process.env.DB_URL);
    const db = mongoose.connection.db;
    await db.dropDatabase();
    mongoose.connection.close();

    app.close();
  });

  describe('Signup testing', () => {
    const uri = 'signup/';
    it('Should signUp new user', () => {
      const path = uri;
      return pactum
        .spec()
        .post(path)
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED);
    });

    it('Should not signUp new user, because Email already taken', () => {
      const path = uri;
      return pactum
        .spec()
        .post(path)
        .withBody({
          email: dto.email,
          password: dto.password,
          username: 'NewUser',
        })
        .expectStatus(HttpStatus.FORBIDDEN);
    });

    it('Should not signUp new user, because Username already taken', () => {
      const path = uri;
      return pactum
        .spec()
        .post(path)
        .withBody({
          email: 'email@email.email',
          password: dto.password,
          username: dto.username,
        })
        .expectStatus(HttpStatus.FORBIDDEN);
    });

    it('Should not signUp new user, because unknown role taken', () => {
      const path = uri;
      return pactum
        .spec()
        .post(path)
        .withBody({
          ...dto,
          role: 'UNKNOWN',
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('Should not signUp new user, because invalid phone number format', () => {
      const path = uri;
      return pactum
        .spec()
        .post(path)
        .withBody({
          ...dto,
          phone: '+3806669991112',
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });
    it('Should not signUp new user, because invalid email format', () => {
      const path = uri;
      return pactum
        .spec()
        .post(path)
        .withBody({
          email: 'notaEmail',
          password: dto.password,
          username: dto.username,
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });
    it('Should not signUp new user, because there is no data', () => {
      const path = uri;
      return pactum.spec().post(path).expectStatus(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Signin testing', () => {
    const uri = 'signin/';
    it('Should signIn user in created before user by email', () => {
      const path = uri;
      return pactum
        .spec()
        .post(path)
        .withBody({
          usernameOrEmail: dto.email,
          password: dto.password,
        })
        .expectStatus(HttpStatus.OK);
    });

    it('Should signIn user in created before user by username', () => {
      const path = uri;
      return pactum
        .spec()
        .post(path)
        .withBody({
          usernameOrEmail: dto.username,
          password: dto.password,
        })
        .expectStatus(HttpStatus.OK);
    });

    it('Should not signIn user in created before user by wrong password', () => {
      const path = uri;
      return pactum
        .spec()
        .post(path)
        .withBody({
          usernameOrEmail: dto.username,
          password: 'rrrrrrrrrrrr',
        })
        .expectStatus(HttpStatus.FORBIDDEN);
    });

    it('Should not signIn user in created before user by unknown login', () => {
      const path = uri;
      return pactum
        .spec()
        .post(path)
        .withBody({
          usernameOrEmail: '24124124',
          password: dto.password,
        })
        .expectStatus(HttpStatus.FORBIDDEN);
    });

    it('Should not signIn user in created before user, with empty body', () => {
      const path = uri;
      return pactum.spec().post(path).expectStatus(HttpStatus.BAD_REQUEST);
    });
  });
});
