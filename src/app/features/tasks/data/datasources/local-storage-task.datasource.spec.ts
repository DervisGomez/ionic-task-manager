import { Task } from '@features/tasks/domain/entities/task.model';

import { LocalStorageTaskDataSource } from './local-storage-task.datasource';

describe('LocalStorageTaskDataSource', () => {
  let dataSource: LocalStorageTaskDataSource;

  const task: Task = {
    id: 't1',
    title: 'Task 1',
    description: 'Description',
    completed: false,
    categoryId: 'c1',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  };

  beforeEach(() => {
    dataSource = new LocalStorageTaskDataSource();
    localStorage.clear();
  });

  it('load debe devolver null cuando no hay datos', () => {
    expect(dataSource.load()).toBeNull();
  });

  it('save y load deben persistir y recuperar tareas', () => {
    dataSource.save([task]);

    const loaded = dataSource.load();
    expect(loaded).toEqual([task]);
  });

  it('clear debe eliminar los datos persistidos', () => {
    dataSource.save([task]);
    dataSource.clear();

    expect(dataSource.load()).toBeNull();
    expect(localStorage.getItem('task-manager.tasks')).toBeNull();
  });

  it('load debe devolver null con JSON inválido', () => {
    localStorage.setItem('task-manager.tasks', '{invalid-json');

    expect(dataSource.load()).toBeNull();
  });

  it('load debe devolver null cuando el contenido no es un arreglo', () => {
    localStorage.setItem('task-manager.tasks', JSON.stringify({ id: 't1' }));

    expect(dataSource.load()).toBeNull();
  });

  it('load debe devolver null cuando un elemento es inválido', () => {
    localStorage.setItem(
      'task-manager.tasks',
      JSON.stringify([
        {
          id: 't1',
          title: 'Task 1',
          completed: 'false',
          categoryId: 'c1',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-02T00:00:00.000Z',
        },
      ]),
    );

    expect(dataSource.load()).toBeNull();
  });

  it('save no debe lanzar excepciones cuando localStorage falla', () => {
    spyOn(Storage.prototype, 'setItem').and.throwError('Quota exceeded');

    expect(() => dataSource.save([task])).not.toThrow();
  });
});
