import { TaskRepository } from '../repositories/task.repository';
import { DeleteTaskUseCase } from './delete-task.use-case';

describe('DeleteTaskUseCase', () => {
  let repository: jasmine.SpyObj<TaskRepository>;
  let useCase: DeleteTaskUseCase;

  beforeEach(() => {
    repository = jasmine.createSpyObj<TaskRepository>('TaskRepository', ['deleteTask']);
    repository.deleteTask.and.resolveTo();

    useCase = new DeleteTaskUseCase(repository);
  });

  it('debe delegar la eliminación al repositorio', async () => {
    await useCase.execute('t1');

    expect(repository.deleteTask).toHaveBeenCalledOnceWith('t1');
  });
});
