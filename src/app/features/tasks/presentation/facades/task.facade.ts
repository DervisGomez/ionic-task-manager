import { inject, Injectable } from '@angular/core';

import { CreateTaskCommand } from '../../domain/commands/create-task.command';
import { UpdateTaskCommand } from '../../domain/commands/update-task.command';
import { CreateTaskUseCase } from '../../domain/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '../../domain/use-cases/delete-task.use-case';
import { GetTasksUseCase } from '../../domain/use-cases/get-tasks.use-case';
import { UpdateTaskUseCase } from '../../domain/use-cases/update-task.use-case';
import { TaskMapper } from '../mappers/task.mapper';
import { TaskViewModel } from '../models/task.viewmodel';
import { TaskState } from '../state/task.state';

/**
 * Punto de entrada entre la UI y el dominio del módulo Tasks.
 * Orquestará los casos de uso y expondrá el estado de la pantalla a los componentes.
 */
@Injectable()
export class TaskFacade {
  private readonly createTaskUseCase = inject(CreateTaskUseCase);
  private readonly getTasksUseCase = inject(GetTasksUseCase);
  private readonly updateTaskUseCase = inject(UpdateTaskUseCase);
  private readonly deleteTaskUseCase = inject(DeleteTaskUseCase);

  private state: TaskState = {
    tasks: [],
    filteredTasks: [],
    searchTerm: '',
    selectedCategory: 'all',
    loading: false,
    error: null,
  };

  private taskViewModels: readonly TaskViewModel[] = [];

  /** Listado de tareas filtradas del agregado Task. */
  get tasks(): readonly TaskViewModel[] {
    return this.taskViewModels;
  }

  /** Término de búsqueda activo. */
  get searchTerm(): string {
    return this.state.searchTerm;
  }

  /** Categoría seleccionada para filtrar. */
  get selectedCategory(): string {
    return this.state.selectedCategory;
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
      this.applyFilters();
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

  /**
   * Actualiza una tarea y recarga el listado.
   */
  async updateTask(id: string, command: CreateTaskCommand): Promise<void> {
    const currentTask = this.state.tasks.find((task) => task.id === id);
    if (!currentTask) return;

    const updateCommand: UpdateTaskCommand = {
      id,
      title: command.title,
      description: command.description,
      completed: currentTask.completed,
      categoryId: command.categoryId,
    };

    await this.updateTaskUseCase.execute(updateCommand);
    await this.loadTasks();
  }

  /**
   * Alterna el estado completado de una tarea y recarga el listado.
   */
  async toggleCompleted(id: string): Promise<void> {
    const currentTask = this.state.tasks.find((task) => task.id === id);
    if (!currentTask) return;

    const command: UpdateTaskCommand = {
      id: currentTask.id,
      title: currentTask.title,
      description: currentTask.description,
      completed: !currentTask.completed,
      categoryId: currentTask.categoryId,
    };

    await this.updateTaskUseCase.execute(command);
    await this.loadTasks();
  }

  /**
   * Elimina una tarea y recarga el listado.
   */
  async deleteTask(id: string): Promise<void> {
    await this.deleteTaskUseCase.execute(id);
    await this.loadTasks();
  }

  /**
   * Actualiza el término de búsqueda y aplica los filtros activos.
   */
  search(term: string): void {
    this.state = { ...this.state, searchTerm: term };
    this.applyFilters();
  }

  /**
   * Actualiza la categoría seleccionada y aplica los filtros activos.
   */
  selectCategory(categoryId: string): void {
    this.state = { ...this.state, selectedCategory: categoryId };
    this.applyFilters();
  }

  private applyFilters(): void {
    const normalizedTerm = this.state.searchTerm.trim().toLowerCase();

    let filteredTasks =
      normalizedTerm.length === 0
        ? this.state.tasks
        : this.state.tasks.filter(
            (task) =>
              task.title.toLowerCase().includes(normalizedTerm) ||
              (task.description?.toLowerCase().includes(normalizedTerm) ?? false),
          );

    if (this.state.selectedCategory !== 'all') {
      filteredTasks = filteredTasks.filter(
        (task) => task.categoryId === this.state.selectedCategory,
      );
    }

    this.state = { ...this.state, filteredTasks };
    this.refreshTaskViewModels();
  }

  private refreshTaskViewModels(): void {
    this.taskViewModels = TaskMapper.toViewModels(this.state.filteredTasks);
  }
}
