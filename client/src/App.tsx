import { BrowserRouter, Route } from 'react-router-dom';
import React from 'react';
import './App.css';
import FirstGraph from './firstchart/FirstGraph';
import RaceChart from './barChartRace/RaceChart';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={FirstGraph} />
      <Route path="/home" exact component={FirstGraph} />
      <Route path="/race" exact component={RaceChart} />
    </BrowserRouter>
  );
}

export default App;
