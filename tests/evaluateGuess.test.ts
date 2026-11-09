import { describe, it, expect } from 'vitest';

import { evaluateGuess } from '../src/core/evaluateGuess';

describe('evaluateGuess', () => {
  it('should count exact matches (bulls) correctly', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('should return zeros for no matches', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('should count all digits present but misplaced (cows)', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('should handle mixed bulls and cows', () => {
    expect(evaluateGuess('1234', '1243')).toEqual({ bulls: 2, cows: 2 });
  });

  it('should handle leading zeros correctly', () => {
    expect(evaluateGuess('0123', '3210')).toEqual({ bulls: 0, cows: 4 });
    expect(evaluateGuess('0123', '0123')).toEqual({ bulls: 4, cows: 0 });
  });

  it('should be case-insensitive for hex', () => {
    expect(evaluateGuess('abcd', 'ABCD')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('ABCD', 'abcd')).toEqual({ bulls: 4, cows: 0 });
  });

  it('should not mutate input arguments', () => {
    const secret = '1234';
    const guess = '4321';
    evaluateGuess(secret, guess);
    expect(secret).toBe('1234');
    expect(guess).toBe('4321');
  });

  it('should assume guess is valid (no duplicates) per game rules', () => {
    expect(evaluateGuess('1234', '1123')).toEqual({ bulls: 1, cows: 2 });
  });
});
