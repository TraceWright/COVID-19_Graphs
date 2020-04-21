import { BrowserRouter, Route } from 'react-router-dom';
import React from 'react';
import './App.css';
import LineChart from './lineChart/LineChart';
import RaceChart from './barRaceChart/RaceChart';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={LineChart} />
      <Route path="/home" exact component={LineChart} />
      <Route path="/race" exact component={RaceChart} />
    </BrowserRouter>
  );
}

export default App;
