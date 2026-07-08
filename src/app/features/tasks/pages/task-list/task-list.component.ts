import { Component } from '@angular/core';

import { FilterOption } from '@shared/models/filter-option.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: false,
})
export class TaskListComponent {
  readonly categories: readonly FilterOption[] = [
    { id: 'all', label: 'Todas' },
    { id: 'work', label: 'Trabajo' },
    { id: 'personal', label: 'Personal' },
  ];

  selectedCategory = 'all';

  searchTerm = '';

  onCategorySelected(id: string): void {
    this.selectedCategory = id;
  }

  onSearchChanged(value: string): void {
    this.searchTerm = value;
  }

  onCreateTask(): void {
    console.log('Crear tarea');
  }
}
