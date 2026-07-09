import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { TaskViewModel } from '../../models/task.viewmodel';
import { TaskCardComponent } from './task-card.component';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  const task: TaskViewModel = {
    id: 'task-1',
    title: 'Planificar sprint',
    description: 'Definir alcance y riesgos',
    categoryId: 'work',
    categoryLabel: 'Trabajo',
    completed: true,
    statusLabel: 'Completada',
    statusColor: 'success',
  };

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TaskCardComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    component.task = task;
    fixture.detectChanges();
    flush();
  }));

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('renderiza el título', () => {
    const title = fixture.debugElement.query(By.css('.task-card__title'))
      .nativeElement as HTMLElement;
    expect(title.textContent?.trim()).toBe(task.title);
  });

  it('renderiza la descripción', () => {
    const description = fixture.debugElement.query(By.css('.task-card__description'))
      .nativeElement as HTMLElement;
    expect(description.textContent?.trim()).toBe(task.description);
  });

  it('no renderiza descripción cuando está vacía', () => {
    component.task = { ...task, description: '' };
    fixture.detectChanges();

    const description = fixture.debugElement.query(By.css('.task-card__description'));

    expect(description).toBeNull();
  });

  it('aplica estado visual completado en la tarjeta', () => {
    const card = fixture.debugElement.query(By.css('.task-card--completed'));

    expect(card).toBeTruthy();
  });

  it('renderiza categoryLabel', () => {
    const category = fixture.debugElement.query(By.css('.task-card__category'))
      .nativeElement as HTMLElement;
    expect(category.textContent?.trim()).toBe(task.categoryLabel);
  });

  it('no muestra categoría cuando la tarea no tiene categoría', () => {
    component.task = { ...task, categoryId: '', categoryLabel: '' };
    fixture.detectChanges();

    const category = fixture.debugElement.query(By.css('.task-card__category'));
    const meta = fixture.debugElement.query(By.css('.task-card__meta--status-only'));

    expect(category).toBeNull();
    expect(meta).toBeTruthy();
  });

  it('renderiza statusLabel', () => {
    const status = fixture.debugElement.query(By.css('ion-badge')).nativeElement as HTMLElement;
    expect(status.textContent?.trim()).toBe(task.statusLabel);
  });

  it('checkbox refleja completed', () => {
    const checkbox = fixture.debugElement.query(By.css('ion-checkbox'))
      .nativeElement as HTMLIonCheckboxElement;
    expect(checkbox.checked).toBeTrue();
  });

  it('emite toggleCompleted', () => {
    spyOn(component.toggleCompleted, 'emit');

    component.onToggleCompleted();

    expect(component.toggleCompleted.emit).toHaveBeenCalledOnceWith(task.id);
  });

  it('emite edit', () => {
    spyOn(component.edit, 'emit');

    component.onEdit();

    expect(component.edit.emit).toHaveBeenCalledOnceWith(task.id);
  });

  it('emite delete', () => {
    spyOn(component.delete, 'emit');

    component.onDelete();

    expect(component.delete.emit).toHaveBeenCalledOnceWith(task.id);
  });

  it('expone aria-label contextual en el checkbox', () => {
    const checkbox = fixture.debugElement.query(By.css('ion-checkbox'))
      .nativeElement as HTMLElement;

    expect(checkbox.getAttribute('aria-label')).toBe('Marcar "Planificar sprint" como pendiente');
  });

  it('expone aria-label contextual en el botón Ver más', () => {
    const longDescription =
      'Texto largo que supera el umbral para mostrar el control de expansión en la tarjeta de tarea dentro del listado principal de la aplicación.';
    component.task = { ...task, description: longDescription };
    fixture.detectChanges();

    const toggle = fixture.debugElement.query(By.css('.task-card__toggle'))
      .nativeElement as HTMLButtonElement;

    expect(toggle.getAttribute('aria-label')).toBe('Expandir descripción de Planificar sprint');
  });

  it('asocia el artículo con el título mediante aria-labelledby', () => {
    const card = fixture.debugElement.query(By.css('ion-card')).nativeElement as HTMLElement;

    expect(card.getAttribute('aria-labelledby')).toBe(`task-title-${task.id}`);
  });

  it('no muestra Ver más cuando la descripción es corta', () => {
    const toggle = fixture.debugElement.query(By.css('.task-card__toggle'));

    expect(toggle).toBeNull();
  });

  it('expande y colapsa descripciones largas', () => {
    const longDescription =
      'Texto largo que supera el umbral para mostrar el control de expansión en la tarjeta de tarea dentro del listado principal de la aplicación.';
    component.task = { ...task, description: longDescription };
    fixture.detectChanges();

    const description = fixture.debugElement.query(By.css('.task-card__description'))
      .nativeElement as HTMLElement;
    const toggle = fixture.debugElement.query(By.css('.task-card__toggle'))
      .nativeElement as HTMLButtonElement;

    expect(toggle.textContent?.trim()).toBe('Ver más');
    expect(description.classList.contains('task-card__description--expanded')).toBeFalse();

    toggle.click();
    fixture.detectChanges();

    expect(description.classList.contains('task-card__description--expanded')).toBeTrue();
    expect(toggle.textContent?.trim()).toBe('Ver menos');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    toggle.click();
    fixture.detectChanges();

    expect(description.classList.contains('task-card__description--expanded')).toBeFalse();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('reinicia la expansión cuando cambia la tarea', () => {
    component.task = {
      ...task,
      id: 'task-2',
      description:
        'Otra descripción suficientemente larga para activar el botón Ver más en la tarjeta de tarea del listado.',
    };
    fixture.detectChanges();

    component.toggleDescription(new Event('click'));
    fixture.detectChanges();

    component.task = {
      ...task,
      id: 'task-3',
      description:
        'Tercera descripción larga que también debe mostrar el control Ver más tras actualizar la tarea.',
    };
    component.ngOnChanges({
      task: {
        currentValue: component.task,
        previousValue: { ...task, id: 'task-2' },
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    fixture.detectChanges();

    const description = fixture.debugElement.query(By.css('.task-card__description'))
      .nativeElement as HTMLElement;

    expect(component.isDescriptionExpanded).toBeFalse();
    expect(description.classList.contains('task-card__description--expanded')).toBeFalse();
  });

  it('mantiene la expansión cuando la tarea recibe una nueva referencia con el mismo id', () => {
    const longDescription =
      'Texto largo que supera el umbral para mostrar el control de expansión en la tarjeta de tarea dentro del listado principal de la aplicación.';

    component.task = { ...task, description: longDescription };
    fixture.detectChanges();

    component.toggleDescription(new Event('click'));
    fixture.detectChanges();

    const previousTask = component.task;
    component.task = { ...previousTask, description: longDescription };
    component.ngOnChanges({
      task: {
        currentValue: component.task,
        previousValue: previousTask,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    fixture.detectChanges();

    const description = fixture.debugElement.query(By.css('.task-card__description'))
      .nativeElement as HTMLElement;

    expect(component.isDescriptionExpanded).toBeTrue();
    expect(description.classList.contains('task-card__description--expanded')).toBeTrue();
  });
});
