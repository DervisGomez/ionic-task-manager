import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TasksRoutingModule } from './tasks-routing-module';
import { IonicModule } from '@ionic/angular';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskFormComponent } from './presentation/components/task-form/task-form.component';
import { TaskCardComponent } from './presentation/components/task-card/task-card.component';
import { SharedModule } from '@shared/shared.module';
import { TASKS_PROVIDERS } from './tasks.providers';
import { CATEGORIES_PROVIDERS } from '@features/categories/categories.providers';

@NgModule({
  declarations: [TaskListComponent, TaskFormComponent, TaskCardComponent],
  imports: [CommonModule, ReactiveFormsModule, IonicModule, TasksRoutingModule, SharedModule],
  providers: [...TASKS_PROVIDERS, ...CATEGORIES_PROVIDERS],
})
export class TasksModule {}
