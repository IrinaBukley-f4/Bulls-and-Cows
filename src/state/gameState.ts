import { Base } from '../core/types.js';

export interface Attempt {
  guess: string;
  bulls: number;
  cows: number;
  timestamp: number;
}

export interface GameState {
  status: 'setup' | 'playing' | 'won';
  length: number;
  base: Base;
  secret: string;
  history: readonly Attempt[];
  startedAt: number | null;
  attempts: number;
}

export const createInitialState = (length: number = 4, base: Base = 10): GameState => ({
  status: 'setup',
  length,
  base,
  secret: '',
  history: [],
  startedAt: null,
  attempts: 0,
});

export const startGame = (length: number, base: Base, secret: string, now: number): GameState => ({
  status: 'playing',
  length,
  base,
  secret,
  history: [],
  startedAt: now,
  attempts: 0,
});

export const addAttempt = (s: GameState, a: Attempt): GameState => ({
  ...s,
  history: [...s.history, a],
  attempts: s.attempts + 1,
});

export const finishGame = (s: GameState): GameState => ({
  ...s,
  status: 'won',
});
