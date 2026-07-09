import { Task } from '@features/tasks/domain/entities/task.model';

const STORAGE_KEY = 'task-manager.tasks';

interface StoredTask {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly completed: boolean;
  readonly categoryId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Acceso a `localStorage` para la persistencia de tareas.
 * No contiene lógica de negocio.
 */
export class LocalStorageTaskDataSource {
  /**
   * Carga tareas desde `localStorage`.
   * @returns Tareas válidas o `null` si no hay datos o son inválidos.
   */
  load(): Task[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        return null;
      }

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return null;
      }

      const tasks: Task[] = [];
      for (const item of parsed) {
        const task = this.toTask(item);
        if (task === null) {
          return null;
        }
        tasks.push(task);
      }

      return tasks;
    } catch {
      return null;
    }
  }

  /**
   * Persiste tareas en `localStorage`.
   * @param tasks Colección de tareas a guardar.
   */
  save(tasks: readonly Task[]): void {
    try {
      const stored = tasks.map((task) => this.toStoredTask(task));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Ignorar errores de persistencia para no propagarlos a la UI.
    }
  }

  /**
   * Elimina las tareas persistidas en `localStorage`.
   */
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar errores de persistencia para no propagarlos a la UI.
    }
  }

  private toStoredTask(task: Task): StoredTask {
    return {
      id: task.id,
      title: task.title,
      ...(task.description !== undefined ? { description: task.description } : {}),
      completed: task.completed,
      categoryId: task.categoryId,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  private toTask(value: unknown): Task | null {
    if (typeof value !== 'object' || value === null) {
      return null;
    }

    const record = value as Record<string, unknown>;
    const { id, title, description, completed, categoryId, createdAt, updatedAt } = record;

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof completed !== 'boolean' ||
      typeof categoryId !== 'string' ||
      typeof createdAt !== 'string' ||
      typeof updatedAt !== 'string'
    ) {
      return null;
    }

    if (description !== undefined && typeof description !== 'string') {
      return null;
    }

    const parsedCreatedAt = new Date(createdAt);
    const parsedUpdatedAt = new Date(updatedAt);
    if (Number.isNaN(parsedCreatedAt.getTime()) || Number.isNaN(parsedUpdatedAt.getTime())) {
      return null;
    }

    return {
      id,
      title,
      ...(description !== undefined ? { description } : {}),
      completed,
      categoryId,
      createdAt: parsedCreatedAt,
      updatedAt: parsedUpdatedAt,
    };
  }
}
