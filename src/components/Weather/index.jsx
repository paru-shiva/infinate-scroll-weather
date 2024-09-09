import "./index.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../Header";
import { DNA } from "react-loader-spinner";

const Weather = () => {
  const params = useParams();
  const { id } = params;

  const [weatherData, changeWeatherData] = useState(undefined);
  const [loading, changeLoading] = useState(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      changeLoading(true);
      const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=geoname_id%2C%20ascii_name%2C%20cou_name_en%2C%20timezone%2C%20coordinates&where=geoname_id%20%3D%20${id}&limit=20`;
      const response = await fetch(url);
      const result = await response.json();
      const coordinates = result.results[0].coordinates;
      const weatherAPI = `https://api.weatherapi.com/v1/current.json?key=8a0442b569ea44a0a6154322240909&q=${coordinates.lat},${coordinates.lon}&aqi=no`;

      const resp = await fetch(weatherAPI, {
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      const resu = await resp.json();

      changeWeatherData(resu);
      changeLoading(false);
    };
    fetchCoordinates();
  }, []);

  const renderWeatherCard = () => {
    if (weatherData != undefined) {
      const { name, country, localtime } = weatherData.location;
      const {
        feelslike_c,
        feelslike_f,
        humidity,
        cloud,
        last_updated,
        temp_c,
        temp_f,
        wind_dir,
        wind_kph,
        condition,
      } = weatherData.current;
      const { icon, text } = condition;

      return (
        <div className="weatherInfoDiv">
          <h2 className="weatherHeading">{`Current Weather for ${name} (${country})`}</h2>
          <div className="weatherCard">
            <h4 className="cardHeading">Current Weather Information</h4>
            <div className="weatherData">
              <p className="dataHead">Local Time: </p>
              <p>{localtime}</p>
            </div>
            <div className="weatherData">
              <img src={icon} className="weatherIcon" />
            </div>
            <div className="weatherData">
              <p className="dataHead">Condition: </p>
              <p>{text}</p>
            </div>
            <div className="weatherData">
              <p className="dataHead">Humidity: </p>
              <p>{humidity}</p>
            </div>
            <div className="weatherData">
              <p className="dataHead">Temparature Fº: </p>
              <p>{temp_f}</p>
            </div>
            <div className="weatherData">
              <p className="dataHead">Temparature Cº: </p>
              <p>{temp_c}</p>
            </div>
            <div className="weatherData">
              <p className="dataHead">Clouds: </p>
              <p>{cloud}</p>
            </div>
            <div className="weatherData">
              <p className="dataHead">Wind Direction: </p>
              <p>{wind_dir}</p>
            </div>
            <div className="weatherData">
              <p className="dataHead">Wind Speed: </p>
              <p>{wind_kph} kph </p>
            </div>
            <div className="weatherData">
              <p className="dataHead">Last Updated: </p>
              <p>{last_updated}</p>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="weatherComponent">
      <Header />
      {loading ? <DNA /> : renderWeatherCard()}
    </div>
  );
};

export default Weather;
