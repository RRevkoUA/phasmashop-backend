import { Injectable } from '@nestjs/common';
import { CreateCharacteristicDto, UpdateCharacteristicDto } from './dto';

@Injectable()
export class CharacteristicService {
  create(createCharacteristicDto: CreateCharacteristicDto) {
    return 'This action adds a new characteristic';
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
