import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserProfile } from '@shared/data';

/**
 * User profile header component
 *
 * Displays user avatar, display name (editable), email, and guest badge.
 * Animated entrance on page load.
 */
@Component({
  selector: 'app-user-profile-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './user-profile-header.component.html',
  styleUrls: ['./user-profile-header.component.css'],
})
export class UserProfileHeaderComponent {
  /**
   * Current user profile
   */
  user = input<UserProfile | null>(null);

  /**
   * Whether user is a guest
   */
  isGuest = input<boolean>(true);

  /**
   * Whether dark theme is active
   */
  isDarkTheme = input<boolean>(false);

  /**
   * Emits when display name is changed
   */
  displayNameChange = output<string>();

  // Edit state
  isEditing = signal(false);
  editValue = signal('');

  // Computed
  displayName = computed(() => this.user()?.displayName ?? 'Guest');
  email = computed(() => this.user()?.email ?? null);
  avatarUrl = computed(() => this.user()?.avatarUrl ?? null);
  initial = computed(() => this.displayName().charAt(0).toUpperCase());

  /**
   * Start editing display name
   */
  startEdit(): void {
    this.editValue.set(this.displayName());
    this.isEditing.set(true);
  }

  /**
   * Cancel editing
   */
  cancelEdit(): void {
    this.isEditing.set(false);
    this.editValue.set('');
  }

  /**
   * Confirm edit (on Enter or blur)
   */
  confirmEdit(): void {
    const newName = this.editValue().trim();
    if (newName && newName !== this.displayName()) {
      this.displayNameChange.emit(newName);
    }
    this.isEditing.set(false);
    this.editValue.set('');
  }

  /**
   * Handle keydown in edit input
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.confirmEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }
}