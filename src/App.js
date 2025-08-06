import React from 'react';
import './Styles/globals.css';
import Dashboard from './Components/Dashboard/Dashboard';
import StockWidget from './Components/StockWidget/StockWidget';

function App() {
  return (
    <div className="App">
      
      <Dashboard />
      <StockWidget />
    </div>
  );
}

export default App;
