import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Image } from 'src/common/schemas';

@Injectable()
export class ImageService {
  constructor(@InjectModel(Image.name) private imageModel: Model<Image>) {}
  async create(filename: string, author?: Types.ObjectId) {
    return await this.imageModel.create({ filename, author });
  }

  async findOne(id: Types.ObjectId) {
    const image = await this.imageModel.findOne({ _id: id });
    if (!image) {
      throw new NotFoundException('Image not Found');
    }
    return image;
  }

  async remove(id: Types.ObjectId) {
    const image = await this.findOne(id);
    await this.imageModel.findByIdAndDelete(image._id);
  }
}
