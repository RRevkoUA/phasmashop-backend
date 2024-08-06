import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModule: Model<User>) {}

  findAll() {}

  findUser(username: string) {}

  update(dto: UpdateUserDto, user: User) {}

  delete(user: User) {}
}
