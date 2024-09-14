import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Characteristic } from '../schemas';
import { Document, Model } from 'mongoose';
import { faker } from '@faker-js/faker';

@Injectable()
export class CharacteristicSeed {
  constructor(
    @InjectModel(Characteristic.name)
    private characteristicModel: Model<Characteristic>,
  ) {}

  async seed(amount: number): Promise<(Characteristic & Document)[]> {
    return new Promise(async (resolve, reject) => {
      while (amount) {
        const characteristic = new this.characteristicModel({
          name: faker.lorem.word({ length: { min: 3, max: 30 } }),
          possibleValue: faker.helpers.arrayElements(
            Array.from({ length: 10 }, () => faker.lorem.word()),
            5,
          ),
        });
        await characteristic.save();
        amount--;
        if (!amount) {
          return resolve(this.characteristicModel.find());
        }
      }
      return reject('Error while seeding');
    });
  }

  async clear(): Promise<{ deletedCount?: number }> {
    return this.characteristicModel.deleteMany({});
  }
}
