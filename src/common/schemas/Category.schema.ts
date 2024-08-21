import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: false })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false, default: false })
  isAvailable?: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Subcategory', unique: true }] })
  subcategories: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
