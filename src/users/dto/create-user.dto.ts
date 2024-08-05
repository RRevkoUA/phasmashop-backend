import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  hash: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsEnum(['Admin', 'Moderator', 'User', 'Guest'])
  @IsOptional()
  role?: string;
}
