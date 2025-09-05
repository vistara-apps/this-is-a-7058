import React, { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { notificationService } from '../services/notifications';

export default function NotificationToggle({ enabled, onChange, className = '' }) {
  const [requesting, setRequesting] = useState(false);

  const handleToggle = async () => {
    if (!enabled) {
      // User wants to enable notifications
      setRequesting(true);
      try {
        const granted = await notificationService.requestPermission();
        if (granted) {
          onChange(true);
        } else {
          // Show user-friendly message
          alert('Please enable notifications in your browser settings to receive crypto alerts.');
        }
      } catch (error) {
        console.error('Notification permission error:', error);
        alert('Unable to enable notifications. Please check your browser settings.');
      } finally {
        setRequesting(false);
      }
    } else {
      // User wants to disable notifications
      onChange(false);
    }
  };

  const isSupported = notificationService.isSupported();

  if (!isSupported) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <BellOff className="w-4 h-4 text-text-secondary" />
        <span className="text-xs text-text-secondary">Not supported</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={requesting}
      className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
        enabled 
          ? 'bg-accent bg-opacity-20 text-accent hover:bg-opacity-30' 
          : 'bg-surface text-text-secondary hover:bg-bg hover:text-text-primary'
      } ${requesting ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={enabled ? 'Notifications enabled' : 'Enable notifications'}
    >
      {requesting ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : enabled ? (
        <Bell className="w-4 h-4" />
      ) : (
        <BellOff className="w-4 h-4" />
      )}
      <span className="text-sm">
        {requesting ? 'Requesting...' : enabled ? 'Enabled' : 'Enable'}
      </span>
    </button>
  );
}
