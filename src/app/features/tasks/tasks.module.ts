import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing-module';
import { IonicModule } from '@ionic/angular';
import { TaskListComponent } from './pages/task-list/task-list.component';


@NgModule({
  declarations: [
    TaskListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TasksRoutingModule
  ]
})
export class TasksModule { }
