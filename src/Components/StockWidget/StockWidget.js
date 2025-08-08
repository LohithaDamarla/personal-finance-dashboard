import React, { useState, useEffect } from 'react';
import { fetchMultipleStocks } from '../../Services/stockAPI';
import './StockWidget.css';

const StockWidget = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadStockData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stockData = await fetchMultipleStocks();
      setStocks(stockData);
      setLastUpdated(new Date().toLocaleTimeString());
      
    } catch (err) {
      setError('Failed to load stock data');
      console.error('Stock widget error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStockData();
    
    // Auto-refresh every 10 minutes (to respect API limits)
    const interval = setInterval(loadStockData, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getChangeColor = (change) => {
    return parseFloat(change) >= 0 ? '#10b981' : '#ef4444';
  };

  const getChangeIcon = (change) => {
    return parseFloat(change) >= 0 ? '↗' : '↘';
  };

  if (loading) {
    return (
      <div className="stock-widget">
        <div className="stock-header">
          <h3>📈 Stock Portfolio</h3>
        </div>
        <div className="stock-loading">
          <div className="loading-spinner"></div>
          <p>Loading live stock data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-widget">
        <div className="stock-header">
          <h3>📈 Stock Portfolio</h3>
        </div>
        <div className="stock-error">
          <p>❌ {error}</p>
          <button onClick={loadStockData} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-widget">
      <div className="stock-header">
        <h3>📈 Stock Portfolio</h3>
        <button onClick={loadStockData} className="refresh-button" title="Refresh Data">
          🔄
        </button>
      </div>
      
      {lastUpdated && (
        <div className="last-updated">
          Last updated: {lastUpdated}
        </div>
      )}
      
      <div className="stocks-list">
        {stocks.map((stock, index) => (
          <div key={stock.symbol} className="stock-item">
            <div className="stock-info">
              <div className="stock-symbol">{stock.symbol}</div>
              <div className="stock-price">{formatPrice(stock.price)}</div>
            </div>
            <div className="stock-change">
              <span 
                className="change-value"
                style={{ color: getChangeColor(stock.change) }}
              >
                {getChangeIcon(stock.change)} {parseFloat(stock.change) >= 0 ? '+' : ''}{stock.change}
              </span>
              <span 
                className="change-percent"
                style={{ color: getChangeColor(stock.change) }}
              >
                ({parseFloat(stock.changePercent) >= 0 ? '+' : ''}{stock.changePercent}%)
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="stock-footer">
        <small>🔴 Live market data • Auto-refresh every 10min</small>
      </div>
    </div>
  );
};

export default StockWidget;