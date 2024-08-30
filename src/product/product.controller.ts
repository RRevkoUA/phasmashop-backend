import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { ImageInterceptorEnum } from 'src/common/enums';
import { GetUser, ImageInterceptor, Role } from 'src/common/decorator';
import { Document } from 'mongoose';
import { User } from 'src/common/schemas';
import { RoleEnum } from 'src/common/enums';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Role(RoleEnum.USER)
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

  @Role(RoleEnum.USER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User & Document,
  ) {
    return this.productService.update(id, updateProductDto, user);
  }

  @Role(RoleEnum.USER)
  @Patch(':id/images')
  @ImageInterceptor(ImageInterceptorEnum.IMAGE_PRODUCT)
  addImages(
    @Param('id') id: string,
    @GetUser() user: User & Document,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.productService.addImages(id, files, user);
  }

  @Role(RoleEnum.USER)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User & Document) {
    return this.productService.remove(id, user);
  }
}
