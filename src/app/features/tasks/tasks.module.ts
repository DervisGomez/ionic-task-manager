import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TasksRoutingModule } from './tasks-routing-module';
import { IonicModule } from '@ionic/angular';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskFormComponent } from './presentation/components/task-form/task-form.component';
import { TaskCardComponent } from './presentation/components/task-card/task-card.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [TaskListComponent, TaskFormComponent, TaskCardComponent],
  imports: [CommonModule, ReactiveFormsModule, IonicModule, TasksRoutingModule, SharedModule],
})
export class TasksModule {}
