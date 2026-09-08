import { useState, useEffect } from 'react'
import { getWeather } from '../api/platform'

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState('Delhi')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadWeather() }, [city])

  async function loadWeather() {
    setLoading(true)
    try {
      const data = await getWeather(city)
      setWeather(data)
    } catch { /* backend offline */ }
    setLoading(false)
  }

  const aqiColors = { Good: '#10B981', Moderate: '#F59E0B', Unhealthy: '#EF4444', Hazardous: '#7C2D12' }

  return (
    <div className="weather-widget">
      <div className="weather-widget__header">
        <span className="overline-dot" style={{ margin: 0 }}>Weather & AQI</span>
        <select className="input" value={city} onChange={e => setCity(e.target.value)}
          style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.6875rem' }}>
          {['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Loading...</p>}

      {weather && !loading && (
        <>
          <div className="weather-widget__current">
            <div className="weather-widget__temp">
              <span className="weather-widget__temp-value">{weather.temperature_c}°</span>
              <span className="weather-widget__condition">{weather.condition}</span>
            </div>
            <div className="weather-widget__details">
              <div className="weather-widget__detail">
                <span className="caption">Feels like</span>
                <span className="weather-widget__detail-value">{weather.feels_like_c}°C</span>
              </div>
              <div className="weather-widget__detail">
                <span className="caption">Humidity</span>
                <span className="weather-widget__detail-value">{weather.humidity}%</span>
              </div>
              <div className="weather-widget__detail">
                <span className="caption">Wind</span>
                <span className="weather-widget__detail-value">{weather.wind_kph} km/h</span>
              </div>
            </div>
          </div>

          <div className="weather-widget__aqi">
            <span className="weather-widget__aqi-label">AQI</span>
            <span className="weather-widget__aqi-value" style={{ color: aqiColors[weather.aqi_level] || '#F59E0B' }}>
              {weather.aqi}
            </span>
            <span className="weather-widget__aqi-level" style={{ color: aqiColors[weather.aqi_level] || '#F59E0B' }}>
              {weather.aqi_level}
            </span>
          </div>

          <div className="weather-widget__forecast">
            {weather.forecast?.map((day, i) => (
              <div key={i} className="weather-widget__forecast-day">
                <span className="weather-widget__forecast-name">{day.day}</span>
                <span className="weather-widget__forecast-condition">{day.condition}</span>
                <span className="weather-widget__forecast-temps">{day.high}° / {day.low}°</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
