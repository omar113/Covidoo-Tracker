import "./App.css";
import { sortData, printStats } from "./util";
import Graph from "./components/Graph";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import { React, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";
import "leaflet/dist/leaflet.css";
import Logo from "./Covidoo Logo.png";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [selectedBox, setSelectedBox] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countriesData = data.map((countryData) => ({
            name: countryData.country,
            value: countryData.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countriesData);
          setMapCountries(data);
        });
    };
    getCountries();
  }, []);

  const onSelectChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        const coordinates =
          countryCode === "worldwide"
            ? [34.80746, -40.4796]
            : [data.countryInfo.lat, data.countryInfo.long];

        setMapCenter(coordinates);
        setMapZoom(4);
      });
    if (countryCode === "worldwide") {
      setMapCenter();
    }
  };
  return (
    <div className="App">
      <div className="Main">
        <div className="Header">
          <img src={Logo} className="Logo" alt="Logo" />
          <FormControl className="Dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onSelectChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((countryData) => (
                <MenuItem value={countryData.value}>
                  {countryData.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="Stats">
          <InfoBox
            isRed
            active={selectedBox === "cases"}
            onClick={(e) => setSelectedBox("cases")}
            title="Cases"
            cases={printStats(countryInfo.todayCases)}
            total={countryInfo.cases}
          />
          <InfoBox
            active={selectedBox === "recovered"}
            onClick={(e) => setSelectedBox("recovered")}
            title="Recovered"
            cases={printStats(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          />
          <InfoBox
            isRed
            active={selectedBox === "deaths"}
            onClick={(e) => setSelectedBox("deaths")}
            title="Deaths"
            cases={printStats(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
          />
        </div>
        <Map
          casesType={selectedBox}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>
      <Card className="Secondary">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData} />
          <h3 className={"GraphTitle"}>Worldwide New Cases</h3>
          <Graph casesType={selectedBox} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
