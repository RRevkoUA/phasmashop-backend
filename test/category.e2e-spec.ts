import { de, faker } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreateCategoryDto } from 'src/category/dto';
import mongoose from 'mongoose';
import * as bodyParser from 'body-parser';

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

    await app.init();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    await app.init();
    await app.listen(port);
  });

  afterAll(async () => {
    app.close();
  });

  describe('Category creating', () => {
    it.todo('Should not create new category, UNAUTHORIZED');
    it.todo('should not create new category, Have not permission');
    it.todo('Should not create new category, because name is not unique');
    it.todo(
      'Should not create new category, because name is have length less than 3',
    );
    it.todo(
      'Should not create new category, because name is have length more than 30',
    );
    it.todo('Should create new category');
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
