import { Base } from '../core/types';

export interface RecordItem {
  length: number;
  base: Base;
  attempts: number;
  timeMs: number;
  date: string;
}

const STORAGE_KEY = 'b-c-records';

export const loadRecords = (): RecordItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveRecords = (r: RecordItem[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
};

export const addRecord = (records: RecordItem[], rec: RecordItem, limit = 10): RecordItem[] => {
  return [...records, rec]
    .sort((a, b) => a.attempts - b.attempts || a.timeMs - b.timeMs)
    .slice(0, limit);
};
