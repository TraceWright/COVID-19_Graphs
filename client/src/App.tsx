import { BrowserRouter, Route } from 'react-router-dom';
import React from 'react';
import './App.css';
import FirstGraph from './firstchart/FirstGraph';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={FirstGraph} />
      <Route path="/home" exact component={FirstGraph} />
    </BrowserRouter>
  );
}

export default App;
