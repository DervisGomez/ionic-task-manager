import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, AlertButton, IonicModule } from '@ionic/angular';

import { RemoteConfigKeys } from '@core/firebase/remote-config.keys';
import { RemoteConfigService } from '@core/firebase/services/remote-config.service';
import { SharedModule } from '@shared/shared.module';

import { CategoryFacade } from '@features/categories/presentation/facades/category.facade';

import { CreateTaskCommand } from '../../domain/commands/create-task.command';
import { TaskCardComponent } from '../../presentation/components/task-card/task-card.component';
import { TaskFormComponent } from '../../presentation/components/task-form/task-form.component';
import { TaskBenchmarkPanelComponent } from '../../presentation/dev/task-benchmark-panel.component';
import { TaskBenchmarkService } from '../../presentation/dev/task-benchmark.service';
import { TaskFacade } from '../../presentation/facades/task.facade';
import { TaskViewModel } from '../../presentation/models/task.viewmodel';
import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskFacadeSpy: jasmine.SpyObj<TaskFacade>;
  let categoryFacadeSpy: jasmine.SpyObj<CategoryFacade>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let alertElementSpy: jasmine.SpyObj<HTMLIonAlertElement>;
  let routerSpy: jasmine.SpyObj<Router>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  let alertConfig: Parameters<AlertController['create']>[0];

  const editingTask: TaskViewModel = {
    id: 'task-1',
    title: 'Planificar sprint',
    description: 'Definir alcance',
    categoryId: 'work',
    completed: false,
  };

  const categories = [
    { id: 'work', name: 'Trabajo' },
    { id: 'personal', name: 'Personal' },
  ];

  const PAGE_SIZE = 30;

  const createTaskViewModels = (count: number): TaskViewModel[] =>
    Array.from({ length: count }, (_, index) => ({
      id: `task-${index}`,
      title: `Tarea ${index}`,
      description: `Descripción ${index}`,
      categoryId: 'work',
      completed: false,
    }));

  const setFacadeTasks = (count: number): void => {
    Object.defineProperty(taskFacadeSpy, 'tasks', {
      get: () => createTaskViewModels(count),
      configurable: true,
    });
    Object.defineProperty(taskFacadeSpy, 'hasAnyTasks', {
      get: () => count > 0,
      configurable: true,
    });
  };

  const setFacadeFilteredEmpty = (): void => {
    Object.defineProperty(taskFacadeSpy, 'tasks', {
      get: () => [],
      configurable: true,
    });
    Object.defineProperty(taskFacadeSpy, 'hasAnyTasks', {
      get: () => true,
      configurable: true,
    });
  };

  const syncViewState = (): void => {
    (component as unknown as { syncViewState: () => void }).syncViewState();
    fixture.detectChanges();
  };

  beforeEach(async () => {
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
        tasks: [],
        hasAnyTasks: false,
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

    categoryFacadeSpy = jasmine.createSpyObj<CategoryFacade>('CategoryFacade', ['loadCategories'], {
      categories,
      loading: false,
      error: null,
    });
    categoryFacadeSpy.loadCategories.and.resolveTo();

    alertElementSpy = jasmine.createSpyObj<HTMLIonAlertElement>('HTMLIonAlertElement', ['present']);
    alertElementSpy.present.and.resolveTo();

    alertControllerSpy = jasmine.createSpyObj<AlertController>('AlertController', ['create']);
    alertControllerSpy.create.and.callFake(async (config) => {
      alertConfig = config;
      return alertElementSpy;
    });

    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    routerSpy.navigate.and.resolveTo(true);

    remoteConfigSpy = jasmine.createSpyObj<RemoteConfigService>('RemoteConfigService', [
      'getBoolean',
    ]);
    remoteConfigSpy.getBoolean.and.callFake(
      (key: string) => key === RemoteConfigKeys.enableCategories,
    );

    TestBed.configureTestingModule({
      declarations: [
        TaskListComponent,
        TaskFormComponent,
        TaskCardComponent,
        TaskBenchmarkPanelComponent,
      ],
      imports: [ReactiveFormsModule, IonicModule.forRoot(), SharedModule],
      providers: [
        { provide: TaskFacade, useValue: taskFacadeSpy },
        { provide: CategoryFacade, useValue: categoryFacadeSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: RemoteConfigService, useValue: remoteConfigSpy },
        {
          provide: TaskBenchmarkService,
          useValue: jasmine.createSpyObj<TaskBenchmarkService>('TaskBenchmarkService', ['run']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    await component.ionViewWillEnter();
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ionViewWillEnter carga tareas y categorías', () => {
    expect(taskFacadeSpy.loadTasks).toHaveBeenCalledTimes(1);
    expect(categoryFacadeSpy.loadCategories).toHaveBeenCalledTimes(1);
  });

  it('ionViewWillEnter recarga tareas y categorías al volver a la pantalla', async () => {
    await component.ionViewWillEnter();

    expect(taskFacadeSpy.loadTasks).toHaveBeenCalledTimes(2);
    expect(categoryFacadeSpy.loadCategories).toHaveBeenCalledTimes(2);
  });

  it('renderiza el botón para administrar categorías', () => {
    const actionButton = fixture.nativeElement.querySelector(
      'app-page-header .page-header__action',
    ) as HTMLElement;

    expect(actionButton).toBeTruthy();
  });

  it('navega a /categories al pulsar administrar categorías', () => {
    component.navigateToCategories();

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/categories']);
  });

  it('oculta el botón de administrar categorías cuando el feature flag está deshabilitado', () => {
    remoteConfigSpy.getBoolean.and.returnValue(false);
    syncViewState();

    const actionButton = fixture.nativeElement.querySelector(
      'app-page-header .page-header__action',
    ) as HTMLElement;

    expect(actionButton).toBeNull();
  });

  it('no navega a /categories cuando el feature flag está deshabilitado', () => {
    remoteConfigSpy.getBoolean.and.returnValue(false);
    syncViewState();

    component.navigateToCategories();

    expect(routerSpy.navigate).not.toHaveBeenCalled();
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

  it('debe abrir el modal desde el empty state sin tareas', () => {
    const emptyState = fixture.nativeElement.querySelector('app-empty-state') as HTMLElement;
    const button = emptyState.querySelector('ion-button') as HTMLElement;

    expect(emptyState.querySelector('.empty-state__title')?.textContent).toContain(
      'Aún no tienes tareas',
    );
    expect(emptyState.querySelector('.empty-state__description')?.textContent).toContain(
      'Crea tu primera tarea para comenzar a organizar tu día.',
    );
    expect(button.textContent).toContain('Nueva tarea');

    button.click();
    fixture.detectChanges();

    expect(component.isCreateModalOpen).toBeTrue();
  });

  it('muestra el empty state sin resultados cuando hay tareas pero el filtro no devuelve coincidencias', () => {
    setFacadeFilteredEmpty();
    Object.defineProperty(taskFacadeSpy, 'searchTerm', {
      get: () => 'inexistente',
      configurable: true,
    });
    syncViewState();

    const emptyStates = fixture.nativeElement.querySelectorAll('app-empty-state');
    const noResultsEmptyState = emptyStates[0] as HTMLElement;

    expect(emptyStates.length).toBe(1);
    expect(noResultsEmptyState.querySelector('.empty-state__title')?.textContent).toContain(
      'No encontramos tareas',
    );
    expect(noResultsEmptyState.querySelector('.empty-state__description')?.textContent).toContain(
      'No hay tareas que coincidan con los filtros actuales.',
    );
    expect(noResultsEmptyState.querySelector('ion-button')?.textContent).toContain(
      'Limpiar filtros',
    );
    expect(fixture.nativeElement.querySelector('ul.task-list__list')).toBeNull();
  });

  it('limpia búsqueda y categoría al pulsar Limpiar filtros', () => {
    setFacadeFilteredEmpty();
    Object.defineProperty(taskFacadeSpy, 'searchTerm', {
      get: () => 'inexistente',
      configurable: true,
    });
    Object.defineProperty(taskFacadeSpy, 'selectedCategory', {
      get: () => 'work',
      configurable: true,
    });
    syncViewState();

    const button = fixture.nativeElement.querySelector('app-empty-state ion-button') as HTMLElement;
    button.click();

    expect(taskFacadeSpy.search).toHaveBeenCalledWith('');
    expect(taskFacadeSpy.selectCategory).toHaveBeenCalledWith('all');
  });

  it('no muestra el FAB cuando no hay tareas', () => {
    const fab = fixture.nativeElement.querySelector('app-floating-action-button');

    expect(fab).toBeNull();
  });

  it('muestra el FAB cuando hay tareas', () => {
    setFacadeTasks(1);
    syncViewState();

    const fab = fixture.nativeElement.querySelector('app-floating-action-button');

    expect(fab).toBeTruthy();
  });

  it('renderiza el FAB fijo para permanecer anclado al viewport', () => {
    setFacadeTasks(1);
    syncViewState();

    const fab = fixture.nativeElement.querySelector('app-floating-action-button') as HTMLElement;

    expect(fab).toBeTruthy();
    expect(fab.classList.contains('floating-action-button')).toBeTrue();
    expect(getComputedStyle(fab).position).toBe('fixed');
    expect(fab.querySelector('ion-fab')).toBeTruthy();
  });

  it('muestra el FAB cuando hay tareas aunque el filtro no devuelva resultados', () => {
    setFacadeFilteredEmpty();
    syncViewState();

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
    Object.defineProperty(taskFacadeSpy, 'tasks', {
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
    setFacadeTasks(1);
    syncViewState();

    const list = fixture.nativeElement.querySelector('ul.task-list__list') as HTMLElement;
    const items = fixture.nativeElement.querySelectorAll('ul.task-list__list > li');

    expect(list.getAttribute('aria-label')).toBe('Lista de tareas');
    expect(items.length).toBe(1);
  });

  describe('infinite scroll', () => {
    it('carga inicial muestra únicamente PAGE_SIZE elementos', () => {
      setFacadeTasks(50);
      syncViewState();

      expect(component.visibleTasks).toHaveSize(PAGE_SIZE);
      expect(component.showInfiniteScroll).toBeTrue();
      expect(component.hasMoreVisibleTasks).toBeTrue();
    });

    it('loadMoreTasks() añade PAGE_SIZE elementos adicionales', () => {
      setFacadeTasks(50);
      syncViewState();

      component.loadMoreTasks();

      expect(component.visibleTasks).toHaveSize(50);
      expect(component.hasMoreVisibleTasks).toBeFalse();
    });

    it('reinicia la lista incremental al buscar', () => {
      setFacadeTasks(50);
      syncViewState();
      component.loadMoreTasks();

      component.onSearchChanged('urgent');
      syncViewState();

      expect(component.visibleTasks).toHaveSize(PAGE_SIZE);
      expect(component.hasMoreVisibleTasks).toBeTrue();
    });

    it('reinicia la lista incremental al cambiar categoría', () => {
      setFacadeTasks(50);
      syncViewState();
      component.loadMoreTasks();

      component.onCategorySelected('work');
      syncViewState();

      expect(component.visibleTasks).toHaveSize(PAGE_SIZE);
      expect(component.hasMoreVisibleTasks).toBeTrue();
    });

    it('reinicia la lista incremental al crear una tarea', async () => {
      setFacadeTasks(40);
      syncViewState();
      component.loadMoreTasks();

      await component.onSubmitTask({
        title: 'Nueva tarea',
        description: 'Descripción',
        categoryId: 'work',
      });
      syncViewState();

      expect(component.visibleTasks).toHaveSize(PAGE_SIZE);
      expect(component.hasMoreVisibleTasks).toBeTrue();
    });

    it('reinicia la lista incremental al editar una tarea', async () => {
      setFacadeTasks(40);
      syncViewState();
      component.loadMoreTasks();

      component.editingTask = createTaskViewModels(40)[0];
      await component.onSubmitTask({
        title: 'Tarea editada',
        description: 'Descripción',
        categoryId: 'work',
      });
      syncViewState();

      expect(component.visibleTasks).toHaveSize(PAGE_SIZE);
      expect(component.hasMoreVisibleTasks).toBeTrue();
    });

    it('reinicia la lista incremental al eliminar una tarea', async () => {
      setFacadeTasks(40);
      syncViewState();
      component.loadMoreTasks();

      await component.onDeleteTask('task-0');

      const deleteButton = alertConfig!.buttons?.find(
        (button): button is AlertButton => typeof button === 'object' && button.text === 'Eliminar',
      );
      await deleteButton?.handler?.(undefined);
      syncViewState();

      expect(component.visibleTasks).toHaveSize(PAGE_SIZE);
      expect(component.hasMoreVisibleTasks).toBeTrue();
    });

    it('no muestra Infinite Scroll con menos de PAGE_SIZE tareas', () => {
      setFacadeTasks(PAGE_SIZE - 1);
      syncViewState();

      const infiniteScroll = fixture.nativeElement.querySelector('ion-infinite-scroll');

      expect(infiniteScroll).toBeNull();
      expect(component.showInfiniteScroll).toBeFalse();
    });

    it('reinicia la lista incremental al completar una tarea', async () => {
      setFacadeTasks(40);
      syncViewState();
      component.loadMoreTasks();

      await component.onToggleCompleted('task-0');

      expect(component.visibleTasks).toHaveSize(PAGE_SIZE);
      expect(component.hasMoreVisibleTasks).toBeTrue();
    });

    it('reinicia la lista incremental al recargar desde TaskFacade', async () => {
      setFacadeTasks(50);
      syncViewState();
      component.loadMoreTasks();

      await component.ionViewWillEnter();

      expect(component.visibleTasks).toHaveSize(PAGE_SIZE);
      expect(component.hasMoreVisibleTasks).toBeTrue();
    });

    it('deshabilita Infinite Scroll cuando no hay más elementos', () => {
      setFacadeTasks(35);
      syncViewState();
      component.loadMoreTasks();
      fixture.detectChanges();

      expect(component.hasMoreVisibleTasks).toBeFalse();
      expect(component.visibleTasks).toHaveSize(35);
      expect(fixture.nativeElement.querySelector('ion-infinite-scroll')).toBeTruthy();
    });
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
