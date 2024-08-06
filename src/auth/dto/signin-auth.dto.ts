import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SigninAuthDto {
  @IsString()
  @ApiProperty({
    default: 'usernameOrEmail',
  })
  usernameOrEmail: string;

  @IsString()
  @ApiProperty({
    default: 'password',
  })
  password: string;
}
