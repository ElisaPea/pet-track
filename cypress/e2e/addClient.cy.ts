describe("Requisitos Funcionales - Creación de Cliente", () => {
  // Antes de cada test, visitamos la página principal del veterinario
  beforeEach(() => {
    cy.visit("/Home-Vet"); // La ruta en donde vive el botón de agregar
  });

  it("RF-01: Debe permitir abrir el popup y escribir los datos de un nuevo cliente", () => {
    // 1. Damos clic al botón con el ícono de '+'
    // Cypress buscará el elemento que contenga ese data-testid genérico de Material UI
    cy.get('[data-testid="AddIcon"]').click();

    // 2. Esperamos a que aparezca la ventana buscando su título
    cy.contains("Agregar nuevo cliente").should("be.visible");

    // 3. Rellenamos los inputs basándonos en su orden de aparición (0=Nombre, 1=Email, 2=Teléfono)
    // Usamos eq() como en tu ejemplo de test-cypress
    cy.get("input").eq(0).type("Cliente Prueba");
    cy.get("input").eq(1).type("prueba@correo.com");
    cy.get("input").eq(2).type("611222333");

    // 4. Verificamos que el botón de GUARDAR esté visible
    // Como es un entorno de pruebas básico, simplemente podemos verificar que existe
    // o darle click.
    cy.contains("button", "GUARDAR").should("be.visible").click();
  });

  it("RF-02: Debe mostrar error si los campos obligatorios están vacíos", () => {
    // 1. Abrimos el popup de nuevo
    cy.get('[data-testid="AddIcon"]').click();

    // 2. Intentamos dar clic en GUARDAR sin rellenar absolutamente nada
    cy.contains("button", "GUARDAR").click();

    // 3. Verificamos visualmente que el sistema nos alerta por los campos vacíos
    cy.contains("Por favor, rellena todos los campos obligatorios").should("be.visible");
  });
});
