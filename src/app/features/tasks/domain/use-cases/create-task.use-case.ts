import { Injectable } from '@angular/core';

import { Task } from '../entities/task.model';
import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskCommand } from '../commands/create-task.command';

/**
 * Caso de uso encargado de crear una nueva tarea.
 */
@Injectable()
export class CreateTaskUseCase {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private readonly repository: TaskRepository) {}

  /**
   * Construye una nueva entidad `Task` y la persiste en el repositorio.
   * @param command Datos necesarios para crear la tarea.
   */
  async execute(command: CreateTaskCommand): Promise<void> {
    const now = new Date();
    const task: Task = {
      id: crypto.randomUUID(),
      title: command.title,
      description: command.description,
      completed: false,
      categoryId: command.categoryId,
      createdAt: now,
      updatedAt: now,
    };

    await this.repository.createTask(task);
  }
}
