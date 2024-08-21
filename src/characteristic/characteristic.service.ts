import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCharacteristicDto, UpdateCharacteristicDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Characteristic } from 'src/common/schemas';

@Injectable()
export class CharacteristicService {
  constructor(
    @InjectModel(Characteristic.name)
    private characteristicModel: Model<Characteristic>,
  ) {}

  async create(createCharacteristicDto: CreateCharacteristicDto) {
    try {
      return await this.characteristicModel.create(createCharacteristicDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException('Characteristic already exists');
      }
      console.error(error);
      throw new ForbiddenException('Something went wrong');
    }
  }

  findAll() {
    return `This action returns all characteristic`;
  }

  findOne(characteristic: string) {
    return `This action returns a #${characteristic} characteristic`;
  }

  update(
    characteristic: string,
    updateCharacteristicDto: UpdateCharacteristicDto,
  ) {
    return `This action updates a #${characteristic} characteristic`;
  }

  remove(characteristic: string) {
    return `This action removes a #${characteristic} characteristic`;
  }
}
