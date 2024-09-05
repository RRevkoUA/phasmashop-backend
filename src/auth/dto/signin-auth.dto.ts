import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SigninAuthDto {
  @IsString()
  @ApiProperty({
    default: 'usernameOrEmail',
    description: 'may be username, or email',
  })
  login: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @ApiProperty({
    default: 'password',
  })
  password: string;
}
