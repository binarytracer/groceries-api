import { NotFoundException } from '@nestjs/common';
import { GroceriesService } from './groceries.service';

describe('GroceriesService', () => {
  let service: GroceriesService;
  const body = { name: 'Eggs', quantity: 12, category: 'Dairy' };

  beforeEach(() => {
    service = new GroceriesService();
  });

  it('gets an item by id, or 404s', () => {
    const [first] = service.getItems();
    expect(service.getItem(first.id)).toBe(first);
    expect(() => service.getItem('nope')).toThrow(NotFoundException);
  });

  it('updates an existing item in place', () => {
    const [first] = service.getItems();
    const count = service.getItems().length;

    const updated = service.updateItem(first.id, body);

    expect(updated).toEqual({ id: first.id, ...body });
    expect(service.getItem(first.id)).toEqual(updated);
    expect(service.getItems()).toHaveLength(count);
  });

  it('creates the item on PUT when the id is unknown (Undo after delete)', () => {
    const count = service.getItems().length;

    service.updateItem('restored-id', body);

    expect(service.getItems()).toHaveLength(count + 1);
    expect(service.getItem('restored-id').name).toBe('Eggs');
  });

  it('deletes an item and returns it', () => {
    const [first] = service.getItems();
    const count = service.getItems().length;

    expect(service.deleteItem(first.id)).toEqual(first);

    expect(service.getItems()).toHaveLength(count - 1);
    expect(() => service.getItem(first.id)).toThrow(NotFoundException);
  });

  it('404s when deleting an unknown id', () => {
    expect(() => service.deleteItem('nope')).toThrow(NotFoundException);
  });
});
