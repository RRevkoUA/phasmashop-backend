import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    example: 'Tag name',
    description: 'The name of the tag',
    required: true,
    default: 'Tag name',
  })
  @IsString()
  name: string;
}
