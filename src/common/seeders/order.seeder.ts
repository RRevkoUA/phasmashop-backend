import { Document, Model } from "mongoose";
import { Product, User } from "../schemas";
import { InjectModel } from "@nestjs/mongoose";
import { Order } from "../schemas/Order.schema";
import { CreateOrderDto } from "src/order/dto";
import { faker } from "@faker-js/faker";
import { DeliveryStatus, DeliveryTypes, RoleEnum } from "../enums";
import { UserSeed } from "./user.seeder";
import { ProductSeed } from "./product.seeder";
import { Logger } from "@nestjs/common";

export class OrderSeed {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
    private userSeed: UserSeed,
    private productSeed: ProductSeed,
  ) {}

  async seed(
    amount: number,
    user?: User & Document,
  ): Promise<(Order & Document)[]> {
    return new Promise(async (resolve, reject) => {
      while (amount) {
        console.error('Creating order');
        const product: (Product & Document)[] = await this.productSeed.seed(3);
        const price = product.reduce(
          (acc, product) => acc + Number(product.price),
          0,
        );
        Logger.error(price);
        const userId = (await this.userSeed.seed(1, [RoleEnum.USER]))
          .pop()
          .user._id;
        const order: CreateOrderDto = {
          deliveryType: faker.helpers.enumValue(DeliveryTypes),
          deliveryStatus: faker.helpers.enumValue(DeliveryStatus),
          waybill: faker.lorem.word({ length: 10 }).toLocaleUpperCase(),
          userId: user?._id && userId.toString(),
          products: product.map((product) => product._id.toString()),
          price,
        };

        await this.orderModel.create(order);
        amount--;
        if (!amount) {
          return resolve(await this.orderModel.find());
        }
      }
      reject();
    });
  }

  async clear(): Promise<{ deletedCount?: number }> {
    return await this.orderModel.deleteMany({});
  }
}
