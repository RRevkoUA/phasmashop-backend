import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto, UpdateTagDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':tag')
  findOne(@Param('tag') tagName: string) {
    return this.tagService.findOne(tagName);
  }

  @Patch(':tag')
  update(@Param('tag') tagName: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(tagName, updateTagDto);
  }

  @Delete(':tag')
  remove(@Param('tag') tagName: string) {
    return this.tagService.remove(tagName);
  }
}
