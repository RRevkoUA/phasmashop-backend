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
    return await this.#getCategory(categoryName);
  }

  async create(dto: CreateCategoryDto) {
    const category = await this.categoryModule.findOne({ name: dto.name });
    if (category) {
      throw new NotFoundException('Category already exists');
    }
    return await this.categoryModule.create(dto);
  }

  async update(categoryName: string, dto: UpdateCategoryDto) {
    const category = await this.#getCategory(categoryName);
    return await this.categoryModule.updateOne(category, dto);
  }

  async remove(categoryName: string) {
    const category = await this.#getCategory(categoryName);
    return await this.categoryModule.deleteOne(category);
  }

  async #getCategory(categoryName: string): Promise<Category> {
    const category = await this.categoryModule.findOne({ name: categoryName });
    if (!category) {
      throw new NotFoundException('Category not Found');
    }
    return category;
  }
}
