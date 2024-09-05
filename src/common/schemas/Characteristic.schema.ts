import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: false })
export class Characteristic {
  @Prop({ required: true, minlength: 3, maxlength: 30 })
  name: string;

  @Prop({ required: false })
  possibleValue: any[];
}

export const CharacteristicSchema =
  SchemaFactory.createForClass(Characteristic);
