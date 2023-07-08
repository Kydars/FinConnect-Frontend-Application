Cypress.Commands.add('login', (username, password) => {
  cy.visit('/')
  cy.get('#login-email')
      .focus()
      .type('zulu@gmail.com')
    cy.get('#login-password')
      .focus()
      .type('111111')
  cy.get('button[name="login-button"]').trigger("click")
  cy.url().should('contain', '/home')
})

describe('logging in', () => {
  it("should navigate to the login screen successfully", () => {
    cy.visit('/');
    cy.url().should('include', 'localhost:3000/')
  })
  it("should navigate to the home page successfully after logging in", () => {
    cy.visit('/');
    cy.get('#login-email')
      .focus()
      .type('zulu@gmail.com')
    cy.get('#login-password')
      .focus()
      .type('111111')
    cy.get('button[name="login-button"]')
      .trigger("click")
    cy.url().should('include', '/home')
  })
});

describe('signing out', () => {
  beforeEach(() => {
    cy.login('zulu@gmail.com', '111111')
  })
  it("should sign out when clicking Sign Out", () => {
    cy.get('#profile-dropdown').click();
    cy.get('#sign-out-button').click();
    cy.url().should('eq', 'http://localhost:3000/')
  })
});

describe('navigation', () => {
  beforeEach(() => {
    cy.login('zulu@gmail.com', '111111')
  })
  it("should go to news search tab", () => {
    cy.get('#news-button').click()
    cy.contains('News Search').should('be.visible')
  })
  it("should go to company search tab", () => {
    cy.get('#company-button').click()
    cy.contains('Company Search').should('be.visible')
  })
  it("should go to predict price tab", () => {
    cy.get('#predict-button').click()
    cy.contains('Predict Price').should('be.visible')
  })
})

describe('searching news and company', () => {
  beforeEach(() => {
    cy.login('zulu@gmail.com', '111111')
  })
  it("news search should search aapl and display aapl in search drop down", () => {
    cy.get('#news-button').click()
    cy.contains('News Search').should('be.visible')
    cy.get('#news-search-field')
      .focus()
      .type('aapl')
    cy.contains('Apple Inc').should('be.visible')
  })
  it("company search should search tsla and display tsla in the list", () => {
    cy.get('#company-button').click()
    cy.contains('Company Search').should('be.visible')
    cy.get('#company-search-field')
      .focus()
      .type('tsla')
    cy.get('#company-search-button')
      .click()
    cy.contains('TSLA').should('be.visible')
  })
})

describe('accessing charts from overview and company search', () => {
  beforeEach(() => {
    cy.login('zulu@gmail.com', '111111')
  })
  it("should see charts from details button on company search", () => {
    cy.get('#company-button').click()
    cy.get('#company-search-field')
      .focus()
      .type('tsla')
    cy.get('#company-search-button')
      .click()
    cy.get('#TSLA-company-detail-button').click()
    cy.contains('TSLA Financial News Chart').should('be.visible')
    cy.url().should('include', '/chart/TSLA')
  })
})
