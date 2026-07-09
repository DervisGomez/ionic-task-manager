import { Injectable } from '@angular/core';

import { LocalStorageCategoryDataSource } from '@features/categories/data/datasources/local-storage-category.datasource';
import { Category } from '@features/categories/domain/entities/category.model';
import { CategoryRepository } from '@features/categories/domain/repositories/category.repository';
import { CATEGORY_CATALOG_SEED } from '@features/categories/shared/catalogs/category.catalog';

/**
 * Implementación in-memory del repositorio de dominio para `Category`.
 *
 * Se registra a través del contrato `CategoryRepository` (ver `CATEGORIES_PROVIDERS`),
 * no como provider directo en la aplicación.
 */
@Injectable()
export class InMemoryCategoryRepository extends CategoryRepository {
  private readonly dataSource = new LocalStorageCategoryDataSource();
  private categories: Category[];

  constructor() {
    super();
    this.categories = this.initializeFromStorage();
  }

  /**
   * Obtiene todas las categorías almacenadas en memoria.
   * Devuelve copias para no exponer el estado interno.
   */
  override async getCategories(): Promise<readonly Category[]> {
    return this.categories.map((category) => ({ ...category }));
  }

  /**
   * Obtiene una categoría por su identificador.
   * @param id Identificador de la categoría.
   * @returns Una copia de la categoría si existe; si no, `null`.
   */
  override async getCategoryById(id: string): Promise<Category | null> {
    const category = this.categories.find((c) => c.id === id);
    return category ? { ...category } : null;
  }

  /**
   * Crea una nueva categoría en el almacenamiento en memoria.
   * Persiste una copia para aislar el estado interno.
   * @param category Categoría a persistir.
   */
  override async createCategory(category: Category): Promise<void> {
    this.categories.push({ ...category });
    this.persist();
  }

  /**
   * Actualiza una categoría reemplazándola por su identificador.
   * Si no existe una categoría con el `id`, no realiza cambios.
   * @param category Categoría actualizada.
   */
  override async updateCategory(category: Category): Promise<void> {
    const index = this.categories.findIndex((c) => c.id === category.id);
    if (index === -1) return;

    this.categories[index] = { ...category };
    this.persist();
  }

  /**
   * Elimina una categoría por su identificador.
   * @param id Identificador de la categoría a eliminar.
   */
  override async deleteCategory(id: string): Promise<void> {
    this.categories = this.categories.filter((c) => c.id !== id);
    this.persist();
  }

  private initializeFromStorage(): Category[] {
    const loaded = this.dataSource.load();
    if (loaded !== null) {
      return loaded.map((category) => ({ ...category }));
    }

    const seed = this.createSeedCategories();
    this.dataSource.save(seed);
    return seed;
  }

  private createSeedCategories(): Category[] {
    const now = new Date();
    return CATEGORY_CATALOG_SEED.map((seed) => ({
      id: seed.id,
      name: seed.name,
      createdAt: now,
      updatedAt: now,
    }));
  }

  private persist(): void {
    this.dataSource.save(this.categories);
  }
}
