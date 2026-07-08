/**
 * Datos requeridos para actualizar una tarea existente.
 */
export interface UpdateTaskCommand {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly completed: boolean;
  readonly categoryId: string;
}
