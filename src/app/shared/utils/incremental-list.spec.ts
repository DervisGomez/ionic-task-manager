import { IncrementalList } from './incremental-list';

describe('IncrementalList', () => {
  const pageSize = 30;

  it('reset() expone la primera página', () => {
    const list = new IncrementalList<number>(pageSize);
    const items = Array.from({ length: 100 }, (_, index) => index);

    list.reset(items);

    expect(list.total).toBe(100);
    expect(list.items).toEqual(items.slice(0, pageSize));
    expect(list.hasMore).toBeTrue();
  });

  it('loadMore() añade PAGE_SIZE elementos adicionales', () => {
    const list = new IncrementalList<number>(pageSize);
    const items = Array.from({ length: 100 }, (_, index) => index);

    list.reset(items);
    list.loadMore();

    expect(list.items).toEqual(items.slice(0, pageSize * 2));
    expect(list.hasMore).toBeTrue();
  });

  it('hasMore es false cuando se muestran todos los elementos', () => {
    const list = new IncrementalList<number>(pageSize);
    const items = Array.from({ length: 45 }, (_, index) => index);

    list.reset(items);
    list.loadMore();

    expect(list.items).toHaveSize(45);
    expect(list.hasMore).toBeFalse();
  });

  it('items refleja el subconjunto visible tras múltiples loadMore()', () => {
    const list = new IncrementalList<number>(pageSize);
    const items = Array.from({ length: 95 }, (_, index) => index);

    list.reset(items);
    list.loadMore();
    list.loadMore();
    list.loadMore();

    expect(list.items).toEqual(items);
    expect(list.total).toBe(95);
    expect(list.hasMore).toBeFalse();
  });

  it('reset() con menos elementos que pageSize muestra todos sin hasMore', () => {
    const list = new IncrementalList<number>(pageSize);
    const items = [1, 2, 3];

    list.reset(items);

    expect(list.items).toEqual(items);
    expect(list.total).toBe(3);
    expect(list.hasMore).toBeFalse();
  });

  it('loadMore() no hace nada cuando hasMore es false', () => {
    const list = new IncrementalList<number>(pageSize);
    const items = [1, 2, 3];

    list.reset(items);
    list.loadMore();

    expect(list.items).toEqual(items);
    expect(list.hasMore).toBeFalse();
  });

  it('reset() con colección vacía deja items vacío', () => {
    const list = new IncrementalList<number>(pageSize);

    list.reset([]);

    expect(list.items).toEqual([]);
    expect(list.total).toBe(0);
    expect(list.hasMore).toBeFalse();
  });
});
