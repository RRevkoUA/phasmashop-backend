import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subcategory } from 'src/common/schemas';
import { Model } from 'mongoose';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectModel(Subcategory.name)
    private subcategoryModule: Model<Subcategory>,
    private readonly categoryService: CategoryService,
  ) {}
  async create(createSubcategoryDto: CreateSubcategoryDto) {
    const category: any = await this.categoryService.findOne(
      createSubcategoryDto.category,
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    try {
      const subcategory = await this.subcategoryModule.create({
        ...createSubcategoryDto,
        category: category._id,
      });
      this.categoryService.addSubcategory(category, subcategory._id);
      return subcategory;
    } catch (error) {
      throw new ForbiddenException('Subcategory already exists');
    }
  }

  findAll() {
    return this.subcategoryModule.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} subcategory`;
  }

  update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    return `This action updates a #${id} subcategory`;
  }

  async remove(id: string) {
    const subcategory = await this.#getSubcategory(id);
    return await this.subcategoryModule.deleteOne(subcategory);
  }

  async #getSubcategory(subcategoryName: string): Promise<Subcategory> {
    const subcategory = await this.subcategoryModule
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
}
