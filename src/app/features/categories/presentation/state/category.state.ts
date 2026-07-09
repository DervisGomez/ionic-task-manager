import { Category } from '../../domain/entities/category.model';

/**
 * Representa el estado de la pantalla del módulo Categories.
 */
export interface CategoryState {
  /** Listado de categorías mostradas en la UI. */
  readonly categories: readonly Category[];

  /** Indica si hay una operación en curso. */
  readonly loading: boolean;

  /** Mensaje de error de la última operación, o `null` si no hay error. */
  readonly error: string | null;
}
