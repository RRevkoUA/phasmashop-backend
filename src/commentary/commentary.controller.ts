import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentaryService } from './commentary.service';
import { CreateCommentaryDto, UpdateCommentaryDto } from './dto';
import { ApiAccessAuth, GetUser, ImageInterceptor } from 'src/common/decorator';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guard';
import { User } from 'src/common/schemas';
import { Document } from 'mongoose';
import { ImageInterceptorEnum } from 'src/common/enums';

@UseGuards(JwtGuard)
@ApiAccessAuth()
@ApiTags('Commentary')
@Controller('commentary')
export class CommentaryController {
  constructor(private readonly commentaryService: CommentaryService) {}

  @ImageInterceptor(ImageInterceptorEnum.IMAGE_COMMENTARY)
  @Post()
  create(
    @Body() createCommentaryDto: CreateCommentaryDto,
    @GetUser() user: User & Document,
  ) {
    return this.commentaryService.create(createCommentaryDto, user);
  }

  @Get()
  findAll() {
    return this.commentaryService.findAll();
  }

  @UseGuards()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentaryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentaryDto: UpdateCommentaryDto,
    @GetUser() user: User & Document,
  ) {
    return this.commentaryService.update(id, updateCommentaryDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User & Document) {
    return this.commentaryService.remove(id, user);
  }
}
