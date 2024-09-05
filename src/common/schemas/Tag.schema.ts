import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: false })
export class Tag {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, minlength: 3, maxlength: 30 })
  description: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
