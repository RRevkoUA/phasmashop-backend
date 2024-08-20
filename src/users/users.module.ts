import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schemas/User.schema';
import { Image, ImageSchema } from 'src/common/schemas/Image.schema';
import { ImageModule } from 'src/image/image.module';
import { ImageService } from 'src/image/image.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Image.name,
        schema: ImageSchema,
      },
    ]),
    ImageModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ImageService],
})
export class UsersModule {}
