import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schemas';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModule: Model<Category>,
  ) {}
  findAll() {
    return this.categoryModule.find();
  }

  findOne() {
    return this.categoryModule.findOne({ name: '' });
  }

  create() {
    return this.categoryModule.create({ name: '', isAvailable: false });
  }

  update() {
    return this.categoryModule.updateOne({ name: '' }, { isAvailable: true });
  }

  remove() {
    return this.categoryModule.deleteOne({ name: '' });
  }
}
