import { Category } from '../entities/category.model';

/**
 * Contrato del repositorio de dominio para `Category`.
 *
 * Define las operaciones necesarias desde la capa de dominio sin especificar
 * cómo se persisten o recuperan los datos.
 */
export abstract class CategoryRepository {
  /** Obtiene todas las categorías disponibles. */
  abstract getCategories(): Promise<readonly Category[]>;

  /**
   * Obtiene una categoría por su identificador.
   * @param id Identificador de la categoría.
   */
  abstract getCategoryById(id: string): Promise<Category | null>;

  /**
   * Persiste una nueva categoría.
   * @param category Entidad a crear.
   */
  abstract createCategory(category: Category): Promise<void>;

  /**
   * Reemplaza una categoría existente.
   * @param category Entidad actualizada.
   */
  abstract updateCategory(category: Category): Promise<void>;

  /**
   * Elimina una categoría por su identificador.
   * @param id Identificador de la categoría.
   */
  abstract deleteCategory(id: string): Promise<void>;
}
