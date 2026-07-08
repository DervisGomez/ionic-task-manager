import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CategoryFilterComponent } from './category-filter.component';
import { FilterOption } from '../../models/filter-option.model';

describe('CategoryFilterComponent', () => {
  let component: CategoryFilterComponent;
  let fixture: ComponentFixture<CategoryFilterComponent>;

  const options: readonly FilterOption[] = [
    { id: 'all', label: 'Todas' },
    { id: 'work', label: 'Trabajo' },
    { id: 'personal', label: 'Personal' },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryFilterComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFilterComponent);
    component = fixture.componentInstance;
    component.options = options;
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
});
