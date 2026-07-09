import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: false,
})
export class SearchBarComponent {
  private static nextId = 0;

  readonly labelId = `app-search-label-${SearchBarComponent.nextId++}`;

  /** Placeholder text displayed in the search field. */
  @Input() placeholder = 'Buscar...';

  /** Accessible label for the search field. Defaults to the placeholder. */
  @Input() ariaLabel?: string;

  /** Current search value bound from the parent. */
  @Input() value = '';

  /** Debounce time in milliseconds before emitting value changes. */
  @Input() debounce = 300;

  /** Whether the search field is disabled. */
  @Input() disabled = false;

  /** Emits the current search value as a plain string. */
  @Output() readonly valueChange = new EventEmitter<string>();

  get accessibleLabel(): string {
    return this.ariaLabel ?? this.placeholder;
  }

  onInput(event: Event): void {
    const { value } = (event as CustomEvent<{ value?: string }>).detail;
    this.valueChange.emit(value ?? '');
  }
}
