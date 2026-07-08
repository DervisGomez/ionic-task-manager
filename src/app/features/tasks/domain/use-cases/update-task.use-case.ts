import { Injectable } from '@angular/core';

import { Task } from '../entities/task.model';
import { TaskRepository } from '../repositories/task.repository';
import { UpdateTaskCommand } from '../commands/update-task.command';

/**
 * Caso de uso encargado de actualizar una tarea existente.
 */
@Injectable()
export class UpdateTaskUseCase {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private readonly repository: TaskRepository) {}

  /**
   * Construye una nueva versión de la tarea y la delega al repositorio.
   * Si la tarea no existe, no realiza cambios.
   * @param command Datos necesarios para actualizar la tarea.
   */
  async execute(command: UpdateTaskCommand): Promise<void> {
    const currentTask = await this.repository.getTaskById(command.id);
    if (!currentTask) return;

    const task: Task = {
      id: command.id,
      title: command.title,
      description: command.description,
      completed: command.completed,
      categoryId: command.categoryId,
      createdAt: currentTask.createdAt,
      updatedAt: new Date(),
    };

    await this.repository.updateTask(task);
  }
}
