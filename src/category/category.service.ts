import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schemas';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModule: Model<Category>,
  ) {}
  findAll(): string {
    return 'This action returns all category';
  }

  findOne(): string {
    return 'This action returns a category';
  }

  create() {
    return 'This action adds a new category';
  }

  update() {
    return 'This action updates a category';
  }

  remove() {
    return 'This action removes a category';
  }
}
