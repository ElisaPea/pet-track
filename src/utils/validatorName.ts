// Validate that a name only contains letters (a-z, A-Z) and spaces
export const validateName = (name: string): boolean => {
    if (name.trim().length === 0) return false;
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
};