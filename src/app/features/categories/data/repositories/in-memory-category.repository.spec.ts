import { Category } from '@features/categories/domain/entities/category.model';

import { InMemoryCategoryRepository } from './in-memory-category.repository';

describe('InMemoryCategoryRepository', () => {
  let repository: InMemoryCategoryRepository;

  beforeEach(() => {
    repository = new InMemoryCategoryRepository();
  });

  it('debe iniciar con las categorías del seed', async () => {
    const categories = await repository.getCategories();
    expect(categories).toHaveSize(3);
    expect(categories.map((category) => category.id)).toEqual(['work', 'personal', 'shopping']);
  });

  it('createCategory debe agregar una categoría', async () => {
    const category: Category = {
      id: 'c1',
      name: 'Category 1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    await repository.createCategory(category);

    const categories = await repository.getCategories();
    expect(categories).toHaveSize(4);
    expect(categories.find((item) => item.id === 'c1')).toEqual(category);
  });

  it('getCategoryById debe devolver una categoría existente', async () => {
    const category: Category = {
      id: 'c1',
      name: 'Category 1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    await repository.createCategory(category);

    const found = await repository.getCategoryById('c1');
    expect(found).toEqual(category);
  });

  it('getCategories no debe exponer el arreglo interno', async () => {
    const category: Category = {
      id: 'c1',
      name: 'Category 1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    await repository.createCategory(category);

    const categories = await repository.getCategories();
    (categories as Category[]).push({
      ...category,
      id: 'c2',
      name: 'Category 2',
    });

    const nextCategories = await repository.getCategories();
    expect(nextCategories).toHaveSize(4);
    expect(nextCategories.find((item) => item.id === 'c1')?.id).toBe('c1');
  });

  it('getCategoryById debe devolver una copia aislada', async () => {
    const category: Category = {
      id: 'c1',
      name: 'Category 1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    await repository.createCategory(category);

    const found = (await repository.getCategoryById('c1')) as Category;
    (found as { name: string }).name = 'Mutated';

    const reloaded = await repository.getCategoryById('c1');
    expect(reloaded?.name).toBe('Category 1');
  });

  it('getCategoryById debe devolver null cuando no existe', async () => {
    const found = await repository.getCategoryById('missing');
    expect(found).toBeNull();
  });

  it('updateCategory debe reemplazar una categoría por id', async () => {
    const original: Category = {
      id: 'c1',
      name: 'Original',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const updated: Category = {
      id: 'c1',
      name: 'Updated',
      createdAt: original.createdAt,
      updatedAt: new Date('2026-01-03T00:00:00.000Z'),
    };

    await repository.createCategory(original);
    await repository.updateCategory(updated);

    const found = await repository.getCategoryById('c1');
    expect(found).toEqual(updated);
  });

  it('deleteCategory debe eliminar una categoría', async () => {
    const category1: Category = {
      id: 'c1',
      name: 'Category 1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };
    const category2: Category = {
      id: 'c2',
      name: 'Category 2',
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    await repository.createCategory(category1);
    await repository.createCategory(category2);

    await repository.deleteCategory('c1');

    const categories = await repository.getCategories();
    expect(categories).toHaveSize(4);
    expect(categories.find((item) => item.id === 'c2')).toEqual(category2);
    expect(categories.find((item) => item.id === 'c1')).toBeUndefined();
  });
});
