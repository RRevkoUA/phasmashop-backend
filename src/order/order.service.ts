import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { Order } from 'src/common/schemas/Order.schema';
import { Document, Model } from 'mongoose';
import { GetUser } from 'src/common/decorator';
import { User } from 'src/common/schemas';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderService {
  readonly logger = new Logger(OrderService.name);
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
      this.logger.error('Something went wrong');
      throw new ForbiddenException('Something went wrong');
    }
  }

  async findAll() {
    return await this.orderModel.find();
  }

  async findOne(id: string, user: User & Document) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      this.logger.error('Order not found');
      throw new ForbiddenException('Order not found');
    }
    if (order.userId.toString() !== user._id.toString()) {
      this.logger.error('You are not allowed to view this order');
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
      this.logger.error('Order not found');
      throw new ForbiddenException('Order not found');
    }
    if (order.userId.toString() !== user._id.toString()) {
      this.logger.error('You are not allowed to update this order');
      throw new ForbiddenException('You are not allowed to update this order');
    }

    return await this.orderModel.findByIdAndUpdate(id, updateOrderDto, {
      new: true,
    });
  }

  async remove(id: string, user: User & Document): Promise<any> {
    const order = await this.orderModel.findById(id);

    if (order.userId.toString() !== user._id.toString()) {
      this.logger.error('You are not allowed to delete this order');
      throw new ForbiddenException('You are not allowed to update this order');
    }
    try {
      return await this.orderModel.deleteOne({ _id: id });
    } catch (error) {
      this.logger.error('You are not allowed to delete this order');
      throw new ForbiddenException('You are not allowed to delete this order');
    }
  }
}
