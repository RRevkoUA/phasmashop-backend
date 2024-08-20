import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Image } from 'src/common/schemas';

@Injectable()
export class ImageService {
  constructor(@InjectModel(Image.name) private imageModule: Model<Image>) {}
  async create(filename: string, author?: Types.ObjectId) {
    return await this.imageModule.create({ filename, author });
  }

  async findOne(id: Types.ObjectId) {
    return await this.#getImage(id);
  }

  async remove(id: Types.ObjectId) {
    const image = await this.#getImage(id);
    await this.imageModule.deleteOne(image);
  }

  async #getImage(id: Types.ObjectId): Promise<Image> {
    const image = await this.imageModule.findOne({ _id: id });
    if (!image) {
      throw new NotFoundException('Image not Found');
    }
    return image;
  }
}
