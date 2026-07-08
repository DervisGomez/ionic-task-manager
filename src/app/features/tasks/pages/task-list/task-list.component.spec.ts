import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@shared/shared.module';

import { CreateTaskCommand } from '../../domain/commands/create-task.command';
import { TaskFormComponent } from '../../presentation/components/task-form/task-form.component';
import { TaskFacade } from '../../presentation/facades/task.facade';
import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskFacadeSpy: jasmine.SpyObj<TaskFacade>;

  beforeEach(waitForAsync(() => {
    taskFacadeSpy = jasmine.createSpyObj<TaskFacade>('TaskFacade', ['loadTasks', 'createTask'], {
      tasks: [],
      loading: false,
      error: null,
    });
    taskFacadeSpy.loadTasks.and.resolveTo();
    taskFacadeSpy.createTask.and.resolveTo();

    TestBed.configureTestingModule({
      declarations: [TaskListComponent, TaskFormComponent],
      imports: [ReactiveFormsModule, IonicModule.forRoot(), SharedModule],
      providers: [{ provide: TaskFacade, useValue: taskFacadeSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe actualizar la categoría seleccionada', () => {
    component.onCategorySelected('work');
    expect(component.selectedCategory).toBe('work');
  });

  it('debe actualizar el término de búsqueda', () => {
    component.onSearchChanged('urgent');
    expect(component.searchTerm).toBe('urgent');
  });

  it('debe solicitar la creación de una tarea desde el facade', async () => {
    const command: CreateTaskCommand = {
      title: 'Comprar víveres',
      description: 'Comprar frutas y verduras',
      categoryId: 'personal',
    };

    await component.onCreateTask(command);

    expect(taskFacadeSpy.createTask).toHaveBeenCalledOnceWith(command);
  });
});
