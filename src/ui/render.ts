import { Attempt } from '../state/gameState';

export const renderHistory = (history: readonly Attempt[]): HTMLElement => {
  const ul = document.createElement('ul');
  ul.className = 'history-list';

  history.forEach((attempt) => {
    const li = document.createElement('li');
    li.textContent = `${attempt.guess} — 🐂 ${attempt.bulls} | 🐄 ${attempt.cows}`;
    ul.appendChild(li);
  });

  return ul;
};
