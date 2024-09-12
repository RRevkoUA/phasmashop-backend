import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentaryDto, UpdateCommentaryDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Comment, User } from 'src/common/schemas';
import { Model } from 'mongoose';
import { ImageService } from 'src/image/image.service';
import { ImageInterceptorEnum } from 'src/common/enums';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CommentaryService {
  private readonly logger = new Logger(CommentaryService.name);
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private readonly imageService: ImageService,
    private readonly productService: ProductService,
  ) {}
  async create(
    createCommentaryDto: CreateCommentaryDto,
    user: User & Document,
  ) {
    try {
      await this.productService.findOneById(createCommentaryDto.product);
      const comment = await this.commentModel.create({
        text: createCommentaryDto.text,
        author: user._id,
      });
      return comment;
    } catch (error) {
      this.logger.error('Something went wrong');
      throw new ForbiddenException('Something went wrong');
    }
  }

  async findAll() {
    return await this.commentModel.find();
  }

  async findOne(id: string) {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      this.logger.error('Comment not found');
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async update(
    id: string,
    updateCommentaryDto: UpdateCommentaryDto,
    user: User & Document,
  ) {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      this.logger.error('Comment not found');
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.toString() !== user._id.toString()) {
      this.logger.error('You are not allowed to update this comment');
      throw new ForbiddenException(
        'You are not allowed to update this comment',
      );
    }
    try {
      const updatedComment = await this.commentModel.findByIdAndUpdate(
        id,
        updateCommentaryDto,
        { new: true },
      );
      return updatedComment;
    } catch (error) {
      this.logger.error(error);
      throw new ForbiddenException('Something went wrong');
    }
  }

  async addImages(
    id: string,
    user: User & Document,
    files: Array<Express.Multer.File>,
  ) {
    const imageIds: Types.ObjectId[] = [];
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      await this.imageService.removeByFilenames(
        files.map((file) => file.filename),
        ImageInterceptorEnum.IMAGE_COMMENTARY,
      );
      this.logger.error('Comment not found');
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.toString() !== user._id.toString()) {
      await this.imageService.removeByFilenames(
        files.map((file) => file.filename),
        ImageInterceptorEnum.IMAGE_COMMENTARY,
      );
      this.logger.error('You are not allowed to update this comment');
      throw new ForbiddenException(
        'You are not allowed to update this comment',
      );
    }

    await this.#removeImages(comment);
    for (const file of files) {
      const imageId = await this.imageService.create(
        file.filename,
        new Types.ObjectId(user._id as string),
      );
      imageIds.push(imageId._id);
    }

    return await this.commentModel.findByIdAndUpdate(
      id,
      { $push: { images: { $each: imageIds } } },
      { new: true },
    );
  }
  async remove(id: string, user: User & Document) {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      this.logger.error('Comment not found');
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.toString() !== user._id.toString()) {
      this.logger.error('You are not allowed to remove this comment');
      throw new ForbiddenException(
        'You are not allowed to remove this comment',
      );
    }
    try {
      await this.#removeImages(comment);
      return await this.commentModel.findByIdAndDelete(id);
    } catch (error) {
      this.logger.error('Something went wrong');
      throw new ForbiddenException('Something went wrong');
    }
  }

  #removeImages = async (comment) => {
    if (comment.images.length) {
      await this.commentModel.findByIdAndUpdate(comment._id, { images: [] });
      await this.imageService.removeMany(
        comment.images,
        ImageInterceptorEnum.IMAGE_COMMENTARY,
      );
    }
  };
}
