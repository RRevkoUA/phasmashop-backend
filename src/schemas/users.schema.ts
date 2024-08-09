import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  hash: string;

  @Prop()
  phone: string;

  @Prop({ enum: ['Admin', 'Moderator', 'User', 'Guest'], default: 'Guest' })
  role: string;

  @Prop({ required: false })
  photoId?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
