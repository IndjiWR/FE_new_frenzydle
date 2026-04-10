import { Component, output, ChangeDetectionStrategy, signal, HostListener, ElementRef, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@shared/data';

/**
 * Language switcher component for i18n
 * Displays a dropdown with available languages
 * Uses LanguageService for state management
 */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  private readonly languageService = inject(LanguageService);
  private readonly elementRef = inject(ElementRef);

  /**
   * Available languages
   */
  languages = this.languageService.languages;

  /**
   * Currently selected language (from service)
   */
  currentLanguage = this.languageService.language;

  /**
   * Whether the dropdown is open
   */
  isOpen = signal<boolean>(false);

  /**
   * Emits when language is changed
   */
  languageChange = output<string>();

  /**
   * Get the language object for the current selection
   */
  currentLang = computed(() => {
    return this.languages.find(l => l.code === this.currentLanguage()) || this.languages[0];
  });

  /**
   * Toggle the dropdown
   */
  toggleDropdown(): void {
    this.isOpen.update(v => !v);
  }

  /**
   * Close the dropdown
   */
  closeDropdown(): void {
    this.isOpen.set(false);
  }

  /**
   * Select a language
   */
  selectLanguage(langCode: string): void {
    this.languageService.setLanguage(langCode);
    this.languageChange.emit(langCode);
    this.closeDropdown();
  }

  /**
   * Close dropdown when clicking outside the component
   */
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: EventTarget | null): void {
    if (!target) return;
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside && this.isOpen()) {
      this.closeDropdown();
    }
  }
}