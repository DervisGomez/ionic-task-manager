import { FilterOption } from '@shared/models/filter-option.model';

/**
 * Catálogo único de categorías del módulo Tasks.
 * Consumido por formulario, listado y mapper de presentación.
 */
const TASK_CATEGORY_CATALOG = [
  { id: 'work', label: 'Trabajo' },
  { id: 'personal', label: 'Personal' },
  { id: 'shopping', label: 'Compras', selectable: false as const },
] as const;

type TaskCategoryCatalogItem = (typeof TASK_CATEGORY_CATALOG)[number];

export type SelectableTaskCategory = Exclude<
  TaskCategoryCatalogItem,
  { readonly selectable: false }
>;

export type SelectableTaskCategoryId = SelectableTaskCategory['id'];

const ALL_FILTER_OPTION: FilterOption = { id: 'all', label: 'Todas' };

function isSelectableCategory(
  category: TaskCategoryCatalogItem,
): category is SelectableTaskCategory {
  return !('selectable' in category) || category.selectable !== false;
}

export function getSelectableTaskCategories(): readonly SelectableTaskCategory[] {
  return TASK_CATEGORY_CATALOG.filter(isSelectableCategory);
}

export function getSelectableTaskCategoryIds(): readonly SelectableTaskCategoryId[] {
  return getSelectableTaskCategories().map((category) => category.id);
}

export function getTaskCategoryLabel(categoryId: string): string {
  const category = TASK_CATEGORY_CATALOG.find((item) => item.id === categoryId);
  return category?.label ?? categoryId;
}

export function getTaskListFilterOptions(): readonly FilterOption[] {
  return [
    ALL_FILTER_OPTION,
    ...getSelectableTaskCategories().map(({ id, label }) => ({ id, label })),
  ];
}
