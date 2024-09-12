import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, minlength: 10, maxlength: 50 })
  name: string;

  @Prop({ required: true, unique: true, minlength: 10, maxlength: 15 })
  article: string;

  @Prop({ required: true, minlength: 20, maxlength: 500 })
  description: string;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop({
    required: true,
    min: 1,
    get: (v: number) => v.toFixed(2),
    set: (v: number) => v * 100,
  })
  price: number;

  @Prop({ required: true, default: 0, min: 0, max: 100 })
  rating: number;

  @Prop({ required: true, default: false })
  isAvailable: boolean;

  @Prop({ required: false, default: 0, min: 0, max: 100 })
  discount: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Subcategory' })
  subcategoryId: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  authorId: Types.ObjectId;

  @Prop({ required: false, type: [{ type: Types.ObjectId, ref: 'Tag' }] })
  tags: Types.ObjectId[];

  @Prop({ required: false, type: [{ type: Types.ObjectId, ref: 'Comment' }] })
  comments: Types.ObjectId[];

  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: 'Image' }] })
  images: Types.ObjectId[];

  @Prop({
    required: false,
    type: [
      {
        _id: false,
        characteristic: { type: Types.ObjectId, ref: 'Characteristic' },
        value: { type: String },
      },
    ],
  })
  characteristics: { characteristic: Types.ObjectId; value: string }[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
