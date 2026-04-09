import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Error state component for displaying error messages
 * With retry button for recovery
 */
@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStateComponent {
  /**
   * Custom error message (optional, uses translation if not provided)
   */
  @Input() message: string = '';

  /**
   * Emits when retry button is clicked
   */
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}