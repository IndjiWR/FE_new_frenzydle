import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthModalService } from '@shared/feature';

/**
 * Guest Teaser Component
 *
 * Overlay shown to guests when they try to view stats/achievements.
 * Prompts them to sign in with a blurred background.
 */
@Component({
  selector: 'app-guest-teaser',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './guest-teaser.component.html',
  styleUrls: ['./guest-teaser.component.css'],
})
export class GuestTeaserComponent {
  private readonly authModalService = inject(AuthModalService);
  private readonly router = inject(Router);

  /**
   * Open auth modal to create account
   */
  onCreateAccount(): void {
    this.authModalService.open();
  }

  /**
   * Navigate back to home
   */
  onMaybeLater(): void {
    this.router.navigateByUrl('/');
  }
}