import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/common/schemas';
import { ImageModule } from 'src/image/image.module';
import { SubcategoryModule } from 'src/subcategory/subcategory.module';
import { CharacteristicModule } from 'src/characteristic/characteristic.module';
import { TagModule } from 'src/tag/tag.module';
import { ProductSeed } from 'src/common/seeders/product.seeder';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ImageModule,
    SubcategoryModule,
    CharacteristicModule,
    TagModule,
    AuthModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductSeed],
  exports: [ProductService, ProductSeed],
})
export class ProductModule {}
