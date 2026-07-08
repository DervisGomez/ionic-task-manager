import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterOption } from '../../models/filter-option.model';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
  standalone: false,
})
export class CategoryFilterComponent {
  /**
   * Opciones disponibles para el filtro.
   */
  @Input({ required: true }) options: readonly FilterOption[] = [];

  /**
   * Id seleccionado actualmente.
   */
  @Input() selected = '';

  /**
   * Emite únicamente el id cuando cambia la selección.
   */
  @Output() selectedChange = new EventEmitter<string>();

  /**
   * Selecciona el id y emite su valor únicamente si cambia la selección.
   */
  select(id: string): void {
    if (id === this.selected) {
      return;
    }

    this.selectedChange.emit(id);
  }
}
