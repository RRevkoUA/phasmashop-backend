import { Injectable } from '@nestjs/common';
import { CreateCommentaryDto, UpdateCommentaryDto } from './dto';

@Injectable()
export class CommentaryService {
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
