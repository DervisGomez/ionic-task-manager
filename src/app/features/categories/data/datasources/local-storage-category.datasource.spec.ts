import { Category } from '@features/categories/domain/entities/category.model';

import { LocalStorageCategoryDataSource } from './local-storage-category.datasource';

describe('LocalStorageCategoryDataSource', () => {
  let dataSource: LocalStorageCategoryDataSource;

  const category: Category = {
    id: 'c1',
    name: 'Category 1',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  };

  beforeEach(() => {
    dataSource = new LocalStorageCategoryDataSource();
    localStorage.clear();
  });

  it('load debe devolver null cuando no hay datos', () => {
    expect(dataSource.load()).toBeNull();
  });

  it('save y load deben persistir y recuperar categorías', () => {
    dataSource.save([category]);

    const loaded = dataSource.load();
    expect(loaded).toEqual([category]);
  });

  it('clear debe eliminar los datos persistidos', () => {
    dataSource.save([category]);
    dataSource.clear();

    expect(dataSource.load()).toBeNull();
    expect(localStorage.getItem('task-manager.categories')).toBeNull();
  });

  it('load debe devolver null con JSON inválido', () => {
    localStorage.setItem('task-manager.categories', '{invalid-json');

    expect(dataSource.load()).toBeNull();
  });

  it('load debe devolver null cuando el contenido no es un arreglo', () => {
    localStorage.setItem('task-manager.categories', JSON.stringify({ id: 'c1' }));

    expect(dataSource.load()).toBeNull();
  });

  it('load debe devolver null cuando un elemento es inválido', () => {
    localStorage.setItem(
      'task-manager.categories',
      JSON.stringify([
        {
          id: 'c1',
          name: 123,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-02T00:00:00.000Z',
        },
      ]),
    );

    expect(dataSource.load()).toBeNull();
  });

  it('save no debe lanzar excepciones cuando localStorage falla', () => {
    spyOn(Storage.prototype, 'setItem').and.throwError('Quota exceeded');

    expect(() => dataSource.save([category])).not.toThrow();
  });
});
