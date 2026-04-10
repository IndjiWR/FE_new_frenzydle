import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AvatarData, AvatarSize, AvatarOption, MOCK_AVATAR_OPTIONS } from '@shared/data';

/**
 * Avatar Renderer Component
 *
 * Renders a pixel art avatar using stacked SVG layers.
 * Used throughout the app for user avatars at different sizes.
 *
 * Layer order (bottom to top):
 * 1. Background color (bgColor)
 * 2. Skin base (skinTone)
 * 3. Eyes (eyeStyle)
 * 4. Expression/Mouth (expression)
 * 5. Hair (hairStyle with hairColor)
 * 6. Glasses (if any)
 * 7. Hat (if any)
 *
 * Usage:
 * ```html
 * <app-avatar-renderer
 *   [avatarData]="userAvatar"
 *   size="sm"
 *   [isGuest]="isGuest"
 *   [initial]="userName.charAt(0)"
 * />
 * ```
 */
@Component({
  selector: 'app-avatar-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-renderer.component.html',
  styleUrls: ['./avatar-renderer.component.css'],
})
export class AvatarRendererComponent {
  private readonly sanitizer = inject(DomSanitizer);

  /** Avatar data containing all layer selections */
  avatarData = input<AvatarData | null>(null);

  /** Size preset: sm (32px), md (64px), lg (200px) */
  size = input<AvatarSize>('md');

  /** Whether the user is a guest (shows placeholder) */
  isGuest = input<boolean>(false);

  /** Initial letter for placeholder (defaults to 'G') */
  initial = input<string>('G');

  /** Whether to show blink animation */
  animated = input<boolean>(false);

  /** Size configurations */
  protected sizeClasses = computed(() => {
    const sizeMap: Record<AvatarSize, string> = {
      sm: 'w-8 h-8',
      md: 'w-16 h-16',
      lg: 'w-50 h-50', // 200px (12.5rem)
    };
    return sizeMap[this.size()];
  });

  protected textSizeClasses = computed(() => {
    const sizeMap: Record<AvatarSize, string> = {
      sm: 'text-xs',
      md: 'text-xl',
      lg: 'text-5xl',
    };
    return sizeMap[this.size()];
  });

  /** Whether to show placeholder (guest or no avatar data) */
  protected showPlaceholder = computed(() => {
    return this.isGuest() || !this.avatarData();
  });

  /**
   * Get the SVG content for an option by ID and category
   */
  protected getOptionSvg(optionId: string, category: AvatarOption['category']): string {
    const option = MOCK_AVATAR_OPTIONS.find(opt => opt.id === optionId && opt.category === category);
    return option?.svgLayer ?? '';
  }

  /**
   * Get the SVG content for a layer, safely sanitized for rendering
   */
  protected getSafeSvg(svgContent: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  }

  /**
   * Get hair color value for applying to hair style SVG
   */
  protected getHairColorValue(hairColorId: string): string {
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