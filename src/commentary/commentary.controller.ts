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
import { ApiAccessAuth, GetUser } from 'src/common/decorator';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guard';

@UseGuards(JwtGuard)
@ApiAccessAuth()
@ApiTags('Commentary')
@Controller('commentary')
export class CommentaryController {
  constructor(private readonly commentaryService: CommentaryService) {}

  @Post()
  create(
    @Body() createCommentaryDto: CreateCommentaryDto,
    @GetUser() username: string,
  ) {
    return this.commentaryService.create(createCommentaryDto, username);
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
    @GetUser() username: string,
  ) {
    return this.commentaryService.update(id, updateCommentaryDto, username);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() username: string) {
    return this.commentaryService.remove(id, username);
  }
}
