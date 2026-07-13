import { VALUE_AREA_PCT, INITIAL_PERIOD_COUNT } from '../config.js';
import { getCell } from '../state.js';
import { priceAtTickIndex } from '../state.js';

export function getActiveTickIndices(grid) {
  const ticks = new Set();
  for (const key of Object.keys(grid)) {
    const [tick] = key.split(',').map(Number);
    ticks.add(tick);
  }
  return [...ticks].sort((a, b) => a - b);
}

export function mergeProfile(grid, periodCount = INITIAL_PERIOD_COUNT) {
  const ticks = getActiveTickIndices(grid);
  const merged = {};

  for (const tick of ticks) {
    let letters = '';
    for (let p = 0; p < periodCount; p++) {
      const letter = getCell(grid, tick, p);
      if (letter) letters += letter;
    }
    if (letters) merged[tick] = letters;
  }

  return merged;
}

export function countTposPerRow(grid, periodCount = INITIAL_PERIOD_COUNT) {
  const merged = mergeProfile(grid, periodCount);
  const counts = {};
  for (const [tick, letters] of Object.entries(merged)) {
    counts[Number(tick)] = letters.length;
  }
  return counts;
}

export function computePOC(counts) {
  const entries = Object.entries(counts).map(([tick, count]) => [Number(tick), count]);
  if (!entries.length) return null;

  entries.sort((a, b) => (b[1] - a[1]) || (a[0] - b[0]));
  return entries[0][0];
}

export function computeValueArea(counts, pocIndex, pct = VALUE_AREA_PCT) {
  if (pocIndex == null) return [];

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  if (total === 0) return [];

  const target = Math.ceil(total * pct);
  const included = new Set([pocIndex]);
  let accumulated = counts[pocIndex] ?? 0;

  let up = pocIndex - 1;
  let down = pocIndex + 1;

  while (accumulated < target && (up in counts || down in counts)) {
    const upCount = up in counts ? counts[up] : -1;
    const downCount = down in counts ? counts[down] : -1;

    if (upCount >= downCount && upCount >= 0) {
      included.add(up);
      accumulated += upCount;
      up--;
    } else if (downCount >= 0) {
      included.add(down);
      accumulated += downCount;
      down++;
    } else {
      break;
    }
  }

  return [...included].sort((a, b) => a - b);
}

export function computeIBR(grid) {
  let min = null;
  let max = null;

  for (const key of Object.keys(grid)) {
    const [tick, period] = key.split(',').map(Number);
    if (period !== 0 && period !== 1) continue;
    if (min === null || tick < min) min = tick;
    if (max === null || tick > max) max = tick;
  }

  if (min === null) return null;
  return { min, max };
}

export function computeClose(lastPrint, startPrice) {
  if (!lastPrint) return null;
  return priceAtTickIndex(lastPrint.tickIndex, startPrice);
}

export function computeAnalytics(state) {
  const counts = countTposPerRow(state.grid, state.periods.length);
  const pocIndex = computePOC(counts);
  const valueArea = computeValueArea(counts, pocIndex);
  const ibr = computeIBR(state.grid);
  const merged = mergeProfile(state.grid, state.periods.length);
  const closePrice = computeClose(state.lastPrint, state.startPrice);

  return { counts, pocIndex, valueArea, ibr, merged, closePrice, closeTick: state.lastPrint?.tickIndex ?? null };
}