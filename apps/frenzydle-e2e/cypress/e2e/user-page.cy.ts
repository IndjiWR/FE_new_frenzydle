describe('User Page', () => {
  beforeEach(() => {
    cy.visitUser();
  });

  describe('Navigation', () => {
    it('should display tabs', () => {
      cy.get('[data-testid="stats-tab-link"]').should('be.visible');
      cy.get('[data-testid="achievements-tab-link"]').should('be.visible');
      cy.get('[data-testid="settings-tab-link"]').should('be.visible');
    });

    it('should default to stats tab', () => {
      cy.url().should('include', '/user/stats');
    });

    it('should navigate to achievements tab', () => {
      cy.get('[data-testid="achievements-tab-link"]').click();
      cy.url().should('include', '/user/achievements');
    });

    it('should navigate to settings tab', () => {
      cy.get('[data-testid="settings-tab-link"]').click();
      cy.url().should('include', '/user/settings');
    });
  });

  describe('Guest User Experience', () => {
    it('should show guest teaser on stats tab', () => {
      cy.get('[data-testid="guest-teaser"]').should('be.visible');
      cy.get('[data-testid="teaser-title"]').should('be.visible');
      cy.get('[data-testid="teaser-message"]').should('be.visible');
    });

    it('should show guest teaser on achievements tab', () => {
      cy.get('[data-testid="achievements-tab-link"]').click();
      cy.get('[data-testid="guest-teaser"]').should('be.visible');
    });

    it('should show guest indicator in header', () => {
      cy.get('[data-testid="guest-badge"]').should('be.visible');
    });

    it('should show limited account info for guests', () => {
      cy.get('[data-testid="settings-tab-link"]').click();
      cy.get('[data-testid="guest-account-message"]').should('be.visible');
      cy.get('[data-testid="settings-create-account"]').should('be.visible');
    });
  });

  describe('Logged In User Experience', () => {
    beforeEach(() => {
      // Login first
      cy.visitHome();
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="auth-email-input"]').type('test@frenzydle.com');
      cy.get('[data-testid="auth-email-submit"]').click();
      cy.get('[data-testid="auth-password-input"]').type('password123');
      cy.get('[data-testid="auth-password-submit"]').click();
      cy.get('[data-testid="auth-modal"]').should('not.exist');
      cy.visitUser();
    });

    describe('Profile Header', () => {
      it('should display user avatar', () => {
        cy.get('[data-testid="user-avatar"]').should('be.visible');
      });

      it('should display display name', () => {
        cy.get('[data-testid="display-name"]').should('be.visible');
      });

      it('should allow editing display name', () => {
        cy.get('[data-testid="display-name-edit"]').click();
        cy.get('[data-testid="display-name-input"]').should('be.visible');
        cy.get('[data-testid="display-name-save"]').should('be.visible');
      });

      it('should cancel name edit on escape', () => {
        cy.get('[data-testid="display-name-edit"]').click();
        cy.get('[data-testid="display-name-input"]').type('{esc}');
        cy.get('[data-testid="display-name-input"]').should('not.exist');
      });
    });

    describe('Stats Tab', () => {
      it('should display stats cards', () => {
        cy.get('[data-testid="stats-tab-link"]').click();
        cy.get('[data-testid="stats-card"]').should('have.length.at.least', 1);
      });

      it('should display activity chart', () => {
        cy.get('[data-testid="stats-tab-link"]').click();
        cy.get('[data-testid="activity-chart"]').should('be.visible');
      });

      it('should allow game filter selection', () => {
        cy.get('[data-testid="stats-tab-link"]').click();
        cy.get('[data-testid="game-filter"]').should('be.visible');
      });
    });

    describe('Achievements Tab', () => {
      it('should display achievements', () => {
        cy.get('[data-testid="achievements-tab-link"]').click();
        cy.get('[data-testid="achievement-card"]').should('have.length.at.least', 1);
      });

      it('should display achievement categories', () => {
        cy.get('[data-testid="achievements-tab-link"]').click();
        cy.get('[data-testid="achievement-category"]').should('have.length.at.least', 1);
      });

      it('should show locked achievements', () => {
        cy.get('[data-testid="achievements-tab-link"]').click();
        cy.get('[data-testid="achievement-card"]').first().within(() => {
          cy.get('[data-testid="achievement-status"]').should('exist');
        });
      });
    });

    describe('Settings Tab', () => {
      it('should display account section', () => {
        cy.get('[data-testid="settings-tab-link"]').click();
        cy.get('[data-testid="settings-account"]').should('be.visible');
      });

      it('should display preferences section', () => {
        cy.get('[data-testid="settings-tab-link"]').click();
        cy.get('[data-testid="settings-preferences"]').should('be.visible');
      });

      it('should display language selector', () => {
        cy.get('[data-testid="settings-tab-link"]').click();
        cy.get('[data-testid="settings-language"]').should('be.visible');
      });

      it('should change language', () => {
        cy.get('[data-testid="settings-tab-link"]').click();
        cy.get('[data-testid="settings-language"]').select('it');
        // Verify language changed (text should be in Italian)
        cy.get('[data-testid="stats-tab-link"]').should('contain', 'Statistiche');
      });

      it('should toggle theme', () => {
        cy.get('[data-testid="settings-tab-link"]').click();
        cy.get('[data-testid="settings-theme-toggle"]').click();
        // Theme should toggle
        cy.get('html').should('have.class', 'dark');
      });

      it('should show password change form', () => {
        cy.get('[data-testid="settings-tab-link"]').click();
        cy.get('[data-testid="show-password-form"]').click();
        cy.get('[data-testid="current-password"]').should('be.visible');
        cy.get('[data-testid="new-password"]').should('be.visible');
        cy.get('[data-testid="confirm-password"]').should('be.visible');
      });

      it('should show danger zone', () => {
        cy.get('[data-testid="settings-tab-link"]').click();
        cy.get('[data-testid="delete-account-btn"]').should('be.visible');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      cy.get('h1, h2, h3').should('exist');
    });

    it('should have accessible tab navigation', () => {
      cy.get('[data-testid="stats-tab-link"]').should('have.attr', 'role', 'tab');
      cy.get('[data-testid="achievements-tab-link"]').should('have.attr', 'role', 'tab');
      cy.get('[data-testid="settings-tab-link"]').should('have.attr', 'role', 'tab');
    });
  });
});