import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums';
import { Role } from 'src/common/decorator';

@ApiTags('Subcategory')
@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Role(RoleEnum.ADMIN)
  @Post()
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoryService.create(createSubcategoryDto);
  }

  @Get()
  findAll() {
    return this.subcategoryService.findAll();
  }

  @Get(':subcategory')
  findOne(@Param('subcategory') subcategoryName: string) {
    return this.subcategoryService.findOne(subcategoryName);
  }

  @Role(RoleEnum.ADMIN)
  @Patch(':subcategory')
  update(
    @Param('subcategory') subcategoryName: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoryService.update(
      subcategoryName,
      updateSubcategoryDto,
    );
  }

  @Role(RoleEnum.ADMIN)
  @Delete(':subcategory')
  remove(@Param('subcategory') subcategoryName: string) {
    return this.subcategoryService.remove(subcategoryName);
  }
}
