import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Bell, Star, RefreshCw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import CoinSearch from './CoinSearch';
import WatchlistItem from './WatchlistItem';
import { cryptoAPI } from '../services/api';

export default function Dashboard() {
  const {
    watchlists,
    watchlistItems,
    selectedWatchlist,
    alerts,
    user,
    loading,
    loadTopCoins
  } = useApp();

  const [watchlistCoins, setWatchlistCoins] = useState([]);
  const [loadingCoins, setLoadingCoins] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Get current watchlist items
  const currentWatchlistItems = watchlistItems.filter(
    item => item.watchlistId === selectedWatchlist?.watchlistId
  );

  // Load coin data for watchlist
  useEffect(() => {
    const loadWatchlistCoins = async () => {
      if (currentWatchlistItems.length === 0) {
        setWatchlistCoins([]);
        return;
      }

      setLoadingCoins(true);
      try {
        const coinIds = currentWatchlistItems.map(item => item.coinId);
        const coins = await cryptoAPI.getMultipleCoins(coinIds);
        setWatchlistCoins(coins);
      } catch (error) {
        console.error('Failed to load watchlist coins:', error);
        setWatchlistCoins([]);
      } finally {
        setLoadingCoins(false);
      }
    };

    loadWatchlistCoins();
  }, [currentWatchlistItems]);

  const handleRefresh = async () => {
    await loadTopCoins();
    // Reload watchlist coins
    if (currentWatchlistItems.length > 0) {
      setLoadingCoins(true);
      try {
        const coinIds = currentWatchlistItems.map(item => item.coinId);
        const coins = await cryptoAPI.getMultipleCoins(coinIds);
        setWatchlistCoins(coins);
      } catch (error) {
        console.error('Failed to refresh watchlist coins:', error);
      } finally {
        setLoadingCoins(false);
      }
    }
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const triggeredAlerts = alerts.filter(alert => alert.status === 'triggered');

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Watchlist Items</p>
              <p className="text-2xl font-bold text-text-primary">{currentWatchlistItems.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent bg-opacity-20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Active Alerts</p>
              <p className="text-2xl font-bold text-text-primary">{activeAlerts.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-positive bg-opacity-20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-positive" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Triggered Today</p>
              <p className="text-2xl font-bold text-text-primary">{triggeredAlerts.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${user?.subscriptionTier === 'pro' ? 'bg-accent' : 'bg-surface'} bg-opacity-20 rounded-lg flex items-center justify-center`}>
              <Star className={`w-5 h-5 ${user?.subscriptionTier === 'pro' ? 'text-accent' : 'text-text-secondary'}`} />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Subscription</p>
              <p className="text-lg font-bold text-text-primary capitalize">
                {user?.subscriptionTier || 'free'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            {selectedWatchlist?.name || 'My Watchlist'}
          </h2>
          <p className="text-text-secondary">
            Track your favorite cryptocurrencies and get instant alerts
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loadingCoins}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loadingCoins ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Crypto</span>
          </button>
        </div>
      </div>

      {/* Search Section */}
      {showSearch && (
        <div className="card-elevated">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Add Cryptocurrency</h3>
          <CoinSearch />
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowSearch(false)}
              className="text-text-secondary hover:text-text-primary text-sm"
            >
              Close Search
            </button>
          </div>
        </div>
      )}

      {/* Subscription Limits Notice */}
      {user?.subscriptionTier === 'free' && (
        <div className="card bg-accent bg-opacity-10 border border-accent">
          <div className="flex items-start space-x-3">
            <Star className="w-5 h-5 text-accent mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary">Free Tier Limits</h3>
              <p className="text-sm text-text-secondary mt-1">
                You're currently using {currentWatchlistItems.length}/10 watchlist slots and {activeAlerts.length}/3 active alerts.
              </p>
              <button className="mt-2 text-accent hover:underline text-sm font-medium">
                Upgrade to Pro for unlimited access →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Watchlist Grid */}
      {loadingCoins ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-20 bg-surface rounded"></div>
            </div>
          ))}
        </div>
      ) : currentWatchlistItems.length === 0 ? (
        <div className="card-elevated text-center py-12">
          <TrendingUp className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Your watchlist is empty
          </h3>
          <p className="text-text-secondary mb-6">
            Start by adding some cryptocurrencies to track their prices and set up alerts.
          </p>
          <button
            onClick={() => setShowSearch(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Crypto</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentWatchlistItems.map((item) => {
            const coinData = watchlistCoins.find(coin => coin.id === item.coinId);
            return (
              <WatchlistItem
                key={item.watchlistItemId}
                item={item}
                coinData={coinData}
              />
            );
          })}
        </div>
      )}

      {/* Recent Alerts */}
      {triggeredAlerts.length > 0 && (
        <div className="card-elevated">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {triggeredAlerts.slice(0, 5).map((alert) => (
              <div key={alert.alertId} className="flex items-center justify-between p-3 bg-surface rounded-md">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {alert.alertType.replace('_', ' ').toUpperCase()} Alert
                  </p>
                  <p className="text-xs text-text-secondary">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-primary">
                    Target: {alert.triggerValue}
                  </p>
                  <span className="inline-block px-2 py-1 bg-positive bg-opacity-20 text-positive text-xs rounded">
                    Triggered
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}