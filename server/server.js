const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Weather endpoint with fallback to Open-Meteo
app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    // Try OpenWeather first if API key is configured
    if (API_KEY && API_KEY !== 'your_openweather_api_key_here') {
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        return res.json(weatherResponse.data);
      } catch (error) {
        console.log('OpenWeather failed, trying Open-Meteo...');
      }
    }
    
    // Fallback to Open-Meteo (free, no API key)
    const geoResponse = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    
    if (!geoResponse.data.results?.length) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    const { latitude, longitude, name, country } = geoResponse.data.results[0];
    
    const weatherResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl&timezone=auto`
    );
    
    const current = weatherResponse.data.current;
    
    // Convert to OpenWeather-like format
    const weatherData = {
      name: `${name}, ${country}`,
      main: {
        temp: current.temperature_2m,
        feels_like: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl
      },
      weather: [{
        description: getWeatherDescription(current.weather_code)
      }],
      wind: {
        speed: current.wind_speed_10m
      },
      visibility: 10000,
      clouds: { all: 0 }
    };
    
    res.json(weatherData);
  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// 5-day forecast endpoint with fallback
app.get('/api/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    // Try OpenWeather first if API key is configured
    if (API_KEY && API_KEY !== 'your_openweather_api_key_here') {
      try {
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        return res.json(forecastResponse.data);
      } catch (error) {
        console.log('OpenWeather forecast failed, trying Open-Meteo...');
      }
    }
    
    // Fallback to Open-Meteo
    const geoResponse = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    
    if (!geoResponse.data.results?.length) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    const { latitude, longitude } = geoResponse.data.results[0];
    
    const forecastResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,weather_code&timezone=auto&forecast_days=5`
    );
    
    const daily = forecastResponse.data.daily;
    
    // Convert to OpenWeather-like format
    const forecastData = {
      list: daily.time.map((date, index) => ({
        dt: new Date(date).getTime() / 1000,
        main: {
          temp: daily.temperature_2m_max[index]
        },
        weather: [{
          description: getWeatherDescription(daily.weather_code[index])
        }]
      }))
    };
    
    res.json(forecastData);
  } catch (error) {
    console.error('Forecast API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

// Weather code to description mapping for Open-Meteo
function getWeatherDescription(code) {
  const codes = {
    0: 'clear sky',
    1: 'mainly clear',
    2: 'partly cloudy',
    3: 'overcast',
    45: 'fog',
    48: 'depositing rime fog',
    51: 'light drizzle',
    53: 'moderate drizzle',
    55: 'dense drizzle',
    61: 'slight rain',
    63: 'moderate rain',
    65: 'heavy rain',
    71: 'slight snow',
    73: 'moderate snow',
    75: 'heavy snow',
    95: 'thunderstorm'
  };
  return codes[code] || 'unknown';
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Using Open-Meteo as fallback (no API key required)');
});