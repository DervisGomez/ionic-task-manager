import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyStateComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Aun no hay tareas');
    fixture.componentRef.setInput(
      'description',
      'Crea tu primera tarea y comienza a organizar tu dia.',
    );
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const title = fixture.nativeElement.querySelector('.empty-state__title');
    expect(title?.textContent).toContain('Aun no hay tareas');
    expect(title?.id).toBe(component.titleId);
  });

  it('should render the description', () => {
    const description = fixture.nativeElement.querySelector('.empty-state__description');
    expect(description?.textContent).toContain(
      'Crea tu primera tarea y comienza a organizar tu dia.',
    );
  });

  it('should render the icon', () => {
    const icon = fixture.nativeElement.querySelector('ion-icon');
    expect(icon?.getAttribute('name')).toBe('document-outline');
  });

  it('should show button when buttonText exists', () => {
    fixture.componentRef.setInput('buttonText', 'Anade tu primera tarea');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('ion-button')).not.toBeNull();
  });

  it('should hide button when buttonText does not exist', () => {
    fixture.componentRef.setInput('buttonText', undefined);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('ion-button')).toBeNull();
  });

  it('should emit action()', () => {
    const emitSpy = spyOn(component.action, 'emit');

    component.onAction();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith();
  });
});
