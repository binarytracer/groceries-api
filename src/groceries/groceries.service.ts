import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
}

@Injectable()
export class GroceriesService {
  // In-memory store: items added at runtime last until the API restarts.
  private readonly items: GroceryItem[] = [
    { id: 'b9fa1b3e-ab12-4adf-a6a1-c2603c5f5b53', name: 'Milk', quantity: 2, category: 'Dairy' },
    { id: '562400dd-096e-4852-ae9a-f2e7c227a6e2', name: 'Bananas', quantity: 6, category: 'Fruit' },
    { id: '0975f73e-840d-4265-a4fe-b2a681e03f09', name: 'Beef Steak', quantity: 1, category: 'Meat' },
    { id: 'ffb73178-e7dd-4b5a-8130-590cd4b145db', name: 'Spinach', quantity: 1, category: 'Vegetables' },
    { id: 'e15e4777-1344-4bad-87dd-bf694b35a726', name: 'Pasta', quantity: 3, category: 'Carbs' },
  ];

  getItems(): GroceryItem[] {
    return this.items;
  }

  createItem(body: any): GroceryItem {
    const item: GroceryItem = {
      id: v4(),
      name: body.name,
      quantity: body.quantity,
      category: body.category,
    };
    this.items.push(item);
    return item;
  }
}
