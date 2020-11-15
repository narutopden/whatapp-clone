import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    fetch(
      "https://cors-anywhere.herokuapp.com/" +
        "https://disease.sh/v3/covid-19/all"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch(
        "https://cors-anywhere.herokuapp.com/" +
          "https://disease.sh/v3/covid-19/countries"
      )
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    // setCountry(countryCode);
    var proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(proxyUrl + url)
      .then((response) => response.json())
      .then((data) => {
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setCountry(countryCode);
        setCountryInfo(data);
        console.log(data);
        // console.log(mapCenter);
        setMapZoom(5);
        // console.log({mapZoom});
      });
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((countries) => (
                <MenuItem value={countries.value}>{countries.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__infobox">
          <InfoBox
          onClick={e => setCasesType('cases')}
            title="Corona Virus"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
          onClick={e => setCasesType('recovered')}
            title="Recoverd"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
          onClick={e => setCasesType('deaths')}
            title="Death"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h2>live cases by country</h2>
          <Table countries={tableData} />
          <h2>live cases by country</h2>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
