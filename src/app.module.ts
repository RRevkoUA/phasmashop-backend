import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { CharacteristicModule } from './characteristic/characteristic.module';
import { CommentaryModule } from './commentary/commentary.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { EncryptionModule } from './encryption/encryption.module';
import { TagModule } from './tag/tag.module';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      serveRoot: '/images',
      serveStaticOptions: {
        extensions: ['jpg', 'jpeg', 'png'],
        index: false,
      },
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    UsersModule,
    AuthModule,
    CategoryModule,
    SubcategoryModule,
    CharacteristicModule,
    CommentaryModule,
    ProductModule,
    OrderModule,
    TagModule,
    EncryptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
