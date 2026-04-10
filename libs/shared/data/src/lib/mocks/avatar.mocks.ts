/**
 * Avatar Mock Data
 *
 * Contains all SVG layer data for avatar customization options.
 * Each layer is designed for a 32x32 pixel art grid.
 *
 * Layer order for rendering:
 * 1. Background (bgColor)
 * 2. Skin base (skinTone)
 * 3. Eyes (eyeStyle)
 * 4. Expression/Mouth (expression)
 * 5. Hair (hairStyle + hairColor)
 * 6. Glasses (if any)
 * 7. Hat (if any)
 */

import { AvatarOption, AvatarData } from '../models/avatar.models';

// ============================================================================
// SKIN TONE SVGS - Face base shapes
// ============================================================================

const SKIN_SVGS: Record<string, string> = {
  'skin-light': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="14" r="10" fill="#FFDAB9"/><rect x="12" y="22" width="8" height="6" rx="2" fill="#FFDAB9"/><rect x="8" y="12" width="2" height="6" rx="1" fill="#FFDAB9"/><rect x="22" y="12" width="2" height="6" rx="1" fill="#FFDAB9"/></svg>`,
  'skin-tan': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="14" r="10" fill="#DEB887"/><rect x="12" y="22" width="8" height="6" rx="2" fill="#DEB887"/><rect x="8" y="12" width="2" height="6" rx="1" fill="#DEB887"/><rect x="22" y="12" width="2" height="6" rx="1" fill="#DEB887"/></svg>`,
  'skin-medium': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="14" r="10" fill="#CD853F"/><rect x="12" y="22" width="8" height="6" rx="2" fill="#CD853F"/><rect x="8" y="12" width="2" height="6" rx="1" fill="#CD853F"/><rect x="22" y="12" width="2" height="6" rx="1" fill="#CD853F"/></svg>`,
  'skin-dark': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="14" r="10" fill="#8B4513"/><rect x="12" y="22" width="8" height="6" rx="2" fill="#8B4513"/><rect x="8" y="12" width="2" height="6" rx="1" fill="#8B4513"/><rect x="22" y="12" width="2" height="6" rx="1" fill="#8B4513"/></svg>`,
};

// ============================================================================
// HAIR STYLE SVGS - Hair shapes (use currentColor for hairColor)
// ============================================================================

const HAIR_STYLE_SVGS: Record<string, string> = {
  'hair-short-1': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M6 14 Q6 4 16 4 Q26 4 26 14 L26 12 Q26 6 16 6 Q6 6 6 12 Z" fill="currentColor"/><rect x="6" y="8" width="4" height="6" fill="currentColor"/><rect x="22" y="8" width="4" height="6" fill="currentColor"/></svg>`,
  'hair-short-2': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M8 12 Q8 4 16 4 Q24 4 24 12" fill="currentColor"/><rect x="8" y="6" width="3" height="8" rx="1" fill="currentColor"/><rect x="21" y="6" width="3" height="8" rx="1" fill="currentColor"/></svg>`,
  'hair-medium': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M5 16 Q5 2 16 2 Q27 2 27 16 L27 24 Q27 26 25 26 L7 26 Q5 26 5 24 Z" fill="currentColor"/><rect x="5" y="14" width="3" height="10" fill="currentColor"/><rect x="24" y="14" width="3" height="10" fill="currentColor"/></svg>`,
  'hair-long': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M4 14 Q4 2 16 2 Q28 2 28 14 L28 30 Q28 31 26 31 L6 31 Q4 31 4 30 Z" fill="currentColor"/><rect x="4" y="12" width="4" height="18" rx="1" fill="currentColor"/><rect x="24" y="12" width="4" height="18" rx="1" fill="currentColor"/></svg>`,
  'hair-curly': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="8" r="6" fill="currentColor"/><circle cx="10" cy="10" r="4" fill="currentColor"/><circle cx="22" cy="10" r="4" fill="currentColor"/><circle cx="8" cy="14" r="3" fill="currentColor"/><circle cx="24" cy="14" r="3" fill="currentColor"/></svg>`,
  'hair-spiky': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><polygon points="16,2 18,10 22,4 20,12 26,8 22,14 28,14 22,16 28,18 22,18 26,24 18,18 20,26 16,20 12,26 14,18 6,24 10,18 4,18 10,18 4,14 10,14 6,8 12,12 10,4 14,10" fill="currentColor"/></svg>`,
  'hair-bald': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"></svg>`,
};

// ============================================================================
// HAIR COLOR SVGS - Just the color values (applied via currentColor)
// ============================================================================

const HAIR_COLOR_VALUES: Record<string, string> = {
  'hair-color-black': '#1a1a1a',
  'hair-color-brown': '#5D4037',
  'hair-color-blonde': '#F5DEB3',
  'hair-color-red': '#B7410E',
  'hair-color-auburn': '#A0522D',
  'hair-color-gray': '#808080',
};

// ============================================================================
// EYE STYLE SVGS - Different eye shapes
// ============================================================================

const EYE_SVGS: Record<string, string> = {
  'eyes-round': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="13" r="2.5" fill="#2D2D2D"/><circle cx="20" cy="13" r="2.5" fill="#2D2D2D"/><circle cx="12.5" cy="12.5" r="0.8" fill="#FFF"/><circle cx="20.5" cy="12.5" r="0.8" fill="#FFF"/></svg>`,
  'eyes-narrow': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="13" width="4" height="2" rx="1" fill="#2D2D2D"/><rect x="18" y="13" width="4" height="2" rx="1" fill="#2D2D2D"/></svg>`,
  'eyes-happy': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M10 14 Q12 11 14 14" stroke="#2D2D2D" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M18 14 Q20 11 22 14" stroke="#2D2D2D" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  'eyes-wink': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="13" r="2.5" fill="#2D2D2D"/><circle cx="12.5" cy="12.5" r="0.8" fill="#FFF"/><path d="M18 14 Q20 11 22 14" stroke="#2D2D2D" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  'eyes-wide': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="13" rx="3" ry="3.5" fill="#2D2D2D"/><ellipse cx="20" cy="13" rx="3" ry="3.5" fill="#2D2D2D"/><circle cx="13" cy="12" r="1.2" fill="#FFF"/><circle cx="21" cy="12" r="1.2" fill="#FFF"/></svg>`,
};

// ============================================================================
// EXPRESSION SVGS - Mouth and expression details
// ============================================================================

const EXPRESSION_SVGS: Record<string, string> = {
  'expr-smile': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M11 18 Q16 24 21 18" stroke="#2D2D2D" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  'expr-grin': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M10 18 Q16 26 22 18" stroke="#2D2D2D" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="12" y="19" width="8" height="4" fill="#FFF"/></svg>`,
  'expr-neutral': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="20" width="8" height="2" rx="1" fill="#2D2D2D"/></svg>`,
  'expr-surprised': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="21" rx="3" ry="4" fill="#2D2D2D"/></svg>`,
  'expr-sad': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M11 22 Q16 18 21 22" stroke="#2D2D2D" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  'expr-smirk': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M10 18 Q14 22 20 18" stroke="#2D2D2D" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
};

// ============================================================================
// GLASSES SVGS - Eyewear options
// ============================================================================

const GLASSES_SVGS: Record<string, string> = {
  'glasses-round': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="14" r="5" stroke="#2D2D2D" stroke-width="1.5" fill="none"/><circle cx="22" cy="14" r="5" stroke="#2D2D2D" stroke-width="1.5" fill="none"/><line x1="15" y1="14" x2="17" y2="14" stroke="#2D2D2D" stroke-width="1.5"/></svg>`,
  'glasses-square': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="10" width="9" height="7" rx="1" stroke="#2D2D2D" stroke-width="1.5" fill="none"/><rect x="18" y="10" width="9" height="7" rx="1" stroke="#2D2D2D" stroke-width="1.5" fill="none"/><line x1="14" y1="13" x2="18" y2="13" stroke="#2D2D2D" stroke-width="1.5"/></svg>`,
  'glasses-aviator': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M4 12 Q4 8 10 10 L14 14 Q14 18 10 18 L6 18 Q4 18 4 14 Z" stroke="#B8860B" stroke-width="1.5" fill="none"/><path d="M28 12 Q28 8 22 10 L18 14 Q18 18 22 18 L26 18 Q28 18 28 14 Z" stroke="#B8860B" stroke-width="1.5" fill="none"/><line x1="14" y1="13" x2="18" y2="13" stroke="#B8860B" stroke-width="1.5"/></svg>`,
  'glasses-sunglasses': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="10" width="10" height="8" rx="2" fill="#1a1a1a" stroke="#2D2D2D" stroke-width="1"/><rect x="18" y="10" width="10" height="8" rx="2" fill="#1a1a1a" stroke="#2D2D2D" stroke-width="1"/><line x1="14" y1="14" x2="18" y2="14" stroke="#2D2D2D" stroke-width="1.5"/></svg>`,
};

// ============================================================================
// HAT SVGS - Headwear options
// ============================================================================

const HAT_SVGS: Record<string, string> = {
  'hat-none': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"></svg>`,
  'hat-cap': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M6 10 Q6 2 16 2 Q26 2 26 10 L26 8 L28 12 L24 10 Q24 6 16 6 Q8 6 8 10 L4 12 L6 8 Z" fill="#4169E1"/><rect x="4" y="10" width="24" height="3" rx="1" fill="#4169E1"/></svg>`,
  'hat-beanie': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="6" r="12" fill="#8B0000"/><rect x="4" y="8" width="24" height="8" fill="#8B0000"/><rect x="4" y="14" width="24" height="3" fill="#FFD700"/></svg>`,
  'hat-crown': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><polygon points="4,12 8,4 12,10 16,2 20,10 24,4 28,12" fill="#FFD700"/><rect x="4" y="10" width="24" height="6" fill="#FFD700"/><circle cx="8" cy="4" r="2" fill="#FF4500"/><circle cx="16" cy="2" r="2" fill="#FF4500"/><circle cx="24" cy="4" r="2" fill="#FF4500"/></svg>`,
  'hat-tophat': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="2" width="16" height="14" fill="#1a1a1a"/><rect x="4" y="14" width="24" height="4" fill="#1a1a1a"/><rect x="8" y="16" width="16" height="2" fill="#2D2D2D"/></svg>`,
  'hat-wizard': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><polygon points="16,2 6,20 26,20" fill="#4B0082"/><circle cx="18" cy="8" r="2" fill="#FFD700"/><circle cx="14" cy="14" r="1.5" fill="#FFD700"/><circle cx="20" cy="12" r="1" fill="#FFD700"/></svg>`,
};

// ============================================================================
// BACKGROUND COLOR SVGS - Circle background
// ============================================================================

const BG_SVGS: Record<string, string> = {
  'bg-lavender': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#9333ea"/></svg>`,
  'bg-mint': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#22c55e"/></svg>`,
  'bg-peach': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#f97316"/></svg>`,
  'bg-sky': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#0ea5e9"/></svg>`,
  'bg-rose': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#e11d48"/></svg>`,
  'bg-gray': `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#6b7280"/></svg>`,
};

// ============================================================================
// HELPER: Generate SVG with hair color applied
// ============================================================================

function createHairStyleSvg(styleId: string, colorId: string): string {
  const styleSvg = HAIR_STYLE_SVGS[styleId] || '';
  const colorValue = HAIR_COLOR_VALUES[colorId] || '#5D4037';

  // Replace currentColor with the actual color
  return styleSvg.replace(/currentColor/g, colorValue);
}

// ============================================================================
// ALL AVATAR OPTIONS
// ============================================================================

export const MOCK_AVATAR_OPTIONS: AvatarOption[] = [
  // Skin tones (all default - always available)
  ...Object.keys(SKIN_SVGS).map(id => ({
    id,
    label: `avatar.options.skinTone.${id.replace('skin-', '')}`,
    category: 'skinTone' as const,
    isLocked: false,
    svgLayer: SKIN_SVGS[id],
    isDefault: true,
  })),

  // Hair styles (6 options)
  {
    id: 'hair-short-1',
    label: 'avatar.options.hairStyle.short1',
    category: 'hairStyle',
    isLocked: false,
    svgLayer: HAIR_STYLE_SVGS['hair-short-1'],
    isDefault: true,
  },
  {
    id: 'hair-short-2',
    label: 'avatar.options.hairStyle.short2',
    category: 'hairStyle',
    isLocked: false,
    svgLayer: HAIR_STYLE_SVGS['hair-short-2'],
    isDefault: true,
  },
  {
    id: 'hair-medium',
    label: 'avatar.options.hairStyle.medium',
    category: 'hairStyle',
    isLocked: false,
    svgLayer: HAIR_STYLE_SVGS['hair-medium'],
    isDefault: true,
  },
  {
    id: 'hair-long',
    label: 'avatar.options.hairStyle.long',
    category: 'hairStyle',
    isLocked: false,
    svgLayer: HAIR_STYLE_SVGS['hair-long'],
    isDefault: true,
  },
  {
    id: 'hair-curly',
    label: 'avatar.options.hairStyle.curly',
    category: 'hairStyle',
    isLocked: true,
    unlocksViaAchievement: 'ten-games',
    svgLayer: HAIR_STYLE_SVGS['hair-curly'],
  },
  {
    id: 'hair-spiky',
    label: 'avatar.options.hairStyle.spiky',
    category: 'hairStyle',
    isLocked: true,
    unlocksViaAchievement: 'first-win',
    svgLayer: HAIR_STYLE_SVGS['hair-spiky'],
  },
  {
    id: 'hair-bald',
    label: 'avatar.options.hairStyle.bald',
    category: 'hairStyle',
    isLocked: false,
    svgLayer: HAIR_STYLE_SVGS['hair-bald'],
    isDefault: true,
  },

  // Hair colors (all default - always available)
  ...Object.keys(HAIR_COLOR_VALUES).map(id => ({
    id,
    label: `avatar.options.hairColor.${id.replace('hair-color-', '')}`,
    category: 'hairColor' as const,
    isLocked: false,
    svgLayer: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="16" height="16" rx="2" fill="${HAIR_COLOR_VALUES[id]}"/></svg>`,
    isDefault: true,
  })),

  // Eye styles (all default)
  ...Object.keys(EYE_SVGS).map(id => ({
    id,
    label: `avatar.options.eyeStyle.${id.replace('eyes-', '')}`,
    category: 'eyeStyle' as const,
    isLocked: false,
    svgLayer: EYE_SVGS[id],
    isDefault: true,
  })),

  // Expressions (all default)
  ...Object.keys(EXPRESSION_SVGS).map(id => ({
    id,
    label: `avatar.options.expression.${id.replace('expr-', '')}`,
    category: 'expression' as const,
    isLocked: false,
    svgLayer: EXPRESSION_SVGS[id],
    isDefault: true,
  })),

  // Glasses (some locked)
  {
    id: 'glasses-none',
    label: 'avatar.options.glasses.none',
    category: 'glasses',
    isLocked: false,
    svgLayer: '',
    isDefault: true,
  },
  ...Object.keys(GLASSES_SVGS).slice(0, 2).map(id => ({
    id,
    label: `avatar.options.glasses.${id.replace('glasses-', '')}`,
    category: 'glasses' as const,
    isLocked: false,
    svgLayer: GLASSES_SVGS[id],
    isDefault: true,
  })),
  {
    id: 'glasses-aviator',
    label: 'avatar.options.glasses.aviator',
    category: 'glasses',
    isLocked: true,
    unlocksViaAchievement: 'streak-5',
    svgLayer: GLASSES_SVGS['glasses-aviator'],
  },
  {
    id: 'glasses-sunglasses',
    label: 'avatar.options.glasses.sunglasses',
    category: 'glasses',
    isLocked: true,
    unlocksViaAchievement: 'win-rate-50',
    svgLayer: GLASSES_SVGS['glasses-sunglasses'],
  },

  // Hats (some locked)
  {
    id: 'hat-none',
    label: 'avatar.options.hat.none',
    category: 'hat',
    isLocked: false,
    svgLayer: HAT_SVGS['hat-none'],
    isDefault: true,
  },
  {
    id: 'hat-cap',
    label: 'avatar.options.hat.cap',
    category: 'hat',
    isLocked: false,
    svgLayer: HAT_SVGS['hat-cap'],
    isDefault: true,
  },
  {
    id: 'hat-beanie',
    label: 'avatar.options.hat.beanie',
    category: 'hat',
    isLocked: false,
    svgLayer: HAT_SVGS['hat-beanie'],
    isDefault: true,
  },
  {
    id: 'hat-crown',
    label: 'avatar.options.hat.crown',
    category: 'hat',
    isLocked: true,
    unlocksViaAchievement: 'avatar-hat',
    svgLayer: HAT_SVGS['hat-crown'],
  },
  {
    id: 'hat-tophat',
    label: 'avatar.options.hat.topHat',
    category: 'hat',
    isLocked: true,
    unlocksViaAchievement: 'perfect-game',
    svgLayer: HAT_SVGS['hat-tophat'],
  },
  {
    id: 'hat-wizard',
    label: 'avatar.options.hat.wizard',
    category: 'hat',
    isLocked: true,
    unlocksViaAchievement: 'avatar-legendary',
    svgLayer: HAT_SVGS['hat-wizard'],
  },

  // Background colors (all default)
  ...Object.keys(BG_SVGS).map(id => ({
    id,
    label: `avatar.options.bgColor.${id.replace('bg-', '')}`,
    category: 'bgColor' as const,
    isLocked: false,
    svgLayer: BG_SVGS[id],
    isDefault: true,
  })),
];

// Re-export DEFAULT_AVATAR from models for convenience
export { DEFAULT_AVATAR } from '../models/avatar.models';

/**
 * Get SVG layer for an option
 */
export function getAvatarOptionSvg(optionId: string): string | undefined {
  return MOCK_AVATAR_OPTIONS.find(opt => opt.id === optionId)?.svgLayer;
}

/**
 * Get all options for a category
 */
export function getAvatarOptionsByCategory(category: AvatarOption['category']): AvatarOption[] {
  return MOCK_AVATAR_OPTIONS.filter(opt => opt.category === category);
}

/**
 * Calculate unlocked option IDs based on user's achievements
 */
export function getUnlockedAvatarOptions(unlockedAchievementIds: string[]): string[] {
  const unlocked: string[] = [];

  for (const option of MOCK_AVATAR_OPTIONS) {
    if (option.isDefault || !option.unlocksViaAchievement) {
      // Default items are always available
      continue;
    }

    if (unlockedAchievementIds.includes(option.unlocksViaAchievement)) {
      unlocked.push(option.id);
    }
  }

  return unlocked;
}