export const getEtapaVida = (edad: string) => {
    const num = parseInt(edad);
    if (!edad || isNaN(num)) return "";
    if (num >= 1 && num <= 3) return "🐾 Cachorro";
    if (num >= 4 && num <= 8) return "🐕 Joven";
    if (num >= 9) return "🦮 Adulto";
    return "";
};