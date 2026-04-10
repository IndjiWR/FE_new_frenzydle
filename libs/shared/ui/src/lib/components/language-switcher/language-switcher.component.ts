import { Component, output, ChangeDetectionStrategy, signal, OnInit, HostListener, ElementRef, computed, effect } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from '@shared/data';

/**
 * Language switcher component for i18n
 * Displays a dropdown with available languages
 * Persists selection to localStorage
 */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent implements OnInit {
  /**
   * Available languages
   */
  languages = SUPPORTED_LANGUAGES;

  /**
   * Currently selected language
   */
  currentLanguage = signal<string>(DEFAULT_LANGUAGE);

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

  constructor(
    private translate: TranslateService,
    private elementRef: ElementRef,
  ) {
    // Keep currentLanguage in sync with translate service
    effect(() => {
      const lang = this.translate.currentLang;
      if (lang && lang !== this.currentLanguage()) {
        this.currentLanguage.set(lang);
      }
    });
  }

  ngOnInit(): void {
    // Get current language from translate service
    const currentLang = this.translate.currentLang || this.translate.defaultLang || DEFAULT_LANGUAGE;
    this.currentLanguage.set(currentLang);

    // Subscribe to language changes from other components
    this.translate.onLangChange.subscribe((event) => {
      this.currentLanguage.set(event.lang);
    });
  }

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
    this.currentLanguage.set(langCode);
    this.translate.use(langCode);

    // Persist to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
    }

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