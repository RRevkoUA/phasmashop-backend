import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  // TODO :: Add validation for text
  @Prop({ required: true, minlength: 3, maxlength: 250 })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  product: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Image' }] })
  images: Types.ObjectId[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
