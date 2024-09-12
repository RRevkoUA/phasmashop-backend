import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Tokens } from 'src/auth/types';
import {
  CreateCharacteristicDto,
  UpdateCharacteristicDto,
} from 'src/characteristic/dto';
import { UserSeed, CharacteristicSeed } from 'src/common/seeders';
import { createTestingModule, TestTemplates } from '../test-utils';
import * as pactum from 'pactum';
import { RoleEnum } from 'src/common/enums';
import { count } from 'console';

describe('Characteristic E2E Test', () => {
  let app: INestApplication;
  let cookie: { [key: string]: Tokens } = {};
  let characteristics: string[];
  let test: TestTemplates;

  const port = Number.parseInt(process.env.APP_PORT) + 50;
  const uri = 'characteristic/';
  const host = `http://localhost:${port}/`;
  const dto: CreateCharacteristicDto = {
    name: faker.lorem.word({ length: { min: 6, max: 50 } }),
    // TODO :: add possible types faker.helpers.arrayElements(['string', 'number', 'boolean', 'object', 'array']),
    possibleValue: faker.helpers.arrayElements(
      Array.from({ length: 10 }, () => faker.lorem.word()),
      5,
    ),
  };

  beforeAll(async () => {
    const { app: appInstance } = await createTestingModule(
      'characteristic-test',
      port,
    );
    app = appInstance;
    try {
      cookie = await app.get(UserSeed).seedRoles();
      characteristics = await app.get(CharacteristicSeed).seed(10);
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
      return test.create.failedHaveNoPermission({ role: RoleEnum.MODERATOR });
    });
    it('Should create new characteristic', () => {
      return test.create.passCreate({ role: RoleEnum.ADMIN });
    });
  });

  describe('Characteristic getting', () => {
    it('Should get all characteristics', () => {
      return test.read.passGet();
    });
    it('Should get characteristic by id', () => {
      return test.read.passGetById(dto.name);
    });
    it('Should not get characteristic by id, NOT FOUND', () => {
      return test.read.failedNotFound();
    });
  });

  describe('Characteristic updating', () => {
    const updateDto: UpdateCharacteristicDto = {
      name: faker.lorem.word({ length: { min: 6, max: 50 } }),
      possibleValue: faker.helpers.arrayElements(
      Array.from({ length: 10 }, () => faker.lorem.word()),
      5,
    ),
    };
    it('Should not update characteristic, UNAUTHORIZED', () => {
      return test.update.failedUnauthorized({
        updatingUnit: characteristics[0],
        dto: updateDto,
      });
    });
    it('Should not update characteristic, Have not permission', () => {
      return test.update.failedHaveNoPermission({
        role: RoleEnum.MODERATOR,
        updatingUnit: characteristics[0],
        dto: updateDto,
      });
    });
    it('Should update characteristic, when body is empty', () => {
      return test.update.passUpdate({
        updatingUnit: characteristics[0],
        dto: {},
        role: RoleEnum.ADMIN,
      });
    });
    it("Should update characteristic's possible value", () => {
      return test.update.passUpdate({
        updatingUnit: characteristics[0],
        dto: {
          possibleValue: updateDto.possibleValue
        },
        role: RoleEnum.ADMIN,
      });
    });
    it("Should update characteristic's name", () => {
      return test.update.passUpdate({
        updatingUnit: characteristics[0],
        dto: {
          name: updateDto.name
        },
        role: RoleEnum.ADMIN,
      });
    });
    it('Should update characteristic fully', () => {
      return test.update.passUpdate({
        updatingUnit: updateDto.name,
        dto: {
          name: faker.lorem.word({ length: { min: 6, max: 50 } }),
          possibleValue: faker.helpers.arrayElements(
            Array.from({ length: 10 }, () => faker.lorem.word()),
            5,
          ),
        },
        role: RoleEnum.ADMIN,
      });
    });
    it('Should not update characteristic, NOT FOUND', () => {
      return test.update.failedNotFound({
        updatingUnit: characteristics[0],
        dto: updateDto,
        role: RoleEnum.ADMIN,
      })
    });
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
