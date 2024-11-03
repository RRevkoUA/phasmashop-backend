import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Category } from '../schemas';
import { faker } from '@faker-js/faker';

@Injectable()
export class CategorySeed {
  constructor(
    @InjectModel(Category.name) private categoryModule: Model<Category>,
  ) {}

  async seed(amount: number): Promise<(Category & Document)[]> {
    return new Promise(async (resolve, reject) => {
      while (amount) {
        const category = new this.categoryModule({
          name: faker.lorem.word({ length: { min: 3, max: 30 } }),
          isAvailable: true,
        });
        await category.save();
        amount--;
        if (!amount) {
          return resolve(await this.categoryModule.find());
        }
      }
      return reject('Cannot seed categories');
    });
  }

  async clear(): Promise<{ deletedCount?: number }> {
    return await this.categoryModule.deleteMany({});
  }
}
