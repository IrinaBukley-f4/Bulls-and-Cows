import { describe, it, expect, vi } from 'vitest';

import { generateSecret } from '../src/core/generateSecret';

describe('generateSecret', () => {
  it('should generate a string of given length with unique digits', () => {
    const secret = generateSecret(4, 10);
    expect(secret).toHaveLength(4);
    expect(new Set(secret).size).toBe(4);
  });

  it('should only use digits within the base', () => {
    const secret = generateSecret(2, 2);
    expect(['0', '1']).toContain(secret[0]);
    expect(['0', '1']).toContain(secret[1]);
  });

  it('should be deterministic with a given random source', () => {
    const secret = generateSecret(3, 10, () => 0);
    expect(secret).toBe('012');
  });

  it('should allow leading zero', () => {
    const secret = generateSecret(2, 10, () => 0);
    expect(secret[0]).toBe('0');
  });

  it('should call random exactly length times', () => {
    const randomSpy = vi.fn(() => 0.5);
    generateSecret(4, 10, randomSpy);
    expect(randomSpy).toHaveBeenCalledTimes(4);
  });

  it('should not mutate the passed random function', () => {
    const original = () => 0;
    generateSecret(3, 10, original);

    expect(generateSecret(1, 10, original)).toBe('0');
  });
});
