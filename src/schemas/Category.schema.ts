import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: false })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  isAvailable: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
