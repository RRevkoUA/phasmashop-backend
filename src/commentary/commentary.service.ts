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
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'You are not allowed to update this comment',
      );
    }

    for (const file of files) {
      const imageId = await this.imageService.create(
        file.filename,
        new Types.ObjectId(user._id as string),
      );
      imageIds.push(imageId._id);
    }
    console.log(imageIds);

    return await this.commentModel.findByIdAndUpdate(
      id,
      { $push: { images: { $each: imageIds } } },
      { new: true },
    );
  }
  async remove(id: string, user: User & Document) {
    // TODO :: Implement removing an any commentary by MODERATOR or ADMIN.
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
      return await this.commentModel.findByIdAndDelete(id);
    } catch (error) {
      console.error(error);
      throw new ForbiddenException('Something went wrong');
    }
  }
}
