import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isWelcomeSeen,
  markWelcomeSeen,
  computeModalMode,
  setOpenPriceTrigger,
  getOpenPriceTrigger,
} from '../src/onboarding.js';

describe('onboarding helpers', () => {
  const store = {};

  beforeEach(() => {
    Object.keys(store).forEach((key) => delete store[key]);
    setOpenPriceTrigger('load');
    vi.stubGlobal('localStorage', {
      getItem: (key) => store[key] ?? null,
      setItem: (key, value) => {
        store[key] = value;
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('isWelcomeSeen is false when key absent', () => {
    expect(isWelcomeSeen()).toBe(false);
  });

  it('markWelcomeSeen persists seen flag', () => {
    markWelcomeSeen();
    expect(isWelcomeSeen()).toBe(true);
  });

  it('computeModalMode returns welcome on first load', () => {
    expect(computeModalMode(false)).toBe('welcome');
  });

  it('computeModalMode returns open after welcome seen on load', () => {
    markWelcomeSeen();
    expect(computeModalMode(false)).toBe('open');
  });

  it('computeModalMode returns reset after R trigger', () => {
    markWelcomeSeen();
    setOpenPriceTrigger('reset');
    expect(computeModalMode(false)).toBe('reset');
  });

  it('computeModalMode returns null when prints exist', () => {
    expect(computeModalMode(true)).toBe(null);
  });

  it('setOpenPriceTrigger updates trigger', () => {
    setOpenPriceTrigger('reset');
    expect(getOpenPriceTrigger()).toBe('reset');
  });
});