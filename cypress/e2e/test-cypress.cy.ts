
describe("Requisitos Funcionales - Gestión de Mascotas", () => {
  // Antes de cada test, que visite la página principal
  beforeEach(() => {
    cy.visit("/");
  });

  it("RF-01: Debe permitir escribir los datos de una nueva mascota", () => {
    // 1. Supongamos que tienes un link o botón que dice "Nueva Mascota"
    // Si no tienes el link aún, puedes usar cy.visit('/ruta-de-tu-formulario')

    // 2. Buscamos los inputs por su etiqueta o placeholder y escribimos
    // Cambia los selectores ('input') por los que uses en tu HTML/Tailwind
    cy.get("input").first().type("Firulais");
    cy.get("input").eq(1).type("Beagle"); // Segunda caja de texto (raza)

    // 3. Verificamos que el botón de guardar esté ahí
    cy.get("button").contains("Guardar").should("be.visible");
  });

  it("RF-02: Debe mostrar error si el formulario está vacío", () => {
    // Intentamos dar clic al botón sin rellenar nada
    cy.get("button").contains("Guardar").click();

    // Verificamos si aparece algún mensaje de validación (si lo tienes implementado)
    // cy.contains('Campo obligatorio').should('be.visible');
  });
});
