import react from "react";
import './Dashboard.css';
import StockWidget from "../StockWidget/StockWidget";


const Dashboard = () => {
    
    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Personal Finance Dashboard </h1>
                <div className="header-info">
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
            </header>
        

            <div className="dashboard-grid">
                <div className="widget ">
                    <StockWidget/>
                </div>

                <div className="widget weather-widget">
                    <h3>Weather</h3>
                    <p>Loading Weather..</p>
                </div>

                <div className="widget news-widget">

                    <h3>Financial News</h3>
                    <p>Loading News..</p>
                </div>

                <div className="widget expense-widget">
                    <h3>Expense Tracker</h3>
                    <p>Loading Expenses</p>
                </div>
            </div>
            
        </div>    
    )
}

export default Dashboard;