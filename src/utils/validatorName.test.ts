import { describe, it, expect } from 'vitest';
import { validateName } from './validatorName';

describe('validateName', () => {
  it('should accept a name with only lowercase letters', () => {
    expect(validateName('juan')).toBe(true);
  });

  it('should accept a name with only uppercase letters', () => {
    expect(validateName('MARIA')).toBe(true);
  });

  it('should accept a composed name with spaces', () => {
    expect(validateName('juan pablo')).toBe(true);
  });

  it('should reject a name containing numbers', () => {
    expect(validateName('juan123')).toBe(false);
  });

  it('should reject a name containing special characters', () => {
    expect(validateName('juan@!')).toBe(false);
  });

  it('should reject an empty string or spaces only', () => {
    expect(validateName('')).toBe(false);
    expect(validateName('   ')).toBe(false);
  });
});
