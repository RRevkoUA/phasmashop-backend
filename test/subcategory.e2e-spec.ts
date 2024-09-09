import { faker } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreateSubcategoryDto } from 'src/subcategory/dto';
import mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import { Tokens } from 'src/auth/types';
import { RoleEnum } from 'src/common/enums';

describe('Subcategory controller E2E Test', () => {
  let app: INestApplication;
  let cookie: Tokens;
  let subcategories: string[];
  let categories: string[];
  const port = Number.parseInt(process.env.APP_PORT) + 30;
  const uri = 'subcategory/';
  const host = `http://localhost:${port}/`;
  const dto: CreateSubsubcategoryDto = {
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

  describe('Subcategory creating', () => {
    it.todo('Should not create new subcategory, UNAUTHORIZED');
    it.todo('should not create new subcategory, Have not permission');
    it.todo('Should not create new subcategory, because name is not unique');
    it.todo(
      'Should not create new subcategory, because name is have length less than 3',
    );
    it.todo(
      'Should not create new subcategory, because name is have length more than 50',
    );
    it.todo('Should not create new subcategory, because body is empty');
    it.todo('Should not create new subcategory, because category is not exist');
    it.todo('Should create new subcategory');
  });

  describe('Subcategory getting', () => {
    it.todo('Should get all categories');
    it.todo('Should get subcategory by id');
  });

  describe('Subcategory updating', () => {
    it.todo('Should not update subcategory, UNAUTHORIZED');
    it.todo('Should not update subcategory, Have not permission');
    it.todo('Should not update subcategory, because name is not unique');
    it.todo('Should not update subcategory, because body is empty');
    it.todo('Should update subcategory name');
    it.todo("Should update subcategory's category");
  });

  describe('Subcategory remove', () => {
    it.todo('Should not remove subcategory, UNAUTHORIZED');
    it.todo('Should not remove subcategory, Have not permission');
    it.todo('Should not remove subcategory, because subcategory is not exist');
    it.todo('Should remove subcategory');
  });
});
