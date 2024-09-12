import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Role } from 'src/common/decorator';
import { RoleEnum } from 'src/common/enums';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':category')
  async findOne(@Param('category') categoryName: string) {
    return await this.categoryService.findOne(categoryName);
  }

  @Role(RoleEnum.ADMIN)
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return await this.categoryService.create(dto);
  }

  @Role(RoleEnum.ADMIN)
  @Patch(':category')
  async update(
    @Param('category') categoryName: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(categoryName, dto);
  }

  @Role(RoleEnum.ADMIN)
  @Delete(':category')
  remove(@Param('category') categoryName: string) {
    return this.categoryService.remove(categoryName);
  }
}
