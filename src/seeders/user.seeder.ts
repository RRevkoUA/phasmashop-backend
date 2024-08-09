import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';
import { AuthService } from 'src/auth/auth.service';
import { SignupAuthDto } from 'src/auth/dto';

@Injectable()
export class UserSeed {
  constructor(
    @InjectModel(User.name) private userModule: Model<User>,
    private readonly authService: AuthService,
  ) {}

  async seed(amount: number) {
    while (amount) {
      const dto: SignupAuthDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        username: faker.internet.userName(),
        role: faker.helpers.arrayElement([
          'Admin',
          'Moderator',
          'User',
          'Guest',
        ]),
        phone: faker.helpers.fromRegExp('+38098[0-9]{7}'),
      };
      const token = await this.authService.signup(dto);
      amount--;
      if (!amount) {
        return token;
      }
    }
    return '';
  }
}
