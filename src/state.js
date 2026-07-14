import { START_PRICE, TICK_SIZE, VISIBLE_ROWS } from './config.js';
import { generatePeriods } from './profile/periods.js';

export function priceAtTickIndex(tickIndex, startPrice = START_PRICE) {
  return Number((startPrice + tickIndex * TICK_SIZE).toFixed(2));
}

export function tickIndexFromPrice(price, startPrice = START_PRICE) {
  return Math.round((price - startPrice) / TICK_SIZE);
}

export function getCell(grid, tickIndex, periodIndex) {
  return grid[`${tickIndex},${periodIndex}`] ?? null;
}

export function setCell(grid, tickIndex, periodIndex, letter) {
  if (letter) {
    grid[`${tickIndex},${periodIndex}`] = letter;
  } else {
    delete grid[`${tickIndex},${periodIndex}`];
  }
}

export function hasPrints(state) {
  return Object.keys(state.grid).length > 0;
}

export function isOpenPrint(tickIndex, periodIndex, letter) {
  return tickIndex === 0 && periodIndex === 0 && letter === 'A';
}

export function recomputeLastPrint(state) {
  let best = null;

  for (const key of Object.keys(state.grid)) {
    const [tick, period] = key.split(',').map(Number);
    if (
      !best
      || period > best.periodIndex
      || (period === best.periodIndex && tick > best.tickIndex)
    ) {
      best = { periodIndex: period, tickIndex: tick };
    }
  }

  state.lastPrint = best;
}

export function clearPeriodColumn(state, periodIndex) {
  for (const key of Object.keys(state.grid)) {
    const [, period] = key.split(',').map(Number);
    if (period === periodIndex) {
      delete state.grid[key];
    }
  }

  recomputeLastPrint(state);
}

export function restoreCursorAfterPeriodClear(state) {
  if (state.periodEntryCursor) {
    state.cursor = { ...state.periodEntryCursor };
  }
}

export function snapshotPeriodEntry(state) {
  state.periodEntryCursor = { ...state.cursor };
}

export function parseStartPrice(raw) {
  const trimmed = String(raw).trim();
  if (!/^\d+\.\d+$/.test(trimmed)) {
    return { ok: false, error: 'Enter a price with a decimal point (e.g. 125.50)' };
  }

  const value = Number(Number(trimmed).toFixed(2));
  if (!Number.isFinite(value) || value <= 0) {
    return { ok: false, error: 'Enter a valid price' };
  }

  return { ok: true, value };
}

export function applyStartPrice(state, raw) {
  const parsed = parseStartPrice(raw);
  if (!parsed.ok) return parsed;

  state.startPrice = parsed.value;
  state.grid = {};
  state.cursor = { periodIndex: 0, tickIndex: 0 };
  state.visibleTickStart = -Math.floor(VISIBLE_ROWS / 2);
  state.fullProfileRevealed = false;
  state.periodEntryCursor = null;
  setCell(state.grid, 0, 0, 'A');
  state.lastPrint = { periodIndex: 0, tickIndex: 0 };

  return { ok: true };
}

export function createInitialState() {
  return {
    grid: {},
    cursor: { periodIndex: 0, tickIndex: 0 },
    lastPrint: null,
    startPrice: START_PRICE,
    fullProfileRevealed: false,
    visibleTickStart: -Math.floor(VISIBLE_ROWS / 2),
    periodEntryCursor: null,
    periods: generatePeriods(),
  };
}

export function resetState(state) {
  const savedStart = state.startPrice;
  const fresh = createInitialState();
  fresh.startPrice = savedStart;
  Object.assign(state, fresh);
  return state;
}