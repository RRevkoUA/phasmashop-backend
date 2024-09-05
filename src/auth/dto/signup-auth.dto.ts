import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleEnum } from 'src/common/enums';

export class SignupAuthDto {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'only letters and numbers allowed',
  })
  @ApiProperty({
    default: 'user',
  })
  username: string;

  @IsEmail()
  @ApiProperty({
    default: 'email@example.com',
  })
  email: string;

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

  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty({
    default: '+380985052935',
  })
  phone?: string;

  @IsEnum(RoleEnum)
  @IsOptional()
  @ApiProperty({
    default: RoleEnum.USER,
    enum: RoleEnum,
  })
  role?: string;
}
