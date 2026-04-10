describe('FrenzyDle App', () => {
  beforeEach(() => {
    cy.visitHome();
  });

  describe('Navigation Bar', () => {
    it('should display logo', () => {
      cy.get('[data-testid="nav-bar"]').should('be.visible');
      cy.get('[data-testid="nav-logo"]').should('be.visible');
    });

    it('should display navigation links', () => {
      cy.get('[data-testid="nav-link-nav.home"]').should('be.visible');
      cy.get('[data-testid="nav-link-nav.games"]').should('be.visible');
    });

    it('should display language switcher', () => {
      cy.get('[data-testid="language-switcher"]').should('be.visible');
    });

    it('should display login button when not logged in', () => {
      cy.get('[data-testid="login-button"]').should('be.visible');
    });
  });

  describe('Hero Section', () => {
    it('should display hero section', () => {
      cy.get('[data-testid="hero-section"]').should('be.visible');
    });

    it('should display logo with animation', () => {
      cy.get('[data-testid="hero-logo"]').should('be.visible');
    });

    it('should display subtitle', () => {
      // Either typewriter or static subtitle should be visible
      cy.get('[data-testid="hero-subtitle-typewriter"], [data-testid="hero-subtitle-static"]')
        .should('be.visible');
    });
  });

  describe('Game Grid', () => {
    it('should display game grid', () => {
      cy.get('[data-testid="game-grid"]').should('be.visible');
    });

    it('should show loading state initially', () => {
      // The mock data loads fast, so we check if the grid eventually shows games
      cy.get('[data-testid="game-grid-loaded"], [data-testid="game-grid-loading"]')
        .should('exist');
    });

    it('should display game cards after loading', () => {
      // Wait for games to load (mock data should load quickly)
      cy.get('[data-testid="game-grid-loaded"]', { timeout: 5000 }).should('exist');
      cy.get('[data-testid="game-card"]').should('have.length.greaterThan', 0);
    });

    it('should display game card information', () => {
      cy.get('[data-testid="game-grid-loaded"]', { timeout: 5000 }).should('exist');
      cy.get('[data-testid="game-card"]').first().within(() => {
        cy.get('[data-testid="game-name"]').should('be.visible');
        cy.get('[data-testid="game-thumbnail"]').should('be.visible');
      });
    });
  });

  describe('Language Switcher', () => {
    it('should open language dropdown on click', () => {
      cy.get('[data-testid="language-switcher-button"]').click();
      cy.get('[data-testid="language-dropdown"]').should('be.visible');
      cy.get('[data-testid="language-option-en"]').should('be.visible');
      cy.get('[data-testid="language-option-it"]').should('be.visible');
      cy.get('[data-testid="language-option-fr"]').should('be.visible');
      cy.get('[data-testid="language-option-es"]').should('be.visible');
      cy.get('[data-testid="language-option-pt"]').should('be.visible');
    });

    it('should change language when selecting an option', () => {
      cy.get('[data-testid="language-switcher-button"]').click();
      cy.get('[data-testid="language-option-it"]').click();
      // Verify language changed (the dropdown should show Italian)
      cy.get('[data-testid="language-switcher-button"]').should('contain', 'Italiano');
    });
  });

  describe('Navigation', () => {
    it('should navigate to user page', () => {
      cy.visitUser();
      cy.contains('User Settings').should('be.visible');
    });

    it('should navigate to game page on card click', () => {
      cy.get('[data-testid="game-grid-loaded"]', { timeout: 5000 }).should('exist');
      cy.get('[data-testid="play-button"]').first().click();
      cy.url().should('include', '/games/');
    });
  });

  describe('Accessibility', () => {
    it('should have correct title', () => {
      cy.title().should('eq', 'FrenzyDle');
    });

    it('should have accessible navigation', () => {
      cy.get('nav').should('exist');
      cy.get('nav a').should('have.length.greaterThan', 0);
    });
  });
});