import React from 'react';
import StockWidget from '../StockWidget/StockWidget';
import WeatherWidget from '../WeatherWidget/WeatherWidget';
import NewsWidget from '../Newswidget/NewsWidget';
import ExpenseWidget from '../Expensewidget/ExpenseWidget';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Personal Finance Dashboard</h1>
        <div className="header-info">
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </header>
      
      <div className="dashboard-grid">
        <div className="widget">
          <StockWidget />
        </div>
        
        <div className="widget weather-widget-container">
          <WeatherWidget />
        </div>
        
        <div className="widget">
          <NewsWidget />
        </div>
        
        <div className="widget">
          <ExpenseWidget />
        </div>
      </div>
      
      <footer className="dashboard-footer">
        <p>Built with ❤️ using React | Real-time data integration | Responsive design</p>
        <div className="tech-stack">
          <span>React</span>
          <span>CSS3</span>
          <span>JavaScript</span>
          <span>APIs</span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;