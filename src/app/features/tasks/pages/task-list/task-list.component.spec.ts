import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@shared/shared.module';

import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      imports: [IonicModule.forRoot(), SharedModule],
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
});
