import { faker } from "@faker-js/faker";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Tokens } from "src/auth/types";
import { CreateCharacteristicDto } from "src/characteristic/dto";
import { UserSeed } from "src/common/seeders";
import { createTestingModule, TestTemplates } from "../test-utils";
import * as pactum from 'pactum';
import { RoleEnum } from "src/common/enums";

describe('Characteristic E2E Test', () => {
let app: INestApplication;
let cookie: { [key: string]: Tokens } = {};
let Characteristics: string[];
let test: TestTemplates;

const port = Number.parseInt(process.env.APP_PORT) + 50;
const uri = 'characteristic/';
const host = `http://localhost:${port}/`;
const dto: CreateCharacteristicDto = {
  name: faker.lorem.word({ length: { min: 6, max: 50 } }),
  // TODO :: add possible types faker.helpers.arrayElements(['string', 'number', 'boolean', 'object', 'array']),
  possibleValue: faker.helpers.arrayElements([faker.lorem.word()], 5)
};

beforeAll(async () => {
  const { app: appInstance } = await createTestingModule('characteristic-test', port);
  app = appInstance;
  try {
    cookie = await app.get(UserSeed).seedRoles();
  } catch (err) {
    throw err;
  }
  test = new TestTemplates(host, uri, cookie, dto);
  pactum.request.setBaseUrl(host);
});

afterAll(async () => {
  await app.close();
});

describe('Characteristic creating', () => {
  it('Should not create new characteristic, UNAUTHORIZED', () => {
    return test.create.failedUnauthorized();
  });
  it('Should not create new characteristic, Have not permission', () => {
    return test.create.failedHaveNoPermission(RoleEnum.MODERATOR);
  });
  it('Should create new characteristic', () => {
    return test.create.passCreate(RoleEnum.ADMIN);
  });
});

describe('Characteristic getting', () => {
  it.todo('Should get all characteristics');
  it.todo('Should get characteristic by id');
  it.todo('Should not get characteristic by id, NOT FOUND');
});

describe('Characteristic updating', () => {
  it.todo('Should not update characteristic, UNAUTHORIZED');
  it.todo('Should not update characteristic, Have not permission');
  it.todo('Should update characteristic, when body is empty');
  it.todo("Should update characteristic's description");
  it.todo("Should update characteristic's name");
  it.todo('Should update characteristic fully');
  it.todo('Should not update characteristic, NOT FOUND');
  it.todo(
    'Should not update characteristic, Characteristic name already exists',
  );
});

describe('Characteristic deleting', () => {
  it.todo('Should not delete characteristic, UNAUTHORIZED');
  it.todo('Should not delete characteristic, Have not permission');
  it.todo('Should delete characteristic');
  it.todo('Should not delete characteristic, NOT FOUND');
});

describe('Characteristic clearing', () => {
  it.todo('Should get no characteristics');
});


});