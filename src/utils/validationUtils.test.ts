import { describe, it, expect } from "vitest";
import { validateEmail } from "./validationUtils";

describe("Pruebas Unitarias: validateEmail", () => {
  describe("Casos de éxito (Emails válidos)", () => {
    it.each([
      "usuario@email.com",
      "juan.perez123@gmail.com",
      "user@mail.empresa.es",
      "v@x.co",
      "nombre_apellido@dominio.org",
    ])("debe retornar true para: %s", (email) => {
      expect(validateEmail(email)).toBe(true);
    });
  });

  describe("Casos de fallo (Emails inválidos)", () => {
    it.each([
      { email: "usuarioemail.com", motivo: "no tiene @" },
      { email: "usuario@", motivo: "no tiene dominio" },
      { email: "usuario@email", motivo: "no tiene extensión" },
      { email: "usuario @email.com", motivo: "contiene espacios" },
      { email: "", motivo: "string vacío" },
      { email: "   ", motivo: "solo espacios" },
      {
        email: "usuario<>@email.com",
        motivo: "caracteres especiales prohibidos",
      },
      { email: "@dominio.com", motivo: "no tiene nombre de usuario" },
      { email: "usuario@.com", motivo: "dominio comienza con punto" },
    ])("debe retornar false cuando $motivo ($email)", ({ email }) => {
      expect(validateEmail(email)).toBe(false);
    });
  });

  it("debe limpiar espacios en blanco al inicio o final (trim)", () => {
    const resultado = validateEmail("  usuario@email.com  ");
    expect(resultado).toBe(true);
  });
});
