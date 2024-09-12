import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  @ApiProperty({
    example: 'Subcategory',
    description: 'The name of the subcategory',
    required: true,
    default: 'SubCategory name',
  })
  name: string;

  @IsBoolean()
  @ApiProperty({
    example: true,
    description:
      'The availability of the subcategory. If false, the subcategory, and ' +
      'subobjects will not be displayed in the list of categories',
    required: false,
    default: false,
  })
  isAvailable?: boolean;

  @IsString()
  @ApiProperty({
    example: 'New Category',
    description: 'added this subcategory to exist category',
    required: true,
    default: 'Category',
  })
  category: string;
}
