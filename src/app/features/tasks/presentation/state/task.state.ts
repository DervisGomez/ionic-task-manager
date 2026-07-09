import { Task } from '../../domain/entities/task.model';

/**
 * Representa el estado de la pantalla del módulo Tasks.
 */
export interface TaskState {
  /** Listado de tareas mostradas en la UI. */
  readonly tasks: readonly Task[];

  /** Listado de tareas filtradas mostradas en la UI. */
  readonly filteredTasks: readonly Task[];

  /** Término de búsqueda activo. */
  readonly searchTerm: string;

  /** Categoría seleccionada para filtrar. */
  readonly selectedCategory: string;

  /** Indica si hay una operación en curso. */
  readonly loading: boolean;

  /** Mensaje de error de la última operación, o `null` si no hay error. */
  readonly error: string | null;
}
