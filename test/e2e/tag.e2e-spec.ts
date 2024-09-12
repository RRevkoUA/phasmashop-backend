import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingModule } from '../test-utils';
import { Tokens } from 'src/auth/types';
import { UserSeed } from 'src/common/seeders';
import * as pactum from 'pactum';
import { faker } from '@faker-js/faker';
import { CreateTagDto } from 'src/tag/dto';
import { TagSeed } from 'src/common/seeders/tag.seeder';

describe('TagController E2E Test', () => {
  let app: INestApplication;
  let users: { [key: string]: Tokens } = {};
  let tags: string[] = [];

  const port = Number.parseInt(process.env.APP_PORT) + 40;
  const host = `http://localhost:${port}/`;
  const uri = 'tag/';
  const dto: CreateTagDto = {
    name: faker.lorem.word({ length: { min: 3, max: 10 } }),
    description: faker.lorem.word({ length: { min: 3, max: 30 } }),
  };

  beforeAll(async () => {
    const { app: appInstance } = await createTestingModule('tag-test', port);
    app = appInstance;
    try {
      users = await app.get(UserSeed).seedRoles();
      tags = await app.get(TagSeed).seed(5);
    } catch (err) {
      throw err;
    }
    pactum.request.setBaseUrl(host);
  }, 10 * 1000);

  afterAll(async () => {
    await app.close();
  });

  describe('Tag creating', () => {
    it('Should not create new tag, UNAUTHORIZED', () => {
      return pactum
        .spec()
        .post(uri)
        .withBody(dto)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should not create new tag, Have not permission', () => {
      return pactum
        .spec()
        .post(uri)
        .withBody(dto)
        .withCookies('access_token', users.MODERATOR.access_token)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should create new tag', () => {
      return pactum
        .spec()
        .post(uri)
        .withBody(dto)
        .withCookies('access_token', users.ADMIN.access_token)
        .expectStatus(HttpStatus.CREATED);
    });
    it('Should not create new tag, Tag already exists', () => {
      return pactum
        .spec()
        .post(uri)
        .withBody(dto)
        .withCookies('access_token', users.ADMIN.access_token)
        .expectStatus(HttpStatus.FORBIDDEN);
    });
  });

  describe('Tag getting', () => {
    it('Should get all tags', () => {
      return pactum.spec().get(uri).expectStatus(HttpStatus.OK);
    });
    it('Should get tag by id', () => {
      return pactum
        .spec()
        .get(uri + tags[0])
        .expectStatus(HttpStatus.OK);
    });
    it('Should not get tag by id, NOT FOUND', () => {
      return pactum
        .spec()
        .get(uri + faker.lorem.word({ length: { min: 3, max: 10 } }))
        .expectStatus(HttpStatus.NOT_FOUND);
    });
  });

  describe('Tag updating', () => {
    it.todo('Should not update tag, UNAUTHORIZED');
    it.todo('Should not update tag, Have not permission');
    it.todo('Should update tag');
  });

  describe('Tag deleting', () => {
    it.todo('Should not delete tag, UNAUTHORIZED');
    it.todo('Should not delete tag, Have not permission');
    it.todo('Should delete tag');
    it.todo('Should not delete tag, NOT FOUND');
  });

  describe('Tag clearing', () => {
    it.todo('Should get no tags');
  });
});
