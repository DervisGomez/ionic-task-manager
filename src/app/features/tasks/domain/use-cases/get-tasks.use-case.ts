import { Injectable } from '@angular/core';

import { Task } from '../entities/task.model';
import { TaskRepository } from '../repositories/task.repository';

/**
 * Caso de uso encargado de obtener todas las tareas.
 */
@Injectable()
export class GetTasksUseCase {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private readonly repository: TaskRepository) {}

  /**
   * Recupera todas las tareas desde el repositorio.
   * @returns La colección de tareas disponibles.
   */
  async execute(): Promise<readonly Task[]> {
    return this.repository.getTasks();
  }
}
