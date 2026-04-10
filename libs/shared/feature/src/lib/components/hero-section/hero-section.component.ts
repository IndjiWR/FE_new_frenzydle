import { Component, input, ChangeDetectionStrategy, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LogoComponent } from '@shared/ui';
import { Subscription } from 'rxjs';

/**
 * Hero section component for the homepage
 * Displays animated logo with fade-in subtitle
 */
@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [TranslateModule, LogoComponent],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  private translate = inject(TranslateService);

  /**
   * Custom title (defaults to FrenzyDle)
   */
  title = input<string>('FrenzyDle');

  /**
   * Custom subtitle key for translation
   */
  subtitleKey = input<string>('home.subtitle');

  /**
   * Whether to animate on mount
   */
  animated = input<boolean>(true);

  /**
   * Whether logo animation is complete (show subtitle)
   */
  showSubtitle = signal<boolean>(false);

  /**
   * Current subtitle text (for language changes)
   */
  subtitleText = signal<string>('');

  /**
   * Language change subscription
   */
  private langChangeSubscription: Subscription | null = null;

  ngOnInit(): void {
    // Set initial subtitle text
    this.updateSubtitleText();

    // Subscribe to language changes
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.updateSubtitleText();
    });

    // If not animated, show subtitle immediately
    if (!this.animated()) {
      this.showSubtitle.set(true);
    } else {
      // Wait for logo animation to complete before showing subtitle
      setTimeout(() => {
        this.showSubtitle.set(true);
      }, 600);
    }
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  /**
   * Update subtitle text from translation
   */
  private updateSubtitleText(): void {
    const key = this.subtitleKey();
    const text = this.translate.instant(key);
    this.subtitleText.set(text);
  }
}