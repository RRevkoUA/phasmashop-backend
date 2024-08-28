import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @ApiProperty({
    example: 'Product name',
    description: 'The name of the product',
    required: true,
    default: 'New Product',
  })
  name: string;

  @IsString()
  @ApiProperty({
    example: 'Product description',
    description: 'The description of the product',
    required: true,
    default: 'New Product description',
  })
  description: string;

  @IsNumber()
  @ApiProperty({
    example: 10,
    description: 'The stock of the product',
    required: true,
    default: 10,
  })
  stock: number;

  @IsNumber()
  @ApiProperty({
    example: 1000,
    description:
      'The price of the product. 1000 is equal to 10.00 USD (or UAH, depends on the currency)',
    required: true,
    default: 1000,
  })
  price: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: false,
    description: 'avaibility of the product',
    required: false,
    default: false,
  })
  isAvailable: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({
    example: 10,
    description: 'The discount of the product in percents',
    required: false,
    default: 0,
  })
  discount?: number;

  @IsString()
  @ApiProperty({
    example: '60e4e1b2b2f7b2f7b2f7b2f7',
    description: 'The subcategory id of the product',
    required: true,
    default: '',
  })
  subcategoryId: string;

  @IsOptional()
  @ApiProperty({
    example: '[60e4e1b2b2f7b2f7b2f7b2f7, 60e4e1b2b2f7b2f7b2f7b2f8]',
    description: 'The tags id array',
    required: false,
    default: '[]',
  })
  tags: string[];

  @ApiProperty({
    example: '[60e4e1b2b2f7b2f7b2f7b2f7, 60e4e1b2b2f7b2f7b2f7b2f8]',
    description: 'The images id array',
    required: true,
    default: '[]',
  })
  images: string[];

  @ApiProperty({
    example: '[{characteristic: "60e4e1b2b2f7b2f7b2f7b2f7", value: "value"}]',
    description: 'The characteristics array',
    required: false,
    default: '',
  })
  @IsOptional()
  characteristics?: [{ characteristic: string; value: string }];
}
