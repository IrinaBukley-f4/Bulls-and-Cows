import { describe, it, expect } from 'vitest';

import { createDigitValidator } from '../src/core/createDigitValidator';

describe('createDigitValidator', () => {
  it('should accept valid decimal digits', () => {
    const isDecDigit = createDigitValidator(10);
    expect(isDecDigit('0')).toBe(true);
    expect(isDecDigit('9')).toBe(true);
    expect(isDecDigit('a')).toBe(false);
  });

  it('should accept valid hex digits in both cases', () => {
    const isHexDigit = createDigitValidator(16);
    expect(isHexDigit('0')).toBe(true);
    expect(isHexDigit('f')).toBe(true);
    expect(isHexDigit('F')).toBe(true);
    expect(isHexDigit('A')).toBe(true);
    expect(isHexDigit('g')).toBe(false);
  });

  it('should accept only 0 and 1 for binary', () => {
    const isBinDigit = createDigitValidator(2);
    expect(isBinDigit('0')).toBe(true);
    expect(isBinDigit('1')).toBe(true);
    expect(isBinDigit('2')).toBe(false);
  });
});
