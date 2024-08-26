import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
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
  constructor(
    @InjectModel(Subcategory.name)
    private subcategoryModel: Model<Subcategory>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}
  async create(createSubcategoryDto: CreateSubcategoryDto) {
    const category: any = await this.categoryService.findOne(
      createSubcategoryDto.category,
    );

    try {
      const subcategory = await this.subcategoryModel.create({
        ...createSubcategoryDto,
        category: category._id,
      });
      this.categoryService.addSubcategory(category, subcategory._id);
      return subcategory;
    } catch (error) {
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
      throw new NotFoundException(
        'Subcategory "' + subcategoryName + '" not found',
      );
    }
    return subcategory;
  }

  async update(
    subcategoryName: string,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    const subcategory: any = await this.findOne(subcategoryName);
    console.log(subcategory);
    if (updateSubcategoryDto.category) {
      const category: any = await this.categoryService.findOne(
        updateSubcategoryDto.category,
      );
      console.log(category);
      this.categoryService.removeSubcategory(
        subcategory.category._id,
        subcategory._id,
      );
      this.categoryService.addSubcategory(category._id, subcategory._id);
      delete updateSubcategoryDto.category;
    }
    return await this.subcategoryModel.findOneAndUpdate(
      subcategory,
      updateSubcategoryDto,
      { new: true },
    );
  }

  async remove(subcategoryName: string) {
    const subcategory = await this.findOne(subcategoryName);
    this.categoryService.removeSubcategory(
      subcategory.category._id,
      subcategory._id,
    );
    return await this.subcategoryModel.findByIdAndDelete(subcategory._id);
  }

  async removeArray(subcategoryId: Types.ObjectId[]) {
    await this.subcategoryModel.deleteMany({
      _id: { $in: subcategoryId },
    });
  }
}
