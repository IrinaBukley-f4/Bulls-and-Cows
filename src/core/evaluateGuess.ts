type Evaluation = { bulls: number; cows: number };

export const evaluateGuess = (secret: string, guess: string): Evaluation => {
  const s = [...secret.toLowerCase()];
  const g = [...guess.toLowerCase()];

  const bulls = s.reduce((acc, char, i) => acc + (char === g[i] ? 1 : 0), 0);

  const secretCounts = s.reduce(
    (acc, char, i) => {
      if (char !== g[i]) {
        acc[char] = (acc[char] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const cows = g.reduce((acc, char, i) => {
    if (char === s[i]) return acc; // бык
    if (secretCounts[char] > 0) {
      secretCounts[char]--;
      return acc + 1;
    }
    return acc;
  }, 0);

  return { bulls, cows };
};
