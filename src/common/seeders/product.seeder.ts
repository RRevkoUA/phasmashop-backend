import { InjectModel } from "@nestjs/mongoose";
import { Product } from "../schemas";
import { Document, Model } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { CreateProductDto } from "src/product/dto";
import { SubcategorySeed } from "./subcategory.seeder";
import { TagSeed } from "./tag.seeder";

@Injectable()
export class ProductSeed {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
    private readonly subcategorySeed: SubcategorySeed,
    private readonly tagSeed: TagSeed,
  ) {}

  async seed(amount: number): Promise<(Product & Document)[]> {
    return new Promise(async (resolve, reject) => {
      Logger.error('Seeding products', amount);
      while (amount) {
        const product: CreateProductDto = {
          isAvailable: true,
          price: faker.number.int({min: 100, max: 10000}),
          article: faker.lorem.word({length: 10}).toLocaleLowerCase(),
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          stock: faker.number.int(),
          subcategoryId: (await this.subcategorySeed.seed(1)).pop()._id.toString(),
          tags: (await this.tagSeed.seed(3)).map(tag => tag._id.toString()),
          images: [],
        };
        Logger.error('Creating product');
        await (await this.productModel.create(product)).save();        
        amount--;
        if (!amount) {
          return resolve(await this.productModel.find());
        }
      }
      resolve(await this.productModel.find());
    });
  }
}
