import { Inject, Module } from '@nestjs/common';
import { CommentaryService } from './commentary.service';
import { CommentaryController } from './commentary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/common/schemas';
import { ImageModule } from 'src/image/image.module';
import { ProductModule } from 'src/product/product.module';
import { CommentarySeed } from 'src/common/seeders/commentary.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
    ImageModule,
    ProductModule,
  ],
  controllers: [CommentaryController],
  providers: [CommentaryService, CommentarySeed],
  exports: [CommentarySeed],
})
export class CommentaryModule {}
