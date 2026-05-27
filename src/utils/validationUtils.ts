// Valida formato de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

// Valida que el teléfono tenga de 4 a 15 dígitos (inclusive)
export const validatePhone = (phone: string): boolean => {
  if (!phone || !phone?.length) return true;
  const justNumbers = phone.replace(/\D/g, "");
  return justNumbers.length >= 4 && justNumbers.length <= 15;
};

// Valida que el número de colegiado sea de 4 a 6 dígitos
export const validateColegiado = (num: string): boolean => {
  const colegiadoRegex = /^\d{4,9}$/;
  return colegiadoRegex.test(num.trim());
};

// Valida si un campo está vacío
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0 && value.trim() !== "+34";
};
