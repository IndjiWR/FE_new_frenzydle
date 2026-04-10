/**
 * Avatar Customization Models
 *
 * The avatar system uses SVG layers stacked in order:
 * 1. Background circle (bgColor)
 * 2. Skin base (face shape, skinTone)
 * 3. Eye style
 * 4. Expression / mouth
 * 5. Hair style (colored with hairColor)
 * 6. Glasses (if not null)
 * 7. Hat (if not null)
 *
 * Each layer is a 32x32 viewBox SVG designed for pixel art stacking.
 */

/** Avatar size presets for different contexts */
export type AvatarSize = 'sm' | 'md' | 'lg';

/** Avatar category types - each corresponds to a layer */
export type AvatarCategory =
  | 'skinTone'
  | 'hairStyle'
  | 'hairColor'
  | 'eyeStyle'
  | 'expression'
  | 'glasses'
  | 'hat'
  | 'bgColor';

/**
 * User's avatar customization data
 * Stored in UserProfile.avatarData
 */
export interface AvatarData {
  /** Skin tone option ID (e.g., "skin-light") */
  skinTone: string;
  /** Hair style option ID (e.g., "hair-short-1") */
  hairStyle: string;
  /** Hair color option ID (e.g., "hair-color-brown") */
  hairColor: string;
  /** Eye style option ID (e.g., "eyes-round") */
  eyeStyle: string;
  /** Expression option ID (e.g., "expr-smile") */
  expression: string;
  /** Glasses option ID or null for none */
  glasses: string | null;
  /** Hat option ID or null for none */
  hat: string | null;
  /** Background color option ID (e.g., "bg-lavender") */
  bgColor: string;
}

/**
 * Single avatar option (one selectable item in a category)
 */
export interface AvatarOption {
  /** Unique option ID */
  id: string;
  /** i18n translation key for display name */
  label: string;
  /** Category this option belongs to */
  category: AvatarCategory;
  /** Whether this option is locked (requires achievement) */
  isLocked: boolean;
  /** Achievement ID that unlocks this option (if locked) */
  unlocksViaAchievement?: string;
  /** Inline SVG string for this layer */
  svgLayer: string;
  /** Whether this is a default option (always available) */
  isDefault?: boolean;
}

/**
 * API response for avatar options
 */
export interface AvatarOptionsResponse {
  /** All available options grouped by category */
  options: AvatarOption[];
  /** Option IDs the user has unlocked */
  unlockedIds: string[];
}

/**
 * API request to save avatar
 */
export interface SaveAvatarRequest {
  avatarData: AvatarData;
}

/**
 * Default avatar configuration for new users
 */
export const DEFAULT_AVATAR: AvatarData = {
  skinTone: 'skin-light',
  hairStyle: 'hair-short-1',
  hairColor: 'hair-color-brown',
  eyeStyle: 'eyes-round',
  expression: 'expr-smile',
  glasses: null,
  hat: null,
  bgColor: 'bg-lavender',
};

/**
 * Category display configuration
 */
export const AVATAR_CATEGORIES: { key: AvatarCategory; icon: string; order: number }[] = [
  { key: 'skinTone', icon: 'face', order: 1 },
  { key: 'hairStyle', icon: 'hair', order: 2 },
  { key: 'hairColor', icon: 'palette', order: 3 },
  { key: 'eyeStyle', icon: 'eye', order: 4 },
  { key: 'expression', icon: 'smile', order: 5 },
  { key: 'glasses', icon: 'glasses', order: 6 },
  { key: 'hat', icon: 'hat', order: 7 },
  { key: 'bgColor', icon: 'circle', order: 8 },
];

/**
 * Size configurations for AvatarRendererComponent
 */
export const AVATAR_SIZES: Record<AvatarSize, { pixels: number; class: string }> = {
  sm: { pixels: 32, class: 'w-8 h-8' },
  md: { pixels: 64, class: 'w-16 h-16' },
  lg: { pixels: 200, class: 'w-50 h-50' },
};