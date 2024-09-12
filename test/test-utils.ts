import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpStatus,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as pactum from 'pactum';
import { Tokens } from 'src/auth/types';
import { th } from '@faker-js/faker';
import { RoleEnum } from 'src/common/enums';

export async function createTestingModule(dbName: string, appPort: number) {
  const dbPort = parseInt(process.env.DB_URL.split(':').pop());

  const mongoUri: string = 'mongodb://localhost:' + dbPort + '/' + dbName;
  Logger.log(mongoUri);
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [MongooseModule.forRoot(mongoUri), AppModule],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.init();
  await app.listen(appPort);
  Logger.log(`Server is running on http://localhost:${appPort}`);

  return { app };
}

type UsersTokens = { [key: string]: Tokens };

export class TestTemplates {
  private uri: string;
  private dto: any;
  private users: UsersTokens;

  create: InstanceType<typeof this.createClass>;
  read: InstanceType<typeof this.getClass>;
  update: InstanceType<typeof this.updateClass>;
  delete: InstanceType<typeof this.deleteClass>;

  constructor(host: string, uri: string, users: UsersTokens, dto: any) {
    this.uri = uri;
    this.users = users;
    this.dto = dto;
    this.create = new this.createClass(this.uri, this.users, this.dto);
    this.read = new this.getClass(this.uri, this.users);
    this.update = new this.updateClass(this.uri, this.users);
    this.delete = new this.deleteClass(this.uri, this.users);

    for (const key in this.users) {
      this.users[key.toLowerCase()] = this.users[key];
      delete this.users[key];
    }

    pactum.request.setBaseUrl(host);
  }

  private createClass = class TestCreate {
    private uri: string;
    private dto: any;
    private users: UsersTokens;
    constructor(uri: string, users: UsersTokens, dto: any) {
      this.uri = uri;
      this.users = users;
      this.dto = dto;
    }
    #create(status: HttpStatus, role?: RoleEnum) {
      let test = pactum.spec().post(this.uri).expectStatus(status);
      if (role) {
        test = test.withCookies('access_token', this.users[role].access_token);
      }
      return test;
    }
    passCreate(role?: RoleEnum, status?: HttpStatus) {
      return this.#create(status || HttpStatus.CREATED, role).withBody(
        this.dto,
      );
    }

    failedUnauthorized(status?: HttpStatus) {
      return this.#create(status || HttpStatus.UNAUTHORIZED).withBody(this.dto);
    }

    failedHaveNoPermission(role: RoleEnum, status?: HttpStatus) {
      return this.#create(status || HttpStatus.UNAUTHORIZED, role).withBody(
        this.dto,
      );
    }

    failedAlreadyExists(role?: RoleEnum, status?: HttpStatus) {
      return this.#create(status || HttpStatus.FORBIDDEN, role).withBody(
        this.dto,
      );
    }

    failedBadRequest(role?: RoleEnum, status?: HttpStatus) {
      return this.#create(status || HttpStatus.BAD_REQUEST, role).withBody({
        someRandomFieldName: 'a',
      });
    }

    failedEmpty(role?: RoleEnum, status?: HttpStatus) {
      return this.#create(status || HttpStatus.BAD_REQUEST, role);
    }
  };

  private getClass = class TestGet {
    private uri: string;
    private users: UsersTokens;
    constructor(uri: string, users: UsersTokens) {
      this.uri = uri;
      this.users = users;
    }

    #get(status: HttpStatus, role?: RoleEnum, uri?: string) {
      let test = pactum
        .spec()
        .get(uri || this.uri)
        .expectStatus(status);
      if (role) {
        test = test.withCookies('access_token', this.users[role].access_token);
      }
      return test;
    }
    passGet(status?: HttpStatus, role?: RoleEnum, count?: number) {
      let test = this.#get(status || HttpStatus.OK, role);
      if (count) {
        test = test.expectJsonLength(count);
      }
      return test;
    }

    passGetById(id: string, role?: RoleEnum, status?: HttpStatus) {
      return this.#get(status || HttpStatus.OK, role, this.uri + id);
    }

    failedUnauthorized(status?: HttpStatus) {
      return this.#get(status || HttpStatus.UNAUTHORIZED);
    }

    async failedHaveNotPermission(role: RoleEnum, status?: HttpStatus) {
      return this.#get(status || HttpStatus.UNAUTHORIZED, role);
    }

    async failedNotFound(id: string, role?: RoleEnum, status?: HttpStatus) {
      return this.#get(status || HttpStatus.NOT_FOUND, role, this.uri + id);
    }
  };

  private updateClass = class TestUpdate {
    private uri: string;
    private users: UsersTokens;
    constructor(uri: string, users: UsersTokens) {
      this.uri = uri;
      this.users = users;
    }

    #updateTest(status: HttpStatus, role?: RoleEnum) {
      let test = pactum.spec().patch(this.uri).expectStatus(status);
      if (role) {
        test = test.withCookies('access_token', this.users[role].access_token);
      }
      return test;
    }
    async passUpdate(dto: any, role?: RoleEnum, status?: HttpStatus) {
      return this.#updateTest(status || HttpStatus.OK, role).withBody(dto);
    }

    async failedUnauthorized(dto: any, status?: HttpStatus) {
      return this.#updateTest(status || HttpStatus.UNAUTHORIZED).withBody(dto);
    }

    async failedHaveNotPermission(
      dto: any,
      role: RoleEnum,
      status?: HttpStatus,
    ) {
      return this.#updateTest(status || HttpStatus.UNAUTHORIZED, role).withBody(
        dto,
      );
    }

    async failedNotFound(dto: any, role?: RoleEnum, status?: HttpStatus) {
      return this.#updateTest(status || HttpStatus.NOT_FOUND, role).withBody(
        dto,
      );
    }

    async passUpdateEmpty(role?: RoleEnum, status?: HttpStatus) {
      return this.#updateTest(status || HttpStatus.NOT_FOUND, role);
    }

    async failedUnique(dto: any, role?: RoleEnum, status?: HttpStatus) {
      return this.#updateTest(status || HttpStatus.FORBIDDEN, role).withBody(
        dto,
      );
    }
  };

  private deleteClass = class TestDelete {
    private uri: string;
    private users: UsersTokens;
    constructor(uri: string, users: UsersTokens) {
      this.uri = uri;
      this.users = users;
    }

    #deleteTest(status: HttpStatus, role?: RoleEnum) {
      let test = pactum.spec().delete(this.uri).expectStatus(status);
      if (role) {
        test = test.withCookies('access_token', this.users[role].access_token);
      }
      return test;
    }

    passDelete(role?: RoleEnum, status?: HttpStatus) {
      return this.#deleteTest(status || HttpStatus.OK, role);
    }

    failedUnauthorized(status?: HttpStatus) {
      return this.#deleteTest(status || HttpStatus.UNAUTHORIZED);
    }

    failedHaveNotPermission(role: RoleEnum, status?: HttpStatus) {
      return this.#deleteTest(status || HttpStatus.UNAUTHORIZED, role);
    }

    failedNotFound(role?: RoleEnum, status?: HttpStatus) {
      return this.#deleteTest(status || HttpStatus.NOT_FOUND, role);
    }
  };
}
