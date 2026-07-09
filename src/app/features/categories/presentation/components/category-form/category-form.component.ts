import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CreateCategoryCommand } from '../../../domain/commands/create-category.command';
import { CategoryViewModel } from '../../models/category.viewmodel';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  standalone: false,
})
export class CategoryFormComponent implements OnChanges {
  @Input() category?: CategoryViewModel;

  @Input() submitButtonText = 'Guardar';

  @Output() readonly submitCategory = new EventEmitter<CreateCategoryCommand>();

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() readonly cancel = new EventEmitter<void>();

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['category']) return;

    if (this.category) {
      this.form.patchValue({
        name: this.category.name,
      });
      return;
    }

    this.form.reset({
      name: '',
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name } = this.form.getRawValue();
    this.submitCategory.emit({ name });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get isEditing(): boolean {
    return this.category !== undefined;
  }

  get headerTitle(): string {
    return this.isEditing ? 'Editar categoría' : 'Nueva categoría';
  }

  get headerDescription(): string {
    return this.isEditing
      ? 'Actualiza el nombre de esta categoría.'
      : 'Crea una categoría para organizar tus tareas.';
  }

  getFieldError(fieldName: 'name'): string | undefined {
    const control = this.form.controls[fieldName];

    if (!control.touched || !control.invalid) {
      return undefined;
    }

    if (control.errors?.['required']) {
      return 'Este campo es obligatorio';
    }

    if (control.errors?.['maxlength']) {
      const maxLength = control.errors['maxlength'].requiredLength as number;
      return `No puede superar ${maxLength} caracteres`;
    }

    return undefined;
  }
}
