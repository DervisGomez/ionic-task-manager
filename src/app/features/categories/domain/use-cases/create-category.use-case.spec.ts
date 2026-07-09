import { CreateCategoryCommand } from '../commands/create-category.command';
import { Category } from '../entities/category.model';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryUseCase } from './create-category.use-case';

describe('CreateCategoryUseCase', () => {
  const generatedId = '11111111-1111-4111-8111-111111111111';

  let repository: jasmine.SpyObj<CategoryRepository>;
  let useCase: CreateCategoryUseCase;

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2026-07-08T14:00:00.000Z'));

    repository = jasmine.createSpyObj<CategoryRepository>('CategoryRepository', ['createCategory']);
    repository.createCategory.and.resolveTo();

    useCase = new CreateCategoryUseCase(repository);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('debe generar id y timestamps antes de crear la categoría', async () => {
    spyOn(crypto, 'randomUUID').and.returnValue(generatedId);

    const command: CreateCategoryCommand = {
      name: 'Nueva categoría',
    };

    await useCase.execute(command);

    expect(repository.createCategory).toHaveBeenCalledTimes(1);

    const createdCategory = repository.createCategory.calls.mostRecent().args[0] as Category;
    expect(createdCategory.id).toBe(generatedId);
    expect(createdCategory.name).toBe(command.name);
    expect(createdCategory.createdAt).toEqual(new Date('2026-07-08T14:00:00.000Z'));
    expect(createdCategory.updatedAt).toEqual(new Date('2026-07-08T14:00:00.000Z'));
  });

  it('debe llamar al repositorio con la nueva entidad', async () => {
    spyOn(crypto, 'randomUUID').and.returnValue(generatedId);

    await useCase.execute({
      name: 'Nueva categoría',
    });

    expect(repository.createCategory).toHaveBeenCalled();
  });
});
