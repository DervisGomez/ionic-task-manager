import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchBarComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a string value on input', () => {
    const emitSpy = spyOn(component.valueChange, 'emit');

    component.onInput(new CustomEvent('ionInput', { detail: { value: 'tarea' } }));

    expect(emitSpy).toHaveBeenCalledWith('tarea');
  });

  it('should emit an empty string when value is undefined', () => {
    const emitSpy = spyOn(component.valueChange, 'emit');

    component.onInput(new CustomEvent('ionInput', { detail: {} }));

    expect(emitSpy).toHaveBeenCalledWith('');
  });

  it('should set aria-label from placeholder by default', () => {
    fixture.componentRef.setInput('placeholder', 'Buscar tareas...');
    fixture.detectChanges();

    const searchbar = fixture.nativeElement.querySelector('ion-searchbar') as HTMLElement;
    const label = fixture.nativeElement.querySelector('label.visually-hidden') as HTMLLabelElement;

    expect(searchbar.getAttribute('aria-label')).toBe('Buscar tareas...');
    expect(searchbar.getAttribute('aria-labelledby')).toBe(component.labelId);
    expect(label.id).toBe(component.labelId);
    expect(label.textContent?.trim()).toBe('Buscar tareas...');
  });

  it('should prefer ariaLabel over placeholder for the accessible label', () => {
    fixture.componentRef.setInput('placeholder', 'Buscar tareas...');
    fixture.componentRef.setInput('ariaLabel', 'Buscar en el listado de tareas');
    fixture.detectChanges();

    const searchbar = fixture.nativeElement.querySelector('ion-searchbar') as HTMLElement;
    const label = fixture.nativeElement.querySelector('label.visually-hidden') as HTMLLabelElement;

    expect(searchbar.getAttribute('aria-label')).toBe('Buscar en el listado de tareas');
    expect(searchbar.getAttribute('aria-labelledby')).toBe(component.labelId);
    expect(label.textContent?.trim()).toBe('Buscar en el listado de tareas');
  });
});
