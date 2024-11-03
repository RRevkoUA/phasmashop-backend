import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Subcategory } from '../schemas';
import { faker } from '@faker-js/faker';
import { CreateSubcategoryDto } from 'src/subcategory/dto';
import { SubcategoryService } from 'src/subcategory/subcategory.service';
import { CategorySeed } from './category.seeder';

@Injectable()
export class SubcategorySeed {
  constructor(
    @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
    private readonly subcategoryService: SubcategoryService,
    // @Inject(forwardRef(() => CategorySeed))
    private readonly categorySeed: CategorySeed,
  ) {}

  async seed(amount: number, category?: string): Promise<(Subcategory & Document)[]> {
    return new Promise(async (resolve, reject) => {
      const categoryName: string = await this.#getCategory(category);
      while (amount) {
        const subcategoryDto: CreateSubcategoryDto = {
          name: faker.lorem.word({ length: { min: 3, max: 50 } }),
          category: categoryName,
          isAvailable: true,
        };
        await this.subcategoryService.create(subcategoryDto);
        amount--;
        if (!amount) {
          return resolve(await this.subcategoryModel.find());
        }
      }
      return reject('Cannot seed categories');
    });
  }

  async clear(): Promise<{ deletedCount?: number }> {
    return await this.subcategoryModel.deleteMany({});
  }

  async #getCategory(category?: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (!category) {
        Logger.log('No category provided, seeding category');
        const categories = await this.categorySeed.seed(1);
        // const categories = [{ name: 'Category' }];
        resolve(categories.pop().name);
      }
      else {
        resolve(category);
      }
    });
  }
}
