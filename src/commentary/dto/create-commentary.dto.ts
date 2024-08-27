import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentaryDto {
  @IsString()
  @ApiProperty({
    example: 'Commentary',
    description: 'The text of the commentary',
    required: true,
    default: 'Commentary text',
  })
  text: string;

  @IsString({ each: true })
  images: string[];
}
