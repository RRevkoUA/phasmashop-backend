import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { JwtGuard } from 'src/common/guard';
import { ApiAccessAuth } from 'src/common/decorator';

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

  @ApiAccessAuth()
  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return await this.categoryService.create(dto);
  }

  @ApiAccessAuth()
  @UseGuards(JwtGuard)
  @Patch(':category')
  async update(
    @Param('category') categoryName: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(categoryName, dto);
  }

  @ApiAccessAuth()
  @UseGuards(JwtGuard)
  @Delete(':category')
  remove(@Param('category') categoryName: string) {
    return this.categoryService.remove(categoryName);
  }
}
