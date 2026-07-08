import { Component, OnInit } from '@angular/core';

import { FilterOption } from '@shared/models/filter-option.model';
import { CreateTaskCommand } from '../../domain/commands/create-task.command';
import { Task } from '../../domain/entities/task.model';
import { TaskFacade } from '../../presentation/facades/task.facade';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: false,
})
export class TaskListComponent implements OnInit {
  readonly categories: readonly FilterOption[] = [
    { id: 'all', label: 'Todas' },
    { id: 'work', label: 'Trabajo' },
    { id: 'personal', label: 'Personal' },
  ];

  selectedCategory = 'all';

  searchTerm = '';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private readonly taskFacade: TaskFacade) {}

  async ngOnInit(): Promise<void> {
    await this.taskFacade.loadTasks();
  }

  get tasks(): readonly Task[] {
    return this.taskFacade.tasks;
  }

  get loading(): boolean {
    return this.taskFacade.loading;
  }

  get error(): string | null {
    return this.taskFacade.error;
  }

  onCategorySelected(id: string): void {
    this.selectedCategory = id;
  }

  onSearchChanged(value: string): void {
    this.searchTerm = value;
  }

  async onCreateTask(command: CreateTaskCommand): Promise<void> {
    await this.taskFacade.createTask(command);
  }
}
