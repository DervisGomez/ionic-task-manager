import { Injectable } from '@angular/core';

import { Task } from '@features/tasks/domain/entities/task.model';
import { TaskRepository } from '@features/tasks/domain/repositories/task.repository';

/**
 * Implementación in-memory del repositorio de dominio para `Task`.
 *
 * Se registra a través del contrato `TaskRepository` (ver `TASKS_PROVIDERS`),
 * no como provider directo en la aplicación.
 */
@Injectable()
export class InMemoryTaskRepository extends TaskRepository {
  private tasks: Task[] = [];

  /**
   * Obtiene todas las tareas almacenadas en memoria.
   * Devuelve copias para no exponer el estado interno.
   */
  override async getTasks(): Promise<readonly Task[]> {
    return this.tasks.map((task) => ({ ...task }));
  }

  /**
   * Obtiene una tarea por su identificador.
   * @param id Identificador de la tarea.
   * @returns Una copia de la tarea si existe; si no, `null`.
   */
  override async getTaskById(id: string): Promise<Task | null> {
    const task = this.tasks.find((t) => t.id === id);
    return task ? { ...task } : null;
  }

  /**
   * Crea una nueva tarea en el almacenamiento en memoria.
   * Persiste una copia para aislar el estado interno.
   * @param task Tarea a persistir.
   */
  override async createTask(task: Task): Promise<void> {
    this.tasks.push({ ...task });
  }

  /**
   * Actualiza una tarea reemplazándola por su identificador.
   * Si no existe una tarea con el `id`, no realiza cambios.
   * @param task Tarea actualizada.
   */
  override async updateTask(task: Task): Promise<void> {
    const index = this.tasks.findIndex((t) => t.id === task.id);
    if (index === -1) return;

    this.tasks[index] = { ...task };
  }

  /**
   * Elimina una tarea por su identificador.
   * @param id Identificador de la tarea a eliminar.
   */
  override async deleteTask(id: string): Promise<void> {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }
}
