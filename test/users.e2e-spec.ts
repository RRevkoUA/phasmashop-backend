import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { SignupAuthDto } from 'src/auth/dto';
import { faker } from '@faker-js/faker';
import * as pactum from 'pactum';
import mongoose from 'mongoose';
import { UserSeed } from 'src/seeders/user.seeder';

describe('AuthController E2E Test', () => {
  let app: INestApplication;
  let newPassword;
  const uri = 'users/';
  const host = `http://localhost:${process.env.APP_PORT}/`;
  const dto: SignupAuthDto = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
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

    it('Should signup', () => {
      return pactum
        .spec()
        .post('signup')
        .withBody(dto)
        .stores('userAT', 'access_token')
        .expectStatus(HttpStatus.CREATED);
    });

    it('Should get new user', () => {
      return pactum
        .spec()
        .get(path)
        .withHeaders({
          Authorization: 'Bearer $S{userAT}',
        })
        .expectStatus(HttpStatus.OK);
    });

    it('Should patch user`s phone', () => {
      return pactum
        .spec()
        .patch(path)
        .withHeaders({
          Authorization: 'Bearer $S{userAT}',
        })
        .withBody({
          phone: faker.helpers.fromRegExp('+38098[0-9]{7}'),
        })
        .expectStatus(HttpStatus.OK);
    });

    it('Should patch user`s password', () => {
      newPassword = faker.internet.password();
      return pactum
        .spec()
        .patch(path)
        .withHeaders({
          Authorization: 'Bearer $S{userAT}',
        })
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
          usernameOrEmail: dto.username,
          password: newPassword,
        })
        .expectStatus(HttpStatus.OK);
    });

    it('Should delete user', () => {
      return pactum
        .spec()
        .delete(path)
        .withHeaders({
          Authorization: 'Bearer $S{userAT}',
        })
        .expectStatus(HttpStatus.OK);
    });

    it('Should not get user UNAUTHORIZED', () => {
      return pactum
        .spec()
        .get(path)
        .withHeaders({
          Authorization: 'Bearer $S{userAT}',
        })
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
  });
  describe('users e2e testing', () => {
    let userAt;

    it('Should not get users UNAUTHORIZED', async () => {
      return pactum
        .spec()
        .get(uri)
        .withHeaders({
          Authorization: `Bearer $S{userAt}`,
        })
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });

    it('Should get users', async () => {
      try {
        userAt = await app.get(UserSeed).seed(20);
        userAt = userAt.access_token;
      } catch (err) {
        console.error(err);
      }
      return pactum
        .spec()
        .get(uri)
        .withHeaders({
          Authorization: `Bearer ${userAt}`,
        })
        .stores('username', '[0].username')
        .expectJsonLength(20)
        .expectStatus(HttpStatus.OK);
    });

    it('Should get user by username', async () => {
      return pactum
        .spec()
        .get(uri + '$S{username}')
        .withHeaders({
          Authorization: `Bearer ${userAt}`,
        })
        .expectBodyContains('$S{username}')
        .expectStatus(HttpStatus.OK);
    });

    it('Should not get user, using invalid username', async () => {
      return pactum
        .spec()
        .get(uri + faker.internet.userName())
        .withHeaders({
          Authorization: `Bearer ${userAt}`,
        })
        .expectStatus(HttpStatus.NOT_FOUND);
    });
  });
});
