import { Task } from '../../domain/entities/task.model';

/**
 * Representa el estado de la pantalla del módulo Tasks.
 */
export interface TaskState {
  /** Listado de tareas mostradas en la UI. */
  readonly tasks: readonly Task[];

  /** Indica si hay una operación en curso. */
  readonly loading: boolean;

  /** Mensaje de error de la última operación, o `null` si no hay error. */
  readonly error: string | null;
}
