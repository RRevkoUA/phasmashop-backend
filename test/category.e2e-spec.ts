import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreateCategoryDto } from 'src/category/dto';
import { UserSeed } from 'src/common/seeders/user.seeder';
import { RoleEnum } from 'src/common/enums';
import * as bodyParser from 'body-parser';
import * as pactum from 'pactum';
import * as cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

describe('Category controller E2E Test', () => {
  let app: INestApplication;
  let cookie;

  const port = Number.parseInt(process.env.APP_PORT) + 20;
  const uri = 'category/';
  const host = `http://localhost:${port}/`;
  const dto: CreateCategoryDto = {
    name: faker.lorem.word(),
    isAvailable: true,
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
    const db = mongoose.connection.db;
    await db.dropDatabase();
    mongoose.connection.close();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    await app.init();
    await app.listen(port);

    pactum.request.setBaseUrl(host);
  });

  afterAll(async () => {
    app.close();
  });

  describe('Category creating', () => {
    const path = uri;
    it('Should not create new category, UNAUTHORIZED', () => {
      return pactum
        .spec()
        .post(path)
        .withBody(dto)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('should not create new category, Have not permission', async () => {
      try {
        cookie = await app.get(UserSeed).seed(1, [RoleEnum.MODERATOR]);
      } catch (err) {
        console.error(err);
      }
      return pactum
        .spec()
        .post(path)
        .withCookies('access_token', cookie.access_token)
        .withBody(dto)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should create new category', async () => {
      try {
        cookie = await app.get(UserSeed).seed(1, [RoleEnum.ADMIN]);
      } catch (err) {
        console.error(err);
      }
      return pactum
        .spec()
        .post(path)
        .withCookies('access_token', cookie.access_token)
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED);
    });
    it.todo('Should not create new category, because name is not unique');
    it.todo(
      'Should not create new category, because name is have length less than 3',
    );
    it.todo(
      'Should not create new category, because name is have length more than 30',
    );
  });

  describe('Category getting', () => {
    it.todo('Should get all categories');
    it.todo('Should get category by id');
  });

  describe('Category updating', () => {
    it.todo('Should not update category, UNAUTHORIZED');
    it.todo('Should not update category, Have not permission');
    it.todo('Should not update category, because name is not unique');
    it.todo('Should not update category, becouse body is empty');
    it.todo('Should update category');
  });

  describe('Category remove', () => {
    it.todo('Should not remove category, UNAUTHORIZED');
    it.todo('Should not remove category, Have not permission');
    it.todo('Should not remove category, because category is not exist');
    it.todo('Should remove category');
  });
});
