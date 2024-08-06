import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SigninAuthDto {
  @IsString()
  @ApiProperty({
    default: 'loginOrEmail',
  })
  loginOrEmail: string;

  @IsString()
  @ApiProperty({
    default: 'password',
  })
  password: string;
}
