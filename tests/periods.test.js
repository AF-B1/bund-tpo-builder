import { describe, it, expect } from 'vitest';
import { generatePeriods } from '../src/profile/periods.js';
import { createInitialState, priceAtTickIndex } from '../src/state.js';
import { getCell } from '../src/state.js';

describe('periods', () => {
  it('labels period A as 07:00–07:30', () => {
    const periods = generatePeriods();
    expect(periods[0].letter).toBe('A');
    expect(periods[0].timeRange).toBe('07:00–07:30');
  });

  it('labels period B as 07:30–08:00', () => {
    const periods = generatePeriods();
    expect(periods[1].letter).toBe('B');
    expect(periods[1].timeRange).toBe('07:30–08:00');
  });

  it('period S is the 19th period ending 16:30', () => {
    const periods = generatePeriods();
    expect(periods[18].letter).toBe('S');
    expect(periods[18].timeRange).toBe('16:00–16:30');
  });
});

describe('initial state', () => {
  it('starts with cursor at open tick and empty grid', () => {
    const state = createInitialState();
    expect(state.cursor.tickIndex).toBe(0);
    expect(state.cursor.periodIndex).toBe(0);
    expect(getCell(state.grid, 0, 0)).toBeNull();
    expect(state.startPrice).toBe(125.5);
    expect(priceAtTickIndex(0, state.startPrice)).toBe(125.5);
    expect(priceAtTickIndex(1, state.startPrice)).toBe(125.51);
  });
});