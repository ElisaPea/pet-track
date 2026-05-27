import { describe, it, expect } from "vitest";
import { validateEmail, validatePhone } from "./validationUtils";

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

describe("Pruebas Unitarias: validatePhone", () => {
  it("debe retornar true si el teléfono es vacío o nulo", () => {
    expect(validatePhone("")).toBe(true);
    expect(validatePhone(undefined as any)).toBe(true);
  });

  it("debe retornar true para teléfonos válidos (solo dígitos, entre 4 y 15)", () => {
    expect(validatePhone("1234")).toBe(true);            // 4 dígitos
    expect(validatePhone("600123456")).toBe(true);       // 9 dígitos
    expect(validatePhone("123456789012345")).toBe(true); // 15 dígitos
  });

  it("debe retornar false para teléfonos con menos de 4 o más de 15 dígitos", () => {
    expect(validatePhone("123")).toBe(false);              // 3 dígitos
    expect(validatePhone("1234567890123456")).toBe(false); // 16 dígitos
  });

  it("debe retornar false si el teléfono contiene caracteres no numéricos", () => {
    expect(validatePhone("+34 600 123 456")).toBe(false); // tiene + y espacios
    expect(validatePhone("abc 1234 xyz")).toBe(false);    // tiene letras
    expect(validatePhone("a-b-c")).toBe(false);            // solo caracteres
    expect(validatePhone("600-123-456")).toBe(false);     // tiene guiones
    expect(validatePhone("(600) 123456")).toBe(false);    // tiene paréntesis
  });
});
