describe('FrenzyDle App', () => {
  beforeEach(() => {
    cy.visitHome();
  });

  it('should display welcome message', () => {
    cy.contains('Welcome to FrenzyDle').should('be.visible');
  });

  it('should navigate to user page', () => {
    cy.visitUser();
    cy.contains('User Settings').should('be.visible');
  });

  it('should have correct title', () => {
    cy.title().should('eq', 'FrenzyDle');
  });
});