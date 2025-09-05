// Data Models and Types

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro'
};

export const ALERT_TYPES = {
  PRICE_ABOVE: 'price_above',
  PRICE_BELOW: 'price_below',
  VOLUME_SPIKE: 'volume_spike',
  PERCENTAGE_CHANGE: 'percentage_change'
};

export const ALERT_STATUS = {
  ACTIVE: 'active',
  TRIGGERED: 'triggered',
  DISABLED: 'disabled'
};

// Default user structure
export const createUser = (email = '', subscriptionTier = SUBSCRIPTION_TIERS.FREE) => ({
  userId: Date.now().toString(),
  email,
  subscriptionTier,
  createdAt: Date.now()
});

// Default cryptocurrency structure
export const createCryptocurrency = (data) => ({
  coinId: data.id,
  symbol: data.symbol?.toUpperCase(),
  name: data.name,
  currentPrice: data.current_price,
  volume24h: data.total_volume,
  marketCap: data.market_cap,
  priceChange24h: data.price_change_percentage_24h,
  image: data.image
});

// Default watchlist structure
export const createWatchlist = (userId, name = 'My Watchlist') => ({
  watchlistId: Date.now().toString(),
  userId,
  name,
  createdAt: Date.now()
});

// Default watchlist item structure
export const createWatchlistItem = (watchlistId, coinId, alertThresholds = {}) => ({
  watchlistItemId: Date.now().toString() + Math.random(),
  watchlistId,
  coinId,
  alertThresholds,
  notificationEnabled: true,
  createdAt: Date.now()
});

// Default alert structure
export const createAlert = (userId, coinId, alertType, triggerValue) => ({
  alertId: Date.now().toString() + Math.random(),
  userId,
  coinId,
  alertType,
  triggerValue,
  timestamp: Date.now(),
  status: ALERT_STATUS.ACTIVE
});