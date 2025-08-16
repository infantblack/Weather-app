import { useState } from 'react'
import axios from 'axios'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async () => {
    if (!city) return
    setLoading(true)
    setError('')
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`/api/weather/${city}`),
        axios.get(`/api/forecast/${city}`)
      ])
      setWeather(weatherRes.data)
      setForecast(forecastRes.data)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch weather data')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">Weather App</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
            />
            <button
              onClick={fetchWeather}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Get Weather'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {weather && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">{weather.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">{Math.round(weather.main.temp)}°C</div>
                <div className="text-gray-600 capitalize">{weather.weather[0].description}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Feels like: {Math.round(weather.main.feels_like)}°C</div>
                <div className="text-sm text-gray-600">Humidity: {weather.main.humidity}%</div>
                <div className="text-sm text-gray-600">Pressure: {weather.main.pressure} hPa</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Wind: {weather.wind.speed} m/s</div>
                <div className="text-sm text-gray-600">Visibility: {weather.visibility / 1000} km</div>
                <div className="text-sm text-gray-600">Clouds: {weather.clouds.all}%</div>
              </div>
            </div>
          </div>
        )}

        {forecast && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">5-Day Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {forecast.list.filter((_, index) => index % 8 === 0).slice(0, 5).map((item, index) => (
                <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="font-semibold">{new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="text-2xl font-bold text-blue-600">{Math.round(item.main.temp)}°C</div>
                  <div className="text-sm text-gray-600 capitalize">{item.weather[0].description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App