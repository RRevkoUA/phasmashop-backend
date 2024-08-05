import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
}
