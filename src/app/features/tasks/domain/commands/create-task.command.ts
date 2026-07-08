/**
 * Datos requeridos para crear una nueva tarea.
 */
export interface CreateTaskCommand {
  readonly title: string;
  readonly description?: string;
  readonly categoryId: string;
}
