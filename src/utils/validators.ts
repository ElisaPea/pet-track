// src/utils/validators.ts

/**
 * Valida un teléfono: únicamente dígitos, longitud entre 4 y 15 (incluidos).
 * Acepta dos formas de invocación para compatibilidad:
 * - `validarTelefono("600123456")`
 * - `validarTelefono("+34", "600123456")` (se ignora el prefijo y se valida el número)
 */
export const validarTelefono = (
  prefijoOrNumero: string,
  numeroOptional?: string,
): boolean => {
  const numero = numeroOptional ?? prefijoOrNumero;
  if (!numero || !numero.length) return false;
  return /^\d{4,15}$/.test(numero.trim());
};
