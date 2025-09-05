import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function CoinSearch() {
  const { searchCoins, addToWatchlist, coins } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchCrypto = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await searchCoins(query);
        // Combine with coin data for more details
        const enhancedResults = searchResults.map(result => {
          const coinData = coins.find(coin => coin.id === result.id);
          return coinData || result;
        });
        setResults(enhancedResults.slice(0, 8));
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchCrypto, 300);
    return () => clearTimeout(debounce);
  }, [query, searchCoins, coins]);

  const handleAddToWatchlist = async (coin) => {
    const success = await addToWatchlist(coin);
    if (success) {
      setQuery('');
      setResults([]);
      setIsOpen(false);
    }
  };

  const formatPrice = (price) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-3 bg-surface rounded-lg border border-surface text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface rounded-lg border border-surface shadow-card z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-text-secondary">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((coin) => (
                <div
                  key={coin.id}
                  className="px-4 py-3 hover:bg-bg transition-colors cursor-pointer flex items-center justify-between"
                  onClick={() => handleAddToWatchlist(coin)}
                >
                  <div className="flex items-center space-x-3">
                    {coin.image && (
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium text-text-primary">{coin.name}</div>
                      <div className="text-sm text-text-secondary uppercase">{coin.symbol}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {coin.current_price && (
                      <div className="text-right">
                        <div className="text-text-primary font-medium">
                          {formatPrice(coin.current_price)}
                        </div>
                        {coin.price_change_percentage_24h !== undefined && (
                          <div className={`text-sm flex items-center ${
                            coin.price_change_percentage_24h >= 0 ? 'text-positive' : 'text-negative'
                          }`}>
                            {coin.price_change_percentage_24h >= 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                          </div>
                        )}
                      </div>
                    )}
                    <button className="p-1 hover:bg-primary hover:text-white rounded transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-text-secondary">
              <p className="text-sm">No cryptocurrencies found</p>
              <p className="text-xs mt-1">Try searching with a different term</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}