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
    categoryLabel: 'Trabajo',
    completed: false,
    statusLabel: 'Pendiente',
    statusColor: 'medium',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskFormComponent],
      imports: [ReactiveFormsModule, IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
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

  it('debe emitir cancel al pulsar Cancelar', () => {
    spyOn(component.cancel, 'emit');

    component.onCancel();

    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('muestra mensaje de error cuando el título es inválido', () => {
    component.form.controls.title.markAsTouched();
    fixture.detectChanges();

    expect(component.getFieldError('title')).toBe('Este campo es obligatorio');
  });

  it('marca el título como inválido cuando falta', () => {
    component.form.controls.title.markAsTouched();
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('ion-input[formcontrolname="title"]'))
      .nativeElement as HTMLElement;

    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
