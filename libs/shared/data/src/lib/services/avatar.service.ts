import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import {
  AvatarData,
  AvatarOption,
  AvatarCategory,
  AvatarOptionsResponse,
  DEFAULT_AVATAR,
} from '../models/avatar.models';

/**
 * Avatar Service
 *
 * Manages avatar customization state with signals.
 * Handles loading options, editor state, and saving.
 */
@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = '/api';

  // Signal-based state
  private readonly _options = signal<AvatarOption[]>([]);
  private readonly _unlockedIds = signal<Set<string>>(new Set());
  private readonly _editorState = signal<AvatarData | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _isSaving = signal(false);

  // Public readonly signals
  readonly options = this._options.asReadonly();
  readonly editorState = this._editorState.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isSaving = this._isSaving.asReadonly();

  // Computed: Options grouped by category
  readonly optionsByCategory = computed(() => {
    const opts = this._options() ?? [];
    return {
      skinTone: opts.filter(o => o.category === 'skinTone'),
      hairStyle: opts.filter(o => o.category === 'hairStyle'),
      hairColor: opts.filter(o => o.category === 'hairColor'),
      eyeStyle: opts.filter(o => o.category === 'eyeStyle'),
      expression: opts.filter(o => o.category === 'expression'),
      glasses: opts.filter(o => o.category === 'glasses'),
      hat: opts.filter(o => o.category === 'hat'),
      bgColor: opts.filter(o => o.category === 'bgColor'),
    };
  });

  // Computed: Has unsaved changes
  readonly hasUnsavedChanges = computed(() => {
    const current = this.authService.currentUser()?.avatarData;
    const editor = this._editorState();

    if (!editor && !current) return false;
    if (!editor || !current) return true;

    return JSON.stringify(editor) !== JSON.stringify(current);
  });

  // Computed: Get the current avatar from user profile
  readonly currentAvatar = computed(() => {
    return this.authService.currentUser()?.avatarData ?? null;
  });

  /**
   * Check if an option is unlocked/available
   */
  isOptionUnlocked(optionId: string): boolean {
    const option = (this._options() ?? []).find(o => o.id === optionId);
    if (!option) return false;
    if (option.isDefault) return true;
    return this._unlockedIds().has(optionId);
  }

  /**
   * Get the unlock requirement for an option
   */
  getUnlockRequirement(optionId: string): string | undefined {
    const option = this._options().find(o => o.id === optionId);
    return option?.unlocksViaAchievement;
  }

  /**
   * Load all avatar options from the API
   */
  async loadOptions(): Promise<void> {
    this._isLoading.set(true);

    try {
      const response = await this.http
        .get<AvatarOptionsResponse>(`${this.baseUrl}/avatar/options`)
        .toPromise();

      if (response) {
        this._options.set(response.options);
        this._unlockedIds.set(new Set(response.unlockedIds));
      }
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Initialize the editor with the current user's avatar
   */
  initEditor(): void {
    const currentAvatar = this.authService.currentUser()?.avatarData;
    this._editorState.set(currentAvatar ? { ...currentAvatar } : { ...DEFAULT_AVATAR });
  }

  /**
   * Update a single option in the editor state
   */
  setEditorOption(category: AvatarCategory, optionId: string | null): void {
    this._editorState.update(state => {
      if (!state) {
        state = { ...DEFAULT_AVATAR };
      }
      return {
        ...state,
        [category]: optionId,
      };
    });
  }

  /**
   * Reset editor to current saved avatar
   */
  resetEditor(): void {
    const currentAvatar = this.authService.currentUser()?.avatarData;
    this._editorState.set(currentAvatar ? { ...currentAvatar } : { ...DEFAULT_AVATAR });
  }

  /**
   * Reset editor to default avatar
   */
  resetToDefault(): void {
    this._editorState.set({ ...DEFAULT_AVATAR });
  }

  /**
   * Randomize all options (only unlocked ones)
   */
  randomize(): void {
    const options = this._options() ?? [];
    const unlockedOptions = options.filter(opt =>
      opt.isDefault || this._unlockedIds().has(opt.id)
    );

    const newState: Partial<AvatarData> = {};

    // For each category, pick a random unlocked option
    const categories: AvatarCategory[] = [
      'skinTone', 'hairStyle', 'hairColor', 'eyeStyle',
      'expression', 'glasses', 'hat', 'bgColor',
    ];

    for (const category of categories) {
      const categoryOptions = unlockedOptions.filter(o => o.category === category);
      if (categoryOptions.length > 0) {
        const randomOption = categoryOptions[Math.floor(Math.random() * categoryOptions.length)];
        if (category === 'glasses' || category === 'hat') {
          (newState as Record<string, string | null>)[category] =
            randomOption.id === 'glasses-none' || randomOption.id === 'hat-none' ? null : randomOption.id;
        } else {
          (newState as Record<string, string>)[category] = randomOption.id;
        }
      }
    }

    this._editorState.set({
      ...DEFAULT_AVATAR,
      ...newState,
    } as AvatarData);
  }

  /**
   * Generate a random avatar using only default options
   * Used for new users who don't have an avatar yet
   */
  generateRandomDefaultAvatar(): AvatarData {
    const defaultOptions = (this._options() ?? []).filter(opt => opt.isDefault);

    const newState: Partial<AvatarData> = {};
    const categories: AvatarCategory[] = [
      'skinTone', 'hairStyle', 'hairColor', 'eyeStyle',
      'expression', 'glasses', 'hat', 'bgColor',
    ];

    for (const category of categories) {
      const categoryOptions = defaultOptions.filter(o => o.category === category);
      if (categoryOptions.length > 0) {
        const randomOption = categoryOptions[Math.floor(Math.random() * categoryOptions.length)];
        if (category === 'glasses' || category === 'hat') {
          (newState as Record<string, string | null>)[category] =
            randomOption.id === 'glasses-none' || randomOption.id === 'hat-none' ? null : randomOption.id;
        } else {
          (newState as Record<string, string>)[category] = randomOption.id;
        }
      }
    }

    return {
      ...DEFAULT_AVATAR,
      ...newState,
    } as AvatarData;
  }

  /**
   * Save the current editor state to the API
   */
  async saveAvatar(): Promise<void> {
    const editorState = this._editorState();
    if (!editorState) return;

    this._isSaving.set(true);

    try {
      const response = await this.http
        .put<{ user: { avatarData: AvatarData } }>(
          `${this.baseUrl}/user/avatar`,
          { avatarData: editorState }
        )
        .toPromise();

      if (response) {
        // Update the auth service with new avatar data
        this.authService.updateUser({ avatarData: response.user.avatarData });
      }
    } finally {
      this._isSaving.set(false);
    }
  }

  /**
   * Get a specific option by ID
   */
  getOptionById(optionId: string): AvatarOption | undefined {
    return (this._options() ?? []).find(o => o.id === optionId);
  }

  /**
   * Get the label for a category
   */
  getCategoryLabel(category: AvatarCategory): string {
    const labels: Record<AvatarCategory, string> = {
      skinTone: 'avatar.category.skinTone',
      hairStyle: 'avatar.category.hairStyle',
      hairColor: 'avatar.category.hairColor',
      eyeStyle: 'avatar.category.eyeStyle',
      expression: 'avatar.category.expression',
      glasses: 'avatar.category.glasses',
      hat: 'avatar.category.hat',
      bgColor: 'avatar.category.bgColor',
    };
    return labels[category];
  }
}