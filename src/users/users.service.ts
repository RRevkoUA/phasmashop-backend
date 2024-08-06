import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModule: Model<User>) {}

  async findAll() {
    const usersArr: User[] = [];
    const cursor = this.userModule.find().cursor();
    for (
      let doc = await cursor.next();
      doc != null;
      doc = await cursor.next()
    ) {
      doc.hash = undefined;
      usersArr.push(doc);
      // XXX :: Fuse for no more objects, than 20. Will fix, in pages update
      if (usersArr.length >= 20) {
        break;
      }
    }
    return usersArr;
  }

  findUser(username: string) {}

  update(dto: UpdateUserDto, user: User) {}

  delete(user: User) {}
}
