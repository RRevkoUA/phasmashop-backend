import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag } from '../schemas';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';

@Injectable()
export class TagSeed {
  constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) {}

  async seed(amount: number): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      while (amount) {
        const tag = new this.tagModel({
          name: faker.lorem.word({ length: { min: 3, max: 10 } }),
          description: faker.lorem.word({ length: { min: 3, max: 30 } }),
        });
        await tag.save();
        amount--;
        if (!amount) {
          return resolve(await this.tagModel.distinct('name'));
        }
      }
      return reject('Cannot seed tags');
    });
  }

  async clear() {
    return await this.tagModel.deleteMany({});
  }
}
