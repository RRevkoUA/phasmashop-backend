import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    // TBD :: Check if category exists
    return await this.categoryModule.findOne({ name: categoryName });
  }

  async create(dto: CreateCategoryDto) {
    // TBD :: Check if category already exists
    return await this.categoryModule.create(dto);
  }

  async update(categoryName: string, dto: UpdateCategoryDto) {
    const category: Category = await this.categoryModule.findOne({
      name: categoryName,
    });
    if (!category) {
      throw new NotFoundException('Category "' + categoryName + '" not found');
    }
    return await this.categoryModule.updateOne(category, dto);
  }

  remove(categoryName: string) {
    // TBD :: Check if category exists
    return this.categoryModule.deleteOne({ name: categoryName });
  }
}
