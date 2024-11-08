import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCharacteristicDto, UpdateCharacteristicDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Characteristic } from 'src/common/schemas';

@Injectable()
export class CharacteristicService {
  readonly logger = new Logger(CharacteristicService.name);
  constructor(
    @InjectModel(Characteristic.name)
    private characteristicModel: Model<Characteristic>,
  ) {}

  async create(createCharacteristicDto: CreateCharacteristicDto) {
    try {
      return await this.characteristicModel.create(createCharacteristicDto);
    } catch (error) {
      if (error.code === 11000) {
        this.logger.error('Characteristic already exists');
        throw new ForbiddenException('Characteristic already exists');
      }
      this.logger.error('Something went wrong');
      throw new ForbiddenException('Something went wrong');
    }
  }

  async findAll() {
    return await this.characteristicModel.find();
  }

  async findOne(characteristicName: string) {
    const characteristic = await this.characteristicModel.findOne({
      name: characteristicName,
    });
    if (!characteristic) {
      this.logger.error('Characteristic not found');
      throw new NotFoundException('Characteristic not found');
    }
    return characteristic;
  }

  async update(
    characteristicName: string,
    updateCharacteristicDto: UpdateCharacteristicDto,
  ) {
    try {
      const characteristic = await this.findOne(characteristicName);
      return await this.characteristicModel.findByIdAndUpdate(
        characteristic._id,
        updateCharacteristicDto,
        { new: true },
      );
    } catch (error) {
      if (error.status === 404) {
        this.logger.error('Characteristic not found');
        throw new NotFoundException(error.message);
      }
      this.logger.error('Something went wrong');
      throw new ForbiddenException('Something went wrong');
    }
  }

  async remove(characteristicName: string) {
    try {
      const characteristic = await this.findOne(characteristicName);
      return await this.characteristicModel.findByIdAndDelete(
        characteristic._id,
      );
    } catch (error) {
      if (error.status === 404) {
        this.logger.error('Characteristic not found');
        throw new NotFoundException(error.message);
      }
      this.logger.error('Something went wrong');
      throw new ForbiddenException('Something went wrong');
    }
  }
}
