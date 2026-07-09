/**
 * Gestiona una colección incremental en memoria sin dependencias de framework.
 * Expone únicamente un subconjunto visible que crece por páginas de tamaño fijo.
 */
export class IncrementalList<T> {
  private source: readonly T[] = [];

  private visibleCount = 0;

  constructor(private readonly pageSize: number) {
    if (pageSize < 1) {
      throw new Error('pageSize must be at least 1');
    }
  }

  /**
   * Reinicia la colección y muestra la primera página.
   */
  reset(items: readonly T[]): void {
    this.source = items;
    this.visibleCount = Math.min(this.pageSize, items.length);
  }

  /**
   * Elementos visibles actualmente.
   */
  get items(): readonly T[] {
    return this.source.slice(0, this.visibleCount);
  }

  /**
   * Total de elementos en la colección fuente.
   */
  get total(): number {
    return this.source.length;
  }

  /**
   * Indica si quedan elementos por cargar.
   */
  get hasMore(): boolean {
    return this.visibleCount < this.source.length;
  }

  /**
   * Carga la siguiente página de elementos visibles.
   */
  loadMore(): void {
    if (!this.hasMore) {
      return;
    }

    this.visibleCount = Math.min(this.visibleCount + this.pageSize, this.source.length);
  }
}
