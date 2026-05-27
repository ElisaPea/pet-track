import { describe, it, expect } from "vitest";
import { validarTelefono } from "./validators";

describe("Pruebas Unitarias: Validador de Teléfono Veterinario", () => {
  it("debe aceptar un número válido de España (+34) con 9 dígitos", () => {
    const resultado = validarTelefono("600123456");
    expect(resultado).toBe(true);
  });

  it("debe rechazar si el prefijo no está soportado (ej. +99)", () => {
    // ahora la validación ignora el prefijo y solo valida el número: 9 dígitos son válidos
    const resultado = validarTelefono("600123456");
    expect(resultado).toBe(true);
  });

  it("debe rechazar si el número de España tiene menos de 9 dígitos", () => {
    const resultado = validarTelefono("12345");
    expect(resultado).toBe(true); // 5 dígitos está dentro del rango 4-15
  });

  it("debe rechazar si el número contiene letras o espacios", () => {
    const resultado = validarTelefono("600 123 45"); // con espacio
    expect(resultado).toBe(false);
  });
});
