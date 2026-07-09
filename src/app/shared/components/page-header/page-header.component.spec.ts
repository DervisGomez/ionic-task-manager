import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageHeaderComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    component.title = 'Gestor de tareas';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title?.textContent).toContain('Gestor de tareas');
  });

  it('should render the subtitle when provided', () => {
    component.subtitle = 'Organiza tu día y enfócate en lo importante.';
    fixture.detectChanges();

    const subtitle = fixture.nativeElement.querySelector('p');
    expect(subtitle?.textContent).toContain('Organiza tu día y enfócate en lo importante.');
  });

  it('should not render the subtitle when not provided', () => {
    component.subtitle = undefined;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p')).toBeNull();
  });

  it('renderiza el botón de acción cuando se proporciona actionIcon', () => {
    component.actionIcon = 'pricetags-outline';
    component.actionAriaLabel = 'Administrar categorías';
    fixture.detectChanges();

    const actionButton = fixture.nativeElement.querySelector('.page-header__action') as HTMLElement;
    const accessibleLabel = actionButton.querySelector('.visually-hidden') as HTMLElement;

    expect(actionButton).toBeTruthy();
    expect(accessibleLabel?.textContent).toBe('Administrar categorías');
  });

  it('emite action al pulsar el botón de acción', () => {
    spyOn(component.action, 'emit');
    component.actionIcon = 'pricetags-outline';
    component.actionAriaLabel = 'Administrar categorías';
    fixture.detectChanges();

    component.onActionClick();

    expect(component.action.emit).toHaveBeenCalled();
  });

  it('renderiza el botón de regreso cuando showBackButton es true', () => {
    component.showBackButton = true;
    component.backAriaLabel = 'Volver a tareas';
    fixture.detectChanges();

    const backButton = fixture.nativeElement.querySelector('.page-header__back') as HTMLElement;
    const accessibleLabel = backButton.querySelector('.visually-hidden') as HTMLElement;

    expect(backButton).toBeTruthy();
    expect(accessibleLabel?.textContent).toBe('Volver a tareas');
  });

  it('emite back al pulsar el botón de regreso', () => {
    spyOn(component.back, 'emit');
    component.showBackButton = true;
    fixture.detectChanges();

    component.onBackClick();

    expect(component.back.emit).toHaveBeenCalled();
  });
});
