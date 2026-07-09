import { Provider } from '@angular/core';

import { CategoryRepository } from './domain/repositories/category.repository';
import { InMemoryCategoryRepository } from './data/repositories/in-memory-category.repository';

import { CreateCategoryUseCase } from './domain/use-cases/create-category.use-case';
import { DeleteCategoryUseCase } from './domain/use-cases/delete-category.use-case';
import { GetCategoriesUseCase } from './domain/use-cases/get-categories.use-case';
import { UpdateCategoryUseCase } from './domain/use-cases/update-category.use-case';
import { CategoryFacade } from './presentation/facades/category.facade';

/**
 * Providers del módulo `Categories`.
 *
 * Composition root de la feature: conecta el contrato `CategoryRepository` con
 * su implementación in-memory y registra los casos de uso del dominio.
 * La presentación debe depender de los use cases, nunca de la capa data.
 */
export const CATEGORIES_PROVIDERS: Provider[] = [
  {
    provide: CategoryRepository,
    useClass: InMemoryCategoryRepository,
  },
  CreateCategoryUseCase,
  GetCategoriesUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
  CategoryFacade,
];
