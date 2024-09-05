import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    example: 'Tag name',
    description: 'The name of the tag',
    required: true,
    default: 'Tag name',
  })
  @MinLength(2)
  @MaxLength(15)
  @IsString()
  name: string;
}
