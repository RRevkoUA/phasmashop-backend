import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './User.schema';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Image {
  @Prop({ required: true })
  filename: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author?: User;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
