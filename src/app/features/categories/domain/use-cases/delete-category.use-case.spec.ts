import { CategoryRepository } from '../repositories/category.repository';
import { DeleteCategoryUseCase } from './delete-category.use-case';

describe('DeleteCategoryUseCase', () => {
  let repository: jasmine.SpyObj<CategoryRepository>;
  let useCase: DeleteCategoryUseCase;

  beforeEach(() => {
    repository = jasmine.createSpyObj<CategoryRepository>('CategoryRepository', ['deleteCategory']);
    repository.deleteCategory.and.resolveTo();

    useCase = new DeleteCategoryUseCase(repository);
  });

  it('debe delegar la eliminación al repositorio', async () => {
    await useCase.execute('c1');

    expect(repository.deleteCategory).toHaveBeenCalledOnceWith('c1');
  });
});
