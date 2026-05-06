describe("Flujo de Creación de Mascota", () => {
  beforeEach(() => {
    cy.visit("/welcome-user");

    // Abre el popup
    cy.contains("button", "!AÑADE UNA MASCOTA!").click();

    // Verificamos que el popup esté visible
    cy.get('[data-testid="input-pet-name"]').should("be.visible");
  });

  it("Debe mostrar error si el usuario intenta guardar sin nombre", () => {
    // Click en guardar sin escribir nombre
    cy.get('[data-testid="btn-save-pet"]').click();

    // Verifica que el toast de error aparece
    cy.get('[data-testid="toast-feedback-message"]')
      .should("be.visible")
      .and("contain", "Por favor, revisa el nombre de la mascota");
  });

  it("Debe permitir crear una mascota correctamente", () => {
    // Escribimos nombre
    cy.get('[data-testid="input-pet-name"]').type("Firulais");

    // Completar más campos
    cy.get('[data-testid="input-pet-age"]').type("3");
    cy.get('[data-testid="input-pet-weight"]').type("10");
    cy.get('[data-testid="input-pet-breed"]').type("Labrador");

    // Guardar
    cy.get('[data-testid="btn-save-pet"]').click();

    // Verifica toast éxito
    cy.get('[data-testid="toast-feedback-message"]')
      .should("be.visible")
      .and("contain", "¡Mascota creada!");

    // Verifica que el popup se cierra (input ya no existe)
    cy.get('[data-testid="input-pet-name"]').should("not.exist");
  });
});
