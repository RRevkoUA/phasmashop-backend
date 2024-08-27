import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentaryDto, UpdateCommentaryDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Comment, User } from 'src/common/schemas';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentaryService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private readonly userService: UsersService,
  ) {}
  async create(
    createCommentaryDto: CreateCommentaryDto,
    user: User & Document,
  ) {
    // TODO :: Implement adding a Images to commentary.
    try {
      const comment = await this.commentModel.create({
        ...createCommentaryDto,
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
