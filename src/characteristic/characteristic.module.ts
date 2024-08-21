import { Module } from '@nestjs/common';
import { CharacteristicService } from './characteristic.service';
import { CharacteristicController } from './characteristic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Characteristic, CharacteristicSchema } from 'src/common/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Characteristic.name,
        schema: CharacteristicSchema,
      },
    ]),
  ],
  controllers: [CharacteristicController],
  providers: [CharacteristicService],
})
export class CharacteristicModule {}
