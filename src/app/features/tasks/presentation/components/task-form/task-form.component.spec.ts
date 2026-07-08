import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskFormComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
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
});
