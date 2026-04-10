import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Empty state component for displaying when no data is available
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  /**
   * Title for the empty state
   */
  title = input<string>('');

  /**
   * Description for the empty state
   */
  description = input<string>('');

  /**
   * Optional action button text
   */
  actionText = input<string>('');

  /**
   * Emits when action button is clicked
   */
  action = output<void>();

  onAction(): void {
    this.action.emit();
  }
}