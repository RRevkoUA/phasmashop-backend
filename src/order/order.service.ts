import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { Order } from 'src/common/schemas/Order.schema';
import { Document, Model } from 'mongoose';
import { GetUser } from 'src/common/decorator';
import { User } from 'src/common/schemas';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}
  async create(
    createOrderDto: CreateOrderDto,
    @GetUser() user: User & Document,
  ) {
    try {
      const order = await this.orderModel.create({
        ...createOrderDto,
        userId: user._id,
      });
      return order;
    } catch (error) {
      throw new ForbiddenException('Something went wrong');
    }
  }

  async findAll() {
    return await this.orderModel.find();
  }

  async findOne(id: string, user: User & Document) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new ForbiddenException('Order not found');
    }
    if (order.userId.toString() !== user._id.toString()) {
      throw new ForbiddenException('You are not allowed to view this order');
    }
    return order;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    user: User & Document,
  ) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new ForbiddenException('Order not found');
    }
    if (order.userId.toString() !== user._id.toString()) {
      throw new ForbiddenException('You are not allowed to update this order');
    }
  }

  async remove(id: string, user: User & Document) {
    const order = await this.orderModel.findById(id);

    if (order.userId.toString() !== user._id.toString()) {
      throw new ForbiddenException('You are not allowed to update this order');
    }
    try {
      return await this.orderModel.deleteOne({ _id: id });
    } catch (error) {
      throw new ForbiddenException('You are not allowed to delete this order');
    }
  }
}
