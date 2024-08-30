import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Image } from 'src/common/schemas';
import * as fs from 'fs';
import { ImageInterceptorEnum } from 'src/common/enums';

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

  async remove(id: Types.ObjectId, subpath: ImageInterceptorEnum) {
    const image = await this.findOne(id);
    if (image.filename) {
      const path = `${process.cwd()}/images/${subpath}/${image.filename}`;
      try {
        fs.unlinkSync(path);
        return await this.imageModel.findByIdAndDelete(image._id);
      } catch (err) {
        console.error(err);
      }
    }
    throw new NotFoundException('Image not Found');
  }
}
