import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  applyStartPrice,
  setCell,
  clearPeriodColumn,
  recomputeLastPrint,
  isOpenPrint,
  getCell,
  hasPrints,
  snapshotPeriodEntry,
  restoreCursorAfterPeriodClear,
} from '../src/state.js';

describe('isOpenPrint', () => {
  it('identifies only the session open A at tick 0 period 0', () => {
    expect(isOpenPrint(0, 0, 'A')).toBe(true);
    expect(isOpenPrint(1, 0, 'A')).toBe(false);
    expect(isOpenPrint(0, 1, 'B')).toBe(false);
    expect(isOpenPrint(0, 0, 'B')).toBe(false);
  });
});

describe('clearPeriodColumn', () => {
  it('removes only prints in the target period', () => {
    const state = createInitialState();
    applyStartPrice(state, '125.50');
    setCell(state.grid, 1, 0, 'A');
    setCell(state.grid, 2, 0, 'A');
    setCell(state.grid, 2, 1, 'B');
    setCell(state.grid, 1, 2, 'C');
    setCell(state.grid, 3, 2, 'C');

    clearPeriodColumn(state, 2);

    expect(getCell(state.grid, 1, 2)).toBeNull();
    expect(getCell(state.grid, 3, 2)).toBeNull();
    expect(getCell(state.grid, 0, 0)).toBe('A');
    expect(getCell(state.grid, 2, 1)).toBe('B');
    expect(hasPrints(state)).toBe(true);
  });

  it('empties the grid when the last period is cleared', () => {
    const state = createInitialState();
    applyStartPrice(state, '125.50');

    clearPeriodColumn(state, 0);

    expect(hasPrints(state)).toBe(false);
    expect(state.lastPrint).toBeNull();
  });
});

describe('cursor restore after clear period', () => {
  it('returns cursor to the position before advancing into the cleared period', () => {
    const state = createInitialState();
    applyStartPrice(state, '125.50');
    setCell(state.grid, -18, 0, 'A');
    state.cursor = { periodIndex: 0, tickIndex: -18 };
    snapshotPeriodEntry(state);
    state.cursor = { periodIndex: 1, tickIndex: -18 };
    setCell(state.grid, -18, 1, 'B');
    setCell(state.grid, -17, 1, 'B');
    snapshotPeriodEntry(state);
    state.cursor = { periodIndex: 2, tickIndex: -17 };
    setCell(state.grid, -17, 2, 'C');
    setCell(state.grid, -16, 2, 'C');

    clearPeriodColumn(state, 2);
    restoreCursorAfterPeriodClear(state);

    expect(state.cursor).toEqual({ periodIndex: 1, tickIndex: -18 });
    expect(getCell(state.grid, -18, 1)).toBe('B');
    expect(getCell(state.grid, -17, 2)).toBeNull();
  });
});

describe('recomputeLastPrint', () => {
  it('picks the highest period then highest tick', () => {
    const state = createInitialState();
    applyStartPrice(state, '125.50');
    setCell(state.grid, 2, 1, 'B');
    setCell(state.grid, 1, 2, 'C');
    setCell(state.grid, 4, 2, 'C');
    state.lastPrint = { periodIndex: 2, tickIndex: 1 };

    clearPeriodColumn(state, 2);

    expect(state.lastPrint).toEqual({ periodIndex: 1, tickIndex: 2 });
  });
});