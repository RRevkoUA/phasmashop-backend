import { forwardRef, Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubcategorySchema, Subcategory } from 'src/common/schemas';
import { CategoryModule } from 'src/category/category.module';
import { SubcategorySeed } from 'src/common/seeders';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subcategory.name,
        schema: SubcategorySchema,
      },
    ]),
    forwardRef(() => CategoryModule),
  ],
  controllers: [SubcategoryController],
  providers: [SubcategoryService, SubcategorySeed],
  exports: [SubcategoryService],
})
export class SubcategoryModule {}
