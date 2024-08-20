import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/User.schema';
import { Image } from 'src/schemas/Image.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModule: Model<User>,
    @InjectModel(Image.name) private imageModule: Model<Image>,
  ) {}

  async findAll() {
    const usersArr: User[] = [];
    const cursor = this.userModule.find().cursor();
    for (
      let doc = await cursor.next();
      doc != null;
      doc = await cursor.next()
    ) {
      doc.hash = undefined;
      doc.hashedRt = undefined;
      usersArr.push(doc);
      // XXX :: Fuse for no more objects, than 20. Will fix, in pages update
      if (usersArr.length >= 20) {
        break;
      }
    }
    return usersArr;
  }

  async findUser(username: string) {
    const user = await this.userModule.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not Found');
    }
    user.hash = undefined;
    user.hashedRt = undefined;
    return user;
  }

  async update(dto: UpdateUserDto, user: User) {
    try {
      const updateData = {
        hash: undefined,
        ...dto,
      };

      if (dto.password) {
        const hash = await argon.hash(dto.password);
        updateData.hash = hash;
      }

      await this.userModule.findOneAndUpdate(user, updateData);
    } catch (err) {
      if (err.code === 11000) {
        const res = Object.values(err.keyValue)[0];
        throw new ForbiddenException(`${res} is already in use`);
      }
    }
  }

  async delete(user: User) {
    return await this.userModule.findOneAndDelete(user);
  }

  async uploadAvatar(user: User, file: Express.Multer.File) {
    const image = await this.imageModule.create({
      filename: file.filename,
      author: user,
    });
    return await this.userModule.findOneAndUpdate(user, { avatar: image });
  }
}
