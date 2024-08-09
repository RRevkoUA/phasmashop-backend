import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninAuthDto, SignupAuthDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() dto: SignupAuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SigninAuthDto) {
    return this.authService.signin(dto);
  }
}
