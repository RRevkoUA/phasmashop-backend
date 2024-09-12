import { INestApplication } from '@nestjs/common';
import { createTestingModule } from 'test/test-utils';
import * as pactum from 'pactum';
import { Tokens } from 'src/auth/types';
import { UserSeed } from 'src/common/seeders';

describe('TagController E2E Test', () => {
  let app: INestApplication;

  const port = Number.parseInt(process.env.APP_PORT) + 40;
  const host = `http://localhost:${port}/`;
  const uri = 'tag/';
  let users: { [key: string]: Tokens } = {};

  beforeAll(async () => {
    const { app: appInstance } = await createTestingModule('tag-test', port);
    app = appInstance;
    users = await app.get(UserSeed).seedRoles();
    pactum.request.setBaseUrl(host);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Tag creating', () => {
    it.todo('Should not create new tag, UNAUTHORIZED');
    it.todo('Should not create new tag, Have not permission');
    it.todo('Should create new tag');
    it.todo('Should not create new tag, Tag already exists');
  });

  describe('Tag getting', () => {
    it.todo('Should get all tags');
    it.todo('Should get tag by id');
    it.todo('Should not get tag by id, NOT FOUND');
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
