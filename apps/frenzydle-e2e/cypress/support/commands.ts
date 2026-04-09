// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
// ***********************************************

// Custom commands for FrenzyDle
Cypress.Commands.add('visitHome', () => {
  cy.visit('/');
});

Cypress.Commands.add('visitUser', () => {
  cy.visit('/user');
});