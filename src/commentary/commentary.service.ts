import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentaryDto, UpdateCommentaryDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from 'src/common/schemas';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentaryService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private readonly userService: UsersService,
  ) {}
  async create(createCommentaryDto: CreateCommentaryDto, username: string) {
    // TODO :: Implement adding a Images to commentary.
    const user = await this.userService.findUser(username);
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

  update(
    id: string,
    updateCommentaryDto: UpdateCommentaryDto,
    username: string,
  ) {
    return `This action updates a #${id} commentary`;
  }

  remove(id: string, username: string) {
    return `This action removes a #${id} commentary`;
  }
}
