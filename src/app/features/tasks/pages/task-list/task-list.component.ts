import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent, ViewWillEnter } from '@ionic/angular';

import { RemoteConfigKeys } from '@core/firebase/remote-config.keys';
import { RemoteConfigService } from '@core/firebase/services/remote-config.service';
import { CategoryFacade } from '@features/categories/presentation/facades/category.facade';
import { CategoryViewModel } from '@features/categories/presentation/models/category.viewmodel';
import { environment } from '@env/environment';
import { IncrementalList } from '@shared/utils/incremental-list';

import { CreateTaskCommand } from '../../domain/commands/create-task.command';
import { TaskPresentationMapper } from '../../presentation/mappers/task-presentation.mapper';
import { TaskFacade } from '../../presentation/facades/task.facade';
import { EnrichedTaskViewModel } from '../../presentation/models/enriched-task.viewmodel';
import { TaskViewModel } from '../../presentation/models/task.viewmodel';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TaskListComponent implements ViewWillEnter {
  private static readonly PAGE_SIZE = 30;

  readonly isProduction = environment.production;

  isCreateModalOpen = false;

  editingTask: TaskViewModel | null = null;

  toastOpen = false;

  toastMessage = '';

  toastColor: 'success' | 'danger' = 'success';

  categories: readonly CategoryViewModel[] = [];

  visibleTasks: readonly EnrichedTaskViewModel[] = [];

  hasTasks = false;

  hasAnyTasks = false;

  showNoTasksEmptyState = false;

  showNoResultsEmptyState = false;

  hasMoreVisibleTasks = false;

  showInfiniteScroll = false;

  searchTerm = '';

  selectedCategory = 'all';

  isCategoriesAdminEnabled = false;

  private readonly incrementalList = new IncrementalList<EnrichedTaskViewModel>(
    TaskListComponent.PAGE_SIZE,
  );

  private readonly taskFacade = inject(TaskFacade);
  private readonly categoryFacade = inject(CategoryFacade);
  private readonly alertController = inject(AlertController);
  private readonly router = inject(Router);
  private readonly remoteConfig = inject(RemoteConfigService);
  private readonly cdr = inject(ChangeDetectorRef);

  async ionViewWillEnter(): Promise<void> {
    await this.taskFacade.loadTasks();
    await this.categoryFacade.loadCategories();
    this.syncViewState();
  }

  trackByTaskId(_index: number, task: EnrichedTaskViewModel): string {
    return task.id;
  }

  onCategorySelected(id: string): void {
    this.taskFacade.selectCategory(id);
    this.syncViewState();
  }

  onSearchChanged(value: string): void {
    this.taskFacade.search(value);
    this.syncViewState();
  }

  clearFilters(): void {
    this.taskFacade.search('');
    this.taskFacade.selectCategory('all');
    this.syncViewState();
  }

  onLoadMore(event: InfiniteScrollCustomEvent): void {
    this.loadMoreTasks();
    void event.target.complete();
  }

  loadMoreTasks(): void {
    this.incrementalList.loadMore();
    this.refreshVisibleTasks();
  }

  navigateToCategories(): void {
    if (!this.isCategoriesAdminEnabled) {
      return;
    }

    void this.router.navigate(['/categories']);
  }

  openCreateModal(): void {
    this.editingTask = null;
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
    this.editingTask = null;
  }

  async onSubmitTask(command: CreateTaskCommand): Promise<void> {
    try {
      if (this.editingTask === null) {
        await this.taskFacade.createTask(command);
        this.showToast('Tarea creada correctamente');
      } else {
        await this.taskFacade.updateTask(this.editingTask.id, command);
        this.showToast('Tarea actualizada correctamente');
      }

      this.closeCreateModal();
      this.syncViewState();
    } catch {
      this.showToast('No fue posible completar la operación', 'danger');
    }
  }

  async onToggleCompleted(id: string): Promise<void> {
    await this.taskFacade.toggleCompleted(id);
    this.syncViewState();
  }

  onEditTask(id: string): void {
    const task = this.taskFacade.tasks.find((item) => item.id === id);
    if (!task) return;

    this.editingTask = task;
    this.isCreateModalOpen = true;
  }

  async onDeleteTask(id: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar tarea',
      message: '¿Estás seguro de que deseas eliminar esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.confirmDeleteTask(id);
          },
        },
      ],
    });

    await alert.present();
  }

  private async confirmDeleteTask(id: string): Promise<void> {
    try {
      await this.taskFacade.deleteTask(id);
      this.showToast('Tarea eliminada correctamente');
      this.syncViewState();
    } catch {
      this.showToast('No fue posible completar la operación', 'danger');
    }
  }

  private showToast(message: string, color: 'success' | 'danger' = 'success'): void {
    this.toastMessage = message;
    this.toastColor = color;
    this.toastOpen = true;
    this.cdr.markForCheck();
  }

  private syncViewState(): void {
    this.isCategoriesAdminEnabled = this.remoteConfig.getBoolean(RemoteConfigKeys.enableCategories);
    this.categories = this.categoryFacade.categories;
    const enrichedTasks = TaskPresentationMapper.toEnrichedViewModels(
      this.taskFacade.tasks,
      this.categories,
    );
    this.incrementalList.reset(enrichedTasks);
    this.hasAnyTasks = this.taskFacade.hasAnyTasks;
    this.hasTasks = enrichedTasks.length > 0;
    this.showNoTasksEmptyState = !this.hasAnyTasks;
    this.showNoResultsEmptyState = this.hasAnyTasks && !this.hasTasks;
    this.searchTerm = this.taskFacade.searchTerm;
    this.selectedCategory = this.taskFacade.selectedCategory;
    this.refreshVisibleTasks();
  }

  private refreshVisibleTasks(): void {
    this.visibleTasks = this.incrementalList.items;
    this.hasMoreVisibleTasks = this.incrementalList.hasMore;
    this.showInfiniteScroll = this.incrementalList.total > TaskListComponent.PAGE_SIZE;
    this.cdr.markForCheck();
  }
}
