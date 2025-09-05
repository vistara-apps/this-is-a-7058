import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ALERT_TYPES } from '../types';

export default function AlertConfigForm({ coin, watchlistItem, isOpen, onClose }) {
  const { createAlert, user } = useApp();
  const [alerts, setAlerts] = useState([
    { type: ALERT_TYPES.PRICE_ABOVE, value: '', enabled: false },
    { type: ALERT_TYPES.PRICE_BELOW, value: '', enabled: false },
    { type: ALERT_TYPES.PERCENTAGE_CHANGE, value: '', enabled: false }
  ]);

  if (!isOpen) return null;

  const handleAlertChange = (index, field, value) => {
    setAlerts(prev => prev.map((alert, i) => 
      i === index ? { ...alert, [field]: value } : alert
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const enabledAlerts = alerts.filter(alert => alert.enabled && alert.value);
    
    if (enabledAlerts.length === 0) {
      alert('Please enable at least one alert with a valid value.');
      return;
    }

    // Check subscription limits
    if (user.subscriptionTier === 'free' && enabledAlerts.length > 3) {
      alert('Free tier is limited to 3 alerts. Please upgrade to Pro for unlimited alerts.');
      return;
    }

    // Create alerts
    enabledAlerts.forEach(alertConfig => {
      createAlert(coin.id, alertConfig.type, parseFloat(alertConfig.value));
    });

    onClose();
  };

  const getAlertLabel = (type) => {
    switch (type) {
      case ALERT_TYPES.PRICE_ABOVE:
        return 'Price Above';
      case ALERT_TYPES.PRICE_BELOW:
        return 'Price Below';
      case ALERT_TYPES.PERCENTAGE_CHANGE:
        return '24h Change Above';
      default:
        return type;
    }
  };

  const getAlertPlaceholder = (type) => {
    switch (type) {
      case ALERT_TYPES.PRICE_ABOVE:
      case ALERT_TYPES.PRICE_BELOW:
        return `e.g. ${coin.current_price.toFixed(2)}`;
      case ALERT_TYPES.PERCENTAGE_CHANGE:
        return 'e.g. 5 (for 5%)';
      default:
        return '';
    }
  };

  const getAlertUnit = (type) => {
    switch (type) {
      case ALERT_TYPES.PRICE_ABOVE:
      case ALERT_TYPES.PRICE_BELOW:
        return '$';
      case ALERT_TYPES.PERCENTAGE_CHANGE:
        return '%';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-surface rounded-lg border border-surface shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Configure Alerts</h2>
            <p className="text-sm text-text-secondary mt-1">
              {coin.name} ({coin.symbol.toUpperCase()})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Current Price Display */}
        <div className="p-6 border-b border-surface">
          <div className="flex items-center space-x-3">
            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-sm text-text-secondary">Current Price</p>
              <p className="text-xl font-bold text-text-primary">
                ${coin.current_price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Alert Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={alert.type} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`alert-${index}`}
                    checked={alert.enabled}
                    onChange={(e) => handleAlertChange(index, 'enabled', e.target.checked)}
                    className="w-4 h-4 text-primary bg-surface border-surface rounded focus:ring-primary"
                  />
                  <label htmlFor={`alert-${index}`} className="text-sm font-medium text-text-primary">
                    {getAlertLabel(alert.type)}
                  </label>
                </div>
                
                {alert.enabled && (
                  <div className="ml-6">
                    <div className="relative">
                      {getAlertUnit(alert.type) && (
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                          {getAlertUnit(alert.type)}
                        </span>
                      )}
                      <input
                        type="number"
                        step="any"
                        value={alert.value}
                        onChange={(e) => handleAlertChange(index, 'value', e.target.value)}
                        placeholder={getAlertPlaceholder(alert.type)}
                        className={`w-full ${getAlertUnit(alert.type) ? 'pl-6' : 'pl-3'} pr-3 py-2 bg-bg border border-surface rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Subscription Notice */}
          {user.subscriptionTier === 'free' && (
            <div className="mt-4 p-3 bg-accent bg-opacity-10 border border-accent rounded-md">
              <p className="text-xs text-text-secondary">
                <strong>Free Tier:</strong> Limited to 3 active alerts. 
                <button className="text-accent hover:underline ml-1">Upgrade to Pro</button> for unlimited alerts.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Create Alerts
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}