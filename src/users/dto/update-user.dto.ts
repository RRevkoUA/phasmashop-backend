import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { SignupAuthDto } from 'src/auth/dto';

export class UpdateUserDto extends PartialType(SignupAuthDto) {
  @ApiProperty({
    example: '',
    description: 'The orders of the user',
    required: false,
    default: 'order',
  })
  order: string;
}
