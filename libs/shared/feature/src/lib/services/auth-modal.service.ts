import { Injectable, inject } from '@angular/core';
import { signal } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Auth modal step types
 */
export type AuthModalStep = 'method-selection' | 'smart-form' | 'success';

/**
 * Auth form action types (determined by email check)
 */
export type AuthFormAction = 'login' | 'convert' | 'register';

/**
 * Options for opening the auth modal
 */
export interface AuthModalOptions {
  /** URL to navigate to after successful login */
  redirectUrl?: string;
  /** Pre-fill email address */
  email?: string;
  /** Initial step to show */
  initialStep?: AuthModalStep;
}

/**
 * Service for managing auth modal state
 *
 * This service is used to control the auth modal from anywhere in the app.
 * It manages the modal visibility, current step, and post-login redirect.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthModalService {
  private readonly router = inject(Router);

  // Modal visibility
  private readonly _isOpen = signal(false);
  readonly isOpen = this._isOpen.asReadonly();

  // Current step in the auth flow
  private readonly _step = signal<AuthModalStep>('method-selection');
  readonly step = this._step.asReadonly();

  // Redirect URL after successful login
  private readonly _redirectUrl = signal<string | null>(null);
  readonly redirectUrl = this._redirectUrl.asReadonly();

  // Pre-filled email (from method selection to smart form)
  private readonly _email = signal<string>('');
  readonly email = this._email.asReadonly();

  // Determined action based on email check
  private readonly _action = signal<AuthFormAction>('register');
  readonly action = this._action.asReadonly();

  /**
   * Open the auth modal
   */
  open(options?: AuthModalOptions): void {
    this._redirectUrl.set(options?.redirectUrl ?? null);
    this._email.set(options?.email ?? '');
    this._step.set(options?.initialStep ?? 'method-selection');
    this._isOpen.set(true);
  }

  /**
   * Close the auth modal
   */
  close(): void {
    this._isOpen.set(false);
    this._step.set('method-selection');
    this._email.set('');
    this._action.set('register');
    this._redirectUrl.set(null);
  }

  /**
   * Navigate to the next step
   */
  setStep(step: AuthModalStep): void {
    this._step.set(step);
  }

  /**
   * Set the email address (passed from method selection to smart form)
   */
  setEmail(email: string): void {
    this._email.set(email);
  }

  /**
   * Set the action (determined by email check result)
   */
  setAction(action: AuthFormAction): void {
    this._action.set(action);
  }

  /**
   * Handle successful login
   * Navigates to redirect URL if set, then closes modal
   */
  handleLoginSuccess(): void {
    const redirectUrl = this._redirectUrl();
    this.close();

    if (redirectUrl) {
      this.router.navigate([redirectUrl]);
    }
  }
}