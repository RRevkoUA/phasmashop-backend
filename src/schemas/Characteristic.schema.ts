import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: false })
export class Characteristics {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  possibleValue: any[];
}
