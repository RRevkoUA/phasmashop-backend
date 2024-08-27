import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  Body,
  Param,
  Post,
  UploadedFile,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/schemas/User.schema';
import { JwtGuard } from 'src/common/guard';
import { ApiAccessAuth, GetUser, ImageInterceptor } from 'src/common/decorator';
import { ImageInterceptorEnum } from 'src/common/enums';

@ApiTags('Users')
@ApiAccessAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  updateUser(@Body() dto: UpdateUserDto, @GetUser() user: User) {
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
      throw new ForbiddenException('No file provided');
    }
    return this.usersService.uploadAvatar(user, file);
  }
}
