import React from 'react';
import { Bell, TrendingUp, Settings, Star } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function AppShell({ children }) {
  const { user, alerts, error, clearError } = useApp();
  
  const activeAlerts = alerts.filter(alert => alert.status === 'active').length;

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-surface">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-text-primary">CryptoTrend</h1>
                <p className="text-xs text-text-secondary hidden sm:block">Never miss a market move</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              {/* Alerts indicator */}
              <div className="relative">
                <Bell className="w-5 h-5 text-text-secondary" />
                {activeAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-xs text-white rounded-full flex items-center justify-center">
                    {activeAlerts > 9 ? '9+' : activeAlerts}
                  </span>
                )}
              </div>

              {/* Subscription tier badge */}
              <div className="hidden sm:flex items-center space-x-2">
                <Star className={`w-4 h-4 ${user?.subscriptionTier === 'pro' ? 'text-accent' : 'text-text-secondary'}`} />
                <span className="text-sm text-text-secondary capitalize">
                  {user?.subscriptionTier || 'free'}
                </span>
              </div>

              {/* Settings */}
              <button className="p-2 hover:bg-bg rounded-md transition-colors">
                <Settings className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-negative text-white px-4 py-3">
          <div className="max-w-container mx-auto flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button
              onClick={clearError}
              className="text-white hover:text-gray-200 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-container mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-surface mt-12">
        <div className="max-w-container mx-auto px-4 sm:px-6 py-8">
          <div className="text-center">
            <p className="text-text-secondary text-sm">
              © 2024 CryptoTrend Alerts. Real-time crypto monitoring made simple.
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <button className="text-text-secondary hover:text-primary transition-colors">
                Upgrade to Pro
              </button>
              <button className="text-text-secondary hover:text-primary transition-colors">
                Privacy Policy
              </button>
              <button className="text-text-secondary hover:text-primary transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}