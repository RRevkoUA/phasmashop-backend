import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  // TODO :: Add validation for text
  @Prop({ required: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Image' }] })
  image: Types.ObjectId[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
