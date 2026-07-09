/**
 * Seed temporal de categorías para `InMemoryCategoryRepository`.
 *
 * No debe consumirse desde la capa de presentación; la UI obtiene categorías
 * a través de `CategoryFacade`.
 */
export const CATEGORY_CATALOG_SEED = [
  { id: 'work', name: 'Trabajo' },
  { id: 'personal', name: 'Personal' },
  { id: 'shopping', name: 'Compras' },
] as const;
