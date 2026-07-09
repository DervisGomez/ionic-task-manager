import { Injectable } from '@angular/core';

import { Category } from '../entities/category.model';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryCommand } from '../commands/create-category.command';

/**
 * Caso de uso encargado de crear una nueva categoría.
 */
@Injectable()
export class CreateCategoryUseCase {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private readonly repository: CategoryRepository) {}

  /**
   * Construye una nueva entidad `Category` y la persiste en el repositorio.
   * @param command Datos necesarios para crear la categoría.
   */
  async execute(command: CreateCategoryCommand): Promise<void> {
    const now = new Date();
    const category: Category = {
      id: crypto.randomUUID(),
      name: command.name,
      createdAt: now,
      updatedAt: now,
    };

    await this.repository.createCategory(category);
  }
}
