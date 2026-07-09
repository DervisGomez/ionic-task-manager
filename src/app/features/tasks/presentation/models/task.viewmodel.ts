/**
 * Representación de una tarea orientada al agregado Task.
 */
export interface TaskViewModel {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
  readonly categoryId: string;
}
