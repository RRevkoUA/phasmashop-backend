import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SigninAuthDto {
  @IsString()
  @MinLength(4)
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
