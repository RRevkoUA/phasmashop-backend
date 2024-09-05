import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/common/schemas/User.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto';
import * as argon from 'argon2';
import { ImageService } from 'src/image/image.service';
import { ImageInterceptorEnum } from 'src/common/enums';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private imageService: ImageService,
  ) {}

  async findAll() {
    const usersArr: User[] = [];
    const cursor = this.userModel.find().populate('avatar').cursor();
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
    const user = await this.userModel.findOne({ username }).populate('avatar');
    if (!user) {
      this.logger.error('User not Found');
      throw new NotFoundException('User not Found');
    }
    user.hash = undefined;
    user.hashedRt = undefined;
    this.logger.verbose('User found: ' + user.username);
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

      const updatedUser = await this.userModel.findOneAndUpdate(
        user,
        updateData,
      );
      updatedUser.hash = undefined;
      updatedUser.hashedRt = undefined;
      this.logger.verbose('User updated: ' + updatedUser.username);
    } catch (err) {
      if (err.code === 11000) {
        const res = Object.values(err.keyValue)[0];
        this.logger.error(`${res} is already in use`);
        throw new ForbiddenException(`${res} is already in use`);
      }
    }
  }

  async delete(user: User) {
    if (user.avatar) {
      await this.imageService.remove(
        user.avatar,
        ImageInterceptorEnum.IMAGE_AVATAR,
      );
    }
    this.logger.verbose('User deleted: ' + user.username);
    return await this.userModel.findOneAndDelete(user);
  }

  async uploadAvatar(user: User, file: Express.Multer.File) {
    const currentUser = await this.userModel.findOne(user);
    if (currentUser.avatar) {
      try {
        await this.imageService.remove(
          currentUser.avatar,
          ImageInterceptorEnum.IMAGE_AVATAR,
        );
      } catch (err) {
        this.logger.error(err);
      }
    }
    const image = await this.imageService.create(
      file.filename,
      currentUser._id,
    );
    return await this.userModel.findOneAndUpdate(user, { avatar: image._id });
  }
}
