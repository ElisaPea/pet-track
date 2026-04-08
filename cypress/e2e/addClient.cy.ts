describe("RF - Creación de Cliente en Pet-Track", () => {

  beforeEach(() => {
    // Ruta correcta del proyecto
    cy.visit("/Home-Vet");
  });

  it("Debe crear un cliente correctamente interceptando la llamada a Supabase", () => {

    // 1. Interceptamos la llamada a Supabase
    // Usamos 'POST' y el patrón de URL que usa Supabase para la tabla 'Client'
    cy.intercept('POST', '**/rest/v1/Client*', {
      statusCode: 201,
      body: [{ id: 1, name: "Juan Perez", email: "juan@test.com" }]
    }).as('supabasePost');

    // 2. Abrimos el popup
    cy.get('[data-testid="add-client-button"]').click();

    // 3. ENTORNO LIMITADO AL POPUP
    cy.get('[data-testid="add-client-popup-container"]').last().within(() => {
      cy.get('[data-testid="input-Nombre"]').type("Juan Perez");
      cy.get('[data-testid="input-Email"]').type("juan@test.com");
      cy.get('[data-testid="input-Telefono"]').type("+34600111222");

      // 4. Click en Guardar
      cy.get('[data-testid="save-client-btn"]').click();
    });

    // 5. Verificamos la comunicación con la API
    cy.wait('@supabasePost').then((interception) => {
      // Validamos que el JSON enviado a Supabase sea el correcto
      const body = interception.request.body[0];
      expect(body.name).to.equal("Juan Perez");
      expect(body.email).to.equal("juan@test.com");
      expect(body.phone).to.equal("+34600111222");
    });

    // 6. Verificamos que el popup se cierra (después de los 2 segundos de timeout)
    // Cypress esperará automáticamente
    cy.get('Agregar nuevo cliente').should('not.exist');
  });

  it("Debe mostrar error de validación si faltan campos", () => {
    cy.get('[data-testid="add-client-button"]').click();
    // Aquí también lo limitamos para que no busque el botón de guardar de la tabla de fondo
    cy.get('[data-testid="add-client-popup-container"]').last().within(() => {
      cy.get('[data-testid="save-client-btn"]').click();
    });

    // Verificamos el Alert de campos obligatorios
    cy.get('[data-testid="error-fields-required"]')
      .should("be.visible")
      .and('contain', 'Por favor, rellena todos los campos obligatorios (Nombre, Email y Teléfono).');
  });
});