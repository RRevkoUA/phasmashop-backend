import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from 'src/common/schemas';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { SubcategoryService } from 'src/subcategory/subcategory.service';

@Injectable()
export class CategoryService {
  readonly logger = new Logger(CategoryService.name);
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @Inject(forwardRef(() => SubcategoryService))
    private readonly subcategoryService: SubcategoryService,
  ) {}
  async findAll() {
    return await this.categoryModel.find();
  }

  async findOne(categoryName: string) {
    const category = await this.categoryModel.findOne({ name: categoryName });
    if (!category) {
      this.logger.error('Category not Found');
      throw new NotFoundException('Category not Found');
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const category = await this.categoryModel.findOne({ name: dto.name });
    if (category) {
      this.logger.error('Category already exists');
      throw new ForbiddenException('Category already exists');
    }
    return await this.categoryModel.create(dto);
  }

  async update(categoryName: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(categoryName);
    try {
      return await this.categoryModel.findByIdAndUpdate(category._id, dto);
    } catch (err) {
      this.logger.error(err.message);
      throw new ForbiddenException(err.message);
    }
  }

  async remove(categoryName: string) {
    const category = await this.findOne(categoryName);
    await this.subcategoryService.removeArray(category.subcategories);
    return await this.categoryModel.findByIdAndDelete(category._id);
  }

  async addSubcategory(
    categoryId: Types.ObjectId,
    subcategoryId: Types.ObjectId,
  ) {
    return await this.categoryModel.findByIdAndUpdate(categoryId, {
      $push: { subcategories: subcategoryId },
    });
  }

  async removeSubcategory(
    categoryId: Types.ObjectId,
    subcategoryId: Types.ObjectId,
  ) {
    return await this.categoryModel.findByIdAndUpdate(categoryId, {
      $pull: { subcategories: subcategoryId },
    });
  }
}
