import { describe, it, expect } from 'vitest';
import { splitCellClasses, splitCornerLabel } from '../src/render/split-view.js';

describe('splitCornerLabel', () => {
  it('returns FESX for eurostoxx', () => {
    expect(splitCornerLabel('eurostoxx')).toBe('FESX');
  });

  it('returns BUND for bund', () => {
    expect(splitCornerLabel('bund')).toBe('BUND');
  });
});

describe('splitCellClasses', () => {
  it('marks the open A cell with open-print', () => {
    const classes = splitCellClasses(0, 0, 'A');
    expect(classes).toContain('open-print');
    expect(classes).not.toContain('early-letter');
  });

  it('uses early-letter for non-open A cells', () => {
    const classes = splitCellClasses(1, 0, 'A');
    expect(classes).toContain('early-letter');
    expect(classes).not.toContain('open-print');
  });
});