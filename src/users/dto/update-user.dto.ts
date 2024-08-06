import { PartialType } from '@nestjs/mapped-types';
import { SignupAuthDto } from 'src/auth/dto';

export class UpdateUserDto extends PartialType(SignupAuthDto) {}
