import React, { useState } from 'react';
import { X, Bell, BellOff, Moon, Sun, DollarSign, Clock, Star } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { notificationService } from '../services/notifications';

export default function Settings({ isOpen, onClose }) {
  const { settings, updateSettings, user } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [notificationPermission, setNotificationPermission] = useState(
    notificationService.hasPermission()
  );

  if (!isOpen) return null;

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  const handleNotificationToggle = async () => {
    if (!localSettings.notifications) {
      // User wants to enable notifications
      const granted = await notificationService.requestPermission();
      if (granted) {
        setNotificationPermission(true);
        handleSettingChange('notifications', true);
      } else {
        alert('Please enable notifications in your browser settings to receive alerts.');
      }
    } else {
      // User wants to disable notifications
      handleSettingChange('notifications', false);
    }
  };

  const refreshIntervalOptions = [
    { value: 15000, label: '15 seconds' },
    { value: 30000, label: '30 seconds' },
    { value: 60000, label: '1 minute' },
    { value: 300000, label: '5 minutes' }
  ];

  const currencyOptions = [
    { value: 'usd', label: 'USD ($)', symbol: '$' },
    { value: 'eur', label: 'EUR (€)', symbol: '€' },
    { value: 'btc', label: 'BTC (₿)', symbol: '₿' },
    { value: 'eth', label: 'ETH (Ξ)', symbol: 'Ξ' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-surface rounded-lg border border-surface shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface">
          <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Notifications */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-primary flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-primary">Push Notifications</p>
                  <p className="text-xs text-text-secondary">
                    Receive alerts when price thresholds are met
                  </p>
                </div>
                <button
                  onClick={handleNotificationToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.notifications ? 'bg-primary' : 'bg-surface border border-surface'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {!notificationService.isSupported() && (
                <div className="p-3 bg-negative bg-opacity-10 border border-negative rounded-md">
                  <p className="text-xs text-text-secondary">
                    Your browser doesn't support push notifications.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Refresh Interval */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-primary flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Refresh Interval</span>
            </h3>
            
            <select
              value={localSettings.refreshInterval}
              onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-bg border border-surface rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {refreshIntervalOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-text-secondary">
              How often to check for price changes and alerts
            </p>
          </div>

          {/* Currency */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-primary flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Display Currency</span>
            </h3>
            
            <select
              value={localSettings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="w-full px-3 py-2 bg-bg border border-surface rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {currencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Theme */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-primary flex items-center space-x-2">
              <Moon className="w-4 h-4" />
              <span>Theme</span>
            </h3>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleSettingChange('theme', 'dark')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  localSettings.theme === 'dark' 
                    ? 'bg-primary text-white' 
                    : 'bg-bg text-text-secondary hover:text-text-primary'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-sm">Dark</span>
              </button>
              <button
                onClick={() => handleSettingChange('theme', 'light')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  localSettings.theme === 'light' 
                    ? 'bg-primary text-white' 
                    : 'bg-bg text-text-secondary hover:text-text-primary'
                }`}
                disabled
              >
                <Sun className="w-4 h-4" />
                <span className="text-sm">Light (Coming Soon)</span>
              </button>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="space-y-3 pt-4 border-t border-surface">
            <h3 className="text-sm font-medium text-text-primary flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Subscription</span>
            </h3>
            
            <div className="p-3 bg-accent bg-opacity-10 border border-accent rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary capitalize">
                    {user?.subscriptionTier || 'free'} Plan
                  </p>
                  <p className="text-xs text-text-secondary">
                    {user?.subscriptionTier === 'pro' 
                      ? 'Unlimited alerts and watchlist items'
                      : 'Limited to 3 alerts and 10 watchlist items'
                    }
                  </p>
                </div>
                {user?.subscriptionTier !== 'pro' && (
                  <button className="px-3 py-1 bg-accent text-white text-xs rounded-md hover:opacity-90 transition-opacity">
                    Upgrade
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-surface">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
