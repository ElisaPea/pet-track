// src/utils/validators.ts

/**
 * Valida un teléfono según su prefijo internacional
 * @param prefijo Ejemplo: '+34'
 * @param numero Ejemplo: '600123456'
 */
export const validarTelefono = (prefijo: string, numero: string): boolean => {
  // 1. Definimos las reglas de nuestra clínica (prefijo y cuántos dígitos esperamos)
  const reglas: Record<string, number> = {
    "+34": 9, // España: 9 dígitos
    "+351": 9, // Portugal: 9 dígitos
    "+33": 9, // Francia: 9 dígitos
  };

  // 2. Comprobamos si el prefijo está en nuestra lista permitida
  if (!reglas[prefijo]) {
    return false; // Si no conocemos el prefijo, no es válido
  }

  // 3. Comprobamos que el número tenga la longitud exacta que marca la regla
  const longitudCorrecta = numero.length === reglas[prefijo];

  // 4. Comprobamos que solo contenga números (sin letras ni espacios)
  const soloNumeros = /^\d+$/.test(numero);

  // Devolvemos true solo si cumple ambas condiciones
  return longitudCorrecta && soloNumeros;
};
