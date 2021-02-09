import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './interfaces/categories/category.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(@Payload() category: Category) {
    this.logger.log(`Category: ${JSON.stringify(category)}`);

    await this.appService.createCategory(category);
  }

  @MessagePattern('list-categories')
  async listCategories(): Promise<Category[]> {
    return await this.appService.listCategories();
  }

  @MessagePattern('find-category')
  async findCategoryById(@Payload() _id: string) {
    return await this.appService.findCategoryById(_id);
  }
}
