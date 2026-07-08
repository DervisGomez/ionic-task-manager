import { Provider } from '@angular/core';

import { TaskRepository } from './domain/repositories/task.repository';
import { InMemoryTaskRepository } from './data/repositories/in-memory-task.repository';

import { CreateTaskUseCase } from './domain/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from './domain/use-cases/delete-task.use-case';
import { GetTasksUseCase } from './domain/use-cases/get-tasks.use-case';
import { UpdateTaskUseCase } from './domain/use-cases/update-task.use-case';
import { TaskFacade } from './presentation/facades/task.facade';

/**
 * Providers del módulo `Tasks`.
 *
 * Composition root de la feature: conecta el contrato `TaskRepository` con
 * su implementación in-memory y registra los casos de uso del dominio.
 * La presentación debe depender de los use cases, nunca de la capa data.
 */
export const TASKS_PROVIDERS: Provider[] = [
  {
    provide: TaskRepository,
    useClass: InMemoryTaskRepository,
  },
  CreateTaskUseCase,
  GetTasksUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  TaskFacade,
];
