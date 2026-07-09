import { inject, Injectable } from '@angular/core';

import { CategoryFacade } from '@features/categories/presentation/facades/category.facade';
import { IncrementalList } from '@shared/utils/incremental-list';

import { CreateTaskUseCase } from '../../domain/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '../../domain/use-cases/delete-task.use-case';
import { GetTasksUseCase } from '../../domain/use-cases/get-tasks.use-case';
import { TaskFacade } from '../facades/task.facade';
import { TaskPresentationMapper } from '../mappers/task-presentation.mapper';
import { EnrichedTaskViewModel } from '../models/enriched-task.viewmodel';

export interface TaskBenchmarkMetrics {
  readonly taskCount: number;
  readonly initialLoadMs: number;
  readonly searchMs: number;
  readonly filterMs: number;
  readonly visibleTaskCount: number;
}

const BENCHMARK_BATCH_SIZE = 100;

/**
 * Utilidad de desarrollo para medir rendimiento con grandes volúmenes de tareas.
 * No debe usarse en producción.
 */
@Injectable()
export class TaskBenchmarkService {
  private static readonly PAGE_SIZE = 30;

  private readonly createTaskUseCase = inject(CreateTaskUseCase);
  private readonly deleteTaskUseCase = inject(DeleteTaskUseCase);
  private readonly getTasksUseCase = inject(GetTasksUseCase);
  private readonly taskFacade = inject(TaskFacade);
  private readonly categoryFacade = inject(CategoryFacade);

  /**
   * Limpia las tareas existentes, siembra el volumen indicado y devuelve métricas.
   */
  async run(taskCount: number): Promise<TaskBenchmarkMetrics> {
    await this.categoryFacade.loadCategories();
    await this.clearTasks();
    await this.seedTasks(taskCount);

    const initial = await this.measureInitialLoad();

    return {
      taskCount,
      initialLoadMs: initial.durationMs,
      searchMs: this.measureSearch(),
      filterMs: this.measureFilter(),
      visibleTaskCount: initial.visibleTaskCount,
    };
  }

  private async clearTasks(): Promise<void> {
    const tasks = await this.getTasksUseCase.execute();
    await Promise.all(tasks.map((task) => this.deleteTaskUseCase.execute(task.id)));
  }

  private async seedTasks(count: number): Promise<void> {
    const categoryId = this.categoryFacade.categories[0]?.id ?? 'work';

    for (let index = 0; index < count; index += BENCHMARK_BATCH_SIZE) {
      const batch = Array.from(
        { length: Math.min(BENCHMARK_BATCH_SIZE, count - index) },
        (_, offset) => {
          const taskIndex = index + offset;
          return this.createTaskUseCase.execute({
            title: `Tarea benchmark ${taskIndex}`,
            description: `Descripción de prueba ${taskIndex}`,
            categoryId,
          });
        },
      );

      await Promise.all(batch);
    }
  }

  private async measureInitialLoad(): Promise<{
    durationMs: number;
    visibleTaskCount: number;
  }> {
    const start = performance.now();
    await this.taskFacade.loadTasks();
    await this.categoryFacade.loadCategories();
    const visibleTaskCount = this.applyIncrementalPresentation().visibleTaskCount;
    return {
      durationMs: performance.now() - start,
      visibleTaskCount,
    };
  }

  private measureSearch(): number {
    const start = performance.now();
    this.taskFacade.search('benchmark 42');
    this.applyIncrementalPresentation();
    return performance.now() - start;
  }

  private measureFilter(): number {
    const categoryId = this.categoryFacade.categories[0]?.id ?? 'work';
    const start = performance.now();
    this.taskFacade.selectCategory(categoryId);
    this.applyIncrementalPresentation();
    return performance.now() - start;
  }

  private applyIncrementalPresentation(): { visibleTaskCount: number } {
    const enrichedTasks = TaskPresentationMapper.toEnrichedViewModels(
      this.taskFacade.tasks,
      this.categoryFacade.categories,
    );
    const incrementalList = new IncrementalList<EnrichedTaskViewModel>(
      TaskBenchmarkService.PAGE_SIZE,
    );
    incrementalList.reset(enrichedTasks);

    return { visibleTaskCount: incrementalList.items.length };
  }
}
