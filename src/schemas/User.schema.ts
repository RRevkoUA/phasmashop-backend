import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Image } from './Image.schema';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: false })
  hashedRt?: string;

  @Prop()
  phone: string;

  @Prop({ enum: ['Admin', 'Moderator', 'User', 'Guest'], default: 'Guest' })
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'Image' })
  avatar?: Image;
}

export const UserSchema = SchemaFactory.createForClass(User);
