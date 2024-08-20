import { IsBoolean, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsBoolean()
  isAvailable?: boolean;
}
