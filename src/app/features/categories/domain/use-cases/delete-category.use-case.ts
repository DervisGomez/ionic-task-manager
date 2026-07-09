import { Injectable } from '@angular/core';

import { CategoryRepository } from '../repositories/category.repository';

/**
 * Caso de uso encargado de eliminar una categoría por su identificador.
 */
@Injectable()
export class DeleteCategoryUseCase {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private readonly repository: CategoryRepository) {}

  /**
   * Elimina la categoría correspondiente al identificador recibido.
   * @param id Identificador de la categoría a eliminar.
   */
  async execute(id: string): Promise<void> {
    await this.repository.deleteCategory(id);
  }
}
