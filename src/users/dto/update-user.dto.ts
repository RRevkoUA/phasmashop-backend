import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { SignupAuthDto } from 'src/auth/dto';

export class UpdateUserDto extends PartialType(SignupAuthDto) {
  @IsString({ each: true })
  @ApiProperty({
    example: ['order1', 'order2'],
    description: 'The orders of the user',
    required: false,
    default: ['order1', 'order2'],
  })
  orders?: string[];
}
