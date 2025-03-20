import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import BiasHeatmap from "./Components/BiasHeatmap";
import BiasRadarChart from "./Components/BiasRadarChart";
import PerformanceGauges from "./Components/PerformanceGauges";
import QueryInterface from "./Components/QueryInterface";
// Import the API service
import { fetchAggregatedMetrics } from "./services/api";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    fetchMetricsData();

    // Set up real-time updates
    const intervalId = setInterval(() => {
      fetchMetricsData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  const fetchMetricsData = async () => {
    try {
      setLoading(true);
      // Use the API service function instead of fetch directly
      const data = await fetchAggregatedMetrics();
      setMetricsData(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading metrics data...</div>;
    }

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
              <PerformanceGauges data={metricsData?.performance} />
            </div>

            <div className="metrics-section">
              <BiasHeatmap data={metricsData?.bias} />
            </div>

            <div className="metrics-section">
              <BiasRadarChart data={metricsData?.biasRadar} />
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
              <BiasHeatmap data={metricsData?.bias} />
              <BiasRadarChart data={metricsData?.biasRadar} />
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

            <PerformanceGauges data={metricsData?.performance} />
          </>
        );

      case "query":
        return (
          <>
            <div className="dashboard-header">
              <h1>Query Interface</h1>
              <p>
                Test the model with your own prompts and see real-time metrics
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
    <div className="llm-dashboard">
      <nav className="dashboard-nav">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "bias" ? "active" : ""}
          onClick={() => setActiveTab("bias")}
        >
          Bias
        </button>
        <button
          className={activeTab === "performance" ? "active" : ""}
          onClick={() => setActiveTab("performance")}
        >
          Performance
        </button>
        <button
          className={activeTab === "query" ? "active" : ""}
          onClick={() => setActiveTab("query")}
        >
          Query
        </button>
      </nav>

      <div className="dashboard-content">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
