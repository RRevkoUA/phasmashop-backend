import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Post,
  UploadedFile,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/schemas/User.schema';
import { GetUser, ImageInterceptor, Role } from 'src/common/decorator';
import { ImageInterceptorEnum, RoleEnum } from 'src/common/enums';
import { Document } from 'mongoose';

@ApiTags('Users')
@Role(RoleEnum.USER)
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Role(RoleEnum.MODERATOR)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  findMe(@GetUser() user: User) {
    return this.usersService.findUser(user.username);
  }

  @Get(':username')
  findUser(@Param('username') username: string) {
    return this.usersService.findUser(username);
  }

  @Patch('me')
  updateUser(@Body() dto: UpdateUserDto, @GetUser() user: User & Document) {
    return this.usersService.update(dto, user);
  }

  @Delete('me')
  deleteUser(@GetUser() user: User) {
    return this.usersService.delete(user);
  }

  @Post('me/avatar')
  @ImageInterceptor(ImageInterceptorEnum.IMAGE_AVATAR)
  uploadAvatar(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      this.logger.error('No file provided');
      throw new ForbiddenException('No file provided');
    }
    return this.usersService.uploadAvatar(user, file);
  }
}
