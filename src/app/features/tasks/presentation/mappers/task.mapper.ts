import { Task } from '../../domain/entities/task.model';
import { TaskViewModel } from '../models/task.viewmodel';

/**
 * Transforma entidades de dominio del agregado Task en modelos de vista.
 */
export class TaskMapper {
  static toViewModel(task: Task): TaskViewModel {
    return {
      id: task.id,
      title: task.title,
      description: task.description ?? '',
      completed: task.completed,
      categoryId: task.categoryId,
    };
  }

  static toViewModels(tasks: readonly Task[]): readonly TaskViewModel[] {
    return tasks.map((task) => TaskMapper.toViewModel(task));
  }
}
