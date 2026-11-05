export type Base = 2 | 8 | 10 | 16;
export type Secret = string;
export type Guess = string;
export interface Evaluation {
  bulls: number;
  cows: number;
}
