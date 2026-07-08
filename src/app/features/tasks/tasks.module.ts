import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing-module';
import { IonicModule } from '@ionic/angular';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { SharedModule } from '@shared/shared.module';
import { TASKS_PROVIDERS } from './tasks.providers';

@NgModule({
  declarations: [TaskListComponent],
  imports: [CommonModule, IonicModule, TasksRoutingModule, SharedModule],
  providers: [...TASKS_PROVIDERS],
})
export class TasksModule {}
