import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { FloatingActionButtonComponent } from './floating-action-button.component';

describe('FloatingActionButtonComponent', () => {
  let component: FloatingActionButtonComponent;
  let fixture: ComponentFixture<FloatingActionButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FloatingActionButtonComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FloatingActionButtonComponent);
    component = fixture.componentInstance;
    component.icon = 'add';
    component.ariaLabel = 'Crear tarea';
    component.disabled = false;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the icon', () => {
    const icon = fixture.nativeElement.querySelector('ion-icon');
    expect(icon?.getAttribute('name')).toBe('add');
  });

  it('should expose accessible label without duplicate hidden labels', () => {
    const accessibleLabel = fixture.nativeElement.querySelector('.visually-hidden') as HTMLElement;

    expect(component.ariaLabel).toBe('Crear tarea');
    expect(accessibleLabel?.textContent).toBe('Crear tarea');
    expect(fixture.nativeElement.querySelector('span[hidden]')).toBeNull();
    expect(fixture.nativeElement.querySelector('ion-fab-button')).toBeTruthy();
  });

  it('should reflect disabled state', () => {
    component.disabled = true;
    fixture.detectChanges();

    const buttonDebugEl = fixture.debugElement.query(By.css('ion-fab-button'));

    const nativeButton = buttonDebugEl?.nativeElement as unknown as
      { disabled?: boolean; ariaDisabled?: string } | undefined;

    const hasNativeDisabled = buttonDebugEl?.nativeElement?.hasAttribute('disabled') ?? false;
    const nativeDisabled = nativeButton?.disabled === true;
    const ngReflectDisabled = buttonDebugEl?.attributes['ng-reflect-disabled'];
    const ariaDisabled =
      buttonDebugEl?.attributes['aria-disabled'] === 'true' ||
      nativeButton?.ariaDisabled === 'true' ||
      buttonDebugEl?.nativeElement?.getAttribute('aria-disabled') === 'true';

    expect(
      hasNativeDisabled || nativeDisabled || ngReflectDisabled === 'true' || ariaDisabled,
    ).toBe(true);
  });

  it('should emit action() when clicked', () => {
    const emitSpy = spyOn(component.action, 'emit');

    const button = fixture.nativeElement.querySelector('ion-fab-button');
    button?.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
