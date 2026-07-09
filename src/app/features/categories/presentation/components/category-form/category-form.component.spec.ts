import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CategoryViewModel } from '../../models/category.viewmodel';
import { CategoryFormComponent } from './category-form.component';

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;

  const category: CategoryViewModel = {
    id: 'work',
    name: 'Trabajo',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryFormComponent],
      imports: [ReactiveFormsModule, IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('aplica patchValue cuando cambia category', () => {
    component.category = category;

    component.ngOnChanges({
      category: {
        currentValue: category,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.form.getRawValue()).toEqual({ name: 'Trabajo' });
  });

  it('debe emitir submitCategory cuando el formulario es válido', () => {
    spyOn(component.submitCategory, 'emit');

    component.form.setValue({ name: 'Personal' });
    component.onSubmit();

    expect(component.submitCategory.emit).toHaveBeenCalledOnceWith({ name: 'Personal' });
  });

  it('no debe emitir submitCategory cuando el formulario es inválido', () => {
    spyOn(component.submitCategory, 'emit');
    component.form.setValue({ name: '' });

    component.onSubmit();

    expect(component.submitCategory.emit).not.toHaveBeenCalled();
  });

  it('debe emitir cancel al pulsar Cancelar', () => {
    spyOn(component.cancel, 'emit');

    component.onCancel();

    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('muestra la cabecera de creación por defecto', () => {
    const title = fixture.debugElement.query(By.css('.category-form__title'))
      .nativeElement as HTMLElement;
    const subtitle = fixture.debugElement.query(By.css('.category-form__subtitle'))
      .nativeElement as HTMLElement;

    expect(title.textContent?.trim()).toBe('Nueva categoría');
    expect(subtitle.textContent?.trim()).toBe('Crea una categoría para organizar tus tareas.');
  });

  it('muestra la cabecera de edición cuando recibe category', () => {
    component.category = category;
    component.ngOnChanges({
      category: {
        currentValue: category,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.category-form__title'))
      .nativeElement as HTMLElement;
    const subtitle = fixture.debugElement.query(By.css('.category-form__subtitle'))
      .nativeElement as HTMLElement;

    expect(title.textContent?.trim()).toBe('Editar categoría');
    expect(subtitle.textContent?.trim()).toBe('Actualiza el nombre de esta categoría.');
  });

  it('muestra mensaje de error cuando el nombre es inválido', () => {
    component.form.controls.name.markAsTouched();
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('#category-name-error'))
      .nativeElement as HTMLElement;

    expect(component.getFieldError('name')).toBe('Este campo es obligatorio');
    expect(error.textContent?.trim()).toBe('Este campo es obligatorio');
  });
});
