// Browser notification service
class NotificationService {
  constructor() {
    this.permission = 'default';
    this.checkPermission();
  }

  async checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    }
    return false;
  }

  async showNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    try {
      const notification = new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: 'crypto-alert',
        renotify: true,
        ...options
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error('Notification error:', error);
      return false;
    }
  }

  async showPriceAlert(coinName, coinSymbol, message, changePercent) {
    const isPositive = changePercent >= 0;
    const icon = isPositive ? '📈' : '📉';
    
    return this.showNotification(`${icon} ${coinName} Alert`, {
      body: `${coinSymbol.toUpperCase()}: ${message}`,
      data: { coinSymbol, changePercent }
    });
  }

  async showVolumeAlert(coinName, coinSymbol, message) {
    return this.showNotification(`📊 Volume Alert`, {
      body: `${coinSymbol.toUpperCase()}: ${message}`,
      data: { coinSymbol, type: 'volume' }
    });
  }

  isSupported() {
    return 'Notification' in window;
  }

  hasPermission() {
    return this.permission === 'granted';
  }
}

export const notificationService = new NotificationService();