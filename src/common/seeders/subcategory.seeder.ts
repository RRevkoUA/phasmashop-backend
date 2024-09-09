import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subcategory } from '../schemas';
import { faker } from '@faker-js/faker';

@Injectable()
export class SubcategorySeed {
  constructor(
    @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
  ) {}

  async seed(amount: number, category: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      while (amount) {
        const subcategory = new this.subcategoryModel({
          name: faker.lorem.word({ length: { min: 3, max: 50 } }),
          category,
          isAvailable: true,
        });
        await subcategory.save();
        amount--;
        if (!amount) {
          return resolve(await this.subcategoryModel.distinct('name'));
        }
      }
      return reject('Cannot seed categories');
    });
  }
}
