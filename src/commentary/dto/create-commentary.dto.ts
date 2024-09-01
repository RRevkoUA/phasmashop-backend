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

  @ApiProperty({
    example: [],
    description: 'The images of the commentary',
    required: false,
    default: ['image1', 'image2'],
  })
  images?: string[];

  @ApiProperty({
    example: 'Product',
    description: 'The product of the commentary',
    required: true,
    default: 'Product',
  })
  product: string;
}
