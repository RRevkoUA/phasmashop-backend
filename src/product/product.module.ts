import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/common/schemas';
import { ImageModule } from 'src/image/image.module';
import { SubcategoryModule } from 'src/subcategory/subcategory.module';
import { CharacteristicModule } from 'src/characteristic/characteristic.module';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ImageModule,
    SubcategoryModule,
    CharacteristicModule,
    TagModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
