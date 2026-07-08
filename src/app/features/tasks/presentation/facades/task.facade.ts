import { inject, Injectable } from '@angular/core';

import { CreateTaskCommand } from '../../domain/commands/create-task.command';
import { CreateTaskUseCase } from '../../domain/use-cases/create-task.use-case';
import { GetTasksUseCase } from '../../domain/use-cases/get-tasks.use-case';
import { Task } from '../../domain/entities/task.model';
import { TaskState } from '../state/task.state';

/**
 * Punto de entrada entre la UI y el dominio del módulo Tasks.
 * Orquestará los casos de uso y expondrá el estado de la pantalla a los componentes.
 */
@Injectable()
export class TaskFacade {
  private readonly createTaskUseCase = inject(CreateTaskUseCase);
  private readonly getTasksUseCase = inject(GetTasksUseCase);

  private state: TaskState = {
    tasks: [],
    loading: false,
    error: null,
  };

  /** Listado de tareas mostradas en la UI. */
  get tasks(): readonly Task[] {
    return this.state.tasks;
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
   * Carga las tareas desde el dominio y actualiza el estado de la pantalla.
   */
  async loadTasks(): Promise<void> {
    this.state = { ...this.state, loading: true };

    try {
      const tasks = await this.getTasksUseCase.execute();
      this.state = { ...this.state, tasks, loading: false };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.state = { ...this.state, loading: false, error: message };
    }
  }

  /**
   * Crea una tarea y recarga el listado.
   */
  async createTask(command: CreateTaskCommand): Promise<void> {
    await this.createTaskUseCase.execute(command);
    await this.loadTasks();
  }
}
