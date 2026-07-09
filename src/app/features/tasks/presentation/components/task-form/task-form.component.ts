import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CreateTaskCommand } from '../../../domain/commands/create-task.command';
import { TaskViewModel } from '../../models/task.viewmodel';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: false,
})
export class TaskFormComponent implements OnChanges {
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

  getFieldError(fieldName: 'title' | 'description'): string | undefined {
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
