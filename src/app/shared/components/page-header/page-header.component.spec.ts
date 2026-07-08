import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageHeaderComponent],
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
});
