import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { FilterOption } from '../../models/filter-option.model';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CategoryFilterComponent implements OnInit, OnChanges {
  /**
   * Categorías disponibles para el filtro.
   */
  @Input({ required: true }) categories: readonly { readonly id: string; readonly name: string }[] =
    [];

  /**
   * Id seleccionado actualmente.
   */
  @Input() selected = '';

  /**
   * Emite únicamente el id cuando cambia la selección.
   */
  @Output() readonly selectedChange = new EventEmitter<string>();

  options: readonly FilterOption[] = [{ id: 'all', label: 'Todas' }];

  private static readonly NAVIGATION_KEYS = [
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
  ] as const;

  ngOnInit(): void {
    this.refreshOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories']) {
      this.refreshOptions();
    }
  }

  /**
   * Selecciona el id y emite su valor únicamente si cambia la selección.
   */
  select(id: string): void {
    if (id === this.selected) {
      return;
    }

    this.selectedChange.emit(id);
    this.focusOption(id);
  }

  onKeydown(event: KeyboardEvent, optionId: string): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.select(optionId);
      return;
    }

    if (
      !CategoryFilterComponent.NAVIGATION_KEYS.includes(
        event.key as (typeof CategoryFilterComponent.NAVIGATION_KEYS)[number],
      )
    ) {
      return;
    }

    event.preventDefault();

    const optionIds = this.options.map((option) => option.id);
    const currentIndex = optionIds.indexOf(optionId);
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % optionIds.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + optionIds.length) % optionIds.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = optionIds.length - 1;
        break;
    }

    const nextId = optionIds[nextIndex];
    this.focusOption(nextId);

    if (nextId !== this.selected) {
      this.selectedChange.emit(nextId);
    }
  }

  private refreshOptions(): void {
    this.options = [
      { id: 'all', label: 'Todas' },
      ...this.categories.map(({ id, name }) => ({ id, label: name })),
    ];
  }

  private focusOption(id: string): void {
    document.getElementById(`category-option-${id}`)?.focus();
  }
}
