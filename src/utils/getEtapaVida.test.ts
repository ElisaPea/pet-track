// src/utils/getEtapaVida.test.ts
import { describe, it, expect } from "vitest";
import { getEtapaVida } from "./getEtapaVida";

describe("getEtapaVida", () => {

    // Casos CACHORRO (1-3)
    it("devuelve Cachorro para edad 1", () => {
        expect(getEtapaVida("1")).toBe("🐾 Cachorro");
    });
    it("devuelve Cachorro para edad 2", () => {
        expect(getEtapaVida("2")).toBe("🐾 Cachorro");
    });
    it("devuelve Cachorro para edad 3", () => {
        expect(getEtapaVida("3")).toBe("🐾 Cachorro");
    });

    // Casos JOVEN (4-8)
    it("devuelve Joven para edad 4", () => {
        expect(getEtapaVida("4")).toBe("🐕 Joven");
    });
    it("devuelve Joven para edad 5", () => {
        expect(getEtapaVida("5")).toBe("🐕 Joven");
    });
    it("devuelve Joven para edad 6", () => {
        expect(getEtapaVida("6")).toBe("🐕 Joven");
    });
    it("devuelve Joven para edad 7", () => {
        expect(getEtapaVida("7")).toBe("🐕 Joven");
    });
    it("devuelve Joven para edad 8", () => {
        expect(getEtapaVida("8")).toBe("🐕 Joven");
    });

    // Casos ADULTO (9+)
    it("devuelve Adulto para edad 9", () => {
        expect(getEtapaVida("9")).toBe("🦮 Adulto");
    });
    it("devuelve Adulto para edad 15", () => {
        expect(getEtapaVida("15")).toBe("🦮 Adulto");
    });

    // Casos vacíos / inválidos
    it("devuelve cadena vacía si edad es vacía", () => {
        expect(getEtapaVida("")).toBe("");
    });
    it("devuelve cadena vacía si edad es 0", () => {
        expect(getEtapaVida("0")).toBe("");
    });
});