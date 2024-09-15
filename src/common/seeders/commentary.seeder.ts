import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment } from 'src/common/schemas';
import { ProductSeed } from "./product.seeder";

@Injectable()
export class CommentarySeed {
  constructor(
    @InjectModel(Comment.name)
    private commentaryModel: Model<Comment>,
    private readonly productSeed: ProductSeed,
  ) {}

  async seed(amount: number): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      while (amount) {
        const commentary = new this.commentaryModel({
          text: faker.lorem.sentence(),
          product: (await this.productSeed.seed(1)).pop()._id.toString(),
        });
        await commentary.save();
        amount--;
        if (!amount) {
          return resolve(await this.commentaryModel.distinct('text'));
        }
      }
      return reject([]);
    });
  }

  async clear(): Promise<{ deletedCount?: number }> {
    return await this.commentaryModel.deleteMany({});
  }
}