import React from "react";
import "./App.css";
import InteractiveBackground from "./components/Background/InteractiveBackground";
import Header from "./components/Header/Header";
import PopulationChartComponent from "./components/Charts/PopulationCharts/PopulationChartsComponents";

function App() {
  return (
    <div className="app">
      <InteractiveBackground />
      <Header />

      <main className="content">
        <h1 className="main-title">AI Bias Detection Dashboard</h1>

        <div className="dashboard-grid">
          {
            <div className="chart-container">
              <PopulationChartComponent
                title="Bias Metrics by Demographic"
                description="Visualization of bias across different demographic categories and LLM models."
              />
            </div>
          }

          {/* Add more chart components here as needed */}
        </div>
      </main>
    </div>
  );
}

export default App;
