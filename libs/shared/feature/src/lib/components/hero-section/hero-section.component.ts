import { Component, Input, ChangeDetectionStrategy, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LogoComponent } from '@shared/ui';

/**
 * Hero section component for the homepage
 * Displays animated logo and typewriter subtitle
 */
@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, TranslateModule, LogoComponent],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent implements OnInit {
  /**
   * Custom title (defaults to FrenzyDle)
   */
  @Input() title: string = 'FrenzyDle';

  /**
   * Custom subtitle key for translation
   */
  @Input() subtitleKey: string = 'home.subtitle';

  /**
   * Whether to animate on mount
   */
  @Input() animated: boolean = true;

  /**
   * Typewriter text state
   */
  typewriterText = signal<string>('');

  /**
   * Whether logo animation is complete
   */
  logoAnimationComplete = signal<boolean>(false);

  /**
   * Full subtitle text
   */
  private fullText: string = '';

  /**
   * Typewriter interval reference
   */
  private typewriterInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    // Set up the subtitle for typewriter effect
    if (this.animated) {
      // Wait for logo animation to complete before starting typewriter
      setTimeout(() => {
        this.logoAnimationComplete.set(true);
      }, 600);
    }
  }

  /**
   * Start typewriter effect
   * Called when logo animation completes
   */
  startTypewriter(text: string): void {
    this.fullText = text;
    this.typewriterText.set('');

    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }

    let charIndex = 0;
    const speed = 40; // ms per character

    this.typewriterInterval = setInterval(() => {
      if (charIndex < this.fullText.length) {
        this.typewriterText.update(current => current + this.fullText[charIndex]);
        charIndex++;
      } else {
        if (this.typewriterInterval) {
          clearInterval(this.typewriterInterval);
        }
      }
    }, speed);
  }

  /**
   * Handle logo animation complete
   */
  onLogoAnimationComplete(): void {
    this.logoAnimationComplete.set(true);
  }
}