import React, { useState,useEffect} from 'react';
import {sortData,prettyPrintStat } from "./util"
import InfoBox from "./InfoBox"
import Map from "./Map"
import Table from "./Table"
import LineGraph from "./LineGraph"
import "./App.css"
import {Card,FormControl,Select,MenuItem, CardContent} from "@material-ui/core"
import "leaflet/dist/leaflet.css";
import Circular from "./Circular";
// https://disease.sh/v3/covid-19/countries
function App() {
  const [countries,setCountries]=useState([])
  const [country,setCountry]=useState('worldwide')
  const [countryInfo,setCountryInfo]=useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({
    lat: 20.5937,
    lng: 78.9629,
  });

  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const[casesType,setCasesType]=useState("cases")

  useEffect(() => {
    const getCountriesData = async() =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries =data.map((country)=>(
          { 
            name:country.country,//United States
            value:country.countryInfo.iso2//US
          }))
          
          const sortedData=sortData(data)
          setTableData(sortedData)
          
          setMapCountries(data)
          setCountries(countries)
      }) 
    }

    getCountriesData()
  },[countries])

  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then((data)=>{
      setCountryInfo(data)


    })
  },[])

  const onCountryChange = async (event) =>{
    const countryCode= event.target.value
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data =>{
      setCountry(countryCode)
      setCountryInfo(data)

      setMapCenter([data.countryInfo?.lat, data?.countryInfo?.long])
      console.log(data)
      setMapZoom(4)
    })
  }



  return (
    <>
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              onChange={onCountryChange}
              variant="outlined"
              value={country}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
              {/* <MenuItem value="WorldWide">Worldwide</MenuItem>
            <MenuItem value="WorldWide">opt2</MenuItem>
            <MenuItem value="WorldWide">opt3</MenuItem>
            <MenuItem value="WorldWide">Yoooo</MenuItem> */}
            </Select>
          </FormControl>
        </div>

        {/* Header */}
        {/* Title */}

        {/* InfoBoxs */}
        <div className="app__stats">
          <InfoBox
            isRed
            onClick={e =>setCasesType("cases")}
            title="Coronavirus Cases (today)"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
            active={casesType==="cases"}
          />
          <InfoBox
            active={casesType === "recoverd"}
            onClick={e => setCasesType("recovered")}
            title="Recovered (today)"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deats"}
            onClick={e => setCasesType("deaths")}
            title="Deaths (today)"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        {/* InfoBoxs */}
        {/* InfoBoxs */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
           <header>
      <div class="logo">
        <img src="https://raw.githubusercontent.com/mrisham/cd/main/COVID-19_TRACKER_HTML_CSS_JAVASCRIPT-master/resources/img/logo.png" alt="" />
        <p>COVID-19<br />STATS</p>
      </div>
      <nav>
        <ul>
          <li><a href="">HOME</a></li>
          <li><a href="https://drive.google.com/drive/folders/1QxpEEn1a1Q2-0euaEZrjMrRFWb9SzQfq?usp=sharing"target="popup">CIRCULARS</a></li>
        </ul>
      </nav>
    </header>
          <h3 className="graphTitle">Live Cases by country</h3>
          <Table countries={tableData} />
          <h3>WorldWide  {casesType}</h3>
          <LineGraph casesType={casesType} className="app__graph"/>
          {/* <LineGraph /> */}
        </CardContent>
      </Card>
      
      
    </div>
    <Circular />

    
    </>
  );
}

export default App;
