import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { UpdateCategoryPayloadDTO } from './dtos/update-category-payload.dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {

  logger = new Logger(CategoriesController.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @MessagePattern('list-categories')
  async listCategories(): Promise<Category[]> {
    return await this.categoriesService.listCategories();
  }

  @MessagePattern('find-category')
  async findCategoryById(@Payload() _id: string) {
    return await this.categoriesService.findCategoryById(_id);
  }

  @EventPattern('create-category')
  async createCategory(@Payload() category: Category) {
    this.logger.log(`Category: ${JSON.stringify(category)}`);

    await this.categoriesService.createCategory(category);
  }

  @EventPattern('update-category')
  async updateCategory(@Payload() updateCategoryPayloadDTO: UpdateCategoryPayloadDTO) {
    await this.categoriesService.updateCategory(updateCategoryPayloadDTO);
  }

  @EventPattern('delete-category')
  async deleteCategory(@Payload() id: string) {
    await this.categoriesService.deleteCategory(id);
  }

}
