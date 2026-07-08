import { Task } from '@features/tasks/domain/entities/task.model';

import { InMemoryTaskRepository } from './in-memory-task.repository';

describe('InMemoryTaskRepository', () => {
  let repository: InMemoryTaskRepository;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
  });

  it('debe iniciar vacío', async () => {
    const tasks = await repository.getTasks();
    expect(tasks).toEqual([]);
  });

  it('createTask debe agregar una tarea', async () => {
    const task: Task = {
      id: 't1',
      title: 'Task 1',
      completed: false,
      categoryId: 'c1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    await repository.createTask(task);

    const tasks = await repository.getTasks();
    expect(tasks).toHaveSize(1);
    expect(tasks[0]).toEqual(task);
  });

  it('getTaskById debe devolver una tarea existente', async () => {
    const task: Task = {
      id: 't1',
      title: 'Task 1',
      completed: true,
      categoryId: 'c1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      description: 'desc',
    };

    await repository.createTask(task);

    const found = await repository.getTaskById('t1');
    expect(found).toEqual(task);
  });

  it('getTasks no debe exponer el arreglo interno', async () => {
    const task: Task = {
      id: 't1',
      title: 'Task 1',
      completed: false,
      categoryId: 'c1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    await repository.createTask(task);

    const tasks = await repository.getTasks();
    (tasks as Task[]).push({
      ...task,
      id: 't2',
      title: 'Task 2',
    });

    const nextTasks = await repository.getTasks();
    expect(nextTasks).toHaveSize(1);
    expect(nextTasks[0]?.id).toBe('t1');
  });

  it('getTaskById debe devolver una copia aislada', async () => {
    const task: Task = {
      id: 't1',
      title: 'Task 1',
      completed: false,
      categoryId: 'c1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    await repository.createTask(task);

    const found = (await repository.getTaskById('t1')) as Task;
    (found as { title: string }).title = 'Mutated';

    const reloaded = await repository.getTaskById('t1');
    expect(reloaded?.title).toBe('Task 1');
  });

  it('getTaskById debe devolver null cuando no existe', async () => {
    const found = await repository.getTaskById('missing');
    expect(found).toBeNull();
  });

  it('updateTask debe reemplazar una tarea por id', async () => {
    const original: Task = {
      id: 't1',
      title: 'Original',
      completed: false,
      categoryId: 'c1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const updated: Task = {
      id: 't1',
      title: 'Updated',
      completed: true,
      categoryId: 'c2',
      createdAt: original.createdAt,
      updatedAt: new Date('2026-01-03T00:00:00.000Z'),
    };

    await repository.createTask(original);
    await repository.updateTask(updated);

    const found = await repository.getTaskById('t1');
    expect(found).toEqual(updated);
  });

  it('deleteTask debe eliminar una tarea', async () => {
    const task1: Task = {
      id: 't1',
      title: 'Task 1',
      completed: false,
      categoryId: 'c1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };
    const task2: Task = {
      id: 't2',
      title: 'Task 2',
      completed: false,
      categoryId: 'c1',
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    await repository.createTask(task1);
    await repository.createTask(task2);

    await repository.deleteTask('t1');

    const tasks = await repository.getTasks();
    expect(tasks).toHaveSize(1);
    expect(tasks[0]).toEqual(task2);
  });
});
