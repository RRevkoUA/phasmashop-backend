import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subcategory } from 'src/common/schemas';
import { Model, Types } from 'mongoose';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class SubcategoryService {
  private readonly logger = new Logger(SubcategoryService.name);
  constructor(
    @InjectModel(Subcategory.name)
    private subcategoryModel: Model<Subcategory>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}
  async create(createSubcategoryDto: CreateSubcategoryDto) {
    try {
      const category: any = await this.categoryService.findOne(
        createSubcategoryDto.category,
      );

      const subcategory = await this.subcategoryModel.create({
        ...createSubcategoryDto,
        category: category._id,
      });
      this.categoryService.addSubcategory(category, subcategory._id);
      this.logger.verbose('Subcategory' + subcategory.name + 'created');
      return subcategory;
    } catch (error) {
      if (error.message === 'Category not Found') {
        this.logger.error('Category not Found');
        throw error;
      }
      this.logger.error('Subcategory already exists');
      throw new ForbiddenException('Subcategory already exists');
    }
  }

  async findAll() {
    return await this.subcategoryModel.find();
  }

  async findOne(subcategoryName: string) {
    const subcategory = await this.subcategoryModel
      .findOne({
        name: subcategoryName,
      })
      .populate('category');
    if (!subcategory) {
      this.logger.error('Subcategory "' + subcategoryName + '" not found');
      throw new NotFoundException(
        'Subcategory "' + subcategoryName + '" not found',
      );
    }
    return subcategory;
  }

  async findOneById(subcategoryId: Types.ObjectId | string) {
    const subcategory = await this.subcategoryModel
      .findById(subcategoryId);
    if (!subcategory) {
      this.logger.error('Subcategory "' + subcategoryId + '" not found');
      throw new NotFoundException(
        'Subcategory "' + subcategoryId + '" not found',
      );
    }
    return subcategory;
  }

  async update(
    subcategoryName: string,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    try {
      const subcategory: any = await this.findOne(subcategoryName);
      if (updateSubcategoryDto.category) {
        const category: any = await this.categoryService.findOne(
          updateSubcategoryDto.category,
        );
        this.categoryService.removeSubcategory(
          subcategory.category._id,
          subcategory._id,
        );
        this.categoryService.addSubcategory(category._id, subcategory._id);
        this.logger.verbose('Subcategory' + subcategory.name + 'updated');
        delete updateSubcategoryDto.category;
      }
      return await this.subcategoryModel.findOneAndUpdate(
        subcategory,
        updateSubcategoryDto,
        { new: true },
      );
    } catch (error) {
      this.logger.error(error);
      throw new ForbiddenException(error);
    }
  }

  async remove(subcategoryName: string) {
    this.logger.verbose('Subcategory' + subcategoryName + 'removing');
    const subcategory = await this.findOne(subcategoryName);
    this.categoryService.removeSubcategory(
      subcategory.category._id,
      subcategory._id,
    );
    return await this.subcategoryModel.findByIdAndDelete(subcategory._id);
  }

  async removeArray(subcategoryId: Types.ObjectId[]) {
    this.logger.verbose('Subcategory array' + subcategoryId + 'removing');
    await this.subcategoryModel.deleteMany({
      _id: { $in: subcategoryId },
    });
  }
}
