import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TasksRoutingModule } from './tasks-routing-module';
import { IonicModule } from '@ionic/angular';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskFormComponent } from './presentation/components/task-form/task-form.component';
import { SharedModule } from '@shared/shared.module';
import { TASKS_PROVIDERS } from './tasks.providers';

@NgModule({
  declarations: [TaskListComponent, TaskFormComponent],
  imports: [CommonModule, ReactiveFormsModule, IonicModule, TasksRoutingModule, SharedModule],
  providers: [...TASKS_PROVIDERS],
})
export class TasksModule {}
