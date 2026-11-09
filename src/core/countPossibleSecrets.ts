const memo = new Map<string, number>();

export const countPossibleSecrets = (length: number, base: number): number => {
  if (length < 0 || length > base) return 0;
  if (length === 0) return 1;

  const key = `${length}:${base}`;
  if (memo.has(key)) return memo.get(key)!;

  const result = base * countPossibleSecrets(length - 1, base - 1);
  memo.set(key, result);
  return result;
};

export const clearMemoCache = (): void => {
  memo.clear();
};
