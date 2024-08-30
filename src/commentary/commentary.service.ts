import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentaryDto, UpdateCommentaryDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Comment, User } from 'src/common/schemas';
import { Model } from 'mongoose';
import { ImageService } from 'src/image/image.service';
import { ImageInterceptorEnum } from 'src/common/enums';

@Injectable()
export class CommentaryService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private readonly imageService: ImageService,
  ) {}
  async create(
    createCommentaryDto: CreateCommentaryDto,
    user: User & Document,
  ) {
    console.log(createCommentaryDto);
    // TODO :: Implement adding a Images to commentary.
    try {
      const comment = await this.commentModel.create({
        text: createCommentaryDto.text,
        author: user._id,
      });
      return comment;
    } catch (error) {
      console.error(error);
      throw new ForbiddenException('Something went wrong');
    }
  }

  async findAll() {
    return await this.commentModel.find();
  }

  async findOne(id: string) {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
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
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.toString() !== user._id.toString()) {
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
      console.error(error);
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
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.toString() !== user._id.toString()) {
      await this.imageService.removeByFilenames(
        files.map((file) => file.filename),
        ImageInterceptorEnum.IMAGE_COMMENTARY,
      );
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
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'You are not allowed to remove this comment',
      );
    }
    try {
      await this.#removeImages(comment);
      return await this.commentModel.findByIdAndDelete(id);
    } catch (error) {
      console.error(error);
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
