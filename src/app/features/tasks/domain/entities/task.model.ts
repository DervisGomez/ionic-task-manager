/**
 * Entidad de dominio que representa una tarea.
 */
export interface Task {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly completed: boolean;
  readonly categoryId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
