import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: false })
export class Subcategory {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  isAvailable: boolean;

  // @Prop({ type: [{ type: Types.ObjectId, ref: 'Characteristics' }] })
  // characteristics: Characteristics[];
}
