import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  standalone: false,
})
export class EmptyStateComponent {
  /**
   * Nombre del icono mostrado en el estado vacio.
   */
  @Input() icon = 'document-outline';

  /**
   * Titulo principal del estado vacio.
   */
  @Input({ required: true }) title!: string;

  /**
   * Descripcion de apoyo del estado vacio.
   */
  @Input({ required: true }) description!: string;

  /**
   * Texto del boton de accion opcional.
   */
  @Input() buttonText?: string;

  /**
   * Indica si el boton de accion esta deshabilitado.
   */
  @Input() buttonDisabled = false;

  /**
   * Emite la accion principal del estado vacio.
   */
  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}
