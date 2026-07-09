import { TestBed } from '@angular/core/testing';

import { Category } from '../../domain/entities/category.model';
import { CreateCategoryUseCase } from '../../domain/use-cases/create-category.use-case';
import { DeleteCategoryUseCase } from '../../domain/use-cases/delete-category.use-case';
import { GetCategoriesUseCase } from '../../domain/use-cases/get-categories.use-case';
import { UpdateCategoryUseCase } from '../../domain/use-cases/update-category.use-case';
import { CategoryFacade } from './category.facade';

describe('CategoryFacade', () => {
  let facade: CategoryFacade;
  let getCategoriesUseCase: jasmine.SpyObj<GetCategoriesUseCase>;
  let createCategoryUseCase: jasmine.SpyObj<CreateCategoryUseCase>;
  let updateCategoryUseCase: jasmine.SpyObj<UpdateCategoryUseCase>;
  let deleteCategoryUseCase: jasmine.SpyObj<DeleteCategoryUseCase>;

  const category: Category = {
    id: 'c1',
    name: 'Personal',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  };

  const anotherCategory: Category = {
    id: 'c2',
    name: 'Trabajo',
    createdAt: new Date('2026-01-03T00:00:00.000Z'),
    updatedAt: new Date('2026-01-04T00:00:00.000Z'),
  };

  beforeEach(() => {
    getCategoriesUseCase = jasmine.createSpyObj<GetCategoriesUseCase>('GetCategoriesUseCase', [
      'execute',
    ]);
    createCategoryUseCase = jasmine.createSpyObj<CreateCategoryUseCase>('CreateCategoryUseCase', [
      'execute',
    ]);
    updateCategoryUseCase = jasmine.createSpyObj<UpdateCategoryUseCase>('UpdateCategoryUseCase', [
      'execute',
    ]);
    deleteCategoryUseCase = jasmine.createSpyObj<DeleteCategoryUseCase>('DeleteCategoryUseCase', [
      'execute',
    ]);

    getCategoriesUseCase.execute.and.resolveTo([category, anotherCategory]);
    createCategoryUseCase.execute.and.resolveTo();
    updateCategoryUseCase.execute.and.resolveTo();
    deleteCategoryUseCase.execute.and.resolveTo();

    TestBed.configureTestingModule({
      providers: [
        CategoryFacade,
        { provide: GetCategoriesUseCase, useValue: getCategoriesUseCase },
        { provide: CreateCategoryUseCase, useValue: createCategoryUseCase },
        { provide: UpdateCategoryUseCase, useValue: updateCategoryUseCase },
        { provide: DeleteCategoryUseCase, useValue: deleteCategoryUseCase },
      ],
    });

    facade = TestBed.inject(CategoryFacade);
  });

  it('loadCategories llama GetCategoriesUseCase', async () => {
    await facade.loadCategories();

    expect(getCategoriesUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('loadCategories expone las categorías como ViewModels', async () => {
    await facade.loadCategories();

    expect(facade.categories).toEqual([
      { id: 'c1', name: 'Personal' },
      { id: 'c2', name: 'Trabajo' },
    ]);
  });

  it('loadCategories finaliza con loading en false', async () => {
    await facade.loadCategories();

    expect(facade.loading).toBeFalse();
  });

  it('loadCategories guarda el error cuando falla', async () => {
    getCategoriesUseCase.execute.and.rejectWith(new Error('Error de red'));

    await facade.loadCategories();

    expect(facade.error).toBe('Error de red');
    expect(facade.loading).toBeFalse();
  });

  it('createCategory llama CreateCategoryUseCase', async () => {
    spyOn(facade, 'loadCategories').and.resolveTo();

    await facade.createCategory({ name: 'Compras' });

    expect(createCategoryUseCase.execute).toHaveBeenCalledOnceWith({ name: 'Compras' });
  });

  it('createCategory recarga las categorías', async () => {
    spyOn(facade, 'loadCategories').and.resolveTo();

    await facade.createCategory({ name: 'Compras' });

    expect(facade.loadCategories).toHaveBeenCalledTimes(1);
  });

  it('updateCategory llama UpdateCategoryUseCase', async () => {
    spyOn(facade, 'loadCategories').and.resolveTo();

    await facade.updateCategory('c1', { name: 'Personal actualizado' });

    expect(updateCategoryUseCase.execute).toHaveBeenCalledOnceWith({
      id: 'c1',
      name: 'Personal actualizado',
    });
  });

  it('updateCategory recarga las categorías', async () => {
    spyOn(facade, 'loadCategories').and.resolveTo();

    await facade.updateCategory('c1', { name: 'Personal actualizado' });

    expect(facade.loadCategories).toHaveBeenCalledTimes(1);
  });

  it('deleteCategory llama DeleteCategoryUseCase', async () => {
    spyOn(facade, 'loadCategories').and.resolveTo();

    await facade.deleteCategory('c1');

    expect(deleteCategoryUseCase.execute).toHaveBeenCalledOnceWith('c1');
  });

  it('deleteCategory recarga las categorías', async () => {
    spyOn(facade, 'loadCategories').and.resolveTo();

    await facade.deleteCategory('c1');

    expect(facade.loadCategories).toHaveBeenCalledTimes(1);
  });
});
