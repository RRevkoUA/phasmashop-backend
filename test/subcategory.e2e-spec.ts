import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreateSubcategoryDto } from 'src/subcategory/dto';
import { CategorySeed, SubcategorySeed, UserSeed } from 'src/common/seeders';
import { Tokens } from 'src/auth/types';
import * as pactum from 'pactum';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';

describe('Subcategory controller E2E Test', () => {
  let app: INestApplication;
  let cookie: { [key: string]: Tokens } = {};
  let subcategories: string[];
  let categories: string[];
  const port = Number.parseInt(process.env.APP_PORT) + 30;
  const uri = 'subcategory/';
  const host = `http://localhost:${port}/`;
  const dto: CreateSubcategoryDto = {
    name: faker.lorem.word({ length: { min: 3, max: 50 } }),
    category: undefined,
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

    try {
      categories = await app.get(CategorySeed).seed(10);
      cookie = await app.get(UserSeed).seedRoles();
      subcategories = await app.get(SubcategorySeed).seed(10, categories[0]);
    } catch (err) {
      throw err;
    }
    dto.category = categories[0];
    pactum.request.setBaseUrl(host);
  });

  afterAll(async () => {
    app.close();
  });

  describe('Subcategory creating', () => {
    it('Should not create new subcategory, UNAUTHORIZED', () => {
      return pactum
        .spec()
        .post(uri)
        .withBody(dto)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('should not create new subcategory, Have not permission', () => {
      return pactum
        .spec()
        .post(uri)
        .withBody(dto)
        .withCookies('access_token', cookie.MODERATOR)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should create new subcategory', () => {
      return pactum
        .spec()
        .post(uri)
        .withBody(dto)
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectStatus(HttpStatus.CREATED);
    });
    it('Should not create new subcategory, because name is not unique', () => {
      return pactum
        .spec()
        .post(uri)
        .withBody(dto)
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectStatus(HttpStatus.FORBIDDEN);
    });
    it('Should not create new subcategory, because name is have length less than 3', () => {
      return pactum
        .spec()
        .post(uri)
        .withBody({
          ...dto,
          name: 'a',
        })
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectStatus(HttpStatus.BAD_REQUEST);
    });
    it('Should not create new subcategory, because name is have length more than 50', () => {
      return pactum
        .spec()
        .post(uri)
        .withBody({
          ...dto,
          name: 'a'.repeat(51),
        })
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectStatus(HttpStatus.BAD_REQUEST);
    });
    it('Should not create new subcategory, because body is empty', () => {
      return pactum
        .spec()
        .post(uri)
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectStatus(HttpStatus.BAD_REQUEST);
    });
    it('Should not create new subcategory, because category is not exist', () => {
      return pactum
        .spec()
        .post(uri)
        .withBody({
          ...dto,
          category: faker.lorem.word(),
        })
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectStatus(HttpStatus.NOT_FOUND);
    });
  });

  describe('Subcategory getting', () => {
    // TODO :: #76
    it('Should get all subcategories', () => {
      return pactum.spec().get(uri).expectStatus(HttpStatus.OK);
    });
    it('Should get subcategory by id', () => {
      return pactum
        .spec()
        .get(`${uri}${subcategories[0]}`)
        .expectStatus(HttpStatus.OK);
    });
  });

  describe('Subcategory updating', () => {
    it('Should not update subcategory, UNAUTHORIZED', () => {
      return pactum
        .spec()
        .patch(`${uri}${subcategories[0]}`)
        .withBody({
          name: faker.lorem.word({ length: { min: 3, max: 50 } }),
        })
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should not update subcategory, Have not permission', () => {
      return pactum
        .spec()
        .patch(`${uri}${subcategories[0]}`)
        .withBody({
          name: faker.lorem.word({ length: { min: 3, max: 50 } }),
        })
        .withCookies('access_token', cookie.MODERATOR)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should not update subcategory, because name is not unique', () => {
      return pactum
        .spec()
        .patch(`${uri}${subcategories[0]}`)
        .withBody({
          name: dto.name,
        })
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectStatus(HttpStatus.FORBIDDEN);
    });
    it('Should not update subcategory, because body is empty', () => {
      return pactum
        .spec()
        .patch(`${uri}${subcategories[0]}`)
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectStatus(HttpStatus.OK);
    });
    it("Should update subcategory's category", () => {
      const updatedCategory = categories[1];
      return pactum
        .spec()
        .patch(`${uri}${subcategories[0]}`)
        .withBody({
          category: updatedCategory,
        })
        .withCookies('access_token', cookie.ADMIN.access_token)
        .inspect()
        .expectStatus(HttpStatus.OK);
    });
    it('Should update subcategory name', () => {
      const updatedName = faker.lorem.word({ length: { min: 3, max: 50 } });
      return pactum
        .spec()
        .patch(`${uri}${subcategories[0]}`)
        .withBody({
          name: updatedName,
        })
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectBodyContains(updatedName)
        .expectStatus(HttpStatus.OK);
    });
  });
  describe('Subcategory remove', () => {
    it.todo('Should not remove subcategory, UNAUTHORIZED');
    it.todo('Should not remove subcategory, Have not permission');
    it.todo('Should not remove subcategory, because subcategory is not exist');
    it.todo('Should remove subcategory');
  });
});
