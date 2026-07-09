import { UpdateCategoryCommand } from '../commands/update-category.command';
import { Category } from '../entities/category.model';
import { CategoryRepository } from '../repositories/category.repository';
import { UpdateCategoryUseCase } from './update-category.use-case';

describe('UpdateCategoryUseCase', () => {
  let repository: jasmine.SpyObj<CategoryRepository>;
  let useCase: UpdateCategoryUseCase;

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2026-07-08T15:00:00.000Z'));

    repository = jasmine.createSpyObj<CategoryRepository>('CategoryRepository', [
      'getCategoryById',
      'updateCategory',
    ]);
    repository.updateCategory.and.resolveTo();

    useCase = new UpdateCategoryUseCase(repository);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('debe construir una nueva entidad y actualizarla en el repositorio', async () => {
    const existingCategory: Category = {
      id: 'c1',
      name: 'Anterior',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };
    const command: UpdateCategoryCommand = {
      id: 'c1',
      name: 'Actualizada',
    };

    repository.getCategoryById.and.resolveTo(existingCategory);

    await useCase.execute(command);

    expect(repository.getCategoryById).toHaveBeenCalledOnceWith('c1');
    expect(repository.updateCategory).toHaveBeenCalledTimes(1);
    expect(repository.updateCategory).toHaveBeenCalledWith({
      id: 'c1',
      name: 'Actualizada',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-07-08T15:00:00.000Z'),
    });
  });

  it('no debe actualizar si la categoría no existe', async () => {
    repository.getCategoryById.and.resolveTo(null);

    await useCase.execute({
      id: 'missing',
      name: 'Actualizada',
    });

    expect(repository.updateCategory).not.toHaveBeenCalled();
  });
});
