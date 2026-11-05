import { createDigitValidator } from './createDigitValidator';

export const isValidGuess = (guess: string, length: number, base: number): boolean => {
  if (guess.length !== length) return false;

  const isDigit = createDigitValidator(base);
  const chars = [...guess.toLowerCase()];

  if (!chars.every(isDigit)) return false;
  if (new Set(chars).size !== chars.length) return false;

  return true;
};
