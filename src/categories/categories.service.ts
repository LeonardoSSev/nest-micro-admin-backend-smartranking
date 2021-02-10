import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCategoryPayloadDTO } from './dtos/update-category-payload.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>
  ) {}

  private readonly logger = new Logger(CategoriesService.name);

  async listCategories(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().exec();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async findCategoryById(_id: string): Promise<Category> {
    try {
      const category = await this.categoryModel.findById(_id);

      this.validateCategoryExistence(category, _id);

      return category;
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async createCategory(category: Category): Promise<Category> {
    try {
      const storedCategory = new this.categoryModel(category);

      return await storedCategory.save();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async updateCategory(updateCategoryPayloadDTO: UpdateCategoryPayloadDTO): Promise<Category> {
    try {
      const { id: _id, category } = updateCategoryPayloadDTO;

      let storedCategory = await this.categoryModel.findById(_id);
      
      this.validateCategoryExistence(storedCategory, _id);

      storedCategory = this.updateCategoryInfo(storedCategory, category);

      return await this.categoryModel.findByIdAndUpdate(_id, { $set: storedCategory }).exec();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async deleteCategory(_id: string): Promise<void> {
    try {
      let storedCategory = await this.categoryModel.findById(_id);
      
      this.validateCategoryExistence(storedCategory, _id);

      await this.categoryModel.findByIdAndDelete(_id).exec();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  validateCategoryExistence(category: Category | null, id: string) {
    if (!category) {
      throw new RpcException(`Category with given id ${id} was not found!`);
    }
  }

  private updateCategoryInfo(categoryForUpdating: Category, updatedCategory: Category): Category {
    const { description, events } = updatedCategory;

    if (description) {
      categoryForUpdating.description = description;
    }

    if (events) {
      categoryForUpdating.events = events;
    }

    return categoryForUpdating;
  }
  
}
