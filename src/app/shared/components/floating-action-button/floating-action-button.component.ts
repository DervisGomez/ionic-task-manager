import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-floating-action-button',
  templateUrl: './floating-action-button.component.html',
  styleUrls: ['./floating-action-button.component.scss'],
  standalone: false,
})
export class FloatingActionButtonComponent {
  /**
   * Nombre del icono de Ionicons.
   */
  @Input() icon = 'add';

  /**
   * Etiqueta accesible obligatoria para lectores de pantalla.
   */
  @Input({ required: true }) ariaLabel!: string;

  /**
   * Indica si el botón se encuentra deshabilitado.
   */
  @Input() disabled = false;

  /**
   * Acción principal del FAB.
   */
  @Output() action = new EventEmitter<void>();

  onAction(): void {
    if (this.disabled) return;
    this.action.emit();
  }
}
