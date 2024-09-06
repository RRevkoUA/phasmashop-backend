import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SigninAuthDto {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'only letters and numbers allowed',
  })
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
