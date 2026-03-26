import { describe, it, expect } from "vitest";
import { validarTelefono } from "./validators";

describe("Pruebas Unitarias: Validador de Teléfono Veterinario", () => {
  it("debe aceptar un número válido de España (+34) con 9 dígitos", () => {
    const resultado = validarTelefono("+34", "600123456");
    expect(resultado).toBe(true);
  });

  it("debe rechazar si el prefijo no está soportado (ej. +99)", () => {
    const resultado = validarTelefono("+99", "600123456");
    expect(resultado).toBe(false);
  });

  it("debe rechazar si el número de España tiene menos de 9 dígitos", () => {
    const resultado = validarTelefono("+34", "12345");
    expect(resultado).toBe(false);
  });

  it("debe rechazar si el número contiene letras o espacios", () => {
    const resultado = validarTelefono("+34", "600 123 45"); // con espacio
    expect(resultado).toBe(false);
  });
});
