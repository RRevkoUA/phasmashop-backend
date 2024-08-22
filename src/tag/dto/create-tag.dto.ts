import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    example: 'Tag name',
    description: 'The name of the tag',
    required: true,
    default: 'Tag name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: ['value1', 'value2'],
    description: 'The array of values for the tag',
    required: false,
    default: ['value1', 'value2'],
  })
  @IsArray()
  enum?: string[];
}
