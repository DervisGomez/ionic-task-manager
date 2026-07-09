import { CategoryViewModel } from '@features/categories/presentation/models/category.viewmodel';

import { EnrichedTaskViewModel } from '../models/enriched-task.viewmodel';
import { TaskViewModel } from '../models/task.viewmodel';

/**
 * Enriquece modelos del agregado Task con información visual derivada de otros agregados.
 */
export class TaskPresentationMapper {
  /**
   * Construye un mapa de categorías indexado por id para búsquedas O(1).
   */
  static buildCategoryMap(
    categories: readonly CategoryViewModel[],
  ): ReadonlyMap<string, CategoryViewModel> {
    return new Map(categories.map((category) => [category.id, category]));
  }

  /**
   * Construye un modelo visual enriquecido a partir de una tarea y las categorías disponibles.
   * @param task Modelo del agregado Task.
   * @param categories Categorías disponibles en la UI o mapa precalculado.
   */
  static toEnrichedViewModel(
    task: TaskViewModel,
    categories: readonly CategoryViewModel[],
  ): EnrichedTaskViewModel;
  static toEnrichedViewModel(
    task: TaskViewModel,
    categoryMap: ReadonlyMap<string, CategoryViewModel>,
  ): EnrichedTaskViewModel;
  static toEnrichedViewModel(
    task: TaskViewModel,
    categories: readonly CategoryViewModel[] | ReadonlyMap<string, CategoryViewModel>,
  ): EnrichedTaskViewModel {
    const category = TaskPresentationMapper.findCategory(task.categoryId, categories);
    const categoryLabel = category?.name ?? task.categoryId;
    const statusLabel = task.completed ? 'Completada' : 'Pendiente';
    const statusColor = task.completed ? 'success' : 'medium';

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      categoryId: task.categoryId,
      categoryLabel,
      statusLabel,
      statusColor,
    };
  }

  /**
   * Construye modelos visuales enriquecidos para una colección de tareas.
   * @param tasks Modelos del agregado Task.
   * @param categories Categorías disponibles en la UI.
   */
  static toEnrichedViewModels(
    tasks: readonly TaskViewModel[],
    categories: readonly CategoryViewModel[],
  ): readonly EnrichedTaskViewModel[] {
    const categoryMap = TaskPresentationMapper.buildCategoryMap(categories);
    return tasks.map((task) => TaskPresentationMapper.toEnrichedViewModel(task, categoryMap));
  }

  private static findCategory(
    categoryId: string,
    categories: readonly CategoryViewModel[] | ReadonlyMap<string, CategoryViewModel>,
  ): CategoryViewModel | undefined {
    if (categories instanceof Map) {
      return categories.get(categoryId);
    }

    const categoryList = categories as readonly CategoryViewModel[];
    return categoryList.find((item) => item.id === categoryId);
  }
}
