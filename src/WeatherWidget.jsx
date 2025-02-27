import { useState, useEffect } from "react";
import "./WeatherWidget.css";

const KEY = "3d4e85f2055b43ca926154931251302";

export default function WeatherWidget({ onClose }) {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Ваш браузер не поддерживает геолокацию");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({
          latitude,
          longitude,
        });
      },
      (err) => {
        console.error("Ошибка геолокации", err.message);
        setError("Не удалось определить ваше местоположение");
      }
    );
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!city.trim() && !coords) {
      setWeatherData(null);
      setError(null);
      return;
    }

    async function getData() {
      setLoading(true);
      try {
        const query = city.trim()
          ? city
          : `${coords.latitude},${coords.longitude}`;
        const res = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${query}`,
          { signal }
        );
        const data = await res.json();

        if (data.error) {
          setError(data.error.message);
          setWeatherData(null);
        } else {
          setWeatherData(data);
          setError(null);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Не удалось получить данные о погоде");
          setWeatherData(null);
        }
      } finally {
        setLoading(false);
      }
    }

    getData();

    return () => {
      controller.abort();
    };
  }, [city, coords]);

  function renderError() {
    return <p className="weather-error">{error}</p>;
  }

  function renderLoading() {
    return <p className="weather-loading">Загрузка...</p>;
  }

  function renderWeather() {
    return (
      <div className="weather-card">
        <h2>
          {`${weatherData?.location?.name}, ${weatherData?.location?.country}`}
        </h2>
        <img
          src={`https:${weatherData?.current?.condition?.icon}`}
          alt="weather icon"
          className="weather-icon"
        />
        <p className="temperature">
          {Math.round(weatherData?.current?.temp_c)} °C
        </p>
        <p className="condition">{weatherData?.current?.condition?.text}</p>
        <div className="weather-details">
          <p>Humidity: {weatherData?.current?.humidity}%</p>
          <p>Wind: {weatherData?.current?.wind_kph} km/h</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-card-container">
        <button className="close-button-weather" onClick={onClose}>
          ×
        </button>
        <h1 className="app-title">Weather</h1>
        <div className="search-container">
          <input
            value={city}
            type="text"
            placeholder="Enter city name"
            className="search-input"
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        {error && renderError()}
        {loading && renderLoading()}
        {!loading && !error && weatherData && renderWeather()}
      </div>
    </div>
  );
}
