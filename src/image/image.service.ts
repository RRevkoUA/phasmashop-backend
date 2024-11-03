import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Image } from 'src/common/schemas';
import * as fs from 'fs';
import { ImageInterceptorEnum } from 'src/common/enums';

@Injectable()
export class ImageService {
  readonly logger = new Logger(ImageService.name);
  constructor(@InjectModel(Image.name) private imageModel: Model<Image>) {}
  async create(filename: string, author?: Types.ObjectId) {
    return await this.imageModel.create({ filename, author });
  }

  async findOne(id: Types.ObjectId) {
    const image = await this.imageModel.findOne({ _id: id });
    if (!image) {
      this.logger.error('Image not Found');
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
        this.logger.error(err);
      }
    }
    throw new NotFoundException('Image not Found');
  }

  async removeMany(ids: Types.ObjectId[], subpath: ImageInterceptorEnum): Promise<any> {
    const images = await this.imageModel.find({ _id: { $in: ids } });
    if (images.length) {
      const path = `${process.cwd()}/images/${subpath}`;
      try {
        images.forEach((image) => {
          fs.unlinkSync(`${path}/${image.filename}`);
        });
        return await this.imageModel.deleteMany({ _id: { $in: ids } });
      } catch (err) {
        this.logger.error(err);
        throw new NotFoundException('Images not Found');
      }
    }
  }

  // Function for removing images by filenames. Not created in DB yet.
  async removeByFilenames(filenames: string[], subpath: ImageInterceptorEnum) {
    const path = `${process.cwd()}/images/${subpath}`;

    try {
      return filenames.forEach((filename) =>
        fs.unlinkSync(`${path}/${filename}`),
      );
    } catch (err) {
      this.logger.error(err);
      throw new NotFoundException('Images not Found');
    }
  }
}
