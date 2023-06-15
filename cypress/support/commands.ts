Cypress.Commands.add('getById', (testId: string) => {
  return cy.get(`[data-cy="${testId}"]`);
});

Cypress.Commands.add('loginByGoogleApi', () => {
  cy.log('Logging in to Google');
  cy.request({
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    body: {
      grant_type: 'refresh_token',
      client_id: Cypress.env('googleClientId'),
      client_secret: Cypress.env('googleClientSecret'),
      refresh_token: Cypress.env('googleRefreshToken'),
    },
  }).then(({ body }) => {
    const { access_token, id_token } = body;

    cy.log('Logging in to our app');
    cy.wait(2000);

    cy.request({
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      headers: { Authorization: `Bearer ${access_token}` },
    }).then(({ body }) => {
      cy.log(body);
      const userItem = {
        token: id_token,
        user: {
          googleId: body.sub,
          email: body.email,
          givenName: body.given_name,
          familyName: body.family_name,
          imageUrl: body.picture,
        },
      };
      cy.log(JSON.stringify(userItem));

      window.localStorage.setItem('googleCypress', JSON.stringify(userItem));
      cy.visit('/');
    });
  });
});

Cypress.Commands.add('adhocLogin', () => {
  cy.intercept("/api/auth/session", { fixture: "session.json" }).as("session");
  cy.setCookie("next-auth.session-token", Cypress.env("SESSION_TOKEN"));
  // Cypress.Cookies.preserveOnce("next-auth.session-token");
});

export {}