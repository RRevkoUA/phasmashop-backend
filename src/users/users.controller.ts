import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/schemas/users.schema';
import { JwtGuard } from 'src/auth/guard';
import { ApiAccessAuth, GetUser } from 'src/auth/decorator';

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
}
