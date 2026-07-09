import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CategoryFilterComponent } from './category-filter.component';

describe('CategoryFilterComponent', () => {
  let component: CategoryFilterComponent;
  let fixture: ComponentFixture<CategoryFilterComponent>;

  const categories = [
    { id: 'work', name: 'Trabajo' },
    { id: 'personal', name: 'Personal' },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryFilterComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFilterComponent);
    component = fixture.componentInstance;
    component.categories = categories;
    component.selected = 'all';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the options', () => {
    const chips = fixture.nativeElement.querySelectorAll('ion-chip');
    expect(chips.length).toBe(3);

    expect(fixture.nativeElement.textContent).toContain('Todas');
    expect(fixture.nativeElement.textContent).toContain('Trabajo');
    expect(fixture.nativeElement.textContent).toContain('Personal');
  });

  it('should emit the selected id when selecting a different option', () => {
    const emitSpy = spyOn(component.selectedChange, 'emit');

    component.select('work');

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('work');
  });

  it('should not emit when selecting the already selected option', () => {
    const emitSpy = spyOn(component.selectedChange, 'emit');

    component.select('all');

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should mark the selected option with aria-checked', () => {
    const selectedOption = fixture.nativeElement.querySelector(
      'ion-chip[aria-checked="true"]',
    ) as HTMLElement;

    expect(selectedOption?.textContent?.trim()).toBe('Todas');
  });

  it('should expose tabindex 0 only on the selected option', () => {
    const options = fixture.nativeElement.querySelectorAll('ion-chip[role="radio"]');

    expect(options[0].getAttribute('tabindex')).toBe('0');
    expect(options[1].getAttribute('tabindex')).toBe('-1');
    expect(options[2].getAttribute('tabindex')).toBe('-1');
  });

  it('should expose radiogroup semantics', () => {
    const group = fixture.nativeElement.querySelector('nav[role="radiogroup"]') as HTMLElement;

    expect(group).toBeTruthy();
    expect(group.getAttribute('aria-label')).toBe('Filtros por categoría');
  });

  it('should navigate with keyboard arrows', () => {
    const emitSpy = spyOn(component.selectedChange, 'emit');

    component.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }), 'all');

    expect(emitSpy).toHaveBeenCalledOnceWith('work');
  });
});
