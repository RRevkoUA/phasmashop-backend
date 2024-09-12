import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from 'src/common/schemas';
import { TagSeed } from 'src/common/seeders/tag.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tag.name,
        schema: TagSchema,
      },
    ]),
  ],
  controllers: [TagController],
  providers: [TagService, TagSeed],
  exports: [TagService],
})
export class TagModule {}
