import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUser, Role } from 'src/common/decorator';
import { Document } from 'mongoose';
import { User } from 'src/common/schemas';
import { RoleEnum } from 'src/common/enums';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Role(RoleEnum.MODERATOR)
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User & Document,
  ) {
    return this.productService.create(createProductDto, user);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOneById(id);
  }

  @Role(RoleEnum.MODERATOR)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User & Document,
  ) {
    return this.productService.update(id, updateProductDto, user);
  }

  @Role(RoleEnum.MODERATOR)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User & Document) {
    return this.productService.remove(id, user);
  }
}
