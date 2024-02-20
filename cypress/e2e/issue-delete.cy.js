describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
      });
  });

  const issueTitle = "This is an issue of type: Task.";
  const issueListLenghtAfterDelete = 3;
  const issueListLenghtAfterDeleteCancel = 4;
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const getConfirmModal = () => cy.get('[data-testid="modal:confirm"]');
  const boardBacklogList = () => cy.get('[data-testid="board-list:backlog"]');
  const issueList = () => cy.get('[data-testid="list-issue"]');

  it("Should delete issue successfully", () => {
    getIssueDetailsModal().should("be.visible");
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').click();
    });
    getConfirmModal().within(() => {
      cy.contains("Delete issue").should("be.visible").click();
    });
    getConfirmModal().should("not.exist");
    getIssueDetailsModal().should("not.exist");

    cy.reload();
    cy.wait(10000);

    boardBacklogList()
      .should("be.visible")
      .within(() => {
        cy.contains(issueTitle).should("not.exist");
        issueList().should("have.length", issueListLenghtAfterDelete);
      });
  });

  it("Should cancel deletion process successfully", () => {
    getIssueDetailsModal().should("be.visible");
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').click();
    });
    getConfirmModal().within(() => {
      cy.contains("Cancel").click();
    });
    getConfirmModal().should("not.exist");

    getIssueDetailsModal()
      .should("be.visible")
      .get('[data-testid="icon:close"]')
      .first()
      .click();
    getIssueDetailsModal().should("not.exist");

    cy.reload();
    cy.wait(10000);

    boardBacklogList()
      .should("be.visible")
      .within(() => {
        cy.contains(issueTitle).should("be.visible");
        issueList().should("have.length", issueListLenghtAfterDeleteCancel);
      });
  });
});
