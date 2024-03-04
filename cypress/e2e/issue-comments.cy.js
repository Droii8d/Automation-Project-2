import { faker } from "@faker-js/faker";

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
      });
  });

  const issueTitle = "This is an issue of type: Task.";
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const addCommentTxtBox = () => cy.contains("Add a comment...");
  const txtAreaForComment = () =>
    cy.get('textarea[placeholder="Add a comment..."]');
  const commentSaveButton = () => cy.contains("button", "Save");
  const allComments = () => cy.get('[data-testid="issue-comment"]');
  const getDeleteConfirmModal = () => cy.get('[data-testid="modal:confirm"]');
  const clickDeleteConfirm = () =>
    cy.contains("button", "Delete comment").click().should("not.exist");

  const randomComment = faker.lorem.sentence(5);
  const randomComment2 = faker.lorem.sentence(5);

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";

    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.contains("Add a comment...").should("exist");
      cy.get('[data-testid="issue-comment"]').should("contain", comment);
    });
  });

  it("Should edit a comment successfully", () => {
    const previousComment = "An old silent pond...";
    const comment = "TEST_COMMENT_EDITED";

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
        .should("contain", previousComment)
        .clear()
        .type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", comment);
    });
  });

  it("Should delete a comment successfully", () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  });

  it("Should create, edit and delete a comment successfully", () => {
    getIssueDetailsModal().within(() => {
      addCommentTxtBox().click();
      txtAreaForComment().type(randomComment);
      commentSaveButton().click().should("not.exist");
      addCommentTxtBox().should("exist");
      allComments().should("contain", randomComment);

      allComments().first().contains("Edit").click().should("not.exist");
      txtAreaForComment()
        .should("contain", randomComment)
        .clear()
        .type(randomComment2);
      commentSaveButton().click().should("not.exist");
      allComments().should("contain", "Edit").and("contain", randomComment2);

      allComments().first().contains("Delete").click();
    });
    getDeleteConfirmModal().within(() => {
      clickDeleteConfirm();
    });
    getDeleteConfirmModal().should("not.exist");

    getIssueDetailsModal().within(() => {
      allComments().should("not.contain", randomComment2);
    });
  });
});
