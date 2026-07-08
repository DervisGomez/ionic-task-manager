import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CreateTaskCommand } from '../../../domain/commands/create-task.command';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: false,
})
export class TaskFormComponent {
  @Output() readonly submitTask = new EventEmitter<CreateTaskCommand>();

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
}
