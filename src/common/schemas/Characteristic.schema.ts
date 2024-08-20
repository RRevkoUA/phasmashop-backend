import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: false })
export class Characteristic {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  possibleValue: any[];
}

export const CharacteristicSchema =
  SchemaFactory.createForClass(Characteristic);
