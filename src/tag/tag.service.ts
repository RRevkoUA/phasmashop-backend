import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto, UpdateTagDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag } from 'src/common/schemas';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name)
    private tagModel: Model<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    try {
      return await this.tagModel.create(createTagDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException('Tag already exists');
      }
      console.error(error);
      throw new ForbiddenException('Something went wrong');
    }
  }

  async findAll() {
    return await this.tagModel.find();
  }

  async findOne(tagName: string) {
    const tag = await this.tagModel.findOne({
      name: tagName,
    });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async update(tagName: string, updateTagDto: UpdateTagDto) {
    try {
      const tag = await this.findOne(tagName);
      return await this.tagModel.findByIdAndUpdate(tag._id, updateTagDto, {
        new: true,
      });
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(error.message);
      }
      throw new ForbiddenException('Something went wrong');
    }
  }

  async remove(tagName: string) {
    try {
      const tag = await this.findOne(tagName);
      return await this.tagModel.findByIdAndDelete(tag._id);
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(error.message);
      }
      throw new ForbiddenException('Something went wrong');
    }
  }
}
