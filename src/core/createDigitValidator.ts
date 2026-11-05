const DIGITS = '0123456789abcdef';

export const createDigitValidator = (base: number) => {
  const allowed = new Set(DIGITS.slice(0, base));
  return (ch: string): boolean => ch.length === 1 && allowed.has(ch.toLowerCase());
};
