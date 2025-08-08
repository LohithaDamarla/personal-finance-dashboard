import React, { useState, useEffect } from 'react';
import { getCurrentWeather,getWeatherForecast,getUserLocation } from '../../Services/weatherAPI';
import './WeatherWidget.css';

const WeatherWidget = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [userCity, setUserCity] = useState('New York');

  const loadWeatherData = async (city = userCity) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Loading weather for ${city}...`);
      
      // Fetch current weather and forecast
      const [current, forecastData] = await Promise.all([
        getCurrentWeather(city),
        getWeatherForecast(city)
      ]);
      
      setCurrentWeather(current);
      setForecast(forecastData);
      setLastUpdated(new Date().toLocaleTimeString());
      
      console.log('Weather data loaded:', { current, forecastData });
      
    } catch (err) {
      setError('Failed to load weather data');
      console.error('Weather widget error:', err);
    } finally {
      setLoading(false);
    }
  };

  const requestUserLocation = async () => {
    try {
      setLoading(true);
      const city = await getUserLocation();
      setUserCity(city);
      await loadWeatherData(city);
    } catch (err) {
      console.log('Location access denied, using default city');
      await loadWeatherData();
    }
  };

  useEffect(() => {
    requestUserLocation();
    
    // Auto-refresh every 30 minutes
    const interval = setInterval(() => loadWeatherData(), 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (iconCode) => {
    // Map weather icons to emojis for better visual appeal
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️', 
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '🌨️', '13n': '🌨️',
      '50d': '🌫️', '50n': '🌫️'
    };
    
    return iconMap[iconCode] || '🌤️';
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 30) return '#ff6b6b'; // Hot - Red
    if (temp >= 20) return '#ffd93d'; // Warm - Yellow  
    if (temp >= 10) return '#74c0fc'; // Cool - Light Blue
    return '#339af0'; // Cold - Blue
  };

  if (loading) {
    return (
      <div className="weather-widget">
        <div className="weather-header">
          <h3>🌤️ Weather</h3>
        </div>
        <div className="weather-loading">
          <div className="loading-spinner"></div>
          <p>Getting your local weather...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget">
        <div className="weather-header">
          <h3>🌤️ Weather</h3>
        </div>
        <div className="weather-error">
          <p>❌ {error}</p>
          <button onClick={() => loadWeatherData()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentWeather) return null;

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h3>🌤️ Weather</h3>
        <button onClick={() => loadWeatherData()} className="refresh-button" title="Refresh Weather">
          🔄
        </button>
      </div>
      
      {lastUpdated && (
        <div className="last-updated">
          Updated: {lastUpdated}
        </div>
      )}
      
      <div className="current-weather">
        <div className="weather-main">
          <div className="weather-icon">
            {getWeatherIcon(currentWeather.icon)}
          </div>
          <div className="weather-info">
            <div className="location">
              {currentWeather.city}, {currentWeather.country}
            </div>
            <div 
              className="temperature"
              style={{ color: getTemperatureColor(currentWeather.temperature) }}
            >
              {currentWeather.temperature}°C
            </div>
            <div className="description">
              {currentWeather.description.charAt(0).toUpperCase() + currentWeather.description.slice(1)}
            </div>
          </div>
        </div>
        
        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">Feels like</span>
            <span className="detail-value">{currentWeather.feelsLike}°C</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{currentWeather.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wind</span>
            <span className="detail-value">{currentWeather.windSpeed} m/s</span>
          </div>
        </div>
      </div>
      
      {forecast.length > 0 && (
        <div className="weather-forecast">
          <div className="forecast-header">3-Day Forecast</div>
          <div className="forecast-list">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-day">{day.dayName}</div>
                <div className="forecast-icon">{getWeatherIcon(day.icon)}</div>
                <div className="forecast-temps">
                  <span className="high-temp">{day.high}°</span>
                  <span className="low-temp">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;