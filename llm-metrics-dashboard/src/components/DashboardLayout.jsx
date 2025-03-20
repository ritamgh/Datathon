import { useState } from "react";
import BiasHeatmap from "./BiasHeatmap";
import BiasRadarChart from "./BiasRadarChart";
import PerformanceGauges from "./PerformanceGauges";
import QueryInterface from "./QueryInterface";

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            <div className="dashboard-header">
              <h1>LLM Metrics Dashboard - Llama 3.2</h1>
              <p>
                Monitoring bias, performance, and other key metrics for your
                local Ollama instance
              </p>
            </div>

            <div className="metrics-section">
              <PerformanceGauges />
            </div>

            <div className="metrics-section">
              <BiasHeatmap />
            </div>

            <div className="metrics-section">
              <BiasRadarChart />
            </div>
          </>
        );
      case "bias":
        return (
          <>
            <div className="dashboard-header">
              <h1>Bias Metrics</h1>
              <p>
                Detailed analysis of biases across demographic groups and topics
              </p>
            </div>

            <div className="metrics-grid">
              <BiasHeatmap />
              <BiasRadarChart />
            </div>
          </>
        );
      case "performance":
        return (
          <>
            <div className="dashboard-header">
              <h1>Performance Metrics</h1>
              <p>
                Model performance indicators including accuracy, hallucination
                rate, and toxicity
              </p>
            </div>

            <PerformanceGauges />
          </>
        );
      case "query":
        return (
          <>
            <div className="dashboard-header">
              <h1>Query LLM</h1>
              <p>
                Test the model with custom prompts and analyze its responses
              </p>
            </div>

            <QueryInterface />
          </>
        );
      default:
        return <div>Select a tab to view metrics</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <ul>
          <li
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </li>
          <li
            className={activeTab === "bias" ? "active" : ""}
            onClick={() => setActiveTab("bias")}
          >
            Bias Metrics
          </li>
          <li
            className={activeTab === "performance" ? "active" : ""}
            onClick={() => setActiveTab("performance")}
          >
            Performance
          </li>
          <li
            className={activeTab === "query" ? "active" : ""}
            onClick={() => setActiveTab("query")}
          >
            Query LLM
          </li>
        </ul>
      </nav>

      <main className="dashboard-content">{renderContent()}</main>
    </div>
  );
};

export default DashboardLayout;
