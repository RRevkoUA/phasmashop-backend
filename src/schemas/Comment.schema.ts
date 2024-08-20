import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User, Image } from '.';

@Schema({ timestamps: true })
export class Comment {
  // TODO :: Add validation for text
  @Prop({ required: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Image' }] })
  image: Image[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
