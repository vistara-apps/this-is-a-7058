// CoinGecko API integration
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

class CryptoAPI {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 60000; // 1 minute cache
  }

  async fetchWithCache(url, options = {}) {
    const cacheKey = url;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  async getTopCoins(limit = 100) {
    const url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`;
    return this.fetchWithCache(url);
  }

  async getCoinById(coinId) {
    const url = `${COINGECKO_BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    return this.fetchWithCache(url);
  }

  async searchCoins(query) {
    if (!query || query.length < 2) return [];
    
    const url = `${COINGECKO_BASE_URL}/search?query=${encodeURIComponent(query)}`;
    const result = await this.fetchWithCache(url);
    return result.coins?.slice(0, 10) || [];
  }

  async getMultipleCoins(coinIds) {
    if (!coinIds || coinIds.length === 0) return [];
    
    const ids = coinIds.join(',');
    const url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`;
    return this.fetchWithCache(url);
  }

  // Calculate simple moving average (SMA)
  calculateSMA(prices, period) {
    if (prices.length < period) return null;
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  // Calculate RSI (simplified version)
  calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return null;
    
    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }
    
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);
    
    const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  // Get historical data for technical indicators
  async getCoinHistory(coinId, days = 7) {
    const url = `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=hourly`;
    return this.fetchWithCache(url);
  }

  // Calculate volume spike detection
  calculateVolumeSpike(volumes, threshold = 2.0) {
    if (volumes.length < 2) return false;
    
    const currentVolume = volumes[volumes.length - 1];
    const avgVolume = volumes.slice(0, -1).reduce((a, b) => a + b, 0) / (volumes.length - 1);
    
    return currentVolume >= (avgVolume * threshold);
  }

  // Get technical indicators for a coin
  async getTechnicalIndicators(coinId) {
    try {
      const history = await this.getCoinHistory(coinId, 30);
      const prices = history.prices.map(p => p[1]);
      const volumes = history.total_volumes.map(v => v[1]);
      
      return {
        sma20: this.calculateSMA(prices, 20),
        sma50: this.calculateSMA(prices, 50),
        rsi: this.calculateRSI(prices),
        volumeSpike: this.calculateVolumeSpike(volumes),
        currentPrice: prices[prices.length - 1],
        priceAboveSMA20: prices[prices.length - 1] > this.calculateSMA(prices, 20),
        priceAboveSMA50: prices[prices.length - 1] > this.calculateSMA(prices, 50)
      };
    } catch (error) {
      console.error('Technical indicators error:', error);
      return null;
    }
  }
}

export const cryptoAPI = new CryptoAPI();
