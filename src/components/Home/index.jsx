import "./index.css";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { DNA } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Header from "../Header";
import Weather from "../Weather";

const Home = () => {
  let sno = 0;
  const [citiesList, changeCitiesList] = useState([]);
  const [currentOffset, changeCurrentOffset] = useState(0);
  const [reachedBottom, changeReachedBottom] = useState(false);
  const [loading, changeLoading] = useState(true);
  const [searchWord, changeSearchWord] = useState("");
  const [emptyRecordsMsg, changeEmptyRecordsMsg] = useState("");
  const [cLat, changeClat] = useState("");
  const [cLon, changeClon] = useState("");
  const [weatherData, changeWeatherData] = useState(undefined);

  console.log(weatherData);

  useEffect(() => {
    const fetchCountriesData = async () => {
      const response = await fetch(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=geoname_id%2C%20ascii_name%2C%20cou_name_en%2C%20timezone%2C%20coordinates&limit=20&offset=${currentOffset}`
      );
      const result = await response.json();
      const newCountriesData = result.results;
      const totalNewCountries = [...citiesList, ...newCountriesData];
      changeCitiesList(totalNewCountries);

      const weatherAPI = `https://api.weatherapi.com/v1/current.json?key=8a0442b569ea44a0a6154322240909&q=${cLat},${cLon}&aqi=no`;

      const resp = await fetch(weatherAPI, {
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      const resu = await resp.json();

      changeWeatherData(resu);
    };

    fetchCountriesData();

    navigator.geolocation.getCurrentPosition((position) => {
      changeClat(position.coords.latitude);
      changeClon(position.coords.longitude);
    });
  }, []);

  useEffect(() => {
    const fetchCountriesData = async () => {
      changeCurrentOffset((pv) => pv + 20);
      const response = await fetch(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=geoname_id%2C%20ascii_name%2C%20cou_name_en%2C%20timezone%2C%20coordinates&limit=20&offset=${
          currentOffset + 20
        }`
      );
      const result = await response.json();
      const newCountriesData = result.results;
      const totalNewCountries = [...citiesList, ...newCountriesData];
      changeLoading(false);
      changeCitiesList(totalNewCountries);
    };

    if (reachedBottom) {
      changeLoading(true);
      fetchCountriesData();
    }
  }, [reachedBottom]);

  useEffect(() => {
    const onscroll = () => {
      const scrolledTo = window.scrollY + window.innerHeight;
      const threshold = 300;
      const isReachBottom =
        document.body.scrollHeight - threshold <= scrolledTo;
      if (isReachBottom) {
        changeReachedBottom(true);
      } else {
        changeReachedBottom(false);
      }
    };
    window.addEventListener("scroll", onscroll);
    return () => {
      window.removeEventListener("scroll", onscroll);
    };
  }, []);

  useEffect(() => {
    const doSearch = async () => {
      changeLoading(true);
      const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=geoname_id%2C%20ascii_name%2C%20cou_name_en%2C%20timezone%2C%20coordinates&where=ascii_name%20like%20%27${searchWord}%27&limit=8`;
      const response = await fetch(url);
      const result = await response.json();
      const searchedList = result.results;
      changeCitiesList(searchedList);
      if (searchedList.length === 0) {
        changeEmptyRecordsMsg("No Data Found, Enter Full Name Without Typos.");
      } else {
        changeEmptyRecordsMsg("");
      }
    };
    if (searchWord === "") {
      const fetchCountriesData = async () => {
        const response = await fetch(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=geoname_id%2C%20ascii_name%2C%20cou_name_en%2C%20timezone%2C%20coordinates&limit=20&offset=0`
        );
        const result = await response.json();
        const newCountriesData = result.results;
        const totalNewCountries = [...citiesList, ...newCountriesData];
        changeCitiesList(totalNewCountries);
      };
      fetchCountriesData();
    } else {
      doSearch();
      changeLoading(false);
    }
  }, [searchWord]);

  const renderCitiesTable = () => {
    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th className="bg-dark text-white" scope="col">
                #
              </th>
              <th className="bg-dark text-white" scope="col">
                City Name
              </th>
              <th className="bg-dark text-white" scope="col">
                Country
              </th>
              <th className="bg-dark text-white" scope="col">
                Time Zone
              </th>
            </tr>
          </thead>
          <tbody>
            {citiesList.map((ei) => {
              sno += 1;
              return (
                <tr key={uuidv4()}>
                  <th scope="row">{sno}</th>
                  <td>
                    <Link className="cityName" to={`/weather/${ei.geoname_id}`}>
                      {ei.ascii_name}
                    </Link>
                  </td>
                  <td className="country">{ei.cou_name_en}</td>
                  <td>{ei.timezone}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading && (
          <DNA
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        )}
      </>
    );
  };

  const onSearchInput = (e) => {
    changeSearchWord(e.target.value);
  };

  return (
    <div className="homeComponent">
      <Header />
      <div className="citiesSection">
        <input
          onChange={onSearchInput}
          value={searchWord}
          className="form-control cityInput"
          type="text"
          placeholder="Search City Name"
        />
        {renderCitiesTable()}
        <div>
          <p>{emptyRecordsMsg}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
