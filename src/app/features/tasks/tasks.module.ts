import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing-module';
import { IonicModule } from '@ionic/angular';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [TaskListComponent],
  imports: [CommonModule, IonicModule, TasksRoutingModule, SharedModule],
})
export class TasksModule {}
