import { Injectable } from '@angular/core';

import { Category } from '../entities/category.model';
import { CategoryRepository } from '../repositories/category.repository';

/**
 * Caso de uso encargado de obtener todas las categorías.
 */
@Injectable()
export class GetCategoriesUseCase {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private readonly repository: CategoryRepository) {}

  /**
   * Recupera todas las categorías desde el repositorio.
   * @returns La colección de categorías disponibles.
   */
  async execute(): Promise<readonly Category[]> {
    return this.repository.getCategories();
  }
}
