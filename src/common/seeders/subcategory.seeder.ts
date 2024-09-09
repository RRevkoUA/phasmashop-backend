import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subcategory } from '../schemas';
import { faker } from '@faker-js/faker';
import { CreateSubcategoryDto } from 'src/subcategory/dto';
import { SubcategoryService } from 'src/subcategory/subcategory.service';

@Injectable()
export class SubcategorySeed {
  constructor(
    @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
    private readonly subcategoryService: SubcategoryService,
  ) {}

  async seed(amount: number, category: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      while (amount) {
        const subcategoryDto: CreateSubcategoryDto = {
          name: faker.lorem.word({ length: { min: 3, max: 50 } }),
          category,
          isAvailable: true,
        };
        await this.subcategoryService.create(subcategoryDto);
        amount--;
        if (!amount) {
          return resolve(await this.subcategoryModel.distinct('name'));
        }
      }
      return reject('Cannot seed categories');
    });
  }
}
