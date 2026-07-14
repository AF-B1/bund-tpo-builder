import { describe, it, expect } from 'vitest';
import { mergedLetterParts } from '../src/render/full-profile.js';

describe('mergedLetterParts', () => {
  it('marks only the first character at tick 0 when open print exists', () => {
    const parts = mergedLetterParts(0, 'ABC', true);
    expect(parts).toEqual([
      { ch: 'A', open: true },
      { ch: 'B', open: false },
      { ch: 'C', open: false },
    ]);
  });

  it('does not mark open styling when open A was cleared', () => {
    const parts = mergedLetterParts(0, 'BC', false);
    expect(parts).toEqual([{ ch: 'BC', open: false }]);
  });

  it('leaves non-open ticks unchanged', () => {
    const parts = mergedLetterParts(3, 'C', true);
    expect(parts).toEqual([{ ch: 'C', open: false }]);
  });
});