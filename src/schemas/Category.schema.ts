import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: false })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  isAvailable: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Subcategory' }] })
  subCategories: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
