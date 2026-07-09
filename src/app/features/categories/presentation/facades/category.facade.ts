import { inject, Injectable } from '@angular/core';

import { CreateCategoryCommand } from '../../domain/commands/create-category.command';
import { UpdateCategoryCommand } from '../../domain/commands/update-category.command';
import { CreateCategoryUseCase } from '../../domain/use-cases/create-category.use-case';
import { DeleteCategoryUseCase } from '../../domain/use-cases/delete-category.use-case';
import { GetCategoriesUseCase } from '../../domain/use-cases/get-categories.use-case';
import { UpdateCategoryUseCase } from '../../domain/use-cases/update-category.use-case';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryViewModel } from '../models/category.viewmodel';
import { CategoryState } from '../state/category.state';

/**
 * Punto de entrada entre la UI y el dominio del módulo Categories.
 * Orquestará los casos de uso y expondrá el estado de la pantalla a los componentes.
 */
@Injectable()
export class CategoryFacade {
  private readonly createCategoryUseCase = inject(CreateCategoryUseCase);
  private readonly getCategoriesUseCase = inject(GetCategoriesUseCase);
  private readonly updateCategoryUseCase = inject(UpdateCategoryUseCase);
  private readonly deleteCategoryUseCase = inject(DeleteCategoryUseCase);

  private state: CategoryState = {
    categories: [],
    loading: false,
    error: null,
  };

  /** Listado de categorías mostradas en la UI. */
  get categories(): readonly CategoryViewModel[] {
    return CategoryMapper.toViewModels(this.state.categories);
  }

  /** Indica si hay una operación en curso. */
  get loading(): boolean {
    return this.state.loading;
  }

  /** Mensaje de error de la última operación, o `null` si no hay error. */
  get error(): string | null {
    return this.state.error;
  }

  /**
   * Carga las categorías desde el dominio y actualiza el estado de la pantalla.
   */
  async loadCategories(): Promise<void> {
    this.state = { ...this.state, loading: true };

    try {
      const categories = await this.getCategoriesUseCase.execute();
      this.state = { ...this.state, categories, loading: false };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.state = { ...this.state, loading: false, error: message };
    }
  }

  /**
   * Crea una categoría y recarga el listado.
   */
  async createCategory(command: CreateCategoryCommand): Promise<void> {
    await this.createCategoryUseCase.execute(command);
    await this.loadCategories();
  }

  /**
   * Actualiza una categoría y recarga el listado.
   */
  async updateCategory(id: string, command: CreateCategoryCommand): Promise<void> {
    const updateCommand: UpdateCategoryCommand = {
      id,
      name: command.name,
    };

    await this.updateCategoryUseCase.execute(updateCommand);
    await this.loadCategories();
  }

  /**
   * Elimina una categoría y recarga el listado.
   */
  async deleteCategory(id: string): Promise<void> {
    await this.deleteCategoryUseCase.execute(id);
    await this.loadCategories();
  }
}
