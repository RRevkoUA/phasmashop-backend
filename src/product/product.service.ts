import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, User } from 'src/common/schemas';
import { Document, Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  async create(createProductDto: CreateProductDto, user: User & Document) {
    try {
      const product = await this.productModel.create({
        ...createProductDto,
        authorId: user._id,
      });
      return product;
    } catch (error) {
      console.error(error);
      throw new ForbiddenException('Something went wrong\n' + error);
    }
  }

  async findAll() {
    return await this.productModel.find();
  }

  async findOneByArticle(article: string) {
    const product = await this.productModel.findOne({ article });
    if (!product) {
      throw new ForbiddenException('Product not found');
    }
    return product;
  }

  async findOneById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new ForbiddenException('Product not found');
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: User & Document,
  ) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.authorId?.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'You are not allowed to update this product',
      );
    }
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        updateProductDto,
        { new: true },
      );
      return updatedProduct;
    } catch (error) {
      console.error(error);
      throw new ForbiddenException('Something went wrong' + error);
    }
  }

  async remove(id: string, user: User & Document) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.authorId.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'You are not allowed to remove this product',
      );
    }
    return await this.productModel.findByIdAndDelete(id);
  }
}
