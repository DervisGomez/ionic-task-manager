import { Task } from '../../domain/entities/task.model';
import { getTaskCategoryLabel } from '../../shared/catalogs/task-categories.catalog';
import { TaskViewModel } from '../models/task.viewmodel';

export class TaskMapper {
  static toViewModel(task: Task): TaskViewModel {
    const categoryLabel = getTaskCategoryLabel(task.categoryId);
    const statusLabel = task.completed ? 'Completada' : 'Pendiente';
    const statusColor = task.completed ? 'success' : 'medium';

    return {
      id: task.id,
      title: task.title,
      description: task.description ?? '',
      categoryId: task.categoryId,
      categoryLabel,
      completed: task.completed,
      statusLabel,
      statusColor,
    };
  }

  static toViewModels(tasks: readonly Task[]): readonly TaskViewModel[] {
    return tasks.map((task) => TaskMapper.toViewModel(task));
  }
}
