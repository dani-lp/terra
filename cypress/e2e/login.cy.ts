import { DataTestIds } from '../../src/const/dataTestIds';

describe('login page', () => {
  before(() => {
    cy.adhocLogin();
    cy.visit('/');
  });

  it('login test', () => {
    cy.getById(DataTestIds.home.postLoginSelector).should('be.visible');
  });
});
