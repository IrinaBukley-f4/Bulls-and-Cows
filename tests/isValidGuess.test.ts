import { describe, it, expect } from 'vitest';

import { isValidGuess } from '../src/core/isValidGuess';

describe('isValidGuess', () => {
  it('should return true for valid guess', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
  });
  it('should return false for wrong length', () => {
    expect(isValidGuess('123', 4, 10)).toBe(false);
  });
  it('should return false for invalid characters', () => {
    expect(isValidGuess('12a4', 4, 10)).toBe(false);
  });
  it('should return false for duplicate digits', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
  });
  it('should handle hex case insensitively', () => {
    expect(isValidGuess('A1B2', 4, 16)).toBe(true);
  });
});
