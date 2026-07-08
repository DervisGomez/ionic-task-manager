import { CreateTaskCommand } from '../commands/create-task.command';
import { Task } from '../entities/task.model';
import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskUseCase } from './create-task.use-case';

describe('CreateTaskUseCase', () => {
  const generatedId = '11111111-1111-4111-8111-111111111111';

  let repository: jasmine.SpyObj<TaskRepository>;
  let useCase: CreateTaskUseCase;

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2026-07-08T14:00:00.000Z'));

    repository = jasmine.createSpyObj<TaskRepository>('TaskRepository', ['createTask']);
    repository.createTask.and.resolveTo();

    useCase = new CreateTaskUseCase(repository);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('debe generar id, timestamps y completed=false antes de crear la tarea', async () => {
    spyOn(crypto, 'randomUUID').and.returnValue(generatedId);

    const command: CreateTaskCommand = {
      title: 'Nueva tarea',
      description: 'Descripción',
      categoryId: 'cat-1',
    };

    await useCase.execute(command);

    expect(repository.createTask).toHaveBeenCalledTimes(1);

    const createdTask = repository.createTask.calls.mostRecent().args[0] as Task;
    expect(createdTask.id).toBe(generatedId);
    expect(createdTask.title).toBe(command.title);
    expect(createdTask.description).toBe(command.description);
    expect(createdTask.categoryId).toBe(command.categoryId);
    expect(createdTask.completed).toBeFalse();
    expect(createdTask.createdAt).toEqual(new Date('2026-07-08T14:00:00.000Z'));
    expect(createdTask.updatedAt).toEqual(new Date('2026-07-08T14:00:00.000Z'));
  });

  it('debe llamar al repositorio con la nueva entidad', async () => {
    spyOn(crypto, 'randomUUID').and.returnValue(generatedId);

    await useCase.execute({
      title: 'Nueva tarea',
      categoryId: 'cat-1',
    });

    expect(repository.createTask).toHaveBeenCalled();
  });
});
