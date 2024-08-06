import {
  Controller,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    //return this.usersService.findAll();
  }

  @Get('me')
  findMe() {
    // return this.usersService.findOne();
  }

  @Patch('me')
  updateUser() {
    //Use UpdateUserDto
    // return this.userService.update();
  }

  @Delete('me')
  deleteUser() {
    //return this.userService.delete();
  }
}
