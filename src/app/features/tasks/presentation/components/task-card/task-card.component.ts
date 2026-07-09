import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TaskViewModel } from '../../models/task.viewmodel';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  standalone: false,
})
export class TaskCardComponent {
  @Input({ required: true }) task!: TaskViewModel;

  @Output() readonly toggleCompleted = new EventEmitter<string>();

  @Output() readonly edit = new EventEmitter<string>();

  @Output() readonly delete = new EventEmitter<string>();

  onToggleCompleted(): void {
    this.toggleCompleted.emit(this.task.id);
  }

  onEdit(): void {
    this.edit.emit(this.task.id);
  }

  onDelete(): void {
    this.delete.emit(this.task.id);
  }

  get checkboxAriaLabel(): string {
    return this.task.completed
      ? `Marcar "${this.task.title}" como pendiente`
      : `Marcar "${this.task.title}" como completada`;
  }

  get editAriaLabel(): string {
    return `Editar tarea ${this.task.title}`;
  }

  get deleteAriaLabel(): string {
    return `Eliminar tarea ${this.task.title}`;
  }
}
