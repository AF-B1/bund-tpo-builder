import { describe, it, expect } from 'vitest';
import { VISIBLE_ROWS } from '../src/config.js';
import {
  createInitialState,
  parseStartPrice,
  applyStartPrice,
  priceAtTickIndex,
  hasPrints,
  getCell,
  computeInitialVisibleTickStart,
  tickIndexToVisibleRow,
  switchMarket,
} from '../src/state.js';

describe('start price', () => {
  it('starts with empty grid and default bund open price', () => {
    const state = createInitialState();
    expect(hasPrints(state)).toBe(false);
    expect(state.marketId).toBe('bund');
    expect(state.startPrice).toBe(125.5);
    expect(priceAtTickIndex(0, state.startPrice, 'bund')).toBe(125.5);
    expect(priceAtTickIndex(1, state.startPrice, 'bund')).toBe(125.51);
  });

  it('bund requires a decimal point', () => {
    expect(parseStartPrice('12550', 'bund').ok).toBe(false);
    expect(parseStartPrice('125.50', 'bund').ok).toBe(true);
  });

  it('eurostoxx requires an integer', () => {
    expect(parseStartPrice('5012.5', 'eurostoxx').ok).toBe(false);
    expect(parseStartPrice('5012', 'eurostoxx').ok).toBe(true);
  });

  it('applyStartPrice seeds A at custom open', () => {
    const state = createInitialState();
    const result = applyStartPrice(state, '126.25');

    expect(result.ok).toBe(true);
    expect(state.startPrice).toBe(126.25);
    expect(getCell(state.grid, 0, 0)).toBe('A');
    expect(priceAtTickIndex(0, state.startPrice, 'bund')).toBe(126.25);
    expect(hasPrints(state)).toBe(true);
  });

  it('eurostoxx price ladder moves one index point per tick', () => {
    const state = createInitialState();
    state.marketId = 'eurostoxx';
    applyStartPrice(state, '5012');
    expect(priceAtTickIndex(1, state.startPrice, 'eurostoxx')).toBe(5013);
    expect(priceAtTickIndex(2, state.startPrice, 'eurostoxx')).toBe(5014);
  });
});

describe('grid window', () => {
  it('uses 60 visible rows', () => {
    expect(VISIBLE_ROWS).toBe(60);
  });

  it('places open tick at vertical center of window', () => {
    const visibleTickStart = computeInitialVisibleTickStart(0);
    const openRow = tickIndexToVisibleRow(0, visibleTickStart);
    const targetRow = Math.floor((VISIBLE_ROWS - 1) / 2);
    expect(openRow).toBe(targetRow);
    expect(openRow).toBe(29);
  });

  it('applyStartPrice centers open in visible window', () => {
    const state = createInitialState();
    applyStartPrice(state, '125.50');
    const openRow = tickIndexToVisibleRow(0, state.visibleTickStart);
    expect(openRow).toBe(Math.floor((VISIBLE_ROWS - 1) / 2));
  });
});

describe('switchMarket', () => {
  it('clears prints and updates market', () => {
    const state = createInitialState();
    applyStartPrice(state, '125.50');
    expect(hasPrints(state)).toBe(true);

    const result = switchMarket(state, 'eurostoxx');
    expect(result.changed).toBe(true);
    expect(state.marketId).toBe('eurostoxx');
    expect(hasPrints(state)).toBe(false);
    expect(state.startPrice).toBe(5012);
    expect(state.fullProfileRevealed).toBe(false);
  });

  it('no-op when market unchanged', () => {
    const state = createInitialState();
    const result = switchMarket(state, 'bund');
    expect(result.changed).toBe(false);
  });
});
