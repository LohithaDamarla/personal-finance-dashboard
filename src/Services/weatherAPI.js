const API_KEY = '41bd9c2c5624a6911e6bcf367bb6c4ad'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Default location (you can change this to your city)
const DEFAULT_LOCATION = 'New York';

export const getCurrentWeather = async (city = DEFAULT_LOCATION) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.cod !== 200) {
      throw new Error(data.message || 'Weather data not found');
    }
    
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      main: data.weather[0].main,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const getWeatherForecast = async (city = DEFAULT_LOCATION) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.cod !== '200') {
      throw new Error(data.message || 'Forecast data not found');
    }
    
    // Group forecast by day and get daily highs/lows
    const dailyForecasts = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date: date,
          temps: [],
          conditions: [],
          icons: []
        };
      }
      
      dailyForecasts[date].temps.push(item.main.temp);
      dailyForecasts[date].conditions.push(item.weather[0].description);
      dailyForecasts[date].icons.push(item.weather[0].icon);
    });
    
    // Format daily forecasts
    const formattedForecast = Object.values(dailyForecasts)
      .slice(0, 3) // Get next 3 days
      .map(day => ({
        date: day.date,
        dayName: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        high: Math.round(Math.max(...day.temps)),
        low: Math.round(Math.min(...day.temps)),
        condition: day.conditions[0], // Most frequent condition
        icon: day.icons[0] // First icon
      }));
    
    return formattedForecast;
    
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Get city name from coordinates
          const response = await fetch(
            `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          
          if (!response.ok) {
            throw new Error('Failed to get location weather');
          }
          
          const data = await response.json();
          resolve(data.name);
          
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(new Error('Location permission denied'));
      },
      { timeout: 10000 }
    );
  });
};