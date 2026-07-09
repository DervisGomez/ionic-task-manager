import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CategoryViewModel } from '../../models/category.viewmodel';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  standalone: false,
})
export class CategoryCardComponent {
  @Input({ required: true }) category!: CategoryViewModel;

  @Output() readonly edit = new EventEmitter<string>();

  @Output() readonly delete = new EventEmitter<string>();

  onEdit(): void {
    this.edit.emit(this.category.id);
  }

  onDelete(): void {
    this.delete.emit(this.category.id);
  }

  get editAriaLabel(): string {
    return `Editar categoría ${this.category.name}`;
  }

  get deleteAriaLabel(): string {
    return `Eliminar categoría ${this.category.name}`;
  }
}
