import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Error state component for displaying error messages
 * With retry button for recovery
 */
@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStateComponent {
  /**
   * Custom error message (optional, uses translation if not provided)
   */
  message = input<string>('');

  /**
   * Emits when retry button is clicked
   */
  retry = output<void>();

  onRetry(): void {
    this.retry.emit();
  }
}