import { Component, inject, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarService, AuthService } from '@shared/data';
import { AvatarRendererComponent } from '@shared/ui';
import { GuestTeaserComponent } from '../guest-teaser/guest-teaser.component';
import { AvatarCategory } from '@shared/data';

/**
 * Avatar Tab Component
 *
 * Main avatar customization interface with:
 * - Large preview panel on the left
 * - Category selector and option grid on the right
 * - Save, randomize, and reset controls
 *
 * Uses AvatarService for state management.
 */
@Component({
  selector: 'app-avatar-tab',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AvatarRendererComponent,
    GuestTeaserComponent,
  ],
  templateUrl: './avatar-tab.component.html',
  styleUrls: ['./avatar-tab.component.css'],
})
export class AvatarTabComponent {
  protected readonly avatarService = inject(AvatarService);
  protected readonly authService = inject(AuthService);

  isGuest = this.authService.isGuest;
  isLoading = this.avatarService.isLoading;
  isSaving = this.avatarService.isSaving;
  editorState = this.avatarService.editorState;
  hasUnsavedChanges = this.avatarService.hasUnsavedChanges;
  optionsByCategory = this.avatarService.optionsByCategory;

  // Currently selected category
  selectedCategory = signal<AvatarCategory>('skinTone');

  // All categories for tabs
  categories: AvatarCategory[] = [
    'skinTone',
    'hairStyle',
    'hairColor',
    'eyeStyle',
    'expression',
    'glasses',
    'hat',
    'bgColor',
  ];

  // Track which option is selected in current category
  selectedOptionInCategory = computed(() => {
    const state = this.editorState();
    const category = this.selectedCategory();
    if (!state) return null;
    return state[category] as string | null;
  });

  constructor() {
    // Load options and init editor when component initializes
    effect(() => {
      if (!this.isGuest()) {
        this.avatarService.loadOptions();
        this.avatarService.initEditor();
      }
    });
  }

  /**
   * Switch to a different category
   */
  selectCategory(category: AvatarCategory): void {
    this.selectedCategory.set(category);
  }

  /**
   * Check if a category tab is active
   */
  isCategoryActive(category: AvatarCategory): boolean {
    return this.selectedCategory() === category;
  }

  /**
   * Select an option in the current category
   */
  selectOption(optionId: string | null): void {
    this.avatarService.setEditorOption(this.selectedCategory(), optionId);
  }

  /**
   * Check if an option is unlocked
   */
  isOptionUnlocked(optionId: string): boolean {
    return this.avatarService.isOptionUnlocked(optionId);
  }

  /**
   * Get unlock requirement for a locked option
   */
  getUnlockRequirement(optionId: string): string | undefined {
    return this.avatarService.getUnlockRequirement(optionId);
  }

  /**
   * Randomize avatar appearance
   */
  randomize(): void {
    this.avatarService.randomize();
  }

  /**
   * Reset to saved avatar
   */
  reset(): void {
    this.avatarService.resetEditor();
  }

  /**
   * Reset to default avatar
   */
  resetToDefault(): void {
    this.avatarService.resetToDefault();
  }

  /**
   * Save current avatar
   */
  async save(): Promise<void> {
    await this.avatarService.saveAvatar();
  }

  /**
   * Get category icon SVG path
   */
  getCategoryIcon(category: AvatarCategory): string {
    const icons: Record<AvatarCategory, string> = {
      skinTone: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
      hairStyle: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.2.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1c-1.29 1.92-3.5 3.2-6 3.2z',
      hairColor: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V8z',
      eyeStyle: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
      expression: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z',
      glasses: 'M3 10h2v4H3v-4zm16 0h2v4h-2v-4zm-9-2h4v8H8V8zm-3 2h2v4H5v-4zm12 0h2v4h-2v-4z',
      hat: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-6h10v2H7v-2z',
      bgColor: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z',
    };
    return icons[category];
  }

  /**
   * Check if current category has locked options
   */
  hasLockedOptions(): boolean {
    const options = this.optionsByCategory()[this.selectedCategory()];
    return options.some(opt => !this.isOptionUnlocked(opt.id));
  }

  /**
   * Get hair color style for display
   */
  getHairColorStyle(hairColorId: string): string {
    const colorMap: Record<string, string> = {
      'hair-color-black': '#1a1a1a',
      'hair-color-brown': '#5D4037',
      'hair-color-blonde': '#F5DEB3',
      'hair-color-red': '#B7410E',
      'hair-color-auburn': '#A0522D',
      'hair-color-gray': '#808080',
    };
    return colorMap[hairColorId] || '#5D4037';
  }
}