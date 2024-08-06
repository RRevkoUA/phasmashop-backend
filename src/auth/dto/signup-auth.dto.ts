import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

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

  @IsEnum(['Admin', 'Moderator', 'User', 'Guest'])
  @IsOptional()
  @ApiProperty({
    default: 'User',
  })
  role?: string;
}
