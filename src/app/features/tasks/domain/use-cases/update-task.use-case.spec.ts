import { UpdateTaskCommand } from '../commands/update-task.command';
import { Task } from '../entities/task.model';
import { TaskRepository } from '../repositories/task.repository';
import { UpdateTaskUseCase } from './update-task.use-case';

describe('UpdateTaskUseCase', () => {
  let repository: jasmine.SpyObj<TaskRepository>;
  let useCase: UpdateTaskUseCase;

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2026-07-08T15:00:00.000Z'));

    repository = jasmine.createSpyObj<TaskRepository>('TaskRepository', [
      'getTaskById',
      'updateTask',
    ]);
    repository.updateTask.and.resolveTo();

    useCase = new UpdateTaskUseCase(repository);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('debe construir una nueva entidad y actualizarla en el repositorio', async () => {
    const existingTask: Task = {
      id: 't1',
      title: 'Anterior',
      description: 'Anterior',
      completed: false,
      categoryId: 'c1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };
    const command: UpdateTaskCommand = {
      id: 't1',
      title: 'Actualizada',
      description: 'Nueva descripción',
      completed: true,
      categoryId: 'c2',
    };

    repository.getTaskById.and.resolveTo(existingTask);

    await useCase.execute(command);

    expect(repository.getTaskById).toHaveBeenCalledOnceWith('t1');
    expect(repository.updateTask).toHaveBeenCalledTimes(1);
    expect(repository.updateTask).toHaveBeenCalledWith({
      id: 't1',
      title: 'Actualizada',
      description: 'Nueva descripción',
      completed: true,
      categoryId: 'c2',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-07-08T15:00:00.000Z'),
    });
  });

  it('no debe actualizar si la tarea no existe', async () => {
    repository.getTaskById.and.resolveTo(null);

    await useCase.execute({
      id: 'missing',
      title: 'Actualizada',
      categoryId: 'c2',
      completed: true,
    });

    expect(repository.updateTask).not.toHaveBeenCalled();
  });
});
