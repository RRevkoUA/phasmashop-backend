import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Characteristic } from './Characteristic.schema';

@Schema({ timestamps: false })
export class Subcategory {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  isAvailable: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Characteristics' }] })
  characteristics: Characteristic[];
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
