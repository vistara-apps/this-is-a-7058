import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storageService } from '../services/storage';
import { cryptoAPI } from '../services/api';
import { notificationService } from '../services/notifications';
import { createUser, createWatchlist, SUBSCRIPTION_TIERS, ALERT_STATUS } from '../types';

const AppContext = createContext();

const initialState = {
  user: null,
  watchlists: [],
  watchlistItems: [],
  alerts: [],
  coins: [],
  selectedWatchlist: null,
  loading: false,
  error: null,
  settings: {
    notifications: true,
    theme: 'dark',
    currency: 'usd',
    refreshInterval: 30000
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_WATCHLISTS':
      return { ...state, watchlists: action.payload };
    
    case 'SET_WATCHLIST_ITEMS':
      return { ...state, watchlistItems: action.payload };
    
    case 'SET_ALERTS':
      return { ...state, alerts: action.payload };
    
    case 'SET_COINS':
      return { ...state, coins: action.payload };
    
    case 'SET_SELECTED_WATCHLIST':
      return { ...state, selectedWatchlist: action.payload };
    
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    
    case 'ADD_WATCHLIST':
      return { ...state, watchlists: [...state.watchlists, action.payload] };
    
    case 'ADD_WATCHLIST_ITEM':
      return { ...state, watchlistItems: [...state.watchlistItems, action.payload] };
    
    case 'ADD_ALERT':
      return { ...state, alerts: [...state.alerts, action.payload] };
    
    case 'UPDATE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert.alertId === action.payload.alertId
            ? { ...alert, ...action.payload.updates }
            : alert
        )
      };
    
    case 'REMOVE_WATCHLIST_ITEM':
      return {
        ...state,
        watchlistItems: state.watchlistItems.filter(
          item => item.watchlistItemId !== action.payload
        )
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app data
  useEffect(() => {
    initializeApp();
  }, []);

  // Set up price monitoring
  useEffect(() => {
    if (state.watchlistItems.length > 0) {
      const interval = setInterval(() => {
        checkAlerts();
      }, state.settings.refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [state.watchlistItems, state.settings.refreshInterval]);

  const initializeApp = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Load user data
      let user = storageService.getUser();
      if (!user) {
        user = createUser();
        storageService.setUser(user);
      }
      dispatch({ type: 'SET_USER', payload: user });

      // Load watchlists
      const watchlists = storageService.getWatchlists();
      if (watchlists.length === 0) {
        const defaultWatchlist = createWatchlist(user.userId, 'My Crypto');
        storageService.addWatchlist(defaultWatchlist);
        dispatch({ type: 'SET_WATCHLISTS', payload: [defaultWatchlist] });
        dispatch({ type: 'SET_SELECTED_WATCHLIST', payload: defaultWatchlist });
      } else {
        dispatch({ type: 'SET_WATCHLISTS', payload: watchlists });
        dispatch({ type: 'SET_SELECTED_WATCHLIST', payload: watchlists[0] });
      }

      // Load watchlist items and alerts
      dispatch({ type: 'SET_WATCHLIST_ITEMS', payload: storageService.getWatchlistItems() });
      dispatch({ type: 'SET_ALERTS', payload: storageService.getAlerts() });
      dispatch({ type: 'SET_SETTINGS', payload: storageService.getSettings() });

      // Load initial coin data
      await loadTopCoins();
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadTopCoins = async () => {
    try {
      const coins = await cryptoAPI.getTopCoins(100);
      dispatch({ type: 'SET_COINS', payload: coins });
    } catch (error) {
      console.error('Failed to load coins:', error);
    }
  };

  const addToWatchlist = async (coin, alertThresholds = {}) => {
    if (!state.selectedWatchlist) return false;

    // Check if coin already exists in watchlist
    const existingItem = state.watchlistItems.find(
      item => item.watchlistId === state.selectedWatchlist.watchlistId && item.coinId === coin.id
    );

    if (existingItem) {
      dispatch({ type: 'SET_ERROR', payload: 'Coin already in watchlist' });
      return false;
    }

    // Check subscription limits
    if (state.user.subscriptionTier === SUBSCRIPTION_TIERS.FREE) {
      const userWatchlistItems = state.watchlistItems.filter(
        item => state.watchlists.some(w => w.userId === state.user.userId && w.watchlistId === item.watchlistId)
      );
      
      if (userWatchlistItems.length >= 10) {
        dispatch({ type: 'SET_ERROR', payload: 'Free tier limited to 10 watchlist items. Upgrade to Pro for unlimited.' });
        return false;
      }
    }

    const watchlistItem = {
      watchlistItemId: Date.now().toString() + Math.random(),
      watchlistId: state.selectedWatchlist.watchlistId,
      coinId: coin.id,
      alertThresholds,
      notificationEnabled: true,
      createdAt: Date.now()
    };

    storageService.addWatchlistItem(watchlistItem);
    dispatch({ type: 'ADD_WATCHLIST_ITEM', payload: watchlistItem });
    return true;
  };

  const removeFromWatchlist = (watchlistItemId) => {
    storageService.removeWatchlistItem(watchlistItemId);
    dispatch({ type: 'REMOVE_WATCHLIST_ITEM', payload: watchlistItemId });
  };

  const createAlert = (coinId, alertType, triggerValue) => {
    // Check subscription limits
    if (state.user.subscriptionTier === SUBSCRIPTION_TIERS.FREE) {
      const activeAlerts = state.alerts.filter(alert => alert.status === ALERT_STATUS.ACTIVE);
      if (activeAlerts.length >= 3) {
        dispatch({ type: 'SET_ERROR', payload: 'Free tier limited to 3 active alerts. Upgrade to Pro for unlimited.' });
        return false;
      }
    }

    const alert = {
      alertId: Date.now().toString() + Math.random(),
      userId: state.user.userId,
      coinId,
      alertType,
      triggerValue,
      timestamp: Date.now(),
      status: ALERT_STATUS.ACTIVE
    };

    storageService.addAlert(alert);
    dispatch({ type: 'ADD_ALERT', payload: alert });
    return true;
  };

  const checkAlerts = async () => {
    if (!state.settings.notifications || state.alerts.length === 0) return;

    const activeAlerts = state.alerts.filter(alert => alert.status === ALERT_STATUS.ACTIVE);
    if (activeAlerts.length === 0) return;

    try {
      // Get unique coin IDs from active alerts
      const coinIds = [...new Set(activeAlerts.map(alert => alert.coinId))];
      const coinData = await cryptoAPI.getMultipleCoins(coinIds);
      
      for (const alert of activeAlerts) {
        const coin = coinData.find(c => c.id === alert.coinId);
        if (!coin) continue;

        let shouldTrigger = false;
        let message = '';

        switch (alert.alertType) {
          case 'price_above':
            if (coin.current_price >= alert.triggerValue) {
              shouldTrigger = true;
              message = `Price reached $${coin.current_price.toFixed(2)} (target: $${alert.triggerValue})`;
            }
            break;
          case 'price_below':
            if (coin.current_price <= alert.triggerValue) {
              shouldTrigger = true;
              message = `Price dropped to $${coin.current_price.toFixed(2)} (target: $${alert.triggerValue})`;
            }
            break;
          case 'percentage_change':
            if (Math.abs(coin.price_change_percentage_24h) >= Math.abs(alert.triggerValue)) {
              shouldTrigger = true;
              message = `24h change: ${coin.price_change_percentage_24h.toFixed(2)}% (target: ${alert.triggerValue}%)`;
            }
            break;
        }

        if (shouldTrigger) {
          await notificationService.showPriceAlert(
            coin.name,
            coin.symbol,
            message,
            coin.price_change_percentage_24h
          );

          // Update alert status
          storageService.updateAlert(alert.alertId, { status: ALERT_STATUS.TRIGGERED });
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              alertId: alert.alertId,
              updates: { status: ALERT_STATUS.TRIGGERED }
            }
          });
        }
      }
    } catch (error) {
      console.error('Alert checking error:', error);
    }
  };

  const searchCoins = async (query) => {
    try {
      const results = await cryptoAPI.searchCoins(query);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...state.settings, ...newSettings };
    storageService.updateSettings(newSettings);
    dispatch({ type: 'SET_SETTINGS', payload: updatedSettings });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value = {
    ...state,
    addToWatchlist,
    removeFromWatchlist,
    createAlert,
    searchCoins,
    updateSettings,
    clearError,
    loadTopCoins
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};