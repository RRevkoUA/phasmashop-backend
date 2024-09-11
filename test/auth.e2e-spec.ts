import { HttpStatus, INestApplication } from '@nestjs/common';
import { SignupAuthDto } from 'src/auth/dto';
import { faker } from '@faker-js/faker';
import * as pactum from 'pactum';
import { createTestingModule } from './test-utils';

describe('AuthController E2E Test', () => {
  let app: INestApplication;

  const port = Number.parseInt(process.env.APP_PORT);
  const host = `http://localhost:${port}/`;
  const dto: SignupAuthDto = {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8, prefix: 'Aa1' }),
    username: faker.internet.userName(),
    phone: faker.helpers.fromRegExp('+38098[0-9]{7}'),
  };

  beforeAll(async () => {
    const { app: appInstance } = await createTestingModule('auth-test', port);
    app = appInstance;
    pactum.request.setBaseUrl(host);
  });

  afterAll(async () => {
    await app.close();
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
          login: dto.email,
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
          login: dto.username,
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
          login: dto.username,
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
          login: faker.helpers.fromRegExp('[a-z]{4}'),
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
