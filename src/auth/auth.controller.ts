import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninAuthDto, SignupAuthDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Tokens } from './types';
import { User } from 'src/schemas/users.schema';
import { ApiAccessAuth, ApiRefreshAuth, GetUser } from './decorator';
import { JwtGuard, JwtRefreshGuard } from './guard';
@ApiTags('Auth')
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() dto: SignupAuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SigninAuthDto) {
    return this.authService.signin(dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAccessAuth()
  @UseGuards(JwtGuard)
  @Post('logout')
  logout(@GetUser() user: User) {
    return this.authService.logout(user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiRefreshAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@GetUser() user: User) {
    return this.authService.refreshTokens(user['user'], user['refresh_token']);
  }
}
