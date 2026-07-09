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

  it('renderiza categoryLabel', () => {
    const category = fixture.debugElement.query(By.css('.task-card__category'))
      .nativeElement as HTMLElement;
    expect(category.textContent?.trim()).toBe(task.categoryLabel);
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

  it('asocia el artículo con el título mediante aria-labelledby', () => {
    const card = fixture.debugElement.query(By.css('ion-card')).nativeElement as HTMLElement;

    expect(card.getAttribute('aria-labelledby')).toBe(`task-title-${task.id}`);
  });
});
