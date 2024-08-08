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
          username: faker.internet.userName(),
        })
        .expectStatus(HttpStatus.FORBIDDEN);
    });

    it('Should not signUp new user, because Username already taken', () => {
      const path = uri;
      return pactum
        .spec()
        .post(path)
        .withBody({
          email: faker.internet.email(),
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
          role: faker.helpers.fromRegExp('a-z{4}'),
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
          phone: '+380' + faker.helpers.fromRegExp('[0-9]{8}'),
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });
    it('Should not signUp new user, because invalid email format', () => {
      const path = uri;
      return pactum
        .spec()
        .post(path)
        .withBody({
          email: faker.helpers.fromRegExp('[a-z]{4}'),
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
          password: faker.helpers.fromRegExp('[a-z]{8}'),
        })
        .expectStatus(HttpStatus.FORBIDDEN);
    });

    it('Should not signIn user in created before user by unknown login', () => {
      const path = uri;
      return pactum
        .spec()
        .post(path)
        .withBody({
          usernameOrEmail: faker.helpers.fromRegExp('[a-z]{4}'),
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
