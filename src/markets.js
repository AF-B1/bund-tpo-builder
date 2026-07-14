export const DEFAULT_MARKET_ID = 'bund';

export const MARKET_IDS = ['bund', 'eurostoxx'];

const MARKETS = {
  bund: {
    id: 'bund',
    label: 'Bund',
    cornerLabel: 'BUND',
    tickSize: 0.01,
    defaultStartPrice: 125.5,
    priceFormat: 'decimal2',
    openHint: '125.50',
    parseOpenPrice(raw) {
      const trimmed = String(raw).trim();
      if (!/^\d+\.\d+$/.test(trimmed)) {
        return { ok: false, error: 'Enter a price with a decimal point (e.g. 125.50)' };
      }
      const value = Number(Number(trimmed).toFixed(2));
      if (!Number.isFinite(value) || value <= 0) {
        return { ok: false, error: 'Enter a valid price' };
      }
      return { ok: true, value };
    },
  },
  eurostoxx: {
    id: 'eurostoxx',
    label: 'EuroStoxx',
    cornerLabel: 'FESX',
    tickSize: 1,
    defaultStartPrice: 5012,
    priceFormat: 'integer',
    openHint: '5012',
    parseOpenPrice(raw) {
      const trimmed = String(raw).trim();
      if (!/^\d+$/.test(trimmed)) {
        return { ok: false, error: 'Enter a whole index point (e.g. 5012)' };
      }
      const value = Number(trimmed);
      if (!Number.isFinite(value) || value <= 0) {
        return { ok: false, error: 'Enter a valid price' };
      }
      return { ok: true, value };
    },
  },
};

export function getMarket(marketId) {
  const market = MARKETS[marketId];
  if (!market) {
    throw new Error(`Unknown market: ${marketId}`);
  }
  return market;
}

export function formatPrice(value, marketId = DEFAULT_MARKET_ID) {
  const market = getMarket(marketId);
  if (market.priceFormat === 'integer') {
    return String(Math.round(value));
  }
  return Number(value).toFixed(2);
}

export function formatPriceForInput(value, marketId = DEFAULT_MARKET_ID) {
  return formatPrice(value, marketId);
}

export function listMarkets() {
  return MARKET_IDS.map((id) => getMarket(id));
}
