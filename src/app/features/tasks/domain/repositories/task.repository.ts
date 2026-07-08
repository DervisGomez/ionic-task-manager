import { Task } from '../entities/task.model';

/**
 * Contrato del repositorio de dominio para `Task`.
 *
 * Define las operaciones necesarias desde la capa de dominio sin especificar
 * cómo se persisten o recuperan los datos.
 */
export abstract class TaskRepository {
  /** Obtiene todas las tareas disponibles. */
  abstract getTasks(): Promise<readonly Task[]>;

  /**
   * Obtiene una tarea por su identificador.
   * @param id Identificador de la tarea.
   */
  abstract getTaskById(id: string): Promise<Task | null>;

  /**
   * Persiste una nueva tarea.
   * @param task Entidad a crear.
   */
  abstract createTask(task: Task): Promise<void>;

  /**
   * Reemplaza una tarea existente.
   * @param task Entidad actualizada.
   */
  abstract updateTask(task: Task): Promise<void>;

  /**
   * Elimina una tarea por su identificador.
   * @param id Identificador de la tarea.
   */
  abstract deleteTask(id: string): Promise<void>;
}
