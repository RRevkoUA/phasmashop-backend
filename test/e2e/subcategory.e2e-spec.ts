import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { CreateSubcategoryDto } from 'src/subcategory/dto';
import { CategorySeed, SubcategorySeed, UserSeed } from 'src/common/seeders';
import { Tokens } from 'src/auth/types';
import { createTestingModule } from '../test-utils';
import * as pactum from 'pactum';
import { Category, Subcategory } from 'src/common/schemas';
import { Document } from 'mongoose';

describe('Subcategory controller E2E Test', () => {
  let app: INestApplication;
  let cookie: { [key: string]: Tokens } = {};
  let subcategories: (Subcategory & Document)[];
  let categories: (Category & Document)[];

  const port = Number.parseInt(process.env.APP_PORT) + 30;
  const uri = 'subcategory/';
  const host = `http://localhost:${port}/`;
  const dto: CreateSubcategoryDto = {
    name: faker.lorem.word({ length: { min: 3, max: 50 } }),
    category: undefined,
    isAvailable: true,
  };

  beforeAll(async () => {
    const { app: appInstance } = await createTestingModule(
      'subcategory-test',
      port,
    );
    app = appInstance;
    try {
      categories = await app.get(CategorySeed).seed(10)
      cookie = await app.get(UserSeed).seedRoles();
      subcategories = await app.get(SubcategorySeed).seed(10, categories[0].name);
    } catch (err) {
      throw err;
    }
    dto.category = categories[0].name;
    pactum.request.setBaseUrl(host);
  }, 10 * 1000);

  afterAll(async () => {
    await app.close();
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
        .withCookies('access_token', cookie.MODERATOR.access_token)
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
        .get(`${uri}${subcategories[0].name}`)
        .expectStatus(HttpStatus.OK);
    });
  });

  describe('Subcategory updating', () => {
    it('Should not update subcategory, UNAUTHORIZED', () => {
      return pactum
        .spec()
        .patch(`${uri}${subcategories[0].name}`)
        .withBody({
          name: faker.lorem.word({ length: { min: 3, max: 50 } }),
        })
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should not update subcategory, Have not permission', () => {
      return pactum
        .spec()
        .patch(`${uri}${subcategories[0].name}`)
        .withBody({
          name: faker.lorem.word({ length: { min: 3, max: 50 } }),
        })
        .withCookies('access_token', cookie.MODERATOR)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should not update subcategory, because name is not unique', () => {
      return pactum
        .spec()
        .patch(`${uri}${subcategories[0].name}`)
        .withBody({
          name: dto.name,
        })
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectStatus(HttpStatus.FORBIDDEN);
    });
    it('Should not update subcategory, because body is empty', () => {
      return pactum
        .spec()
        .patch(`${uri}${subcategories[0].name}`)
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectStatus(HttpStatus.OK);
    });
    it("Should update subcategory's category", () => {
      const updatedCategory = categories[1].name;
      return pactum
        .spec()
        .patch(`${uri}${subcategories[0].name}`)
        .withBody({
          category: updatedCategory,
        })
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectStatus(HttpStatus.OK);
    });
    it('Should update subcategory name', () => {
      const updatedName = faker.lorem.word({ length: { min: 3, max: 50 } });
      return pactum
        .spec()
        .patch(`${uri}${subcategories[0].name}`)
        .withBody({
          name: updatedName,
        })
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectBodyContains(updatedName)
        .expectStatus(HttpStatus.OK);
    });
  });
  describe('Subcategory remove', () => {
    it('Should not remove subcategory, UNAUTHORIZED', () => {
      return pactum
        .spec()
        .delete(`${uri}${subcategories[1].name}`)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should not remove subcategory, Have not permission', () => {
      return pactum
        .spec()
        .delete(`${uri}${subcategories[1].name}`)
        .withCookies('access_token', cookie.MODERATOR)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should not remove subcategory, because subcategory is not exist', () => {
      return pactum
        .spec()
        .delete(`${uri}${faker.lorem.word()}`)
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectStatus(HttpStatus.NOT_FOUND);
    });
    it('Should remove subcategory', () => {
      return pactum
        .spec()
        .delete(`${uri}${subcategories[1].name}`)
        .withCookies('access_token', cookie.ADMIN.access_token)
        .expectStatus(HttpStatus.OK);
    });
  });
});
