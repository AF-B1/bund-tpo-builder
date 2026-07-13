import { START_PRICE, TICK_SIZE, VISIBLE_ROWS } from './config.js';
import { generatePeriods } from './profile/periods.js';

export function priceAtTickIndex(tickIndex) {
  return Number((START_PRICE + tickIndex * TICK_SIZE).toFixed(2));
}

export function tickIndexFromPrice(price) {
  return Math.round((price - START_PRICE) / TICK_SIZE);
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

export function createInitialState() {
  const state = {
    grid: {},
    cursor: { periodIndex: 0, tickIndex: 0 },
    lastPrint: { periodIndex: 0, tickIndex: 0 },
    fullProfileRevealed: false,
    visibleTickStart: -Math.floor(VISIBLE_ROWS / 2),
    periods: generatePeriods(),
  };

  setCell(state.grid, 0, 0, 'A');
  return state;
}

export function resetState(state) {
  const fresh = createInitialState();
  Object.assign(state, fresh);
  return state;
}