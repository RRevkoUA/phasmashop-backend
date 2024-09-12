import { forwardRef, Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/common/schemas';
import { CategoryService } from './category.service';
import { SubcategoryModule } from 'src/subcategory/subcategory.module';
import { CategorySeed } from 'src/common/seeders';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
    forwardRef(() => SubcategoryModule),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategorySeed],
  exports: [CategoryService],
})
export class CategoryModule {}
