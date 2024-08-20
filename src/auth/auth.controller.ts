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
import { User } from 'src/schemas/User.schema';
import { ApiAccessAuth, ApiRefreshAuth, GetUser, SetCookie } from './decorator';
import { JwtGuard, JwtRefreshGuard } from './guard';
@ApiTags('Auth')
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(
    @Body() dto: SignupAuthDto,
    @SetCookie() set_cookie,
  ): Promise<Tokens> {
    const tokens: Tokens = await this.authService.signup(dto);

    set_cookie('access_token', tokens.access_token);
    set_cookie('refresh_token', tokens.refresh_token);

    return tokens;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: SigninAuthDto, @SetCookie() set_cookie) {
    const tokens = await this.authService.signin(dto);

    set_cookie('access_token', tokens.access_token);
    set_cookie('refresh_token', tokens.refresh_token);

    return tokens;
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
  async refresh(@GetUser() user: User, @SetCookie() set_cookie) {
    const tokens: Tokens = await this.authService.refreshTokens(
      user['user'],
      user['refresh_token'],
    );

    set_cookie('access_token', tokens.access_token);
    set_cookie('refresh_token', tokens.refresh_token);

    return tokens;
  }
}
