import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GroceriesService } from './groceries.service';

// Mounted at the root so existing client URLs keep working.
@ApiTags('Groceries')
@ApiBearerAuth()
@Controller()
export class GroceriesController {
  constructor(private readonly groceries: GroceriesService) {}

  @Get()
  getItems() {
    return this.groceries.getItems();
  }

  @Post()
  createItem(@Body() body: any) {
    return this.groceries.createItem(body);
  }

  @Get(':id')
  getItem(@Param('id') id: string) {
    return this.groceries.getItem(id);
  }

  @Delete(':id')
  deleteItem(@Param('id') id: string) {
    return this.groceries.deleteItem(id);
  }

  @Put(':id')
  updateItem(@Param('id') id: string, @Body() body: any) {
    return this.groceries.updateItem(id, body);
  }
}
