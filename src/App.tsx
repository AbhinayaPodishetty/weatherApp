import React, { useState } from "react";
import "./styles.css"; // Import CSS file

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    try {
      setError("");
      setWeather(null);
      setLoading(true); // Step 1: Get coordinates

      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found!");
        setLoading(false);
        return;
      }

      const { latitude, longitude, country } = geoData.results[0]; // Step 2: Get weather

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({ ...weatherData.current_weather, country });
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch weather data.");
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="title">🌤 Weather Now</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Get Weather</button>
      </div>
      {loading && <p className="loading">Fetching weather...</p>}
      {error && <p className="error">{error}</p>}
      {weather && (
        <div className="card">
          <h2>
            Weather in {city}, {weather.country}
          </h2>
          <p>🌡 Temperature: {weather.temperature}°C</p>
          <p>💨 Wind Speed: {weather.windspeed} km/h</p>
        </div>
      )}
    </div>
  );
}

export default App;
