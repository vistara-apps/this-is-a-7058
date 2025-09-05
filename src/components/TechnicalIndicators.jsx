import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { cryptoAPI } from '../services/api';

export default function TechnicalIndicators({ coinId, coinSymbol }) {
  const [indicators, setIndicators] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadIndicators = async () => {
      if (!coinId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await cryptoAPI.getTechnicalIndicators(coinId);
        setIndicators(data);
      } catch (err) {
        setError('Failed to load indicators');
        console.error('Technical indicators error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadIndicators();
  }, [coinId]);

  if (loading) {
    return (
      <div className="bg-surface rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Activity className="w-4 h-4 text-text-secondary" />
          <h4 className="text-sm font-medium text-text-primary">Technical Indicators</h4>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-bg rounded w-3/4"></div>
          <div className="h-4 bg-bg rounded w-1/2"></div>
          <div className="h-4 bg-bg rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !indicators) {
    return (
      <div className="bg-surface rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Activity className="w-4 h-4 text-text-secondary" />
          <h4 className="text-sm font-medium text-text-primary">Technical Indicators</h4>
        </div>
        <p className="text-xs text-text-secondary">
          {error || 'Indicators not available'}
        </p>
      </div>
    );
  }

  const getRSISignal = (rsi) => {
    if (rsi >= 70) return { signal: 'Overbought', color: 'text-negative', icon: TrendingDown };
    if (rsi <= 30) return { signal: 'Oversold', color: 'text-positive', icon: TrendingUp };
    return { signal: 'Neutral', color: 'text-text-secondary', icon: Activity };
  };

  const getSMASignal = (priceAboveSMA20, priceAboveSMA50) => {
    if (priceAboveSMA20 && priceAboveSMA50) return { signal: 'Bullish', color: 'text-positive', icon: TrendingUp };
    if (!priceAboveSMA20 && !priceAboveSMA50) return { signal: 'Bearish', color: 'text-negative', icon: TrendingDown };
    return { signal: 'Mixed', color: 'text-text-secondary', icon: Activity };
  };

  const rsiSignal = indicators.rsi ? getRSISignal(indicators.rsi) : null;
  const smaSignal = getSMASignal(indicators.priceAboveSMA20, indicators.priceAboveSMA50);

  return (
    <div className="bg-surface rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Activity className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-medium text-text-primary">Technical Indicators</h4>
        <span className="text-xs text-text-secondary uppercase">{coinSymbol}</span>
      </div>

      <div className="space-y-3">
        {/* RSI Indicator */}
        {indicators.rsi && rsiSignal && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <rsiSignal.icon className={`w-3 h-3 ${rsiSignal.color}`} />
              <span className="text-xs text-text-secondary">RSI (14)</span>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-text-primary">
                {indicators.rsi.toFixed(1)}
              </div>
              <div className={`text-xs ${rsiSignal.color}`}>
                {rsiSignal.signal}
              </div>
            </div>
          </div>
        )}

        {/* SMA Trend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <smaSignal.icon className={`w-3 h-3 ${smaSignal.color}`} />
            <span className="text-xs text-text-secondary">SMA Trend</span>
          </div>
          <div className="text-right">
            <div className={`text-xs font-medium ${smaSignal.color}`}>
              {smaSignal.signal}
            </div>
            <div className="text-xs text-text-secondary">
              20/50 SMA
            </div>
          </div>
        </div>

        {/* Volume Spike */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className={`w-3 h-3 ${indicators.volumeSpike ? 'text-accent' : 'text-text-secondary'}`} />
            <span className="text-xs text-text-secondary">Volume</span>
          </div>
          <div className="text-right">
            <div className={`text-xs font-medium ${indicators.volumeSpike ? 'text-accent' : 'text-text-primary'}`}>
              {indicators.volumeSpike ? 'Spike' : 'Normal'}
            </div>
            <div className="text-xs text-text-secondary">
              Activity
            </div>
          </div>
        </div>

        {/* Moving Averages */}
        {(indicators.sma20 || indicators.sma50) && (
          <div className="pt-2 border-t border-bg">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {indicators.sma20 && (
                <div>
                  <div className="text-text-secondary">SMA 20</div>
                  <div className="text-text-primary font-medium">
                    ${indicators.sma20.toFixed(2)}
                  </div>
                </div>
              )}
              {indicators.sma50 && (
                <div>
                  <div className="text-text-secondary">SMA 50</div>
                  <div className="text-text-primary font-medium">
                    ${indicators.sma50.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
