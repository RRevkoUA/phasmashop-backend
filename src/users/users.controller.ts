import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  Body,
  Param,
  UseInterceptors,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/schemas/User.schema';
import { JwtGuard } from 'src/common/guard';
import { ApiAccessAuth, GetUser } from 'src/common/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageHelper } from 'src/common/helpers/image.helper';

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
  @UseInterceptors(FileInterceptor('file', imageHelper))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadAvatar(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(user, file);
  }
}
