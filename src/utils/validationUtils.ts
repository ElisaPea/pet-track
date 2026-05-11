// Valida formato de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

// Valida que el teléfono tenga el formato +34 más 9 números
export const validatePhone = (phone: string): boolean => {
  if (!phone || !phone?.length) return true;
  const justNumbers = phone.replace(/\D/g, "");
  return justNumbers.length > 3 && justNumbers.length < 15;
  // return justNumbers.length === 9; // 34 + 9 dígitos
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
