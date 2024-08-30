import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, User } from 'src/common/schemas';
import { Document, Model, Types } from 'mongoose';
import { ImageService } from 'src/image/image.service';
import { ImageInterceptorEnum } from 'src/common/enums';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly imageService: ImageService,
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

  async addImages(
    id: string,
    files: Array<Express.Multer.File>,
    user: User & Document,
  ) {
    const imageIds: Types.ObjectId[] = [];
    const product = await this.productModel.findById(id);
    if (!product) {
      this.imageService.removeByFilenames(
        files.map((file) => file.filename),
        ImageInterceptorEnum.IMAGE_PRODUCT,
      );
      throw new NotFoundException('Product not found');
    }
    if (product.authorId.toString() !== user._id.toString()) {
      this.imageService.removeByFilenames(
        files.map((file) => file.filename),
        ImageInterceptorEnum.IMAGE_PRODUCT,
      );
      throw new ForbiddenException(
        'You are not allowed to update this product',
      );
    }

    this.#removeImages(product);
    for (const file of files) {
      const imageId = await this.imageService.create(
        file.filename,
        new Types.ObjectId(user._id as string),
      );
      imageIds.push(imageId._id);
    }
    return await this.productModel.findByIdAndUpdate(
      id,
      { $push: { images: { $each: imageIds } } },
      { new: true },
    );
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
    this.#removeImages(product);
    return await this.productModel.findByIdAndDelete(id);
  }

  #removeImages = async (product: Product & Document) => {
    if (product.images.length) {
      await this.productModel.findByIdAndUpdate(product._id, { images: [] });
      await this.imageService.removeMany(
        product.images,
        ImageInterceptorEnum.IMAGE_PRODUCT,
      );
    }
  };
}
