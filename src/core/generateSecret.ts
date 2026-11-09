export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random,
): string => {
  const digits = '0123456789abcdef'.slice(0, base).split('');

  const pick = (pool: string[], acc: string): string => {
    if (acc.length === length) return acc;
    const idx = Math.floor(random() * pool.length);
    const next = pool[idx];
    return pick(
      pool.filter((_, i) => i !== idx),
      acc + next,
    );
  };

  return pick(digits, '');
};
