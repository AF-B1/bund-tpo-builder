import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  parseStartPrice,
  applyStartPrice,
  priceAtTickIndex,
  hasPrints,
  getCell,
} from '../src/state.js';

describe('start price', () => {
  it('starts with empty grid and default open price', () => {
    const state = createInitialState();
    expect(hasPrints(state)).toBe(false);
    expect(state.startPrice).toBe(125.5);
    expect(priceAtTickIndex(0, state.startPrice)).toBe(125.5);
    expect(priceAtTickIndex(1, state.startPrice)).toBe(125.51);
  });

  it('requires a decimal point', () => {
    expect(parseStartPrice('12550').ok).toBe(false);
    expect(parseStartPrice('125.50').ok).toBe(true);
  });

  it('applyStartPrice seeds A at custom open', () => {
    const state = createInitialState();
    const result = applyStartPrice(state, '126.25');

    expect(result.ok).toBe(true);
    expect(state.startPrice).toBe(126.25);
    expect(getCell(state.grid, 0, 0)).toBe('A');
    expect(priceAtTickIndex(0, state.startPrice)).toBe(126.25);
    expect(hasPrints(state)).toBe(true);
  });
});