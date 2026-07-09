import { CategoryViewModel } from '@features/categories/presentation/models/category.viewmodel';

import { TaskViewModel } from '../models/task.viewmodel';
import { TaskPresentationMapper } from './task-presentation.mapper';

describe('TaskPresentationMapper', () => {
  const categories: readonly CategoryViewModel[] = [
    { id: 'personal', name: 'Personal' },
    { id: 'work', name: 'Trabajo' },
    { id: 'shopping', name: 'Compras' },
  ];

  it('enriquece una tarea con categoryLabel y estado visual', () => {
    const task: TaskViewModel = {
      id: '1',
      title: 'Comprar pan',
      description: 'Integral',
      completed: false,
      categoryId: 'personal',
    };

    const viewModel = TaskPresentationMapper.toEnrichedViewModel(task, categories);

    expect(viewModel).toEqual({
      id: '1',
      title: 'Comprar pan',
      description: 'Integral',
      completed: false,
      categoryId: 'personal',
      categoryLabel: 'Personal',
      statusLabel: 'Pendiente',
      statusColor: 'medium',
    });
  });

  it('enriquece múltiples tareas', () => {
    const tasks: readonly TaskViewModel[] = [
      {
        id: '1',
        title: 'Comprar pan',
        description: 'Integral',
        completed: false,
        categoryId: 'personal',
      },
      {
        id: '2',
        title: 'Enviar reporte',
        description: 'Semanal',
        completed: true,
        categoryId: 'work',
      },
    ];

    const viewModels = TaskPresentationMapper.toEnrichedViewModels(tasks, categories);

    expect(viewModels).toEqual([
      {
        id: '1',
        title: 'Comprar pan',
        description: 'Integral',
        completed: false,
        categoryId: 'personal',
        categoryLabel: 'Personal',
        statusLabel: 'Pendiente',
        statusColor: 'medium',
      },
      {
        id: '2',
        title: 'Enviar reporte',
        description: 'Semanal',
        completed: true,
        categoryId: 'work',
        categoryLabel: 'Trabajo',
        statusLabel: 'Completada',
        statusColor: 'success',
      },
    ]);
  });

  it('resuelve categoryLabel para categorías conocidas y desconocidas', () => {
    const shoppingTask: TaskViewModel = {
      id: '1',
      title: 'Comprar leche',
      description: '',
      completed: false,
      categoryId: 'shopping',
    };
    const unknownTask: TaskViewModel = {
      id: '2',
      title: 'Otra tarea',
      description: '',
      completed: false,
      categoryId: 'custom-category',
    };

    expect(TaskPresentationMapper.toEnrichedViewModel(shoppingTask, categories).categoryLabel).toBe(
      'Compras',
    );
    expect(TaskPresentationMapper.toEnrichedViewModel(unknownTask, categories).categoryLabel).toBe(
      'custom-category',
    );
  });

  it('mapea statusLabel y statusColor según el estado', () => {
    const pendingTask: TaskViewModel = {
      id: '1',
      title: 'Pendiente',
      description: '',
      completed: false,
      categoryId: 'work',
    };
    const completedTask: TaskViewModel = {
      id: '2',
      title: 'Completada',
      description: '',
      completed: true,
      categoryId: 'work',
    };

    expect(TaskPresentationMapper.toEnrichedViewModel(pendingTask, categories)).toEqual(
      jasmine.objectContaining({
        statusLabel: 'Pendiente',
        statusColor: 'medium',
      }),
    );
    expect(TaskPresentationMapper.toEnrichedViewModel(completedTask, categories)).toEqual(
      jasmine.objectContaining({
        statusLabel: 'Completada',
        statusColor: 'success',
      }),
    );
  });
});
