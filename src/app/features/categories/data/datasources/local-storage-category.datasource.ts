import { Category } from '@features/categories/domain/entities/category.model';

const STORAGE_KEY = 'task-manager.categories';

interface StoredCategory {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Acceso a `localStorage` para la persistencia de categorías.
 * No contiene lógica de negocio.
 */
export class LocalStorageCategoryDataSource {
  /**
   * Carga categorías desde `localStorage`.
   * @returns Categorías válidas o `null` si no hay datos o son inválidos.
   */
  load(): Category[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        return null;
      }

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return null;
      }

      const categories: Category[] = [];
      for (const item of parsed) {
        const category = this.toCategory(item);
        if (category === null) {
          return null;
        }
        categories.push(category);
      }

      return categories;
    } catch {
      return null;
    }
  }

  /**
   * Persiste categorías en `localStorage`.
   * @param categories Colección de categorías a guardar.
   */
  save(categories: readonly Category[]): void {
    try {
      const stored = categories.map((category) => this.toStoredCategory(category));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Ignorar errores de persistencia para no propagarlos a la UI.
    }
  }

  /**
   * Elimina las categorías persistidas en `localStorage`.
   */
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar errores de persistencia para no propagarlos a la UI.
    }
  }

  private toStoredCategory(category: Category): StoredCategory {
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  private toCategory(value: unknown): Category | null {
    if (typeof value !== 'object' || value === null) {
      return null;
    }

    const record = value as Record<string, unknown>;
    const { id, name, createdAt, updatedAt } = record;

    if (
      typeof id !== 'string' ||
      typeof name !== 'string' ||
      typeof createdAt !== 'string' ||
      typeof updatedAt !== 'string'
    ) {
      return null;
    }

    const parsedCreatedAt = new Date(createdAt);
    const parsedUpdatedAt = new Date(updatedAt);
    if (Number.isNaN(parsedCreatedAt.getTime()) || Number.isNaN(parsedUpdatedAt.getTime())) {
      return null;
    }

    return {
      id,
      name,
      createdAt: parsedCreatedAt,
      updatedAt: parsedUpdatedAt,
    };
  }
}
