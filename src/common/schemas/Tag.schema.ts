import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: false })
export class Tag {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
