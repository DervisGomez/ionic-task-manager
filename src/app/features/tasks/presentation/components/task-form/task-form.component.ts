import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CreateTaskCommand } from '../../../domain/commands/create-task.command';
import {
  getSelectableTaskCategories,
  getSelectableTaskCategoryIds,
  SelectableTaskCategoryId,
} from '../../../shared/catalogs/task-categories.catalog';
import { TaskViewModel } from '../../models/task.viewmodel';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  standalone: false,
})
export class TaskFormComponent implements OnChanges {
  readonly categoryOptions = getSelectableTaskCategories();

  @Input() task?: TaskViewModel;

  @Input() submitButtonText = 'Guardar';

  @Output() readonly submitTask = new EventEmitter<CreateTaskCommand>();

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() readonly cancel = new EventEmitter<void>();

  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
    categoryId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['task']) return;

    if (this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        categoryId: this.task.categoryId,
      });
      return;
    }

    this.form.reset({
      title: '',
      description: '',
      categoryId: '',
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, description, categoryId } = this.form.getRawValue();
    this.submitTask.emit({
      title,
      description: description || undefined,
      categoryId,
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  selectCategory(categoryId: SelectableTaskCategoryId): void {
    this.form.controls.categoryId.setValue(categoryId);
    this.focusCategory(categoryId);
  }

  onCategoryKeydown(event: KeyboardEvent, categoryId: SelectableTaskCategoryId): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.selectCategory(categoryId);
      return;
    }

    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      return;
    }

    event.preventDefault();

    const options = getSelectableTaskCategoryIds();
    const currentIndex = options.indexOf(categoryId);
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % options.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + options.length) % options.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = options.length - 1;
        break;
    }

    const nextCategory = options[nextIndex];
    this.form.controls.categoryId.setValue(nextCategory);
    this.focusCategory(nextCategory);
  }

  get isEditing(): boolean {
    return this.task !== undefined;
  }

  get headerTitle(): string {
    return this.isEditing ? 'Editar tarea' : 'Nueva tarea';
  }

  get headerDescription(): string {
    return this.isEditing
      ? 'Actualiza la información de esta tarea.'
      : 'Crea una nueva tarea para mantenerte organizado.';
  }

  get descriptionDescribedBy(): string | null {
    if (this.getFieldError('description')) {
      return 'task-description-error';
    }

    return 'task-description-helper';
  }

  get categoryDescribedBy(): string | null {
    if (this.getFieldError('categoryId')) {
      return 'task-category-error';
    }

    return 'task-form-category-helper';
  }

  getFieldError(fieldName: 'title' | 'description' | 'categoryId'): string | undefined {
    const control = this.form.controls[fieldName];

    if (!control.touched || !control.invalid) {
      return undefined;
    }

    if (control.errors?.['required']) {
      return fieldName === 'categoryId' ? 'Selecciona una categoría' : 'Este campo es obligatorio';
    }

    if (control.errors?.['maxlength']) {
      const maxLength = control.errors['maxlength'].requiredLength as number;
      return `No puede superar ${maxLength} caracteres`;
    }

    return undefined;
  }

  getCategoryChipId(categoryId: SelectableTaskCategoryId): string {
    return `task-form-category-${categoryId}`;
  }

  private focusCategory(categoryId: SelectableTaskCategoryId): void {
    document.getElementById(this.getCategoryChipId(categoryId))?.focus();
  }
}
