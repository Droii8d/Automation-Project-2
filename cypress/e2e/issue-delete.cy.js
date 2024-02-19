import IssueModal from "../pages/IssueModal";

describe("Issue deleting and cancellation", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
        cy.get('[data-testid="modal:issue-details"]').should("be.visible");
      });
  });

  it("Should delete an issue and validate successful deletion", () => {
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.validateIssueVisibilityState(
      "This is an issue of type: Task.",
      false
    );
  });

  it("Should initiate deletion of issue and then cancel deletion", () => {
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.validateIssueVisibilityState(
      "This is an issue of type: Task.",
      true
    );
  });
});
