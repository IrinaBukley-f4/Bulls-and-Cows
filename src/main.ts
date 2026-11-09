import { generateSecret } from './core/generateSecret.js';
import { evaluateGuess } from './core/evaluateGuess.js';
import { isValidGuess } from './core/isValidGuess.js';
import { createDigitValidator } from './core/createDigitValidator.js';
import {
  createInitialState,
  startGame,
  addAttempt,
  finishGame,
  GameState,
} from './state/gameState.js';
import { loadRecords, saveRecords, addRecord, RecordItem } from './state/records.js';
import { Base } from './core/types.js';

// ==========================================
// 1. Состояние приложения
// ==========================================
let state: GameState = createInitialState(4, 10);
let records: RecordItem[] = loadRecords();
let startTime: number | null = null;
let timerInterval: number | null = null;

// Корневой контейнер (создаётся один раз)
const root = document.createElement('div');
root.className = 'app-container';
document.body.appendChild(root);

// ==========================================
// 2. Вспомогательные функции (UI)
// ==========================================
const createElement = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string = '',
  text: string = '',
): HTMLElementTagNameMap[K] => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
};

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
};

// ==========================================
// 3. Отрисовка экранов
// ==========================================

// 3.1 Экран настроек
const renderSetup = (): void => {
  root.innerHTML = ''; // Очистка (вместо innerHTML для контента используем createElement ниже)

  const title = createElement('h1', 'title', 'Bulls and Cows');
  const form = createElement('div', 'setup-form');

  // Выбор системы счисления
  const baseLabel = createElement('label', 'label', 'Система счисления: ');
  const baseSelect = createElement('select', 'select');
  const bases: { value: Base; label: string }[] = [
    { value: 2, label: 'Bin (2)' },
    { value: 8, label: 'Oct (8)' },
    { value: 10, label: 'Dec (10)' },
    { value: 16, label: 'Hex (16)' },
  ];
  bases.forEach(({ value, label }) => {
    const option = createElement('option', '', label);
    option.value = value.toString();
    option.selected = value === state.base;
    baseSelect.appendChild(option);
  });

  // Выбор длины
  const lengthLabel = createElement('label', 'label', 'Длина числа: ');
  const lengthSelect = createElement('select', 'select');
  for (let i = 2; i <= 6; i++) {
    const option = createElement('option', '', i.toString());
    option.value = i.toString();
    option.selected = i === state.length;
    lengthSelect.appendChild(option);
  }

  // Функция обновления доступных длин в зависимости от base
  const updateLengthOptions = (base: Base) => {
    Array.from(lengthSelect.options).forEach((opt) => {
      const len = parseInt(opt.value, 10);
      opt.disabled = len > base;
    });
    // Если текущая выбранная длина стала недоступной, сбрасываем на минимальную
    if (parseInt(lengthSelect.value, 10) > base) {
      lengthSelect.value = '2';
    }
  };

  baseSelect.addEventListener('change', () => {
    const newBase = parseInt(baseSelect.value, 10) as Base;
    updateLengthOptions(newBase);
    // Обновляем состояние, чтобы при старте взялись новые настройки
    state = { ...state, base: newBase, length: parseInt(lengthSelect.value, 10) };
  });

  lengthSelect.addEventListener('change', () => {
    state = { ...state, length: parseInt(lengthSelect.value, 10) };
  });

  // Инициализация доступных длин
  updateLengthOptions(state.base);

  // Кнопка старта
  const startBtn = createElement('button', 'btn primary', 'Начать игру');
  startBtn.addEventListener('click', () => {
    const length = parseInt(lengthSelect.value, 10);
    const base = parseInt(baseSelect.value, 10) as Base;
    const secret = generateSecret(length, base);

    state = startGame(length, base, secret, Date.now());
    startTime = Date.now();

    // Запуск таймера
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = window.setInterval(() => {
      const timerEl = document.getElementById('timer');
      if (timerEl && startTime) {
        timerEl.textContent = formatTime(Date.now() - startTime);
      }
    }, 1000);

    renderGame();
  });

  form.append(
    baseLabel,
    baseSelect,
    createElement('br'),
    lengthLabel,
    lengthSelect,
    createElement('br'),
    startBtn,
  );
  root.append(title, form);
};

// 3.2 Экран игры
const renderGame = (): void => {
  root.innerHTML = ''; // Очистка

  const title = createElement(
    'h1',
    'title',
    `Bulls and Cows (${state.base}-base, length ${state.length})`,
  );

  const info = createElement('div', 'info');
  const timerEl = createElement('span', 'timer', '00:00');
  timerEl.id = 'timer';
  const attemptsEl = createElement('span', 'attempts', `Attempts: ${state.attempts}`);
  info.append(timerEl, attemptsEl);

  // История
  const historyContainer = createElement('div', 'history');
  if (state.history.length === 0) {
    historyContainer.textContent = 'Нет попыток';
  } else {
    const list = createElement('ul', 'history-list');
    state.history.forEach((attempt) => {
      const li = createElement(
        'li',
        'history-item',
        `${attempt.guess} — 🐂 ${attempt.bulls} | 🐄 ${attempt.cows}`,
      );
      list.appendChild(li);
    });
    historyContainer.appendChild(list);
  }

  // Поле ввода (только если игра не окончена)
  let inputContainer: HTMLElement | null = null;
  if (state.status === 'playing') {
    inputContainer = createElement('div', 'input-container');

    const input = createElement('input', 'guess-input');
    input.type = 'text';
    input.placeholder = `Введите ${state.length} цифр...`;
    input.maxLength = state.length;

    const isDigit = createDigitValidator(state.base);

    // Фильтрация ввода в реальном времени
    input.addEventListener('input', () => {
      const filtered = [...input.value].filter(isDigit).join('');
      input.value = filtered;
    });

    // Обработка Enter
    const submitGuess = () => {
      const guess = input.value.toLowerCase();

      // Проверка длины и валидности
      if (guess.length !== state.length) {
        alert(`Нужно ввести ${state.length} цифр`);
        return;
      }
      if (!isValidGuess(guess, state.length, state.base)) {
        alert('Некорректная попытка: проверьте уникальность и допустимые символы.');
        return;
      }
      // Проверка на дубликат
      if (state.history.some((a) => a.guess === guess)) {
        alert('Вы уже вводили эту попытку!');
        return;
      }

      // Оценка
      const evaluation = evaluateGuess(state.secret, guess);
      const newAttempt = { guess, ...evaluation, timestamp: Date.now() };

      state = addAttempt(state, newAttempt);

      if (evaluation.bulls === state.length) {
        // Победа
        state = finishGame(state);
        if (timerInterval) clearInterval(timerInterval);

        const timeMs = startTime ? Date.now() - startTime : 0;
        const newRecord: RecordItem = {
          length: state.length,
          base: state.base,
          attempts: state.attempts,
          timeMs,
          date: new Date().toISOString(),
        };
        records = addRecord(records, newRecord);
        saveRecords(records);

        renderWin(timeMs);
      } else {
        renderGame(); // Перерисовка с новой историей
        // Фокусировка на поле ввода после перерисовки
        const newInput = document.querySelector('.guess-input') as HTMLInputElement;
        if (newInput) newInput.focus();
      }
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitGuess();
    });

    const submitBtn = createElement('button', 'btn', 'Проверить');
    submitBtn.addEventListener('click', submitGuess);

    inputContainer.append(input, submitBtn);
  }

  // Кнопка "Новая игра"
  const newGameBtn = createElement('button', 'btn secondary', 'Новая игра');
  newGameBtn.addEventListener('click', () => {
    if (timerInterval) clearInterval(timerInterval);
    state = createInitialState(state.length, state.base);
    renderSetup();
  });

  root.append(title, info, historyContainer);
  if (inputContainer) root.appendChild(inputContainer);
  root.appendChild(newGameBtn);
};

// 3.3 Экран победы
const renderWin = (timeMs: number): void => {
  root.innerHTML = '';

  const title = createElement('h1', 'title win-title', '🎉 Победа!');
  const stats = createElement(
    'p',
    'win-stats',
    `Вы угадали за ${state.attempts} попыток и ${formatTime(timeMs)}.`,
  );

  // Таблица рекордов
  const recordsTitle = createElement('h2', '', 'Таблица рекордов (Top 10)');
  const table = createElement('table', 'records-table');
  const thead = createElement('thead');
  const headerRow = createElement('tr');
  ['Место', 'Попытки', 'Время', 'Настройки', 'Дата'].forEach((text) => {
    headerRow.appendChild(createElement('th', '', text));
  });
  thead.appendChild(headerRow);

  const tbody = createElement('tbody');
  records.forEach((r, idx) => {
    const tr = createElement('tr');
    tr.appendChild(createElement('td', '', (idx + 1).toString()));
    tr.appendChild(createElement('td', '', r.attempts.toString()));
    tr.appendChild(createElement('td', '', formatTime(r.timeMs)));
    tr.appendChild(createElement('td', '', `${r.base}-base, len ${r.length}`));
    tr.appendChild(createElement('td', '', new Date(r.date).toLocaleDateString()));
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);

  const newGameBtn = createElement('button', 'btn primary', 'Новая игра');
  newGameBtn.addEventListener('click', () => {
    state = createInitialState(state.length, state.base);
    renderSetup();
  });

  root.append(title, stats, recordsTitle, table, newGameBtn);
};

// ==========================================
// 4. Старт приложения
// ==========================================
renderSetup();
