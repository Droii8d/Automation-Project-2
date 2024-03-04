import { es, faker } from "@faker-js/faker";

describe("Time tracking", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  const randomTitle = faker.lorem.words(2);
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const estimatedTime = () => cy.get('[placeholder="Number"]');
  const issueDetailsModalCloseIcon = () => cy.get('[data-testid="icon:close"]');

  it("Should add/edit/remove time estimation to the issue", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.wait(3000);
      cy.get('input[name="title"]').type(randomTitle);
      cy.get('button[type="submit"]').click();
      cy.wait(30000);
    });
    cy.contains(randomTitle).click();
    getIssueDetailsModal().within(() => {
      cy.wait(7000);
      cy.contains("No time logged").should("be.visible");
      estimatedTime().type("10").should("have.value", 10).and("be.visible");
      issueDetailsModalCloseIcon().click();
    });
    cy.wait(3000);
    cy.contains(randomTitle).click();
    getIssueDetailsModal().within(() => {
      cy.wait(3000);
      estimatedTime().should("have.value", 10).and("be.visible");
      estimatedTime()
        .clear()
        .type("20")
        .should("have.value", 20)
        .and("be.visible");
      issueDetailsModalCloseIcon().click();
    });
    cy.wait(3000);
    cy.contains(randomTitle).click();
    getIssueDetailsModal().within(() => {
      estimatedTime().should("have.value", 20).and("be.visible");
      estimatedTime().clear();
      issueDetailsModalCloseIcon().click();
    });
    cy.wait(3000);
    cy.contains(randomTitle).click();
    getIssueDetailsModal().within(() => {
      estimatedTime().should("have.value", "").and("be.visible");
    });
  });
});
