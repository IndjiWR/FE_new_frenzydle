import { Component, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@shared/data';
import { AuthModalService, AuthModalStep, AuthFormAction } from '@shared/feature';
import { signal, computed } from '@angular/core';

/**
 * Auth Modal Component
 *
 * Three-step authentication modal:
 * 1. Method Selection - Google button + Email input
 * 2. Smart Form - Login/Convert/Register based on email check
 * 3. Success - Animated checkmark
 *
 * Features:
 * - Backdrop click closes modal
 * - Escape key closes modal
 * - Animated entrance (scale + fade)
 * - Reactive form validation
 */
@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalComponent {
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(AuthModalService);
  private readonly fb = inject(FormBuilder);

  // Inputs
  isOpen = input<boolean>(false);

  // Outputs
  close = output<void>();
  loginSuccess = output<void>();

  // Internal state
  currentStep = signal<AuthModalStep>('method-selection');
  email = signal<string>('');
  action = signal<AuthFormAction>('register');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Computed
  stepTitle = computed(() => {
    switch (this.currentStep()) {
      case 'method-selection':
        return 'auth.signIn';
      case 'smart-form':
        return this.action() === 'login' ? 'auth.welcomeBack' : 'auth.createAccount';
      case 'success':
        return 'auth.success';
      default:
        return 'auth.signIn';
    }
  });

  // Email form for method selection
  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  // Password form for smart form
  passwordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    displayName: [''],
  });

  // Computed signal for whether displayName is required
  requiresDisplayName = computed(() => this.action() !== 'login');

  /**
   * Handle email form submission (Step 1)
   */
  onEmailSubmit(): void {
    if (this.emailForm.invalid) {
      return;
    }

    const emailValue = this.emailForm.value.email ?? '';
    this.email.set(emailValue);
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Check if email exists
    this.authService.checkEmail(emailValue).subscribe({
      next: (result) => {
        this.isLoading.set(false);
        this.action.set(result.suggestedAction);
        this.currentStep.set('smart-form');

        // Update display name validation based on action
        if (result.suggestedAction !== 'login') {
          this.passwordForm.controls.displayName.setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(24)]);
        } else {
          this.passwordForm.controls.displayName.clearValidators();
        }
        this.passwordForm.controls.displayName.updateValueAndValidity();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('auth.errorCheckingEmail');
        console.error('Email check failed:', error);
      },
    });
  }

  /**
   * Handle password form submission (Step 2)
   */
  onPasswordSubmit(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    const password = this.passwordForm.value.password ?? '';
    const displayName = this.passwordForm.value.displayName ?? '';
    const emailValue = this.email();

    this.isLoading.set(true);
    this.errorMessage.set(null);

    let authObservable;

    switch (this.action()) {
      case 'login':
        authObservable = this.authService.login(emailValue, password);
        break;
      case 'convert':
        authObservable = this.authService.convertGuest(emailValue, password, displayName);
        break;
      case 'register':
        authObservable = this.authService.register(emailValue, password, displayName);
        break;
    }

    authObservable.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.currentStep.set('success');
        // Auto-close after success animation
        setTimeout(() => {
          this.onSuccess();
        }, 800);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('auth.invalidCredentials');
        console.error('Auth failed:', error);
      },
    });
  }

  /**
   * Handle Google sign-in
   */
  onGoogleSignIn(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.loginWithGoogle().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.currentStep.set('success');
        setTimeout(() => {
          this.onSuccess();
        }, 800);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('auth.googleError');
        console.error('Google sign-in failed:', error);
      },
    });
  }

  /**
   * Handle continue as guest
   */
  onContinueAsGuest(): void {
    this.close.emit();
  }

  /**
   * Handle back button (Step 2 -> Step 1)
   */
  onBack(): void {
    this.currentStep.set('method-selection');
    this.errorMessage.set(null);
  }

  /**
   * Handle successful login
   */
  onSuccess(): void {
    this.loginSuccess.emit();
    this.close.emit();
  }

  /**
   * Handle modal close
   */
  onClose(): void {
    this.reset();
    this.close.emit();
  }

  /**
   * Handle backdrop click
   */
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  /**
   * Reset form state
   */
  private reset(): void {
    this.currentStep.set('method-selection');
    this.email.set('');
    this.errorMessage.set(null);
    this.isLoading.set(false);
    this.emailForm.reset();
    this.passwordForm.reset();
  }

  /**
   * Track keyboard events for Escape key
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onClose();
    }
  }
}