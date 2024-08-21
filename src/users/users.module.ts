import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schemas/User.schema';
import { ImageModule } from 'src/image/image.module';
import { ImageService } from 'src/image/image.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ImageModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ImageService],
})
export class UsersModule {}
