import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthModalService } from './auth-modal.service';

describe('AuthModalService', () => {
  let service: AuthModalService;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    router = {
      navigate: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [AuthModalService, { provide: Router, useValue: router }],
    });

    service = TestBed.inject(AuthModalService);
  });

  describe('initial state', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have modal closed by default', () => {
      expect(service.isOpen()).toBe(false);
    });

    it('should have method-selection step by default', () => {
      expect(service.step()).toBe('method-selection');
    });

    it('should have no redirect URL by default', () => {
      expect(service.redirectUrl()).toBeNull();
    });

    it('should have empty email by default', () => {
      expect(service.email()).toBe('');
    });

    it('should have register action by default', () => {
      expect(service.action()).toBe('register');
    });
  });

  describe('open', () => {
    it('should open modal without options', () => {
      service.open();

      expect(service.isOpen()).toBe(true);
      expect(service.step()).toBe('method-selection');
      expect(service.redirectUrl()).toBeNull();
      expect(service.email()).toBe('');
    });

    it('should open modal with redirect URL', () => {
      service.open({ redirectUrl: '/user/settings' });

      expect(service.isOpen()).toBe(true);
      expect(service.redirectUrl()).toBe('/user/settings');
    });

    it('should open modal with pre-filled email', () => {
      service.open({ email: 'test@example.com' });

      expect(service.isOpen()).toBe(true);
      expect(service.email()).toBe('test@example.com');
    });

    it('should open modal with initial step', () => {
      service.open({ initialStep: 'smart-form' });

      expect(service.isOpen()).toBe(true);
      expect(service.step()).toBe('smart-form');
    });

    it('should open modal with all options', () => {
      service.open({
        redirectUrl: '/profile',
        email: 'user@example.com',
        initialStep: 'success',
      });

      expect(service.isOpen()).toBe(true);
      expect(service.redirectUrl()).toBe('/profile');
      expect(service.email()).toBe('user@example.com');
      expect(service.step()).toBe('success');
    });
  });

  describe('close', () => {
    it('should close modal', () => {
      service.open();
      expect(service.isOpen()).toBe(true);

      service.close();

      expect(service.isOpen()).toBe(false);
    });

    it('should reset step to method-selection', () => {
      service.open({ initialStep: 'success' });
      expect(service.step()).toBe('success');

      service.close();

      expect(service.step()).toBe('method-selection');
    });

    it('should clear email', () => {
      service.open({ email: 'test@example.com' });
      expect(service.email()).toBe('test@example.com');

      service.close();

      expect(service.email()).toBe('');
    });

    it('should reset action to register', () => {
      service.setAction('login');
      expect(service.action()).toBe('login');

      service.close();

      expect(service.action()).toBe('register');
    });

    it('should clear redirect URL', () => {
      service.open({ redirectUrl: '/profile' });
      expect(service.redirectUrl()).toBe('/profile');

      service.close();

      expect(service.redirectUrl()).toBeNull();
    });
  });

  describe('setStep', () => {
    it('should change step to smart-form', () => {
      service.setStep('smart-form');
      expect(service.step()).toBe('smart-form');
    });

    it('should change step to success', () => {
      service.setStep('success');
      expect(service.step()).toBe('success');
    });

    it('should change step to method-selection', () => {
      service.setStep('smart-form');
      service.setStep('method-selection');
      expect(service.step()).toBe('method-selection');
    });
  });

  describe('setEmail', () => {
    it('should set email', () => {
      service.setEmail('new@example.com');
      expect(service.email()).toBe('new@example.com');
    });

    it('should update email', () => {
      service.setEmail('first@example.com');
      service.setEmail('second@example.com');
      expect(service.email()).toBe('second@example.com');
    });

    it('should allow empty email', () => {
      service.setEmail('test@example.com');
      service.setEmail('');
      expect(service.email()).toBe('');
    });
  });

  describe('setAction', () => {
    it('should set action to login', () => {
      service.setAction('login');
      expect(service.action()).toBe('login');
    });

    it('should set action to convert', () => {
      service.setAction('convert');
      expect(service.action()).toBe('convert');
    });

    it('should set action to register', () => {
      service.setAction('login');
      service.setAction('register');
      expect(service.action()).toBe('register');
    });
  });

  describe('handleLoginSuccess', () => {
    it('should close modal without redirect', () => {
      service.open();
      service.handleLoginSuccess();

      expect(service.isOpen()).toBe(false);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should close modal and navigate to redirect URL', () => {
      service.open({ redirectUrl: '/user/settings' });
      service.handleLoginSuccess();

      expect(service.isOpen()).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/user/settings']);
    });

    it('should clear redirect URL after navigation', () => {
      service.open({ redirectUrl: '/profile' });
      service.handleLoginSuccess();

      expect(service.redirectUrl()).toBeNull();
    });
  });

  describe('typical flow', () => {
    it('should support full login flow', () => {
      // User clicks login button
      service.open({ redirectUrl: '/protected' });
      expect(service.isOpen()).toBe(true);
      expect(service.step()).toBe('method-selection');

      // User enters email
      service.setEmail('user@example.com');
      expect(service.email()).toBe('user@example.com');

      // Email check determines action
      service.setAction('login');
      expect(service.action()).toBe('login');

      // Move to form step
      service.setStep('smart-form');
      expect(service.step()).toBe('smart-form');

      // After successful login
      service.handleLoginSuccess();
      expect(service.isOpen()).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/protected']);
    });

    it('should support guest conversion flow', () => {
      // Guest tries to access protected feature
      service.open({ redirectUrl: '/user/settings' });
      expect(service.isOpen()).toBe(true);

      // Pre-fill email
      service.setEmail('guest@example.com');

      // Email exists, suggest convert
      service.setAction('convert');
      service.setStep('smart-form');

      expect(service.action()).toBe('convert');
      expect(service.step()).toBe('smart-form');

      // Complete conversion
      service.setStep('success');
      expect(service.step()).toBe('success');

      // Close and redirect
      service.handleLoginSuccess();
      expect(service.isOpen()).toBe(false);
    });
  });
});