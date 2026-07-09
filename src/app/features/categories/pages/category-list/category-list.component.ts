import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ViewWillEnter } from '@ionic/angular';

import { CreateCategoryCommand } from '../../domain/commands/create-category.command';
import { CategoryFacade } from '../../presentation/facades/category.facade';
import { CategoryViewModel } from '../../presentation/models/category.viewmodel';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CategoryListComponent implements ViewWillEnter {
  isCreateModalOpen = false;

  editingCategory: CategoryViewModel | null = null;

  toastOpen = false;

  toastMessage = '';

  toastColor: 'success' | 'danger' = 'success';

  categories: readonly CategoryViewModel[] = [];

  loading = false;

  error: string | null = null;

  hasCategories = false;

  showContent = false;

  private readonly categoryFacade = inject(CategoryFacade);
  private readonly alertController = inject(AlertController);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  async ionViewWillEnter(): Promise<void> {
    await this.categoryFacade.loadCategories();
    this.syncViewState();
  }

  trackByCategoryId(_index: number, category: CategoryViewModel): string {
    return category.id;
  }

  navigateToTasks(): void {
    void this.router.navigate(['/tasks']);
  }

  openCreateModal(): void {
    this.editingCategory = null;
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
    this.editingCategory = null;
  }

  async onSubmitCategory(command: CreateCategoryCommand): Promise<void> {
    try {
      if (this.editingCategory === null) {
        await this.categoryFacade.createCategory(command);
        this.showToast('Categoría creada correctamente');
      } else {
        await this.categoryFacade.updateCategory(this.editingCategory.id, command);
        this.showToast('Categoría actualizada correctamente');
      }

      this.closeCreateModal();
      this.syncViewState();
    } catch {
      this.showToast('No fue posible completar la operación', 'danger');
    }
  }

  onEditCategory(id: string): void {
    const category = this.categoryFacade.categories.find((item) => item.id === id);
    if (!category) return;

    this.editingCategory = category;
    this.isCreateModalOpen = true;
  }

  async onDeleteCategory(id: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar categoría',
      message: '¿Estás seguro de que deseas eliminar esta categoría?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.confirmDeleteCategory(id);
          },
        },
      ],
    });

    await alert.present();
  }

  private async confirmDeleteCategory(id: string): Promise<void> {
    try {
      await this.categoryFacade.deleteCategory(id);
      this.showToast('Categoría eliminada correctamente');
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
    this.categories = this.categoryFacade.categories;
    this.loading = this.categoryFacade.loading;
    this.error = this.categoryFacade.error;
    this.hasCategories = this.categories.length > 0;
    this.showContent = !this.loading && !this.error;
    this.cdr.markForCheck();
  }
}
