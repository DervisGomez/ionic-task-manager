import { TestBed } from '@angular/core/testing';

import { Task } from '../../domain/entities/task.model';
import { CreateTaskUseCase } from '../../domain/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '../../domain/use-cases/delete-task.use-case';
import { GetTasksUseCase } from '../../domain/use-cases/get-tasks.use-case';
import { UpdateTaskUseCase } from '../../domain/use-cases/update-task.use-case';
import { TaskFacade } from './task.facade';

describe('TaskFacade', () => {
  let facade: TaskFacade;
  let getTasksUseCase: jasmine.SpyObj<GetTasksUseCase>;
  let updateTaskUseCase: jasmine.SpyObj<UpdateTaskUseCase>;
  let deleteTaskUseCase: jasmine.SpyObj<DeleteTaskUseCase>;

  const task: Task = {
    id: 'task-1',
    title: 'Planificar sprint',
    description: 'Definir alcance',
    completed: false,
    categoryId: 'work',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  };

  const anotherTask: Task = {
    id: 'task-2',
    title: 'Comprar pan',
    description: 'Integral urgente',
    completed: false,
    categoryId: 'personal',
    createdAt: new Date('2026-01-03T00:00:00.000Z'),
    updatedAt: new Date('2026-01-04T00:00:00.000Z'),
  };

  beforeEach(() => {
    getTasksUseCase = jasmine.createSpyObj<GetTasksUseCase>('GetTasksUseCase', ['execute']);
    updateTaskUseCase = jasmine.createSpyObj<UpdateTaskUseCase>('UpdateTaskUseCase', ['execute']);
    deleteTaskUseCase = jasmine.createSpyObj<DeleteTaskUseCase>('DeleteTaskUseCase', ['execute']);

    getTasksUseCase.execute.and.resolveTo([task, anotherTask]);
    updateTaskUseCase.execute.and.resolveTo();
    deleteTaskUseCase.execute.and.resolveTo();

    TestBed.configureTestingModule({
      providers: [
        TaskFacade,
        {
          provide: CreateTaskUseCase,
          useValue: jasmine.createSpyObj('CreateTaskUseCase', ['execute']),
        },
        { provide: GetTasksUseCase, useValue: getTasksUseCase },
        { provide: UpdateTaskUseCase, useValue: updateTaskUseCase },
        { provide: DeleteTaskUseCase, useValue: deleteTaskUseCase },
      ],
    });

    facade = TestBed.inject(TaskFacade);
  });

  it('toggleCompleted llama UpdateTaskUseCase', async () => {
    await facade.loadTasks();
    spyOn(facade, 'loadTasks').and.resolveTo();

    await facade.toggleCompleted(task.id);

    expect(updateTaskUseCase.execute).toHaveBeenCalledOnceWith({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: true,
      categoryId: task.categoryId,
    });
  });

  it('después llama loadTasks', async () => {
    await facade.loadTasks();
    spyOn(facade, 'loadTasks').and.resolveTo();

    await facade.toggleCompleted(task.id);

    expect(facade.loadTasks).toHaveBeenCalledTimes(1);
  });

  it('deleteTask llama DeleteTaskUseCase', async () => {
    spyOn(facade, 'loadTasks').and.resolveTo();

    await facade.deleteTask(task.id);

    expect(deleteTaskUseCase.execute).toHaveBeenCalledOnceWith(task.id);
  });

  it('deleteTask recarga las tareas', async () => {
    spyOn(facade, 'loadTasks').and.resolveTo();

    await facade.deleteTask(task.id);

    expect(facade.loadTasks).toHaveBeenCalledTimes(1);
  });

  it('búsqueda vacía devuelve todas las tareas', async () => {
    await facade.loadTasks();

    facade.search('');

    expect(facade.tasks).toHaveSize(2);
  });

  it('búsqueda por título filtra las tareas', async () => {
    await facade.loadTasks();

    facade.search('pan');

    expect(facade.tasks).toHaveSize(1);
    expect(facade.tasks[0].title).toBe('Comprar pan');
  });

  it('búsqueda por descripción filtra las tareas', async () => {
    await facade.loadTasks();

    facade.search('urgente');

    expect(facade.tasks).toHaveSize(1);
    expect(facade.tasks[0].title).toBe('Comprar pan');
  });

  it('búsqueda sin resultados devuelve un listado vacío', async () => {
    await facade.loadTasks();

    facade.search('inexistente');

    expect(facade.tasks).toHaveSize(0);
    expect(facade.hasAnyTasks).toBeTrue();
  });

  it('hasAnyTasks es false cuando no hay tareas cargadas', async () => {
    getTasksUseCase.execute.and.resolveTo([]);

    await facade.loadTasks();

    expect(facade.hasAnyTasks).toBeFalse();
    expect(facade.tasks).toHaveSize(0);
  });

  it('categoría "all" devuelve todas las tareas', async () => {
    await facade.loadTasks();

    facade.selectCategory('all');

    expect(facade.tasks).toHaveSize(2);
  });

  it('categoría específica devuelve únicamente esa categoría', async () => {
    await facade.loadTasks();

    facade.selectCategory('work');

    expect(facade.tasks).toHaveSize(1);
    expect(facade.tasks[0].categoryId).toBe('work');
  });

  it('búsqueda y categoría funcionan simultáneamente', async () => {
    await facade.loadTasks();

    facade.selectCategory('personal');
    facade.search('urgente');

    expect(facade.tasks).toHaveSize(1);
    expect(facade.tasks[0].title).toBe('Comprar pan');
    expect(facade.tasks[0].categoryId).toBe('personal');
  });

  it('updateTask llama UpdateTaskUseCase', async () => {
    await facade.loadTasks();
    spyOn(facade, 'loadTasks').and.resolveTo();

    const command = {
      title: 'Sprint actualizado',
      description: 'Nuevo alcance',
      categoryId: 'work',
    };

    await facade.updateTask(task.id, command);

    expect(updateTaskUseCase.execute).toHaveBeenCalledOnceWith({
      id: task.id,
      title: command.title,
      description: command.description,
      completed: task.completed,
      categoryId: command.categoryId,
    });
  });

  it('updateTask recarga las tareas', async () => {
    await facade.loadTasks();
    spyOn(facade, 'loadTasks').and.resolveTo();

    await facade.updateTask(task.id, {
      title: 'Sprint actualizado',
      description: 'Nuevo alcance',
      categoryId: 'work',
    });

    expect(facade.loadTasks).toHaveBeenCalledTimes(1);
  });
});
