import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { CategoryViewModel } from '../../models/category.viewmodel';
import { CategoryCardComponent } from './category-card.component';

describe('CategoryCardComponent', () => {
  let component: CategoryCardComponent;
  let fixture: ComponentFixture<CategoryCardComponent>;

  const category: CategoryViewModel = {
    id: 'work',
    name: 'Trabajo',
  };

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryCardComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryCardComponent);
    component = fixture.componentInstance;
    component.category = category;
    fixture.detectChanges();
    flush();
  }));

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('renderiza el nombre', () => {
    const title = fixture.debugElement.query(By.css('.category-card__title'))
      .nativeElement as HTMLElement;

    expect(title.textContent?.trim()).toBe(category.name);
  });

  it('emite edit', () => {
    spyOn(component.edit, 'emit');

    component.onEdit();

    expect(component.edit.emit).toHaveBeenCalledOnceWith(category.id);
  });

  it('emite delete', () => {
    spyOn(component.delete, 'emit');

    component.onDelete();

    expect(component.delete.emit).toHaveBeenCalledOnceWith(category.id);
  });

  it('asocia la tarjeta con el título mediante aria-labelledby', () => {
    const card = fixture.debugElement.query(By.css('ion-card')).nativeElement as HTMLElement;

    expect(card.getAttribute('aria-labelledby')).toBe(`category-title-${category.id}`);
  });
});
