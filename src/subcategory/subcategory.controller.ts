import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiAccessAuth } from 'src/common/decorator';
import { JwtGuard } from 'src/common/guard';

@ApiTags('Subcategory')
@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @ApiAccessAuth()
  @UseGuards(JwtGuard)
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

  @ApiAccessAuth()
  @UseGuards(JwtGuard)
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

  @ApiAccessAuth()
  @UseGuards(JwtGuard)
  @Delete(':subcategory')
  remove(@Param('subcategory') subcategoryName: string) {
    return this.subcategoryService.remove(subcategoryName);
  }
}
