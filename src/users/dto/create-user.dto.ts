import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  username: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  hash: string;

  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty()
  phone?: string;

  @IsEnum(['Admin', 'Moderator', 'User', 'Guest'])
  @IsOptional()
  @ApiProperty()
  role?: string;
}
