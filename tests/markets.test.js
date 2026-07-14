import { describe, it, expect } from 'vitest';
import { getMarket, formatPrice, listMarkets, DEFAULT_MARKET_ID } from '../src/markets.js';

describe('markets', () => {
  it('lists bund and eurostoxx', () => {
    const ids = listMarkets().map((m) => m.id);
    expect(ids).toEqual(['bund', 'eurostoxx']);
  });

  it('bund tick size is 0.01', () => {
    expect(getMarket('bund').tickSize).toBe(0.01);
  });

  it('eurostoxx tick size is 1', () => {
    expect(getMarket('eurostoxx').tickSize).toBe(1);
  });

  it('formatPrice uses decimals for bund', () => {
    expect(formatPrice(125.5, 'bund')).toBe('125.50');
  });

  it('formatPrice uses integers for eurostoxx', () => {
    expect(formatPrice(5012, 'eurostoxx')).toBe('5012');
  });

  it('throws for unknown market', () => {
    expect(() => getMarket('unknown')).toThrow(/Unknown market/);
  });

  it('default market is bund', () => {
    expect(DEFAULT_MARKET_ID).toBe('bund');
  });
});

describe('parseOpenPrice', () => {
  it('bund accepts decimal open', () => {
    expect(getMarket('bund').parseOpenPrice('125.50')).toEqual({ ok: true, value: 125.5 });
  });

  it('bund rejects integer-only open', () => {
    expect(getMarket('bund').parseOpenPrice('12550').ok).toBe(false);
  });

  it('eurostoxx accepts integer open', () => {
    expect(getMarket('eurostoxx').parseOpenPrice('5012')).toEqual({ ok: true, value: 5012 });
  });

  it('eurostoxx rejects decimal open', () => {
    expect(getMarket('eurostoxx').parseOpenPrice('5012.5').ok).toBe(false);
  });
});
