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
});
