import { describe, it, expect, beforeEach } from 'vitest';

import { countPossibleSecrets, clearMemoCache } from '../src/core/countPossibleSecrets';

describe('countPossibleSecrets', () => {
  beforeEach(() => {
    clearMemoCache();
  });

  it('should return 0 if length > base', () => {
    expect(countPossibleSecrets(3, 2)).toBe(0);
  });

  it('should return 1 for length 0 (empty permutation)', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it('should calculate permutations without repetition correctly', () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    expect(countPossibleSecrets(1, 16)).toBe(16);
  });

  it('should use memoization for repeat calls', () => {
    const first = countPossibleSecrets(4, 10);
    const second = countPossibleSecrets(4, 10);
    expect(first).toBe(second);
  });
});
