import { Injectable } from '@nestjs/common';
import { CreateCommentaryDto, UpdateCommentaryDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from 'src/common/schemas';
import { Model } from 'mongoose';

@Injectable()
export class CommentaryService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}
  create(createCommentaryDto: CreateCommentaryDto, username: string) {
    return 'This action adds a new commentary';
  }

  findAll() {
    return `This action returns all commentary`;
  }

  findOne(id: string) {
    return `This action returns a #${id} commentary`;
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
