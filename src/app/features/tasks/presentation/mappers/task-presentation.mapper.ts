import { CategoryViewModel } from '@features/categories/presentation/models/category.viewmodel';

import { EnrichedTaskViewModel } from '../models/enriched-task.viewmodel';
import { TaskViewModel } from '../models/task.viewmodel';

/**
 * Enriquece modelos del agregado Task con información visual derivada de otros agregados.
 */
export class TaskPresentationMapper {
  /**
   * Construye un modelo visual enriquecido a partir de una tarea y las categorías disponibles.
   * @param task Modelo del agregado Task.
   * @param categories Categorías disponibles en la UI.
   */
  static toEnrichedViewModel(
    task: TaskViewModel,
    categories: readonly CategoryViewModel[],
  ): EnrichedTaskViewModel {
    const category = categories.find((item) => item.id === task.categoryId);
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
    return tasks.map((task) => TaskPresentationMapper.toEnrichedViewModel(task, categories));
  }
}
