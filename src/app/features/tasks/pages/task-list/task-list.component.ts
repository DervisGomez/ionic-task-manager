import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ViewWillEnter } from '@ionic/angular';

import { CategoryFacade } from '@features/categories/presentation/facades/category.facade';
import { CategoryViewModel } from '@features/categories/presentation/models/category.viewmodel';

import { CreateTaskCommand } from '../../domain/commands/create-task.command';
import { TaskPresentationMapper } from '../../presentation/mappers/task-presentation.mapper';
import { TaskFacade } from '../../presentation/facades/task.facade';
import { EnrichedTaskViewModel } from '../../presentation/models/enriched-task.viewmodel';
import { TaskViewModel } from '../../presentation/models/task.viewmodel';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: false,
})
export class TaskListComponent implements ViewWillEnter {
  isCreateModalOpen = false;

  editingTask: TaskViewModel | null = null;

  toastOpen = false;

  toastMessage = '';

  toastColor: 'success' | 'danger' = 'success';

  private readonly taskFacade = inject(TaskFacade);
  private readonly categoryFacade = inject(CategoryFacade);
  private readonly alertController = inject(AlertController);
  private readonly router = inject(Router);

  async ionViewWillEnter(): Promise<void> {
    await this.taskFacade.loadTasks();
    await this.categoryFacade.loadCategories();
  }

  get categories(): readonly CategoryViewModel[] {
    return this.categoryFacade.categories;
  }

  get enrichedTasks(): readonly EnrichedTaskViewModel[] {
    return TaskPresentationMapper.toEnrichedViewModels(this.taskFacade.tasks, this.categories);
  }

  get hasTasks(): boolean {
    return this.taskFacade.tasks.length > 0;
  }

  get searchTerm(): string {
    return this.taskFacade.searchTerm;
  }

  get selectedCategory(): string {
    return this.taskFacade.selectedCategory;
  }

  trackByTaskId(_index: number, task: EnrichedTaskViewModel): string {
    return task.id;
  }

  onCategorySelected(id: string): void {
    this.taskFacade.selectCategory(id);
  }

  onSearchChanged(value: string): void {
    this.taskFacade.search(value);
  }

  navigateToCategories(): void {
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
    } catch {
      this.showToast('No fue posible completar la operación', 'danger');
    }
  }

  async onToggleCompleted(id: string): Promise<void> {
    await this.taskFacade.toggleCompleted(id);
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
    } catch {
      this.showToast('No fue posible completar la operación', 'danger');
    }
  }

  private showToast(message: string, color: 'success' | 'danger' = 'success'): void {
    this.toastMessage = message;
    this.toastColor = color;
    this.toastOpen = true;
  }
}
