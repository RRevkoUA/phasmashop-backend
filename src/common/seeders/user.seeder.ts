import { faker } from '@faker-js/faker';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { User } from 'src/common/schemas/User.schema';
import { AuthService } from 'src/auth/auth.service';
import { SignupAuthDto } from 'src/auth/dto';
import { RoleEnum } from '../enums';
import { Tokens } from 'src/auth/types';

@Injectable()
export class UserSeed {
  constructor(
    @InjectModel(User.name) private userModule: Model<User>,
    private readonly authService: AuthService,
  ) {}

  async seed(
    amount: number,
    possibleRoles: RoleEnum[],
  ): Promise<
    {
      user: User & Document;
      tokens: Tokens;
    }[]
  > {
    return new Promise(async (resolve, reject) => {
      const users: { user: User & Document; tokens: Tokens }[] = [];
      while (amount) {
        const dto: SignupAuthDto = {
          email: faker.internet.email(),
          password: faker.internet.password({ length: 8, prefix: 'Aa1' }),
          username: faker.internet.userName(),
          role: faker.helpers.arrayElement(Object.values(possibleRoles)),
          phone: faker.helpers.fromRegExp('+38098[0-9]{7}'),
        };
        const tokens = await this.authService.signup(dto);
        users.push({
          tokens: tokens,
          user: await this.getUserByToken(tokens.access_token),
        });
        amount--;
        if (!amount) {
          return resolve(users);
        }
      }
      return reject('Cannot seed users');
    });
  }

  async seedRoles(): Promise<{ [key: string]: Tokens }> {
    return new Promise(async (resolve, reject) => {
      const tokens: { [key: string]: Tokens } = {};
      for (const role in RoleEnum) {
        const dto: SignupAuthDto = {
          email: faker.internet.email(),
          password: faker.internet.password({ length: 8, prefix: 'Aa1' }),
          username: faker.internet.userName(),
          role: RoleEnum[role],
          phone: faker.helpers.fromRegExp('+38098[0-9]{7}'),
        };
        try {
          tokens[role] = await this.authService.signup(dto);
        } catch (err) {
          return reject(err);
        }
      }
      return resolve(tokens);
    });
  }

  async clear(): Promise<{ deletedCount?: number }> {
    return await this.userModule.deleteMany({});
  }

  async getUserByToken(token: string): Promise<User & Document> {
    const { payload } = this.decodeToken(token);
    return await this.userModule.findOne({ email: payload.email });
  }


  decodeToken(token: string) {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf8'));
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));

    return { header, payload };
  }
}
