import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Tokens } from "src/auth/types";
import { CreateCommentaryDto } from "src/commentary/dto";
import { UserSeed, ProductSeed} from "src/common/seeders";
import { createTestingModule, TestTemplates } from '../test-utils';
import { RoleEnum } from "src/common/enums";
import * as pactum from "pactum";
import { ProductService } from "src/product/product.service";

describe('Commentary E2E Test', () => {
  let app: INestApplication;
  let users: { [key: string]: Tokens } = {};
  let commentaries: string[];
  let product: any;
  let test: TestTemplates;

  const port = Number.parseInt(process.env.APP_PORT) + 60;
  const host = `http://localhost:${port}/`;
  const uri = 'commentary/';
  const dto: CreateCommentaryDto = {
    text: faker.lorem.word({ length: { min: 6, max: 50 } }),
    product: undefined,
  };

  beforeAll(async () => {
    const { app: appInstance } = await createTestingModule('commentary-test', port);
    app = appInstance;
    users = await app.get(UserSeed).seedRoles();
    // commentaries = await app.get(CommentarySeed).seed(10);
    product = await app.get(ProductSeed).seed(1);

    dto.product = product[0]._id;
    console.error(await app.get(ProductService).findAll());
    test = new TestTemplates(host, uri, users, dto);
    pactum.request.setBaseUrl(host);
  });

  afterAll(async () => {
    await app.close();
  });


  describe('Commentary creating', () => {
    it('Should not create new commentary, UNAUTHORIZED', () => {
      return test.create.failedUnauthorized();
    });
    it('Should create new commentary', () => {
      return test.create.passCreate({ role: RoleEnum.USER });
    });
  });
});