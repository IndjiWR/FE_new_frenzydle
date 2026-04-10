import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthModalComponent } from './auth-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@shared/data';
import { AuthModalService } from '@shared/feature';
import { of, throwError } from 'rxjs';

describe('AuthModalComponent', () => {
  let component: AuthModalComponent;
  let fixture: ComponentFixture<AuthModalComponent>;
  let authService: jest.Mocked<AuthService>;
  let modalService: jest.Mocked<AuthModalService>;

  beforeEach(async () => {
    const authMock = {
      checkEmail: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      convertGuest: jest.fn(),
      loginWithGoogle: jest.fn(),
    };
    const modalMock = {
      isOpen: jest.fn(),
      step: jest.fn(),
      redirectUrl: jest.fn(),
      open: jest.fn(),
      close: jest.fn(),
      handleLoginSuccess: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AuthModalComponent, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: AuthModalService, useValue: modalMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthModalComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    modalService = TestBed.inject(AuthModalService) as jest.Mocked<AuthModalService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display method selection step by default', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    expect(component.currentStep()).toBe('method-selection');
  });

  it('should display email input in method selection step', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const emailInput = fixture.nativeElement.querySelector('[data-testid="auth-email-input"]');
    expect(emailInput).toBeTruthy();
  });

  it('should display Google sign-in button', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const googleButton = fixture.nativeElement.querySelector('[data-testid="auth-google-button"]');
    expect(googleButton).toBeTruthy();
  });

  it('should show email error when invalid email entered', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    component.emailForm.controls.email.setValue('invalid-email');
    component.emailForm.controls.email.markAsTouched();
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('[data-testid="auth-email-error"]');
    expect(error).toBeTruthy();
  });

  it('should navigate to smart form when email submitted', () => {
    authService.checkEmail.mockReturnValue(of({ exists: true, suggestedAction: 'login' }));
    component.emailForm.controls.email.setValue('test@frenzydle.com');
    component.onEmailSubmit();
    expect(authService.checkEmail).toHaveBeenCalledWith('test@frenzydle.com');
    expect(component.currentStep()).toBe('smart-form');
  });

  it('should show password field for login action', () => {
    authService.checkEmail.mockReturnValue(of({ exists: true, suggestedAction: 'login' }));
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.emailForm.controls.email.setValue('test@frenzydle.com');
    component.onEmailSubmit();
    fixture.detectChanges();

    const passwordInput = fixture.nativeElement.querySelector('[data-testid="auth-password-input"]');
    expect(passwordInput).toBeTruthy();
    // Should NOT show display name for login
    const displayNameInput = fixture.nativeElement.querySelector('[data-testid="auth-display-name-input"]');
    expect(displayNameInput).toBeFalsy();
  });

  it('should show display name field for register action', () => {
    authService.checkEmail.mockReturnValue(of({ exists: false, suggestedAction: 'register' }));
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.emailForm.controls.email.setValue('new@frenzydle.com');
    component.onEmailSubmit();
    fixture.detectChanges();

    const displayNameInput = fixture.nativeElement.querySelector('[data-testid="auth-display-name-input"]');
    expect(displayNameInput).toBeTruthy();
  });

  it('should show display name field for convert action', () => {
    authService.checkEmail.mockReturnValue(of({ exists: true, suggestedAction: 'convert' }));
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.emailForm.controls.email.setValue('existing@frenzydle.com');
    component.onEmailSubmit();
    fixture.detectChanges();

    const displayNameInput = fixture.nativeElement.querySelector('[data-testid="auth-display-name-input"]');
    expect(displayNameInput).toBeTruthy();
  });

  it('should call login when action is login and form submitted', () => {
    authService.checkEmail.mockReturnValue(of({ exists: true, suggestedAction: 'login' }));
    authService.login.mockReturnValue(of({ id: '1', displayName: 'Test', email: 'test@test.com', isGuest: false, avatarUrl: null, createdAt: '' }));
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.emailForm.controls.email.setValue('test@test.com');
    component.onEmailSubmit();
    fixture.detectChanges();

    component.passwordForm.controls.password.setValue('password123');
    component.onPasswordSubmit();

    expect(authService.login).toHaveBeenCalledWith('test@test.com', 'password123');
  });

  it('should call register when action is register and form submitted', () => {
    authService.checkEmail.mockReturnValue(of({ exists: false, suggestedAction: 'register' }));
    authService.register.mockReturnValue(of({ id: '1', displayName: 'Test', email: 'test@test.com', isGuest: false, avatarUrl: null, createdAt: '' }));
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.emailForm.controls.email.setValue('test@test.com');
    component.onEmailSubmit();
    fixture.detectChanges();

    component.passwordForm.controls.password.setValue('password123');
    component.passwordForm.controls.displayName.setValue('Test User');
    component.onPasswordSubmit();

    expect(authService.register).toHaveBeenCalledWith('test@test.com', 'password123', 'Test User');
  });

  it('should call convertGuest when action is convert and form submitted', () => {
    authService.checkEmail.mockReturnValue(of({ exists: true, suggestedAction: 'convert' }));
    authService.convertGuest.mockReturnValue(of({ id: '1', displayName: 'Test', email: 'test@test.com', isGuest: false, avatarUrl: null, createdAt: '' }));
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.emailForm.controls.email.setValue('test@test.com');
    component.onEmailSubmit();
    fixture.detectChanges();

    component.passwordForm.controls.password.setValue('password123');
    component.passwordForm.controls.displayName.setValue('Test User');
    component.onPasswordSubmit();

    expect(authService.convertGuest).toHaveBeenCalledWith('test@test.com', 'password123', 'Test User');
  });

  it('should call loginWithGoogle when Google button clicked', () => {
    authService.loginWithGoogle.mockReturnValue(of({ id: '1', displayName: 'Test', email: 'test@test.com', isGuest: false, avatarUrl: null, createdAt: '' }));
    component.onGoogleSignIn();
    expect(authService.loginWithGoogle).toHaveBeenCalled();
  });

  it('should emit close when backdrop clicked', () => {
    jest.spyOn(component.close, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const backdrop = fixture.nativeElement.querySelector('[data-testid="auth-modal-backdrop"]');
    backdrop.click();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should reset state on close', () => {
    component.email.set('test@test.com');
    component.currentStep.set('smart-form');
    component.errorMessage.set('error');
    component.onClose();
    expect(component.email()).toBe('');
    expect(component.currentStep()).toBe('method-selection');
    expect(component.errorMessage()).toBeNull();
  });

  it('should navigate back to method selection from smart form', () => {
    authService.checkEmail.mockReturnValue(of({ exists: true, suggestedAction: 'login' }));
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.emailForm.controls.email.setValue('test@test.com');
    component.onEmailSubmit();

    expect(component.currentStep()).toBe('smart-form');
    component.onBack();
    expect(component.currentStep()).toBe('method-selection');
  });
});