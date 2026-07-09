import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;

  @Input() subtitle?: string;

  @Input() actionIcon?: string;

  @Input() actionAriaLabel?: string;

  @Input() showBackButton = false;

  @Input() backAriaLabel = 'Volver a tareas';

  @Output() readonly action = new EventEmitter<void>();

  @Output() readonly back = new EventEmitter<void>();

  onActionClick(): void {
    this.action.emit();
  }

  onBackClick(): void {
    this.back.emit();
  }
}
