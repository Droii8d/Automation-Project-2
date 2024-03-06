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
  const timeTrackingSection = () => cy.get('[data-testid="icon:stopwatch"]');
  const timeTrackingModal = () => cy.get('[data-testid="modal:tracking"]');
  const timeSpentInput = () => cy.get('[placeholder="Number"]').eq(0);
  const timeRemainingInput = () => cy.get('[placeholder="Number"]').eq(1);
  const timeTrackingDoneButton = () => cy.get("button").contains("Done");
  const estimatedTimeValue_1 = 10;
  const estimatedTimeValue_2 = 20;
  const logedTimeSpent = 2;
  const logedTimeRemaining = 5;

  it("Should create issue and add/edit/remove time estimation to the issue", () => {
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
      estimatedTime()
        .type(estimatedTimeValue_1)
        .should("have.value", estimatedTimeValue_1)
        .and("be.visible");
      issueDetailsModalCloseIcon().click();
    });
    cy.wait(3000);
    cy.contains(randomTitle).click();
    getIssueDetailsModal().within(() => {
      cy.wait(3000);
      estimatedTime()
        .should("have.value", estimatedTimeValue_1)
        .and("be.visible");
      estimatedTime()
        .clear()
        .type(estimatedTimeValue_2)
        .should("have.value", estimatedTimeValue_2)
        .and("be.visible");
      issueDetailsModalCloseIcon().click();
    });
    cy.wait(3000);
    cy.contains(randomTitle).click();
    getIssueDetailsModal().within(() => {
      estimatedTime()
        .should("have.value", estimatedTimeValue_2)
        .and("be.visible");
      estimatedTime().clear();
      issueDetailsModalCloseIcon().click();
    });
    cy.wait(3000);
    cy.contains(randomTitle).click();
    getIssueDetailsModal().within(() => {
      estimatedTime().should("have.value", "").and("be.visible");
    });
  });

  it("Should create issue, add time estimation and log/remove logged spent time on issue", () => {
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
      estimatedTime()
        .type(estimatedTimeValue_1)
        .should("have.value", estimatedTimeValue_1)
        .and("be.visible");
      timeTrackingSection().click();
    });
    timeTrackingModal()
      .should("be.visible")
      .within(() => {
        timeSpentInput().type(logedTimeSpent);
        timeRemainingInput().type(logedTimeRemaining);
        cy.wait(1000);
        cy.contains("No time logged").should("not.exist");
        cy.contains(logedTimeSpent + "h logged").should("be.visible");
        cy.contains(logedTimeRemaining + "h remaining").should("be.visible");
        timeTrackingDoneButton().click();
      });
    getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        cy.contains("No time logged").should("not.exist");
        cy.contains(logedTimeSpent + "h logged").should("be.visible");
        cy.contains(logedTimeRemaining + "h remaining").should("be.visible");
        issueDetailsModalCloseIcon().click();
      });
    cy.contains(randomTitle).click();
    getIssueDetailsModal().within(() => {
      cy.wait(7000);
      timeTrackingSection().click();
    });
    timeTrackingModal()
      .should("be.visible")
      .within(() => {
        timeSpentInput().clear();
        timeRemainingInput().clear();
        cy.contains("No time logged").should("be.visible");
        cy.contains(estimatedTimeValue_1 + "h estimated").should("be.visible");
        timeTrackingDoneButton().click();
      });
    getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        estimatedTime().should("have.value", estimatedTimeValue_1);
        cy.contains("No time logged").should("be.visible");
        cy.contains(estimatedTimeValue_1 + "h estimated").should("be.visible");
        issueDetailsModalCloseIcon().click();
      });
  });
});
