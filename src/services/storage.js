// Local storage service for user data persistence
class StorageService {
  constructor() {
    this.keys = {
      USER: 'crypto-alerts-user',
      WATCHLISTS: 'crypto-alerts-watchlists',
      WATCHLIST_ITEMS: 'crypto-alerts-watchlist-items',
      ALERTS: 'crypto-alerts-alerts',
      SETTINGS: 'crypto-alerts-settings'
    };
  }

  // Generic storage methods
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage retrieval error:', error);
      return defaultValue;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage removal error:', error);
      return false;
    }
  }

  // User management
  getUser() {
    return this.getItem(this.keys.USER);
  }

  setUser(user) {
    return this.setItem(this.keys.USER, user);
  }

  // Watchlists management
  getWatchlists() {
    return this.getItem(this.keys.WATCHLISTS, []);
  }

  setWatchlists(watchlists) {
    return this.setItem(this.keys.WATCHLISTS, watchlists);
  }

  addWatchlist(watchlist) {
    const watchlists = this.getWatchlists();
    watchlists.push(watchlist);
    return this.setWatchlists(watchlists);
  }

  updateWatchlist(watchlistId, updates) {
    const watchlists = this.getWatchlists();
    const index = watchlists.findIndex(w => w.watchlistId === watchlistId);
    if (index !== -1) {
      watchlists[index] = { ...watchlists[index], ...updates };
      return this.setWatchlists(watchlists);
    }
    return false;
  }

  removeWatchlist(watchlistId) {
    const watchlists = this.getWatchlists();
    const filtered = watchlists.filter(w => w.watchlistId !== watchlistId);
    return this.setWatchlists(filtered);
  }

  // Watchlist items management
  getWatchlistItems() {
    return this.getItem(this.keys.WATCHLIST_ITEMS, []);
  }

  setWatchlistItems(items) {
    return this.setItem(this.keys.WATCHLIST_ITEMS, items);
  }

  addWatchlistItem(item) {
    const items = this.getWatchlistItems();
    items.push(item);
    return this.setWatchlistItems(items);
  }

  updateWatchlistItem(itemId, updates) {
    const items = this.getWatchlistItems();
    const index = items.findIndex(i => i.watchlistItemId === itemId);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      return this.setWatchlistItems(items);
    }
    return false;
  }

  removeWatchlistItem(itemId) {
    const items = this.getWatchlistItems();
    const filtered = items.filter(i => i.watchlistItemId !== itemId);
    return this.setWatchlistItems(filtered);
  }

  getWatchlistItemsByWatchlistId(watchlistId) {
    const items = this.getWatchlistItems();
    return items.filter(i => i.watchlistId === watchlistId);
  }

  // Alerts management
  getAlerts() {
    return this.getItem(this.keys.ALERTS, []);
  }

  setAlerts(alerts) {
    return this.setItem(this.keys.ALERTS, alerts);
  }

  addAlert(alert) {
    const alerts = this.getAlerts();
    alerts.push(alert);
    return this.setAlerts(alerts);
  }

  updateAlert(alertId, updates) {
    const alerts = this.getAlerts();
    const index = alerts.findIndex(a => a.alertId === alertId);
    if (index !== -1) {
      alerts[index] = { ...alerts[index], ...updates };
      return this.setAlerts(alerts);
    }
    return false;
  }

  removeAlert(alertId) {
    const alerts = this.getAlerts();
    const filtered = alerts.filter(a => a.alertId !== alertId);
    return this.setAlerts(filtered);
  }

  // Settings management
  getSettings() {
    return this.getItem(this.keys.SETTINGS, {
      notifications: true,
      theme: 'dark',
      currency: 'usd',
      refreshInterval: 30000
    });
  }

  setSettings(settings) {
    return this.setItem(this.keys.SETTINGS, settings);
  }

  updateSettings(updates) {
    const settings = this.getSettings();
    return this.setSettings({ ...settings, ...updates });
  }
}

export const storageService = new StorageService();