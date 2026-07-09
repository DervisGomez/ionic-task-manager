import { Injectable } from '@angular/core';

import { Category } from '../entities/category.model';
import { CategoryRepository } from '../repositories/category.repository';
import { UpdateCategoryCommand } from '../commands/update-category.command';

/**
 * Caso de uso encargado de actualizar una categoría existente.
 */
@Injectable()
export class UpdateCategoryUseCase {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private readonly repository: CategoryRepository) {}

  /**
   * Construye una nueva versión de la categoría y la delega al repositorio.
   * Si la categoría no existe, no realiza cambios.
   * @param command Datos necesarios para actualizar la categoría.
   */
  async execute(command: UpdateCategoryCommand): Promise<void> {
    const currentCategory = await this.repository.getCategoryById(command.id);
    if (!currentCategory) return;

    const category: Category = {
      id: command.id,
      name: command.name,
      createdAt: currentCategory.createdAt,
      updatedAt: new Date(),
    };

    await this.repository.updateCategory(category);
  }
}
