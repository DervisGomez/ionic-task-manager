import { Task } from '../entities/task.model';
import { TaskRepository } from '../repositories/task.repository';
import { GetTasksUseCase } from './get-tasks.use-case';

describe('GetTasksUseCase', () => {
  let repository: jasmine.SpyObj<TaskRepository>;
  let useCase: GetTasksUseCase;

  beforeEach(() => {
    repository = jasmine.createSpyObj<TaskRepository>('TaskRepository', ['getTasks']);
    useCase = new GetTasksUseCase(repository);
  });

  it('debe devolver las tareas obtenidas desde el repositorio', async () => {
    const tasks: readonly Task[] = [
      {
        id: 't1',
        title: 'Task 1',
        completed: false,
        categoryId: 'c1',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    ];

    repository.getTasks.and.resolveTo(tasks);

    const result = await useCase.execute();

    expect(repository.getTasks).toHaveBeenCalledTimes(1);
    expect(result).toEqual(tasks);
  });
});
