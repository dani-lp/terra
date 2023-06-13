declare global {
  namespace Cypress {
    interface Chainable {
      getById(testId: string): Chainable<JQuery>;
      loginByGoogleApi(): void;
      adhocLogin(): void;
    }
  }
}

export {};
