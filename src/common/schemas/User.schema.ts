import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { RoleEnum } from '../enums';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true, minlength: 4, maxlength: 16 })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: false })
  hashedRt?: string;

  @Prop()
  phone: string;

  @Prop({ enum: RoleEnum, default: RoleEnum.USER })
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'Image' })
  avatar?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
