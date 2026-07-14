const WELCOME_KEY = 'bund-tpo-builder.welcomeSeen';

let openPriceTrigger = 'load';

export function getOpenPriceTrigger() {
  return openPriceTrigger;
}

export function setOpenPriceTrigger(trigger) {
  openPriceTrigger = trigger;
}

export function isWelcomeSeen() {
  try {
    return localStorage.getItem(WELCOME_KEY) === '1';
  } catch {
    return false;
  }
}

export function markWelcomeSeen() {
  try {
    localStorage.setItem(WELCOME_KEY, '1');
  } catch {
    // private mode — ignore
  }
}

export function computeModalMode(hasPrints) {
  if (hasPrints) return null;
  if (openPriceTrigger === 'reset') return 'reset';
  if (openPriceTrigger === 'market-switch') return 'open';
  if (!isWelcomeSeen()) return 'welcome';
  return 'open';
}