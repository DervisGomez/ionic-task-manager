import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

import { TaskBenchmarkMetrics, TaskBenchmarkService } from './task-benchmark.service';

const BENCHMARK_PRESETS = [100, 500, 1000, 5000] as const;

@Component({
  selector: 'app-task-benchmark-panel',
  templateUrl: './task-benchmark-panel.component.html',
  styleUrls: ['./task-benchmark-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TaskBenchmarkPanelComponent {
  readonly presets = BENCHMARK_PRESETS;

  isRunning = false;

  lastResult: TaskBenchmarkMetrics | null = null;

  errorMessage: string | null = null;

  private readonly benchmarkService = inject(TaskBenchmarkService);
  private readonly cdr = inject(ChangeDetectorRef);

  async runBenchmark(taskCount: number): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.errorMessage = null;
    this.cdr.markForCheck();

    try {
      this.lastResult = await this.benchmarkService.run(taskCount);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : String(error);
    } finally {
      this.isRunning = false;
      this.cdr.markForCheck();
    }
  }
}
