import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SigninAuthDto {
  @IsString()
  @ApiProperty({
    default: 'usernameOrEmail',
    description: 'may be username, or email',
  })
  login: string;

  @IsString()
  @ApiProperty({
    default: 'password',
  })
  password: string;
}
