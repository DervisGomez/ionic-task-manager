import { Category } from '../../domain/entities/category.model';
import { CategoryMapper } from './category.mapper';

describe('CategoryMapper', () => {
  it('mapea una categoría a CategoryViewModel', () => {
    const category: Category = {
      id: 'c1',
      name: 'Personal',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const viewModel = CategoryMapper.toViewModel(category);

    expect(viewModel).toEqual({
      id: 'c1',
      name: 'Personal',
    });
  });

  it('mapea múltiples categorías a CategoryViewModel[]', () => {
    const categories: readonly Category[] = [
      {
        id: 'c1',
        name: 'Personal',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      },
      {
        id: 'c2',
        name: 'Trabajo',
        createdAt: new Date('2026-02-01T00:00:00.000Z'),
        updatedAt: new Date('2026-02-02T00:00:00.000Z'),
      },
    ];

    const viewModels = CategoryMapper.toViewModels(categories);

    expect(viewModels).toEqual([
      { id: 'c1', name: 'Personal' },
      { id: 'c2', name: 'Trabajo' },
    ]);
  });

  it('no modifica la entidad original', () => {
    const originalCategory: Category = {
      id: 'c1',
      name: 'Personal',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };
    const snapshot = { ...originalCategory };

    CategoryMapper.toViewModel(originalCategory);

    expect(originalCategory).toEqual(snapshot);
  });
});
