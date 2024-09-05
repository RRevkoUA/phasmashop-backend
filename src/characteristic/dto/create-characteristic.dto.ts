import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCharacteristicDto {
  @ApiProperty({
    example: 'Characteristic name',
    description: 'The name of the characteristic',
    required: true,
    default: 'Characteristic name',
  })
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  name: string;

  @ApiProperty({
    example: ['value1', 'value2'],
    description: 'The array of values for the characteristic',
    required: false,
    default: ['value1', 'value2'],
  })
  @IsArray()
  enum?: string[];
}
