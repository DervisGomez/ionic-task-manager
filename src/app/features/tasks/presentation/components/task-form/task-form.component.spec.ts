import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TaskViewModel } from '../../models/task.viewmodel';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  const task: TaskViewModel = {
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskFormComponent],
      imports: [ReactiveFormsModule, IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    component.categories = categories;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('aplica patchValue cuando cambia task', () => {
    component.task = task;

    component.ngOnChanges({
      task: {
        currentValue: task,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.form.getRawValue()).toEqual({
      title: 'Planificar sprint',
      description: 'Definir alcance',
      categoryId: 'work',
    });
  });

  it('debe emitir submitTask cuando el formulario es válido', () => {
    spyOn(component.submitTask, 'emit');

    component.form.setValue({
      title: 'Comprar víveres',
      description: 'Comprar frutas y verduras',
      categoryId: 'personal',
    });

    component.onSubmit();

    expect(component.submitTask.emit).toHaveBeenCalledOnceWith({
      title: 'Comprar víveres',
      description: 'Comprar frutas y verduras',
      categoryId: 'personal',
    });
  });

  it('no debe emitir submitTask cuando el formulario es inválido', () => {
    spyOn(component.submitTask, 'emit');
    component.form.setValue({
      title: '',
      description: '',
      categoryId: '',
    });

    component.onSubmit();

    expect(component.submitTask.emit).not.toHaveBeenCalled();
  });

  it('no debe emitir submitTask cuando falta la categoría', () => {
    spyOn(component.submitTask, 'emit');
    component.form.setValue({
      title: 'Tarea válida',
      description: '',
      categoryId: '',
    });

    component.onSubmit();

    expect(component.submitTask.emit).not.toHaveBeenCalled();
    expect(component.getFieldError('categoryId')).toBe('Selecciona una categoría');
  });

  it('muestra mensaje de error cuando la categoría es inválida', () => {
    component.form.controls.categoryId.markAsTouched();
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('#task-category-error'))
      .nativeElement as HTMLElement;
    const radiogroup = fixture.nativeElement.querySelector('[role="radiogroup"]') as HTMLElement;

    expect(component.getFieldError('categoryId')).toBe('Selecciona una categoría');
    expect(error.textContent?.trim()).toBe('Selecciona una categoría');
    expect(radiogroup.getAttribute('aria-invalid')).toBe('true');
    expect(radiogroup.getAttribute('aria-describedby')).toBe('task-category-error');
  });

  it('debe emitir cancel al pulsar Cancelar', () => {
    spyOn(component.cancel, 'emit');

    component.onCancel();

    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('muestra mensaje de error cuando el título es inválido', () => {
    component.form.controls.title.markAsTouched();
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('#task-title-error'))
      .nativeElement as HTMLElement;

    expect(component.getFieldError('title')).toBe('Este campo es obligatorio');
    expect(error.textContent?.trim()).toBe('Este campo es obligatorio');
  });

  it('muestra la cabecera de creación por defecto', () => {
    const title = fixture.debugElement.query(By.css('.task-form__title'))
      .nativeElement as HTMLElement;
    const subtitle = fixture.debugElement.query(By.css('.task-form__subtitle'))
      .nativeElement as HTMLElement;

    expect(title.textContent?.trim()).toBe('Nueva tarea');
    expect(subtitle.textContent?.trim()).toBe('Crea una nueva tarea para mantenerte organizado.');
  });

  it('muestra la cabecera de edición cuando recibe task', () => {
    component.task = task;
    component.ngOnChanges({
      task: {
        currentValue: task,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.task-form__title'))
      .nativeElement as HTMLElement;
    const subtitle = fixture.debugElement.query(By.css('.task-form__subtitle'))
      .nativeElement as HTMLElement;

    expect(title.textContent?.trim()).toBe('Editar tarea');
    expect(subtitle.textContent?.trim()).toBe('Actualiza la información de esta tarea.');
  });

  it('marca el título como inválido cuando falta', () => {
    component.form.controls.title.markAsTouched();
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('ion-input[formcontrolname="title"]'))
      .nativeElement as HTMLElement;

    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('asocia la descripción con el texto de ayuda', () => {
    expect(component.descriptionDescribedBy).toBe('task-description-helper');
  });

  it('expone radiogroup accesible para la categoría', () => {
    const radiogroup = fixture.nativeElement.querySelector('[role="radiogroup"]') as HTMLElement;
    const selectedRadio = fixture.nativeElement.querySelector(
      'button[role="radio"][aria-checked="false"]',
    ) as HTMLElement;

    expect(radiogroup.getAttribute('aria-labelledby')).toBe('task-form-category-label');
    expect(selectedRadio).toBeTruthy();
  });

  it('navega la categoría con teclado', () => {
    component.onCategoryKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }), 'work');

    expect(component.form.controls.categoryId.value).toBe('personal');
  });
});
