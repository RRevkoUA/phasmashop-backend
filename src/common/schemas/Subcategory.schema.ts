import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: false })
export class Subcategory {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  isAvailable: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Characteristics' }] })
  characteristics: Types.ObjectId[];
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
