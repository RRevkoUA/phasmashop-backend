import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty({
    example: 'Category name',
    description: 'The name of the category',
    required: true,
    default: 'New Category',
  })
  name: string;

  @IsBoolean()
  @ApiProperty({
    example: true,
    description:
      'The availability of the category. If false, the category, and sub objects will not be displayed in the list of categories',
    required: false,
    default: false,
  })
  isAvailable?: boolean;
}
