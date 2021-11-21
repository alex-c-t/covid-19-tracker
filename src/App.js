import { Card, CardContent, FormControl, List, MenuItem, Select } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Map from './Map';
import Tables from './Tables';
import {prettyPrintStat, sortData} from './utils';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])
  const [center, setCenter] = useState({lat: 10.8505, lng: 76.2711})
  const [mapZoom, setmapZoom] = useState(2)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases');
  const [worldwideCases, setWorldWideCases] = useState([])

  useEffect(() =>{
    const getCountriesData = async () =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then(response => response.json())
      .then((data)=>{
        // mapping only the neccessary details for each country.
        const countries1 = data.map((country)=>(
          {
            name:country.country, //United Kingdom
            value: country.countryInfo.iso3 // UK
          }
        ));
        const sortedData = sortData(data)
        //setting all countries list into usestate
        setTableData(sortedData);
        setMapCountries(data);
        setWorldWideCases(data);
        setCountries(countries1);
      })
      // getting worldwide data on first loading
      onCountryChange({target:{value:'worldwide'}})
    }
    getCountriesData();
    

  },[])

  const  onCountryChange = async(event) =>{
    // getting worldwide or specific country's covid-19 satus
    const countryCode = event.target.value;
    const url = countryCode==='worldwide' ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    // https://disease.sh/v3​/covid-19​/all
    // https://disease.sh/v3/covid-19/countries/{country}

    await fetch(url)
    .then(response => response.json())
    .then(data =>{
      setCountryInfo(data);
      setCountry(countryCode);
      if (countryCode !== 'worldwide'){
      setCenter([data.countryInfo.lat, data.countryInfo.long]);
      setmapZoom(3)
      setMapCountries([data]);
      }else{
        setmapZoom(1);
        setMapCountries(worldwideCases);
      }
      
    });

  };

   
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className = "app__dropdown">
            <Select 
            variant = "outlined"
            onChange = {onCountryChange}
            value = {country}
            >
              <MenuItem value = {'worldwide'}>WorldWide</MenuItem>
              {
                countries.map((country, index) =>(
                  <MenuItem key = {index} value = {country.value}>{country.name}</MenuItem>
                ))
              }

            </Select>
          </FormControl>
        </div>

      {/* {Header} */}
      {/* Title + Select input dropdown field */}
      
      <div className="app__stats">

        <InfoBox
        isOrange 
        active ={casesType==="cases"} 
        onClick ={(e)=>setCasesType('cases')} 
        title="Corona Cases" 
        cases = {prettyPrintStat(countryInfo.todayCases)} 
        total = {prettyPrintStat(countryInfo.cases)} 
        type = "Cases"
        />

        <InfoBox
        isGreen
        active ={casesType==="recovered"} 
        onClick ={(e)=>setCasesType('recovered')} 
        title="Recovered" 
        cases = {prettyPrintStat(countryInfo.todayRecovered)} 
        total = {prettyPrintStat(countryInfo.recovered)} 
        type ="Recovery"
        />

        <InfoBox
        isRed 
        active ={casesType==="deaths"} 
        onClick ={(e)=>setCasesType('deaths')} 
        title="Deaths" 
        cases = {prettyPrintStat(countryInfo.todayDeaths)} 
        total = {prettyPrintStat(countryInfo.deaths)} 
        type = "Deaths"
        />

      </div>
      
      

      {/* Map */}
      <Map
      countries = {mapCountries} 
      center = {center}
      zoom = {mapZoom}
      casesType= {casesType}
      />

      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Tables countries = {tableData} />
          <h3 className = "app_graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className = {"app__graph"} casesType= {casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
