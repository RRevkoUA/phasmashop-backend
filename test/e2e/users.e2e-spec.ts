import { HttpStatus, INestApplication } from '@nestjs/common';
import { SignupAuthDto } from 'src/auth/dto';
import { faker } from '@faker-js/faker';
import * as pactum from 'pactum';
import { UserSeed } from 'src/common/seeders/user.seeder';
import { RoleEnum } from 'src/common/enums';
import { createTestingModule } from '../test-utils';

describe('UsersController E2E Test', () => {
  let app: INestApplication;
  let newPassword;
  let cookie;

  const port = Number.parseInt(process.env.APP_PORT) + 10;
  const uri = 'users/';
  const host = `http://localhost:${port}/`;
  const dto: SignupAuthDto = {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8, prefix: 'Aa1' }),
    username: faker.internet.userName(),
  };

  beforeAll(async () => {
    const { app: appInstance } = await createTestingModule('users-test', port);
    app = appInstance;
    pactum.request.setBaseUrl(host);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('users/me e2e testing', () => {
    const path = uri + 'me';
    it('Should not get user UNAUTHORIZED', () => {
      return pactum.spec().get(path).expectStatus(HttpStatus.UNAUTHORIZED);
    });

    it('Should not patch user UNAUTHORIZED', () => {
      return pactum.spec().patch(path).expectStatus(HttpStatus.UNAUTHORIZED);
    });

    it('Should not delete user UNAUTHORIZED', () => {
      return pactum.spec().delete(path).expectStatus(HttpStatus.UNAUTHORIZED);
    });

    it('Should get new user', async () => {
      cookie = await pactum
        .spec()
        .post('signup')
        .withBody(dto)
        .returns((ctx) => {
          return ctx.res.headers['set-cookie'];
        });

      return pactum
        .spec()
        .get(path)
        .withCookies(cookie[0])
        .expectStatus(HttpStatus.OK);
    });

    it('Should patch user`s phone', () => {
      return pactum
        .spec()
        .patch(path)
        .withCookies(cookie[0])
        .withBody({
          phone: faker.helpers.fromRegExp('+38098[0-9]{7}'),
        })
        .expectStatus(HttpStatus.OK);
    });

    it('Should patch user`s password', () => {
      newPassword = faker.internet.password({ length: 8, prefix: 'Aa1' });
      return pactum
        .spec()
        .patch(path)
        .withCookies(cookie[0])
        .withBody({
          password: newPassword,
        })
        .expectStatus(HttpStatus.OK);
    });

    it('Should signin to user, and get him by new password', () => {
      return pactum
        .spec()
        .post('signin')
        .withBody({
          login: dto.username,
          password: newPassword,
        })
        .expectStatus(HttpStatus.OK);
    });

    it('Should delete user', () => {
      return pactum
        .spec()
        .delete(path)
        .withCookies(cookie[0])
        .expectStatus(HttpStatus.OK);
    });

    it('Should not get user UNAUTHORIZED', () => {
      return pactum
        .spec()
        .get(path)
        .withCookies(cookie[0])
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
  });
  describe('users e2e testing', () => {
    it('Should not get users UNAUTHORIZED', async () => {
      return pactum
        .spec()
        .get(uri)
        .withCookies(cookie[0])

        .expectStatus(HttpStatus.UNAUTHORIZED);
    });

    it('Should not get users NO PERMISSION', async () => {
      try {
        cookie = await app.get(UserSeed).seed(1, [RoleEnum.USER]);
      } catch (err) {
        console.error(err);
      }
      return pactum
        .spec()
        .get(uri)
        .withCookies('access_token', cookie.access_token)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });

    // TODO :: Issue#76
    it('Should get users', async () => {
      try {
        cookie = await app.get(UserSeed).seed(20, [RoleEnum.MODERATOR]);
      } catch (err) {
        console.error(err);
      }
      return pactum
        .spec()
        .get(uri)
        .withCookies('access_token', cookie.access_token)
        .stores('username', '[0].username')
        .expectJsonLength(21)
        .expectStatus(HttpStatus.OK);
    });

    it('Should get user by username', async () => {
      return pactum
        .spec()
        .get(uri + '$S{username}')
        .withCookies('access_token', cookie.access_token)

        .expectBodyContains('$S{username}')
        .expectStatus(HttpStatus.OK);
    });

    it('Should not get user, using invalid username', async () => {
      return pactum
        .spec()
        .get(uri + faker.internet.userName())
        .withCookies('access_token', cookie.access_token)
        .expectStatus(HttpStatus.NOT_FOUND);
    });
  });
});
