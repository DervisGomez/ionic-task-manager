import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { EnrichedTaskViewModel } from '../../models/enriched-task.viewmodel';

const DESCRIPTION_TOGGLE_THRESHOLD = 85;

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  standalone: false,
})
export class TaskCardComponent implements OnChanges {
  @Input({ required: true }) task!: EnrichedTaskViewModel;

  isDescriptionExpanded = false;

  private expandedTaskId: string | null = null;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['task']) return;

    if (this.expandedTaskId === this.task.id) {
      this.isDescriptionExpanded = true;
      return;
    }

    if (this.expandedTaskId !== null) {
      this.isDescriptionExpanded = false;
      this.expandedTaskId = null;
    }
  }

  toggleDescription(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
    this.expandedTaskId = this.isDescriptionExpanded ? this.task.id : null;
  }

  get hasCategory(): boolean {
    return this.task.categoryId.trim().length > 0 && this.task.categoryLabel.trim().length > 0;
  }

  get canExpandDescription(): boolean {
    return this.task.description.length > DESCRIPTION_TOGGLE_THRESHOLD;
  }

  get descriptionToggleLabel(): string {
    return this.isDescriptionExpanded ? 'Ver menos' : 'Ver más';
  }

  get descriptionToggleAriaLabel(): string {
    const action = this.isDescriptionExpanded ? 'Contraer' : 'Expandir';
    return `${action} descripción de ${this.task.title}`;
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
