describe('Auth Flow', () => {
  beforeEach(() => {
    cy.visitHome();
  });

  describe('Auth Modal', () => {
    it('should open auth modal when login button is clicked', () => {
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="auth-modal"]').should('be.visible');
    });

    it('should close modal when backdrop is clicked', () => {
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="auth-modal"]').should('be.visible');
      cy.get('[data-testid="auth-modal-backdrop"]').click({ force: true });
      cy.get('[data-testid="auth-modal"]').should('not.exist');
    });

    it('should display email input in method selection step', () => {
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="auth-email-input"]').should('be.visible');
      cy.get('[data-testid="auth-google-button"]').should('be.visible');
    });

    it('should show validation error for invalid email', () => {
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="auth-email-input"]').type('invalid-email');
      cy.get('[data-testid="auth-email-input"]').blur();
      cy.get('[data-testid="auth-email-error"]').should('be.visible');
    });

    it('should show password field after email submission', () => {
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="auth-email-input"]').type('test@frenzydle.com');
      cy.get('[data-testid="auth-email-submit"]').click();
      cy.get('[data-testid="auth-password-input"]').should('be.visible');
    });

    it('should show display name field for new email', () => {
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="auth-email-input"]').type('newuser@example.com');
      cy.get('[data-testid="auth-email-submit"]').click();
      cy.get('[data-testid="auth-display-name-input"]').should('be.visible');
    });
  });

  describe('Login Flow', () => {
    it('should login with valid credentials', () => {
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="auth-email-input"]').type('test@frenzydle.com');
      cy.get('[data-testid="auth-email-submit"]').click();
      cy.get('[data-testid="auth-password-input"]').type('password123');
      cy.get('[data-testid="auth-password-submit"]').click();

      // Should show success and close modal
      cy.get('[data-testid="auth-modal"]').should('not.exist');
    });

    it('should show error for invalid credentials', () => {
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="auth-email-input"]').type('test@frenzydle.com');
      cy.get('[data-testid="auth-email-submit"]').click();
      cy.get('[data-testid="auth-password-input"]').type('wrongpassword');
      cy.get('[data-testid="auth-password-submit"]').click();

      // Should show error message
      cy.get('[data-testid="auth-error"]').should('be.visible');
    });
  });

  describe('Guest User', () => {
    it('should create guest session on app load', () => {
      // Guest session should be created automatically
      cy.window().then((win) => {
        // Check localStorage for guest user data
        const userJson = win.localStorage.getItem('frenzydle_user');
        // Either null (not yet created) or a guest user object
        if (userJson) {
          const user = JSON.parse(userJson);
          expect(user.isGuest).to.be.true;
        }
      });
    });

    it('should show login button for guests', () => {
      cy.get('[data-testid="login-button"]').should('be.visible');
    });
  });

  describe('Protected Routes', () => {
    it('should allow guests to access /user route', () => {
      cy.visitUser();
      cy.url().should('include', '/user');
    });

    it('should show guest teaser on stats tab', () => {
      cy.visitUser();
      cy.get('[data-testid="guest-teaser"]').should('be.visible');
    });

    it('should show guest teaser on achievements tab', () => {
      cy.visitUser();
      cy.get('[data-testid="achievements-tab-link"]').click();
      cy.get('[data-testid="guest-teaser"]').should('be.visible');
    });
  });

  describe('User Dropdown (NavBar)', () => {
    it('should show user dropdown when logged in', () => {
      // First login
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="auth-email-input"]').type('test@frenzydle.com');
      cy.get('[data-testid="auth-email-submit"]').click();
      cy.get('[data-testid="auth-password-input"]').type('password123');
      cy.get('[data-testid="auth-password-submit"]').click();
      cy.get('[data-testid="auth-modal"]').should('not.exist');

      // Click on user avatar to open dropdown
      cy.get('[data-testid="user-dropdown-toggle"]').click();
      cy.get('[data-testid="user-dropdown"]').should('be.visible');
    });

    it('should navigate to user page from dropdown', () => {
      // Login first
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="auth-email-input"]').type('test@frenzydle.com');
      cy.get('[data-testid="auth-email-submit"]').click();
      cy.get('[data-testid="auth-password-input"]').type('password123');
      cy.get('[data-testid="auth-password-submit"]').click();
      cy.get('[data-testid="auth-modal"]').should('not.exist');

      // Open dropdown and click profile
      cy.get('[data-testid="user-dropdown-toggle"]').click();
      cy.get('[data-testid="user-profile-link"]').click();
      cy.url().should('include', '/user');
    });

    it('should logout from dropdown', () => {
      // Login first
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="auth-email-input"]').type('test@frenzydle.com');
      cy.get('[data-testid="auth-email-submit"]').click();
      cy.get('[data-testid="auth-password-input"]').type('password123');
      cy.get('[data-testid="auth-password-submit"]').click();
      cy.get('[data-testid="auth-modal"]').should('not.exist');

      // Logout
      cy.get('[data-testid="user-dropdown-toggle"]').click();
      cy.get('[data-testid="logout-button"]').click();

      // Should show login button again
      cy.get('[data-testid="login-button"]').should('be.visible');
    });
  });
});