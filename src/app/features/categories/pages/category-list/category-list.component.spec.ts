import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, AlertButton, IonicModule } from '@ionic/angular';

import { SharedModule } from '@shared/shared.module';

import { CreateCategoryCommand } from '../../domain/commands/create-category.command';
import { CategoryCardComponent } from '../../presentation/components/category-card/category-card.component';
import { CategoryFormComponent } from '../../presentation/components/category-form/category-form.component';
import { CategoryFacade } from '../../presentation/facades/category.facade';
import { CategoryViewModel } from '../../presentation/models/category.viewmodel';
import { CategoryListComponent } from './category-list.component';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let categoryFacadeSpy: jasmine.SpyObj<CategoryFacade>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let alertElementSpy: jasmine.SpyObj<HTMLIonAlertElement>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertConfig: Parameters<AlertController['create']>[0];

  const editingCategory: CategoryViewModel = {
    id: 'work',
    name: 'Trabajo',
  };

  const categories = [
    { id: 'work', name: 'Trabajo' },
    { id: 'personal', name: 'Personal' },
  ];

  beforeEach(waitForAsync(() => {
    categoryFacadeSpy = jasmine.createSpyObj<CategoryFacade>(
      'CategoryFacade',
      ['loadCategories', 'createCategory', 'updateCategory', 'deleteCategory'],
      {
        categories: [],
        loading: false,
        error: null,
      },
    );
    categoryFacadeSpy.loadCategories.and.resolveTo();
    categoryFacadeSpy.createCategory.and.resolveTo();
    categoryFacadeSpy.updateCategory.and.resolveTo();
    categoryFacadeSpy.deleteCategory.and.resolveTo();

    alertElementSpy = jasmine.createSpyObj<HTMLIonAlertElement>('HTMLIonAlertElement', ['present']);
    alertElementSpy.present.and.resolveTo();

    alertControllerSpy = jasmine.createSpyObj<AlertController>('AlertController', ['create']);
    alertControllerSpy.create.and.callFake(async (config) => {
      alertConfig = config;
      return alertElementSpy;
    });

    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    routerSpy.navigate.and.resolveTo(true);

    TestBed.configureTestingModule({
      declarations: [CategoryListComponent, CategoryFormComponent, CategoryCardComponent],
      imports: [ReactiveFormsModule, IonicModule.forRoot(), SharedModule],
      providers: [
        { provide: CategoryFacade, useValue: categoryFacadeSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit ejecuta loadCategories', () => {
    expect(categoryFacadeSpy.loadCategories).toHaveBeenCalledTimes(1);
  });

  it('renderiza el botón de regreso a tareas', () => {
    const backButton = fixture.nativeElement.querySelector(
      'app-page-header .page-header__back',
    ) as HTMLElement;

    expect(backButton).toBeTruthy();
  });

  it('navega a /tasks al pulsar el botón de regreso', () => {
    component.navigateToTasks();

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/tasks']);
  });

  it('muestra estado vacío cuando no hay categorías', () => {
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('app-empty-state');
    const list = fixture.nativeElement.querySelector('.category-list__list');

    expect(emptyState).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Aún no hay categorías');
    expect(list).toBeNull();
  });

  it('renderiza el listado cuando existen categorías', () => {
    Object.defineProperty(categoryFacadeSpy, 'categories', {
      get: () => categories,
    });
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.category-list__item');
    const emptyState = fixture.nativeElement.querySelector('app-empty-state');

    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Trabajo');
    expect(items[1].textContent).toContain('Personal');
    expect(emptyState).toBeNull();
  });

  it('debe abrir el modal de creación', () => {
    component.editingCategory = editingCategory;

    component.openCreateModal();

    expect(component.editingCategory).toBeNull();
    expect(component.isCreateModalOpen).toBeTrue();
  });

  it('debe abrir el modal desde el empty state', () => {
    const button = fixture.nativeElement.querySelector('app-empty-state ion-button') as HTMLElement;

    button.click();
    fixture.detectChanges();

    expect(component.isCreateModalOpen).toBeTrue();
  });

  it('no muestra el FAB cuando no hay categorías', () => {
    const fab = fixture.nativeElement.querySelector('app-floating-action-button');

    expect(fab).toBeNull();
  });

  it('muestra el FAB cuando hay categorías', () => {
    Object.defineProperty(categoryFacadeSpy, 'categories', {
      get: () => categories,
    });
    fixture.detectChanges();

    const fab = fixture.nativeElement.querySelector('app-floating-action-button');

    expect(fab).toBeTruthy();
  });

  it('debe cerrar el modal después de crear una categoría', async () => {
    const command: CreateCategoryCommand = { name: 'Compras' };
    component.isCreateModalOpen = true;

    await component.onSubmitCategory(command);

    expect(categoryFacadeSpy.createCategory).toHaveBeenCalledOnceWith(command);
    expect(component.isCreateModalOpen).toBeFalse();
  });

  it('debe abrir el modal de edición', () => {
    Object.defineProperty(categoryFacadeSpy, 'categories', {
      get: () => [editingCategory],
    });

    component.onEditCategory('work');

    expect(component.editingCategory).toEqual(editingCategory);
    expect(component.isCreateModalOpen).toBeTrue();
  });

  it('debe editar una categoría desde el modal', async () => {
    const command: CreateCategoryCommand = { name: 'Trabajo actualizado' };
    component.editingCategory = editingCategory;
    component.isCreateModalOpen = true;

    await component.onSubmitCategory(command);

    expect(categoryFacadeSpy.updateCategory).toHaveBeenCalledOnceWith('work', command);
    expect(component.isCreateModalOpen).toBeFalse();
    expect(component.editingCategory).toBeNull();
  });

  it('al confirmar eliminación llama CategoryFacade.deleteCategory', async () => {
    await component.onDeleteCategory('work');

    const deleteButton = alertConfig!.buttons?.find(
      (button): button is AlertButton => typeof button === 'object' && button.text === 'Eliminar',
    );

    expect(deleteButton).toBeTruthy();
    await deleteButton?.handler?.(undefined);

    expect(categoryFacadeSpy.deleteCategory).toHaveBeenCalledOnceWith('work');
  });

  it('al cancelar eliminación no llama CategoryFacade.deleteCategory', async () => {
    await component.onDeleteCategory('work');

    expect(alertControllerSpy.create).toHaveBeenCalled();
    expect(categoryFacadeSpy.deleteCategory).not.toHaveBeenCalled();
  });

  it('muestra toast de éxito después de crear una categoría', async () => {
    const command: CreateCategoryCommand = { name: 'Compras' };

    await component.onSubmitCategory(command);

    expect(component.toastOpen).toBeTrue();
    expect(component.toastMessage).toBe('Categoría creada correctamente');
    expect(component.toastColor).toBe('success');
  });

  it('muestra toast de error cuando falla una operación', async () => {
    categoryFacadeSpy.createCategory.and.rejectWith(new Error('Error de red'));
    component.isCreateModalOpen = true;
    const command: CreateCategoryCommand = { name: 'Compras' };

    await component.onSubmitCategory(command);

    expect(component.toastOpen).toBeTrue();
    expect(component.toastMessage).toBe('No fue posible completar la operación');
    expect(component.toastColor).toBe('danger');
    expect(component.isCreateModalOpen).toBeTrue();
  });
});
