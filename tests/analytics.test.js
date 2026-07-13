import { describe, it, expect } from 'vitest';
import {
  mergeProfile,
  countTposPerRow,
  computePOC,
  computeValueArea,
  computeIBR,
} from '../src/profile/analytics.js';
import { setCell } from '../src/state.js';

function gridFrom(specs) {
  const grid = {};
  for (const [tick, period, letter] of specs) {
    setCell(grid, tick, period, letter);
  }
  return grid;
}

describe('analytics', () => {
  it('merges letters in period order at same price', () => {
    const grid = gridFrom([[0, 0, 'A'], [0, 1, 'B']]);
    expect(mergeProfile(grid)[0]).toBe('AB');
  });

  it('computes POC with tie to lower tick', () => {
    const counts = { 0: 2, 1: 2, 2: 1 };
    expect(computePOC(counts)).toBe(0);
  });

  it('VA at 68.8% includes ceil(10 * 0.688) = 7 TPOs', () => {
    const counts = { 0: 1, 1: 3, 2: 3, 3: 2, 4: 1 };
    const va = computeValueArea(counts, 2, 0.688);
    const total = va.reduce((sum, tick) => sum + counts[tick], 0);
    expect(total).toBeGreaterThanOrEqual(7);
  });

  it('IBR spans only A and B periods', () => {
    const grid = gridFrom([
      [0, 0, 'A'],
      [2, 0, 'A'],
      [1, 1, 'B'],
      [5, 2, 'C'],
    ]);
    expect(computeIBR(grid)).toEqual({ min: 0, max: 2 });
  });

  it('empty grid returns null POC path safely', () => {
    expect(computePOC({})).toBeNull();
    expect(computeIBR({})).toBeNull();
  });
});