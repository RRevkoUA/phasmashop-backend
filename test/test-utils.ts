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
import { faker } from '@faker-js/faker';
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
    passCreate(params?: { role?: RoleEnum; status?: HttpStatus }) {
      return this.#create(
        params?.status || HttpStatus.CREATED,
        params?.role,
      ).withBody(this.dto);
    }

    failedUnauthorized(params?: { status?: HttpStatus }) {
      return this.#create(params?.status || HttpStatus.UNAUTHORIZED).withBody(
        this.dto,
      );
    }

    failedHaveNoPermission(params: { role: RoleEnum; status?: HttpStatus }) {
      return this.#create(
        params?.status || HttpStatus.UNAUTHORIZED,
        params.role,
      ).withBody(this.dto);
    }

    failedAlreadyExists(params?: { role?: RoleEnum; status?: HttpStatus }) {
      return this.#create(
        params?.status || HttpStatus.FORBIDDEN,
        params?.role,
      ).withBody(this.dto);
    }

    failedBadRequest(params?: { role?: RoleEnum; status?: HttpStatus }) {
      return this.#create(
        params?.status || HttpStatus.BAD_REQUEST,
        params?.role,
      ).withBody({
        someRandomFieldName: 'a',
      });
    }

    failedEmpty(params?: { role?: RoleEnum; status?: HttpStatus }) {
      return this.#create(
        params?.status || HttpStatus.BAD_REQUEST,
        params?.role,
      );
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
    passGet(params?: { status?: HttpStatus; role?: RoleEnum; count?: number }) {
      let test = this.#get(params?.status || HttpStatus.OK, params?.role);
      if (params?.count) {
        test = test.expectJsonLength(params.count);
      }
      return test;
    }

    passGetById(id: string, params?: { role?: RoleEnum; status?: HttpStatus }) {
      return this.#get(
        params?.status || HttpStatus.OK,
        params?.role,
        this.uri + id,
      );
    }

    failedUnauthorized(params?: { status?: HttpStatus }) {
      return this.#get(params?.status || HttpStatus.UNAUTHORIZED);
    }

    failedHaveNoPermission(params: { role: RoleEnum; status?: HttpStatus }) {
      return this.#get(params?.status || HttpStatus.UNAUTHORIZED, params.role);
    }

    failedNotFound(params?: { role?: RoleEnum; status?: HttpStatus }) {
      return this.#get(
        params?.status || HttpStatus.NOT_FOUND,
        params?.role,
        this.uri + faker.lorem.word(),
      );
    }
  };

  private updateClass = class TestUpdate {
    private uri: string;
    private users: UsersTokens;
    constructor(uri: string, users: UsersTokens) {
      this.uri = uri;
      this.users = users;
    }

    #updateTest(uri: string, status: HttpStatus, role?: RoleEnum) {
      let test = pactum.spec().patch(uri).expectStatus(status);
      if (role) {
        test = test.withCookies('access_token', this.users[role].access_token);
      }
      return test;
    }
    passUpdate(params: {
      updatingUnit: string;
      dto: any;
      role?: RoleEnum;
      status?: HttpStatus;
    }) {
      return this.#updateTest(
        this.uri + params.updatingUnit,
        params?.status || HttpStatus.OK,
        params?.role,
      ).withBody(params.dto);
    }

    failedUnauthorized(params: {
      updatingUnit: string;
      dto: any;
      status?: HttpStatus;
    }) {
      return this.#updateTest(
        this.uri + params.updatingUnit,
        params?.status || HttpStatus.UNAUTHORIZED,
      ).withBody(params.dto);
    }

    failedHaveNoPermission(params: {
      updatingUnit: string;
      dto: any;
      role: RoleEnum;
      status?: HttpStatus;
    }) {
      return this.#updateTest(
        this.uri + params.updatingUnit,
        params?.status || HttpStatus.UNAUTHORIZED,
        params.role,
      ).withBody(params.dto);
    }

    failedNotFound(params: {
      updatingUnit: string;
      dto: any;
      role?: RoleEnum;
      status?: HttpStatus;
    }) {
      return this.#updateTest(
        this.uri + params.updatingUnit,
        params?.status || HttpStatus.NOT_FOUND,
        params?.role,
      ).withBody(params.dto);
    }

    passUpdateEmpty(
      updatingUnit: string,
      params?: { role?: RoleEnum; status?: HttpStatus },
    ) {
      return this.#updateTest(
        this.uri + updatingUnit,
        params?.status || HttpStatus.NOT_FOUND,
        params?.role,
      );
    }

    failedUnique(params: {
      updatingUnit: string;
      dto: any;
      role?: RoleEnum;
      status?: HttpStatus;
    }) {
      return this.#updateTest(
        this.uri + params.updatingUnit,
        params?.status || HttpStatus.FORBIDDEN,
        params?.role,
      ).withBody(params.dto);
    }
  };

  private deleteClass = class TestDelete {
    private uri: string;
    private users: UsersTokens;
    constructor(uri: string, users: UsersTokens) {
      this.uri = uri;
      this.users = users;
    }

    #deleteTest(uri: string, status: HttpStatus, role?: RoleEnum) {
      let test = pactum.spec().delete(uri).expectStatus(status);
      if (role) {
        test = test.withCookies('access_token', this.users[role].access_token);
      }
      return test;
    }

    passDelete(
      deleteUnit: string,
      params?: { role?: RoleEnum; status?: HttpStatus },
    ) {
      return this.#deleteTest(
        deleteUnit,
        params?.status || HttpStatus.OK,
        params?.role,
      );
    }

    failedUnauthorized(deleteUnit: string, params?: { status?: HttpStatus }) {
      return this.#deleteTest(
        deleteUnit,
        params?.status || HttpStatus.UNAUTHORIZED,
      );
    }

    failedHaveNoPermission(params: {
      deleteUnit: string;
      role: RoleEnum;
      status?: HttpStatus;
    }) {
      return this.#deleteTest(
        params.deleteUnit,
        params?.status || HttpStatus.UNAUTHORIZED,
        params.role,
      );
    }

    failedNotFound(deleteUnit: string, params?: {
      role?: RoleEnum;
      status?: HttpStatus;
    }) {
      return this.#deleteTest(
        deleteUnit,
        params?.status || HttpStatus.NOT_FOUND,
        params?.role,
      );
    }
  };
}
