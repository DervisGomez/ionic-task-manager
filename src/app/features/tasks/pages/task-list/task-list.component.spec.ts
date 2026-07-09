import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertController, AlertButton, IonicModule } from '@ionic/angular';

import { SharedModule } from '@shared/shared.module';

import { CreateTaskCommand } from '../../domain/commands/create-task.command';
import { TaskCardComponent } from '../../presentation/components/task-card/task-card.component';
import { TaskFormComponent } from '../../presentation/components/task-form/task-form.component';
import { TaskFacade } from '../../presentation/facades/task.facade';
import { TaskViewModel } from '../../presentation/models/task.viewmodel';
import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskFacadeSpy: jasmine.SpyObj<TaskFacade>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let alertElementSpy: jasmine.SpyObj<HTMLIonAlertElement>;
  let alertConfig: Parameters<AlertController['create']>[0];

  const editingTask: TaskViewModel = {
    id: 'task-1',
    title: 'Planificar sprint',
    description: 'Definir alcance',
    categoryId: 'work',
    categoryLabel: 'Trabajo',
    completed: false,
    statusLabel: 'Pendiente',
    statusColor: 'medium',
  };

  beforeEach(waitForAsync(() => {
    taskFacadeSpy = jasmine.createSpyObj<TaskFacade>(
      'TaskFacade',
      [
        'loadTasks',
        'createTask',
        'updateTask',
        'toggleCompleted',
        'deleteTask',
        'search',
        'selectCategory',
      ],
      {
        filteredTasks: [],
        searchTerm: '',
        selectedCategory: 'all',
        loading: false,
        error: null,
      },
    );
    taskFacadeSpy.loadTasks.and.resolveTo();
    taskFacadeSpy.createTask.and.resolveTo();
    taskFacadeSpy.updateTask.and.resolveTo();
    taskFacadeSpy.toggleCompleted.and.resolveTo();
    taskFacadeSpy.deleteTask.and.resolveTo();

    alertElementSpy = jasmine.createSpyObj<HTMLIonAlertElement>('HTMLIonAlertElement', ['present']);
    alertElementSpy.present.and.resolveTo();

    alertControllerSpy = jasmine.createSpyObj<AlertController>('AlertController', ['create']);
    alertControllerSpy.create.and.callFake(async (config) => {
      alertConfig = config;
      return alertElementSpy;
    });

    TestBed.configureTestingModule({
      declarations: [TaskListComponent, TaskFormComponent, TaskCardComponent],
      imports: [ReactiveFormsModule, IonicModule.forRoot(), SharedModule],
      providers: [
        { provide: TaskFacade, useValue: taskFacadeSpy },
        { provide: AlertController, useValue: alertControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('onCategorySelected delega en TaskFacade.selectCategory', () => {
    component.onCategorySelected('work');

    expect(taskFacadeSpy.selectCategory).toHaveBeenCalledOnceWith('work');
  });

  it('onSearchChanged delega en TaskFacade.search', () => {
    component.onSearchChanged('urgent');

    expect(taskFacadeSpy.search).toHaveBeenCalledOnceWith('urgent');
  });

  it('onToggleCompleted delega en TaskFacade', async () => {
    await component.onToggleCompleted('task-1');

    expect(taskFacadeSpy.toggleCompleted).toHaveBeenCalledOnceWith('task-1');
  });

  it('debe abrir el modal de creación', () => {
    component.editingTask = editingTask;

    component.openCreateModal();

    expect(component.editingTask).toBeNull();
    expect(component.isCreateModalOpen).toBeTrue();
  });

  it('debe abrir el modal desde el empty state', () => {
    const button = fixture.nativeElement.querySelector('app-empty-state ion-button') as HTMLElement;

    button.click();
    fixture.detectChanges();

    expect(component.isCreateModalOpen).toBeTrue();
  });

  it('no muestra el FAB cuando no hay tareas', () => {
    const fab = fixture.nativeElement.querySelector('app-floating-action-button');

    expect(fab).toBeNull();
  });

  it('muestra el FAB cuando hay tareas', () => {
    Object.defineProperty(taskFacadeSpy, 'filteredTasks', {
      get: () => [editingTask],
    });
    fixture.detectChanges();

    const fab = fixture.nativeElement.querySelector('app-floating-action-button');

    expect(fab).toBeTruthy();
  });

  it('debe cerrar el modal de creación', () => {
    component.isCreateModalOpen = true;

    component.closeCreateModal();

    expect(component.isCreateModalOpen).toBeFalse();
  });

  it('debe cerrar el modal después de crear una tarea', async () => {
    const command: CreateTaskCommand = {
      title: 'Comprar víveres',
      description: 'Comprar frutas y verduras',
      categoryId: 'personal',
    };
    component.isCreateModalOpen = true;

    await component.onSubmitTask(command);

    expect(taskFacadeSpy.createTask).toHaveBeenCalledOnceWith(command);
    expect(component.isCreateModalOpen).toBeFalse();
  });

  it('debe abrir el modal de edición', () => {
    Object.defineProperty(taskFacadeSpy, 'filteredTasks', {
      get: () => [editingTask],
    });

    component.onEditTask('task-1');

    expect(component.editingTask).toEqual(editingTask);
    expect(component.isCreateModalOpen).toBeTrue();
  });

  it('debe editar una tarea desde el modal', async () => {
    const command: CreateTaskCommand = {
      title: 'Sprint actualizado',
      description: 'Nuevo alcance',
      categoryId: 'work',
    };
    component.editingTask = editingTask;
    component.isCreateModalOpen = true;

    await component.onSubmitTask(command);

    expect(taskFacadeSpy.updateTask).toHaveBeenCalledOnceWith('task-1', command);
    expect(component.isCreateModalOpen).toBeFalse();
    expect(component.editingTask).toBeNull();
  });

  it('al confirmar eliminación llama TaskFacade.deleteTask', async () => {
    await component.onDeleteTask('task-1');

    const deleteButton = alertConfig!.buttons?.find(
      (button): button is AlertButton => typeof button === 'object' && button.text === 'Eliminar',
    );

    expect(deleteButton).toBeTruthy();
    await deleteButton?.handler?.(undefined);

    expect(taskFacadeSpy.deleteTask).toHaveBeenCalledOnceWith('task-1');
  });

  it('al cancelar eliminación no llama TaskFacade.deleteTask', async () => {
    await component.onDeleteTask('task-1');

    expect(alertControllerSpy.create).toHaveBeenCalled();
    expect(taskFacadeSpy.deleteTask).not.toHaveBeenCalled();
  });

  it('showToast configura el mensaje, color y abre el toast', () => {
    const showToast = (
      component as unknown as {
        showToast: (message: string, color?: 'success' | 'danger') => void;
      }
    ).showToast.bind(component);

    showToast('Mensaje de prueba', 'danger');

    expect(component.toastOpen).toBeTrue();
    expect(component.toastMessage).toBe('Mensaje de prueba');
    expect(component.toastColor).toBe('danger');
  });

  it('muestra toast de éxito después de crear una tarea', async () => {
    const command: CreateTaskCommand = {
      title: 'Comprar víveres',
      description: 'Comprar frutas y verduras',
      categoryId: 'personal',
    };

    await component.onSubmitTask(command);

    expect(component.toastOpen).toBeTrue();
    expect(component.toastMessage).toBe('Tarea creada correctamente');
    expect(component.toastColor).toBe('success');
  });

  it('muestra toast de éxito después de editar una tarea', async () => {
    const command: CreateTaskCommand = {
      title: 'Sprint actualizado',
      description: 'Nuevo alcance',
      categoryId: 'work',
    };
    component.editingTask = editingTask;

    await component.onSubmitTask(command);

    expect(component.toastOpen).toBeTrue();
    expect(component.toastMessage).toBe('Tarea actualizada correctamente');
    expect(component.toastColor).toBe('success');
  });

  it('muestra toast de éxito después de eliminar una tarea', async () => {
    await component.onDeleteTask('task-1');

    const deleteButton = alertConfig!.buttons?.find(
      (button): button is AlertButton => typeof button === 'object' && button.text === 'Eliminar',
    );

    await deleteButton?.handler?.(undefined);

    expect(component.toastOpen).toBeTrue();
    expect(component.toastMessage).toBe('Tarea eliminada correctamente');
    expect(component.toastColor).toBe('success');
  });

  it('muestra toast de error cuando falla una operación', async () => {
    taskFacadeSpy.createTask.and.rejectWith(new Error('Error de red'));
    component.isCreateModalOpen = true;
    const command: CreateTaskCommand = {
      title: 'Comprar víveres',
      description: 'Comprar frutas y verduras',
      categoryId: 'personal',
    };

    await component.onSubmitTask(command);

    expect(component.toastOpen).toBeTrue();
    expect(component.toastMessage).toBe('No fue posible completar la operación');
    expect(component.toastColor).toBe('danger');
    expect(component.isCreateModalOpen).toBeTrue();
  });

  it('expone semántica de lista accesible cuando hay tareas', () => {
    Object.defineProperty(taskFacadeSpy, 'filteredTasks', {
      get: () => [editingTask],
    });
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('ul.task-list__list') as HTMLElement;
    const items = fixture.nativeElement.querySelectorAll('ul.task-list__list > li');

    expect(list.getAttribute('aria-label')).toBe('Lista de tareas');
    expect(items.length).toBe(1);
  });

  it('asocia el modal con el título y la descripción del formulario', () => {
    component.isCreateModalOpen = true;
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('ion-modal') as HTMLElement;

    expect(modal.getAttribute('aria-labelledby')).toBe('task-form-modal-title');
    expect(modal.getAttribute('aria-describedby')).toBe('task-form-modal-description');
  });

  it('usa role alert en toasts de error', () => {
    const showToast = (
      component as unknown as {
        showToast: (message: string, color?: 'success' | 'danger') => void;
      }
    ).showToast.bind(component);

    showToast('Error', 'danger');
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('ion-toast') as HTMLElement;

    expect(toast.getAttribute('role')).toBe('alert');
  });
});
