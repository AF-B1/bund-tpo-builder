import { VISIBLE_ROWS } from './config.js';
import { DEFAULT_MARKET_ID, getMarket } from './markets.js';
import { generatePeriods } from './profile/periods.js';

export function computeInitialVisibleTickStart(openTickIndex = 0) {
  const targetRow = Math.floor((VISIBLE_ROWS - 1) / 2);
  return openTickIndex - (VISIBLE_ROWS - 1 - targetRow);
}

export function tickIndexToVisibleRow(tickIndex, visibleTickStart) {
  return VISIBLE_ROWS - 1 - (tickIndex - visibleTickStart);
}

export function priceAtTickIndex(tickIndex, startPrice, marketId = DEFAULT_MARKET_ID) {
  const { tickSize, priceFormat } = getMarket(marketId);
  const raw = startPrice + tickIndex * tickSize;
  if (priceFormat === 'integer') {
    return Math.round(raw);
  }
  return Number(raw.toFixed(2));
}

export function tickIndexFromPrice(price, startPrice, marketId = DEFAULT_MARKET_ID) {
  const { tickSize } = getMarket(marketId);
  return Math.round((price - startPrice) / tickSize);
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

export function parseStartPrice(raw, marketId = DEFAULT_MARKET_ID) {
  return getMarket(marketId).parseOpenPrice(raw);
}

function clearSessionPrints(state) {
  state.grid = {};
  state.cursor = { periodIndex: 0, tickIndex: 0 };
  state.lastPrint = null;
  state.fullProfileRevealed = false;
  state.visibleTickStart = computeInitialVisibleTickStart(0);
  state.periodEntryCursor = null;
}

export function applyStartPrice(state, raw) {
  const parsed = parseStartPrice(raw, state.marketId);
  if (!parsed.ok) return parsed;

  state.startPrice = parsed.value;
  clearSessionPrints(state);
  setCell(state.grid, 0, 0, 'A');
  state.lastPrint = { periodIndex: 0, tickIndex: 0 };

  return { ok: true };
}

export function switchMarket(state, marketId) {
  if (state.marketId === marketId) {
    return { ok: true, changed: false };
  }

  const market = getMarket(marketId);
  state.marketId = marketId;
  state.startPrice = market.defaultStartPrice;
  clearSessionPrints(state);

  return { ok: true, changed: true };
}

export function createInitialState() {
  const market = getMarket(DEFAULT_MARKET_ID);
  return {
    marketId: DEFAULT_MARKET_ID,
    grid: {},
    cursor: { periodIndex: 0, tickIndex: 0 },
    lastPrint: null,
    startPrice: market.defaultStartPrice,
    fullProfileRevealed: false,
    visibleTickStart: computeInitialVisibleTickStart(0),
    periodEntryCursor: null,
    periods: generatePeriods(),
  };
}

export function resetState(state) {
  const savedStart = state.startPrice;
  const savedMarket = state.marketId;
  const fresh = createInitialState();
  fresh.marketId = savedMarket;
  fresh.startPrice = savedStart;
  Object.assign(state, fresh);
  return state;
}
