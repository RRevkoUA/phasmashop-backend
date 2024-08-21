import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from 'src/common/schemas';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModule: Model<Category>,
  ) {}
  async findAll() {
    return await this.categoryModule.find();
  }

  async findOne(categoryName: string) {
    const category = await this.categoryModule.findOne({ name: categoryName });
    if (!category) {
      throw new NotFoundException('Category not Found');
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const category = await this.categoryModule.findOne({ name: dto.name });
    if (category) {
      throw new ForbiddenException('Category already exists');
    }
    return await this.categoryModule.create(dto);
  }

  async update(categoryName: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(categoryName);
    return await this.categoryModule.findByIdAndUpdate(category._id, dto);
  }

  async remove(categoryName: string) {
    const category = await this.findOne(categoryName);
    return await this.categoryModule.findByIdAndDelete(category._id);
  }

  async addSubcategory(
    categoryId: Types.ObjectId,
    subcategoryId: Types.ObjectId,
  ) {
    return await this.categoryModule.findByIdAndUpdate(categoryId, {
      $push: { subcategories: subcategoryId },
    });
  }

  async removeSubcategory(
    categoryId: Types.ObjectId,
    subcategoryId: Types.ObjectId,
  ) {
    return await this.categoryModule.findByIdAndUpdate(categoryId, {
      $pull: { subcategories: subcategoryId },
    });
  }
}
