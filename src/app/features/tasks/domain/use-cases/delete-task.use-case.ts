import { Injectable } from '@angular/core';

import { TaskRepository } from '../repositories/task.repository';

/**
 * Caso de uso encargado de eliminar una tarea por su identificador.
 */
@Injectable()
export class DeleteTaskUseCase {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private readonly repository: TaskRepository) {}

  /**
   * Elimina la tarea correspondiente al identificador recibido.
   * @param id Identificador de la tarea a eliminar.
   */
  async execute(id: string): Promise<void> {
    await this.repository.deleteTask(id);
  }
}
