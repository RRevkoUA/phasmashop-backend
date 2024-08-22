import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { CharacteristicModule } from './characteristic/characteristic.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
