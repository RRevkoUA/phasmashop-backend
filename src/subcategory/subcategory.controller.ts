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
@Role(RoleEnum.ADMIN)
@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoryService.create(createSubcategoryDto);
  }

  @Role(RoleEnum.USER)
  @Get()
  findAll() {
    return this.subcategoryService.findAll();
  }
  @Role(RoleEnum.USER)
  @Get(':subcategory')
  findOne(@Param('subcategory') subcategoryName: string) {
    return this.subcategoryService.findOne(subcategoryName);
  }

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

  @Delete(':subcategory')
  remove(@Param('subcategory') subcategoryName: string) {
    return this.subcategoryService.remove(subcategoryName);
  }
}
