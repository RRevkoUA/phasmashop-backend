import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { CreateCategoryDto } from 'src/category/dto';
import { UserSeed, CategorySeed } from 'src/common/seeders';
import { RoleEnum } from 'src/common/enums';
import { Tokens } from 'src/auth/types';
import { createTestingModule } from '../test-utils';
import * as pactum from 'pactum';

describe('Category controller E2E Test', () => {
  let app: INestApplication;
  let cookie: Tokens;
  let cookieAdmin: Tokens;
  let categories: string[];

  const port = Number.parseInt(process.env.APP_PORT) + 20;
  const uri = 'category/';
  const host = `http://localhost:${port}/`;
  const dto: CreateCategoryDto = {
    name: faker.lorem.word({ length: { min: 3, max: 30 } }),
    isAvailable: true,
  };

  beforeAll(async () => {
    const { app: appInstance } = await createTestingModule(
      'category-test',
      port,
    );
    app = appInstance;
    pactum.request.setBaseUrl(host);
  });
  afterAll(async () => {
    await app.close();
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
        cookieAdmin = await app.get(UserSeed).seed(1, [RoleEnum.ADMIN]);
      } catch (err) {
        console.error(err);
      }
      return pactum
        .spec()
        .post(path)
        .withCookies('access_token', cookieAdmin.access_token)
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED);
    });
    it('Should not create new category, because name is not unique', () => {
      return pactum
        .spec()
        .post(path)
        .withCookies('access_token', cookieAdmin.access_token)
        .withBody(dto)
        .expectBodyContains('Category already exists')
        .expectStatus(HttpStatus.FORBIDDEN);
    });
    it('Should not create new category, because name is have length less than 3', () => {
      return pactum
        .spec()
        .post(path)
        .withCookies('access_token', cookieAdmin.access_token)
        .withBody({
          name: 'ab',
          isAvailable: true,
        })
        .expectBodyContains('name must be longer than or equal to 3 characters')
        .expectStatus(HttpStatus.BAD_REQUEST);
    });
    it('Should not create new category, because name is have length more than 30', () => {
      return pactum
        .spec()
        .post(path)
        .withCookies('access_token', cookieAdmin.access_token)
        .withBody({
          name: 'a'.repeat(31),
          isAvailable: true,
        })
        .expectBodyContains(
          'name must be shorter than or equal to 30 characters',
        )
        .expectStatus(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Category getting', () => {
    // TODO :: Issue#76
    it('Should get all categories', async () => {
      try {
        categories = await app.get(CategorySeed).seed(5);
      } catch (err) {
        console.error(err);
      }

      return pactum.spec().get(uri).expectStatus(HttpStatus.OK);
    });
    it('Should get category by id', () => {
      return pactum
        .spec()
        .get(`${uri}${categories[0]}`)
        .expectStatus(HttpStatus.OK);
    });
  });

  describe('Category updating', () => {
    it('Should not update category, UNAUTHORIZED', () => {
      return pactum
        .spec()
        .patch(`${uri}${categories[0]}`)
        .withBody({
          name: faker.lorem.word({ length: { min: 3, max: 30 } }),
          isAvailable: true,
        })
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should not update category, Have not permission', () => {
      return pactum
        .spec()
        .patch(`${uri}${categories[0]}`)
        .withCookies('access_token', cookie.access_token)
        .withBody({
          name: faker.lorem.word({ length: { min: 3, max: 30 } }),
          isAvailable: true,
        })
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should not update category, because name is not unique', async () => {
      return pactum
        .spec()
        .patch(`${uri}${categories[0]}`)
        .withCookies('access_token', cookieAdmin.access_token)
        .withBody({
          name: categories[1],
          isAvailable: true,
        })
        .expectBodyContains('E11000 duplicate key error')
        .expectStatus(HttpStatus.FORBIDDEN);
    });
    it('Should update category, when body is empty', () => {
      return pactum
        .spec()
        .patch(`${uri}${categories[0]}`)
        .withCookies('access_token', cookieAdmin.access_token)
        .expectStatus(HttpStatus.OK);
    });
    it('Should update category', () => {
      return pactum
        .spec()
        .patch(`${uri}${categories[0]}`)
        .withCookies('access_token', cookieAdmin.access_token)
        .withBody({
          name: faker.lorem.word({ length: { min: 3, max: 30 } }),
          isAvailable: true,
        })
        .expectStatus(HttpStatus.OK);
    });
  });

  describe('Category remove', () => {
    it('Should not remove category, UNAUTHORIZED', () => {
      return pactum
        .spec()
        .delete(`${uri}${categories[2]}`)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should not remove category, Have not permission', () => {
      return pactum
        .spec()
        .delete(`${uri}${categories[2]}`)
        .withCookies('access_token', cookie.access_token)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should remove category', () => {
      return pactum
        .spec()
        .delete(`${uri}${categories[2]}`)
        .withCookies('access_token', cookieAdmin.access_token)
        .expectStatus(HttpStatus.OK);
    });
    it('Should not remove category, because category is not exist', () => {
      return pactum
        .spec()
        .delete(`${uri}${categories[2]}`)
        .withCookies('access_token', cookieAdmin.access_token)
        .expectStatus(HttpStatus.NOT_FOUND);
    });
  });

  describe('Subcategory interaction', () => {
    it.todo('Should add subcategory to category');
    it.todo('Should add many subcategories to category');
    it.todo('Should get category without subcategories');
    it.todo('Should remove category, and all subcategories');
  });

  describe('Additional', () => {
    it('Should return empty body', async () => {
      await app.get(CategorySeed).clear();
      return pactum
        .spec()
        .get(uri)
        .inspect()
        .expectBody([])
        .expectStatus(HttpStatus.OK);
    });
    it('Should return NotFound, because category is not exist', () => {
      return pactum
        .spec()
        .get(`${uri}${categories[2]}`)
        .expectStatus(HttpStatus.NOT_FOUND);
    });
  });
});
