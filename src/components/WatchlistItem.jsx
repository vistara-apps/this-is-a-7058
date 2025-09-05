import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Bell, BellOff, Trash2, Settings } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import AlertConfigForm from './AlertConfigForm';

export default function WatchlistItem({ item, coinData }) {
  const { removeFromWatchlist } = useApp();
  const [showAlertConfig, setShowAlertConfig] = useState(false);

  if (!coinData) return null;

  const formatPrice = (price) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatVolume = (volume) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(1)}K`;
    return `$${volume.toFixed(0)}`;
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
    return `$${marketCap.toFixed(0)}`;
  };

  const isPositive = coinData.price_change_percentage_24h >= 0;

  return (
    <>
      <div className="card hover:shadow-lg transition-all duration-200 border border-surface">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={coinData.image}
              alt={coinData.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-text-primary">{coinData.name}</h3>
              <p className="text-sm text-text-secondary uppercase">{coinData.symbol}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAlertConfig(true)}
              className="p-1 hover:bg-primary hover:text-white rounded transition-colors"
              title="Configure alerts"
            >
              <Settings className="w-4 h-4" />
            </button>
            
            <button
              className="p-1 hover:bg-accent hover:text-white rounded transition-colors"
              title={item.notificationEnabled ? 'Notifications enabled' : 'Notifications disabled'}
            >
              {item.notificationEnabled ? (
                <Bell className="w-4 h-4 text-accent" />
              ) : (
                <BellOff className="w-4 h-4 text-text-secondary" />
              )}
            </button>
            
            <button
              onClick={() => removeFromWatchlist(item.watchlistItemId)}
              className="p-1 hover:bg-negative hover:text-white rounded transition-colors"
              title="Remove from watchlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Price and Change */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-text-secondary">Current Price</p>
            <p className="text-xl font-bold text-text-primary">
              {formatPrice(coinData.current_price)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-text-secondary">24h Change</p>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-positive' : 'text-negative'}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-semibold">
                {isPositive ? '+' : ''}{coinData.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Additional Data */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface">
          <div>
            <p className="text-xs text-text-secondary">24h Volume</p>
            <p className="text-sm font-medium text-text-primary">
              {formatVolume(coinData.total_volume)}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-text-secondary">Market Cap</p>
            <p className="text-sm font-medium text-text-primary">
              {formatMarketCap(coinData.market_cap)}
            </p>
          </div>
        </div>

        {/* Alert Thresholds Display */}
        {Object.keys(item.alertThresholds || {}).length > 0 && (
          <div className="mt-4 pt-4 border-t border-surface">
            <p className="text-xs text-text-secondary mb-2">Active Alerts</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(item.alertThresholds).map(([type, value]) => (
                <span
                  key={type}
                  className="px-2 py-1 bg-primary bg-opacity-20 text-primary text-xs rounded-md"
                >
                  {type.replace('_', ' ')}: {type.includes('price') ? `$${value}` : `${value}%`}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alert Configuration Modal */}
      {showAlertConfig && (
        <AlertConfigForm
          coin={coinData}
          watchlistItem={item}
          isOpen={showAlertConfig}
          onClose={() => setShowAlertConfig(false)}
        />
      )}
    </>
  );
}