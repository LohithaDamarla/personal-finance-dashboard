import React, { useState, useEffect } from 'react';
import { getFinancialNews,formatTimeAgo } from '../../Services/newsAPI';
import './NewsWidget.css';

const NewsWidget = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading financial news...');
      
      const newsData = await getFinancialNews('business');
      setArticles(newsData);
      setLastUpdated(new Date().toLocaleTimeString());
      
      console.log('News loaded:', newsData);
      
    } catch (err) {
      setError('Failed to load news');
      console.error('News widget error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    
    // Auto-refresh every 20 minutes
    const interval = setInterval(loadNews, 20 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const openArticle = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="news-widget">
        <div className="news-header">
          <h3>📰 Financial News</h3>
        </div>
        <div className="news-loading">
          <div className="loading-spinner"></div>
          <p>Loading latest news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-widget">
        <div className="news-header">
          <h3>📰 Financial News</h3>
        </div>
        <div className="news-error">
          <p>❌ {error}</p>
          <button onClick={loadNews} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-widget">
      <div className="news-header">
        <h3>📰 Financial News</h3>
        <button onClick={loadNews} className="refresh-button" title="Refresh News">
          🔄
        </button>
      </div>
      
      {lastUpdated && (
        <div className="last-updated">
          Updated: {lastUpdated}
        </div>
      )}
      
      <div className="news-list">
        {articles.map((article, index) => (
          <div 
            key={index} 
            className="news-item"
            onClick={() => openArticle(article.url)}
          >
            <div className="news-content">
              <div className="news-title">
                {truncateText(article.title, 70)}
              </div>
              <div className="news-description">
                {truncateText(article.description, 90)}
              </div>
              <div className="news-meta">
                <span className="news-source">{article.source.name}</span>
                <span className="news-time">{formatTimeAgo(article.publishedAt)}</span>
              </div>
            </div>
            <div className="news-indicator">
              <span className="external-link">🔗</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="news-footer">
        <small>📈 Live financial news • Updates every 20min</small>
      </div>
    </div>
  );
};

export default NewsWidget;