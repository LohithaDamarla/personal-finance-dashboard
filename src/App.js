import React from 'react';
import './Styles/globals.css';
import Dashboard from './Components/Dashboard/Dashboard';
import StockWidget from './Components/StockWidget/StockWidget';
import WeatherWidget from './Components/WeatherWidget/WeatherWidget';
import NewsWidget from './Components/Newswidget/NewsWidget';
import ExpenseWidget from './Components/Expensewidget/ExpenseWidget';


function App() {
  return (
    <div className="App">
      
      <Dashboard />
      <StockWidget />
      <WeatherWidget />
      <NewsWidget />
      <ExpenseWidget/>
    </div>
  );
}

export default App;
