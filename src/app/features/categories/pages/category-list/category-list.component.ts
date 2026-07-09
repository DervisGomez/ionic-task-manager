import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ViewWillEnter } from '@ionic/angular';

import { CreateCategoryCommand } from '../../domain/commands/create-category.command';
import { CategoryFacade } from '../../presentation/facades/category.facade';
import { CategoryViewModel } from '../../presentation/models/category.viewmodel';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  standalone: false,
})
export class CategoryListComponent implements ViewWillEnter {
  isCreateModalOpen = false;

  editingCategory: CategoryViewModel | null = null;

  toastOpen = false;

  toastMessage = '';

  toastColor: 'success' | 'danger' = 'success';

  private readonly categoryFacade = inject(CategoryFacade);
  private readonly alertController = inject(AlertController);
  private readonly router = inject(Router);

  async ionViewWillEnter(): Promise<void> {
    await this.categoryFacade.loadCategories();
  }

  get categories(): readonly CategoryViewModel[] {
    return this.categoryFacade.categories;
  }

  get loading(): boolean {
    return this.categoryFacade.loading;
  }

  get error(): string | null {
    return this.categoryFacade.error;
  }

  get hasCategories(): boolean {
    return this.categories.length > 0;
  }

  get showContent(): boolean {
    return !this.loading && !this.error;
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
