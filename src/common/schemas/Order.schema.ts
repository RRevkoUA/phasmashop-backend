import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeliveryTypes } from '../enums';
import { DeliveryStatus } from '../enums/delivery-status.enum';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, enum: DeliveryTypes })
  deliveryType: string;

  @Prop({ required: true, enum: DeliveryStatus })
  deliveryStatus: string;

  @Prop({ required: true, unique: true })
  waybill: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: 'Product' }] })
  products: Types.ObjectId[];

  @Prop({
    required: true,
    min: 1,
    get: (v: number) => v.toFixed(2),
    set: (v: number) => v * 100,
  })
  price: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
