import { useState } from "react";
import BiasHeatmap from "./BiasHeatmap";
import BiasRadarChart from "./BiasRadarChart";
import PerformanceGauges from "./PerformanceGauges";
import QueryInterface from "./QueryInterface";

/**
 * DashboardLayout Component
 *
 * Main layout component that manages navigation between different
 * sections of the LLM metrics dashboard.
 */
const DashboardLayout = () => {
  // State to track which tab is currently active
  const [activeTab, setActiveTab] = useState("overview");

  /**
   * Renders the appropriate content based on the active tab
   * @returns {JSX.Element} The content for the active tab
   */
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
        return <div className="empty-state">Select a tab to view metrics</div>;
    }
  };

  // Tab item configuration for cleaner rendering
  const tabItems = [
    { id: "overview", label: "Overview" },
    { id: "bias", label: "Bias Metrics" },
    { id: "performance", label: "Performance" },
    { id: "query", label: "Query LLM" },
  ];

  return (
    <div className="dashboard-container">
      {/* Navigation sidebar */}
      <nav className="dashboard-nav">
        <ul>
          {tabItems.map((tab) => (
            <li
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content area */}
      <main className="dashboard-content">{renderContent()}</main>
    </div>
  );
};

export default DashboardLayout;
