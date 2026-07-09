import { Task } from '../../domain/entities/task.model';
import { TaskMapper } from './task.mapper';

describe('TaskMapper', () => {
  it('mapea una tarea a TaskViewModel', () => {
    const task: Task = {
      id: '1',
      title: 'Comprar pan',
      description: 'Integral',
      completed: false,
      categoryId: 'personal',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const viewModel = TaskMapper.toViewModel(task);

    expect(viewModel).toEqual({
      id: '1',
      title: 'Comprar pan',
      description: 'Integral',
      categoryId: 'personal',
      completed: false,
    });
  });

  it('mapea múltiples tareas a TaskViewModel[]', () => {
    const tasks: readonly Task[] = [
      {
        id: '1',
        title: 'Comprar pan',
        description: 'Integral',
        completed: false,
        categoryId: 'personal',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      },
      {
        id: '2',
        title: 'Enviar reporte',
        description: 'Semanal',
        completed: true,
        categoryId: 'work',
        createdAt: new Date('2026-02-01T00:00:00.000Z'),
        updatedAt: new Date('2026-02-02T00:00:00.000Z'),
      },
    ];

    const viewModels = TaskMapper.toViewModels(tasks);

    expect(viewModels).toEqual([
      {
        id: '1',
        title: 'Comprar pan',
        description: 'Integral',
        categoryId: 'personal',
        completed: false,
      },
      {
        id: '2',
        title: 'Enviar reporte',
        description: 'Semanal',
        categoryId: 'work',
        completed: true,
      },
    ]);
  });

  it('no modifica la entidad original', () => {
    const originalTask: Task = {
      id: '1',
      title: 'Comprar pan',
      description: 'Integral',
      completed: false,
      categoryId: 'personal',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };
    const snapshot = { ...originalTask };

    TaskMapper.toViewModel(originalTask);

    expect(originalTask).toEqual(snapshot);
  });
});
