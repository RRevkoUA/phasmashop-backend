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
    name: faker.lorem.word({ length: { min: 6, max: 10 } }),
    description: faker.lorem.word({ length: { min: 3, max: 30 } }),
  };

  beforeAll(async () => {
    const { app: appInstance } = await createTestingModule('tag-test', port);
    app = appInstance;
    users = await app.get(UserSeed).seedRoles();
    tags = await app.get(TagSeed).seed(10);
    pactum.request.setBaseUrl(host);
  });

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
        .get(uri + faker.lorem.word({ length: { min: 6, max: 10 } }))
        .expectStatus(HttpStatus.NOT_FOUND);
    });
  });

  describe('Tag updating', () => {
    it('Should not update tag, UNAUTHORIZED', () => {
      return pactum
        .spec()
        .patch(uri + tags[0])
        .withBody({
          name: faker.lorem.word({ length: { min: 6, max: 10 } }),
          description: faker.lorem.word({ length: { min: 3, max: 30 } }),
        })
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should not update tag, Have not permission', () => {
      return pactum
        .spec()
        .patch(uri + tags[0])
        .withBody({
          name: faker.lorem.word({ length: { min: 6, max: 10 } }),
          description: faker.lorem.word({ length: { min: 3, max: 30 } }),
        })
        .withCookies('access_token', users.MODERATOR.access_token)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should update tag, when body is empty', () => {
      return pactum
        .spec()
        .patch(uri + tags[0])
        .withCookies('access_token', users.ADMIN.access_token)
        .expectStatus(HttpStatus.OK);
    });
    it("Should update tag's description", () => {
      return pactum
        .spec()
        .patch(uri + tags[0])
        .withBody({
          description: faker.lorem.word({ length: { min: 6, max: 30 } }),
        })
        .withCookies('access_token', users.ADMIN.access_token)
        .expectStatus(HttpStatus.OK);
    });
    it("Should update tag's name", () => {
      return pactum
        .spec()
        .patch(uri + tags[0])
        .withBody({
          name: faker.lorem.word({ length: { min: 6, max: 10 } }),
        })
        .withCookies('access_token', users.ADMIN.access_token)
        .expectStatus(HttpStatus.OK);
    });
    it('Should update tag fully', () => {
      return pactum
        .spec()
        .patch(uri + tags[1])
        .withBody({
          name: faker.lorem.word({ length: { min: 6, max: 10 } }),
          description: faker.lorem.word({ length: { min: 3, max: 30 } }),
        })
        .withCookies('access_token', users.ADMIN.access_token)
        .expectStatus(HttpStatus.OK);
    });
    it('Should not update tag, NOT FOUND', () => {
      return pactum
        .spec()
        .patch(uri + tags[0])
        .withBody({
          name: faker.lorem.word({ length: { min: 6, max: 10 } }),
          description: faker.lorem.word({ length: { min: 3, max: 30 } }),
        })
        .withCookies('access_token', users.ADMIN.access_token)
        .expectStatus(HttpStatus.NOT_FOUND);
    });
    it('Should not update tag, Tag name already exists', () => {
      return pactum
        .spec()
        .patch(uri + tags[2])
        .withBody({
          name: dto.name,
          description: faker.lorem.word({ length: { min: 6, max: 30 } }),
        })
        .withCookies('access_token', users.ADMIN.access_token)
        .expectStatus(HttpStatus.FORBIDDEN);
    });
  });

  describe('Tag deleting', () => {
    it('Should not delete tag, UNAUTHORIZED', () => {
      return pactum
        .spec()
        .delete(uri + tags[3])
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should not delete tag, Have not permission', () => {
      return pactum
        .spec()
        .delete(uri + tags[3])
        .withCookies('access_token', users.MODERATOR.access_token)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });
    it('Should delete tag', () => {
      return pactum
        .spec()
        .delete(uri + tags[3])
        .withCookies('access_token', users.ADMIN.access_token)
        .expectStatus(HttpStatus.OK);
    });
    it('Should not delete tag, NOT FOUND', () => {
      return pactum
        .spec()
        .delete(uri + tags[3])
        .withCookies('access_token', users.ADMIN.access_token)
        .expectStatus(HttpStatus.NOT_FOUND);
    });
  });

  describe('Tag clearing', () => {
    it.todo('Should get no tags');
  });
});
