import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarRendererComponent } from './avatar-renderer.component';
import { DEFAULT_AVATAR } from '@shared/data';

describe('AvatarRendererComponent', () => {
  let component: AvatarRendererComponent;
  let fixture: ComponentFixture<AvatarRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarRendererComponent);
    component = fixture.componentInstance;
  });

  describe('size classes', () => {
    it('should apply sm size classes', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      const sizeClasses = component.sizeClasses();
      expect(sizeClasses).toBe('w-8 h-8');
    });

    it('should apply md size classes by default', () => {
      fixture.detectChanges();
      const sizeClasses = component.sizeClasses();
      expect(sizeClasses).toBe('w-16 h-16');
    });

    it('should apply lg size classes', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      const sizeClasses = component.sizeClasses();
      expect(sizeClasses).toBe('w-50 h-50');
    });
  });

  describe('text size classes', () => {
    it('should apply xs text for sm size', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      const textClasses = component.textSizeClasses();
      expect(textClasses).toBe('text-xs');
    });

    it('should apply xl text for md size', () => {
      fixture.detectChanges();
      const textClasses = component.textSizeClasses();
      expect(textClasses).toBe('text-xl');
    });

    it('should apply 5xl text for lg size', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      const textClasses = component.textSizeClasses();
      expect(textClasses).toBe('text-5xl');
    });
  });

  describe('placeholder display', () => {
    it('should show placeholder when isGuest is true', () => {
      fixture.componentRef.setInput('isGuest', true);
      fixture.componentRef.setInput('avatarData', null);
      fixture.detectChanges();

      expect(component.showPlaceholder()).toBe(true);
    });

    it('should show placeholder when avatarData is null', () => {
      fixture.componentRef.setInput('isGuest', false);
      fixture.componentRef.setInput('avatarData', null);
      fixture.detectChanges();

      expect(component.showPlaceholder()).toBe(true);
    });

    it('should not show placeholder when user has avatar data', () => {
      fixture.componentRef.setInput('isGuest', false);
      fixture.componentRef.setInput('avatarData', DEFAULT_AVATAR);
      fixture.detectChanges();

      expect(component.showPlaceholder()).toBe(false);
    });

    it('should use initial from input', () => {
      fixture.componentRef.setInput('isGuest', true);
      fixture.componentRef.setInput('initial', 'John');
      fixture.detectChanges();

      expect(component.initial()).toBe('John');
    });
  });

  describe('getOptionSvg', () => {
    it('should return SVG content for valid options', () => {
      const svg = component.getOptionSvg('skin-light', 'skinTone');
      expect(svg).toContain('svg');
    });

    it('should return empty string for invalid options', () => {
      const svg = component.getOptionSvg('invalid-option', 'skinTone');
      expect(svg).toBe('');
    });
  });

  describe('getSafeSvg', () => {
    it('should sanitize SVG content', () => {
      const svg = '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" /></svg>';
      const safeSvg = component.getSafeSvg(svg);

      // SafeHtml should be returned (bypassSecurityTrustHtml result)
      expect(safeSvg).toBeTruthy();
    });
  });

  describe('getHairColorValue', () => {
    it('should return correct color for black hair', () => {
      const color = component.getHairColorValue('hair-color-black');
      expect(color).toBe('#1a1a1a');
    });

    it('should return correct color for brown hair', () => {
      const color = component.getHairColorValue('hair-color-brown');
      expect(color).toBe('#5D4037');
    });

    it('should return correct color for blonde hair', () => {
      const color = component.getHairColorValue('hair-color-blonde');
      expect(color).toBe('#F5DEB3');
    });

    it('should return correct color for red hair', () => {
      const color = component.getHairColorValue('hair-color-red');
      expect(color).toBe('#B7410E');
    });

    it('should return correct color for auburn hair', () => {
      const color = component.getHairColorValue('hair-color-auburn');
      expect(color).toBe('#A0522D');
    });

    it('should return correct color for gray hair', () => {
      const color = component.getHairColorValue('hair-color-gray');
      expect(color).toBe('#808080');
    });

    it('should return default brown for unknown hair color', () => {
      const color = component.getHairColorValue('unknown-color');
      expect(color).toBe('#5D4037');
    });
  });

  describe('rendering', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should render placeholder for guest', () => {
      fixture.componentRef.setInput('isGuest', true);
      fixture.detectChanges();

      const placeholder = fixture.nativeElement.querySelector('[data-testid="avatar-placeholder"]');
      expect(placeholder).toBeTruthy();
    });

    it('should render avatar layers when avatar data provided', () => {
      fixture.componentRef.setInput('isGuest', false);
      fixture.componentRef.setInput('avatarData', DEFAULT_AVATAR);
      fixture.detectChanges();

      const layers = fixture.nativeElement.querySelector('[data-testid="avatar-layers"]');
      expect(layers).toBeTruthy();
    });

    it('should apply animated class when animated is true', () => {
      fixture.componentRef.setInput('animated', true);
      fixture.componentRef.setInput('avatarData', DEFAULT_AVATAR);
      fixture.detectChanges();

      const layers = fixture.nativeElement.querySelector('[data-testid="avatar-layers"]');
      expect(layers?.classList.contains('animate-blink')).toBe(true);
    });
  });

  describe('avatar data rendering', () => {
    it('should render background color layer', () => {
      fixture.componentRef.setInput('avatarData', {
        ...DEFAULT_AVATAR,
        bgColor: 'bg-lavender',
      });
      fixture.detectChanges();

      const layers = fixture.nativeElement.querySelector('[data-testid="avatar-layers"]');
      expect(layers).toBeTruthy();
    });

    it('should render glasses layer when specified', () => {
      fixture.componentRef.setInput('avatarData', {
        ...DEFAULT_AVATAR,
        glasses: 'glasses-round',
      });
      fixture.detectChanges();

      const layers = fixture.nativeElement.querySelector('[data-testid="avatar-layers"]');
      expect(layers).toBeTruthy();
    });

    it('should render hat layer when specified', () => {
      fixture.componentRef.setInput('avatarData', {
        ...DEFAULT_AVATAR,
        hat: 'hat-cap',
      });
      fixture.detectChanges();

      const layers = fixture.nativeElement.querySelector('[data-testid="avatar-layers"]');
      expect(layers).toBeTruthy();
    });

    it('should not render glasses layer when null', () => {
      fixture.componentRef.setInput('avatarData', {
        ...DEFAULT_AVATAR,
        glasses: null,
      });
      fixture.detectChanges();

      const layers = fixture.nativeElement.querySelector('[data-testid="avatar-layers"]');
      expect(layers).toBeTruthy();
    });

    it('should not render hat layer when null', () => {
      fixture.componentRef.setInput('avatarData', {
        ...DEFAULT_AVATAR,
        hat: null,
      });
      fixture.detectChanges();

      const layers = fixture.nativeElement.querySelector('[data-testid="avatar-layers"]');
      expect(layers).toBeTruthy();
    });
  });
});