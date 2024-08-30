import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { RoleEnum } from 'src/common/enums';

export class SignupAuthDto {
  @IsString()
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
