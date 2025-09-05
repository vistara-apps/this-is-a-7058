import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function DataTable({ data, columns, loading = false, emptyMessage = "No data available" }) {
  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-surface rounded w-full"></div>
          <div className="h-4 bg-surface rounded w-3/4"></div>
          <div className="h-4 bg-surface rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  const formatValue = (value, type) => {
    switch (type) {
      case 'price':
        if (value < 0.01) return `$${value.toFixed(6)}`;
        if (value < 1) return `$${value.toFixed(4)}`;
        return `$${value.toFixed(2)}`;
      case 'percentage':
        return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
      case 'volume':
        if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
        if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
        return `$${value.toFixed(0)}`;
      case 'marketcap':
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
        return `$${value.toFixed(0)}`;
      default:
        return value;
    }
  };

  const getPercentageColor = (value) => {
    return value >= 0 ? 'text-positive' : 'text-negative';
  };

  const getPercentageIcon = (value) => {
    return value >= 0 ? TrendingUp : TrendingDown;
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface">
            {data.map((row, index) => (
              <tr key={row.id || index} className="hover:bg-bg transition-colors">
                {columns.map((column) => {
                  const value = row[column.key];
                  const formattedValue = column.format ? formatValue(value, column.format) : value;
                  
                  return (
                    <td key={column.key} className={`px-4 py-4 whitespace-nowrap ${column.className || ''}`}>
                      {column.format === 'percentage' ? (
                        <div className={`flex items-center space-x-1 ${getPercentageColor(value)}`}>
                          {React.createElement(getPercentageIcon(value), { className: 'w-4 h-4' })}
                          <span className="text-sm font-medium">{formattedValue}</span>
                        </div>
                      ) : column.key === 'name' && row.image ? (
                        <div className="flex items-center space-x-3">
                          <img src={row.image} alt={row.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <div className="text-sm font-medium text-text-primary">{row.name}</div>
                            <div className="text-sm text-text-secondary uppercase">{row.symbol}</div>
                          </div>
                        </div>
                      ) : (
                        <div className={`text-sm ${column.format === 'price' ? 'font-medium text-text-primary' : 'text-text-primary'}`}>
                          {formattedValue}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
