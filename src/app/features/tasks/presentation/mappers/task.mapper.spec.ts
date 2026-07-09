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
      categoryLabel: 'Personal',
      completed: false,
      statusLabel: 'Pendiente',
      statusColor: 'medium',
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
        categoryLabel: 'Personal',
        completed: false,
        statusLabel: 'Pendiente',
        statusColor: 'medium',
      },
      {
        id: '2',
        title: 'Enviar reporte',
        description: 'Semanal',
        categoryId: 'work',
        categoryLabel: 'Trabajo',
        completed: true,
        statusLabel: 'Completada',
        statusColor: 'success',
      },
    ]);
  });

  it('mapea categoryLabel para categorías conocidas y desconocidas', () => {
    const shoppingTask: Task = {
      id: '1',
      title: 'Comprar leche',
      completed: false,
      categoryId: 'shopping',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };
    const unknownTask: Task = {
      id: '2',
      title: 'Otra tarea',
      completed: false,
      categoryId: 'custom-category',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    expect(TaskMapper.toViewModel(shoppingTask).categoryLabel).toBe('Compras');
    expect(TaskMapper.toViewModel(unknownTask).categoryLabel).toBe('custom-category');
  });

  it('mapea statusLabel y statusColor según el estado', () => {
    const pendingTask: Task = {
      id: '1',
      title: 'Pendiente',
      completed: false,
      categoryId: 'work',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };
    const completedTask: Task = {
      id: '2',
      title: 'Completada',
      completed: true,
      categoryId: 'work',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    expect(TaskMapper.toViewModel(pendingTask)).toEqual(
      jasmine.objectContaining({
        statusLabel: 'Pendiente',
        statusColor: 'medium',
      }),
    );
    expect(TaskMapper.toViewModel(completedTask)).toEqual(
      jasmine.objectContaining({
        statusLabel: 'Completada',
        statusColor: 'success',
      }),
    );
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
