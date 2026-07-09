import { Task } from '../../domain/entities/task.model';
import { TaskViewModel } from '../models/task.viewmodel';

export class TaskMapper {
  private static readonly CATEGORY_LABELS: Record<string, string> = {
    personal: 'Personal',
    work: 'Trabajo',
    shopping: 'Compras',
  };

  static toViewModel(task: Task): TaskViewModel {
    const categoryLabel = TaskMapper.CATEGORY_LABELS[task.categoryId] ?? task.categoryId;
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
