import { TestBed } from '@angular/core/testing';

import { CATEGORIES_PROVIDERS } from '@features/categories/categories.providers';
import { TASKS_PROVIDERS } from '@features/tasks/tasks.providers';

import { TaskBenchmarkService } from './task-benchmark.service';

describe('TaskBenchmarkService', () => {
  let service: TaskBenchmarkService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [...TASKS_PROVIDERS, ...CATEGORIES_PROVIDERS, TaskBenchmarkService],
    });

    service = TestBed.inject(TaskBenchmarkService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('mide carga, búsqueda y filtrado con 100 tareas', async () => {
    const metrics = await service.run(100);

    expect(metrics.taskCount).toBe(100);
    expect(metrics.visibleTaskCount).toBe(30);
    expect(metrics.initialLoadMs).toBeGreaterThanOrEqual(0);
    expect(metrics.searchMs).toBeGreaterThanOrEqual(0);
    expect(metrics.filterMs).toBeGreaterThanOrEqual(0);
  });

  xit('documenta métricas de rendimiento (habilitar manualmente)', async () => {
    for (const count of [100, 500, 1000, 5000]) {
      const metrics = await service.run(count);
      // eslint-disable-next-line no-console
      console.log(`BENCHMARK_${count}`, JSON.stringify(metrics));
      expect(metrics.taskCount).toBe(count);
      expect(metrics.visibleTaskCount).toBe(Math.min(30, count));
    }
  }, 600000);
});
