import { Category } from '../entities/category.model';
import { CategoryRepository } from '../repositories/category.repository';
import { GetCategoriesUseCase } from './get-categories.use-case';

describe('GetCategoriesUseCase', () => {
  let repository: jasmine.SpyObj<CategoryRepository>;
  let useCase: GetCategoriesUseCase;

  beforeEach(() => {
    repository = jasmine.createSpyObj<CategoryRepository>('CategoryRepository', ['getCategories']);
    useCase = new GetCategoriesUseCase(repository);
  });

  it('debe devolver las categorías obtenidas desde el repositorio', async () => {
    const categories: readonly Category[] = [
      {
        id: 'c1',
        name: 'Category 1',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    ];

    repository.getCategories.and.resolveTo(categories);

    const result = await useCase.execute();

    expect(repository.getCategories).toHaveBeenCalledTimes(1);
    expect(result).toEqual(categories);
  });
});
