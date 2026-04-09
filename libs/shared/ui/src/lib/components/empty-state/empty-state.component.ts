import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Empty state component for displaying when no data is available
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  /**
   * Title for the empty state
   */
  @Input() title: string = '';

  /**
   * Description for the empty state
   */
  @Input() description: string = '';

  /**
   * Optional action button text
   */
  @Input() actionText: string = '';

  /**
   * Emits when action button is clicked
   */
  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}