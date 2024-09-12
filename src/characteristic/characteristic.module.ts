import { Module } from '@nestjs/common';
import { CharacteristicService } from './characteristic.service';
import { CharacteristicController } from './characteristic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Characteristic, CharacteristicSchema } from 'src/common/schemas';
import { CharacteristicSeed } from 'src/common/seeders';

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
  providers: [CharacteristicService, CharacteristicSeed],
  exports: [CharacteristicService],
})
export class CharacteristicModule {}
