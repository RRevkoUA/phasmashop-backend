import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiAccessAuth, GetUser, ImageInterceptor } from 'src/common/decorator';
import { JwtGuard } from 'src/common/guard';
import { Document } from 'mongoose';
import { User } from 'src/common/schemas';
import { ImageInterceptorEnum } from 'src/common/enums';

@UseGuards(JwtGuard)
@ApiAccessAuth()
@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User & Document,
  ) {
    return this.productService.create(createProductDto, user);
  }

  @UseGuards()
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @UseGuards()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User & Document,
  ) {
    return this.productService.update(id, updateProductDto, user);
  }

  @Patch(':id/images')
  @ImageInterceptor(ImageInterceptorEnum.IMAGE_PRODUCT)
  addImages(
    @Param('id') id: string,
    @GetUser() user: User & Document,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.productService.addImages(id, files, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User & Document) {
    return this.productService.remove(id, user);
  }
}
