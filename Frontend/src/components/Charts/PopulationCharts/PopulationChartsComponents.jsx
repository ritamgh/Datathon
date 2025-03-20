import React, { useState, useEffect } from "react";
import "./PopulationChartComponents.css";

const PopulationChartComponent = ({ title, description }) => {
  // State management
  const [chartData, setChartData] = useState([
    {
      bar2010: { height: 120, start: 165 },
      bar2011: { height: 0, start: 0 },
      bar2012: { height: 110, start: 45 },
    },
    {
      bar2010: { height: 140, start: 150 },
      bar2011: { height: 90, start: 50 },
      bar2012: { height: 0, start: 0 },
    },
    {
      bar2010: { height: 80, start: 180 },
      bar2011: { height: 130, start: 50 },
      bar2012: { height: 0, start: 0 },
    },
    {
      bar2010: { height: 100, start: 160 },
      bar2011: { height: 0, start: 0 },
      bar2012: { height: 120, start: 40 },
    },
    {
      bar2010: { height: 130, start: 160 },
      bar2011: { height: 0, start: 0 },
      bar2012: { height: 90, start: 60 },
    },
    {
      bar2010: { height: 0, start: 0 },
      bar2011: { height: 140, start: 50 },
      bar2012: { height: 80, start: 200 },
    },
    {
      bar2010: { height: 110, start: 150 },
      bar2011: { height: 0, start: 0 },
      bar2012: { height: 130, start: 40 },
    },
    {
      bar2010: { height: 90, start: 190 },
      bar2011: { height: 110, start: 70 },
      bar2012: { height: 0, start: 0 },
    },
    {
      bar2010: { height: 120, start: 160 },
      bar2011: { height: 0, start: 0 },
      bar2012: { height: 100, start: 50 },
    },
    {
      bar2010: { height: 0, start: 0 },
      bar2011: { height: 120, start: 60 },
      bar2012: { height: 140, start: 180 },
    },
    {
      bar2010: { height: 130, start: 140 },
      bar2011: { height: 0, start: 0 },
      bar2012: { height: 120, start: 40 },
    },
  ]);
  const [activeYears, setActiveYears] = useState({
    2010: true,
    2011: true,
    2012: true,
  });
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState("sample");

  // Helper function to add dots to bars
  const renderDots = (barData, color, animate, index) => {
    return (
      <>
        <div
          className="dot"
          style={{
            backgroundColor: color,
            left: "4px",
            bottom: animate
              ? barData.start + "px"
              : barData.start + barData.height - 4 + "px",
            transition: animate ? "bottom 1s ease-out" : "none",
            animation: "fadeIn 0.5s forwards",
            transitionDelay: animate ? `${100 * index + 100}ms` : "0ms",
          }}
        />
        <div
          className="dot"
          style={{
            backgroundColor: color,
            left: "4px",
            bottom: animate ? barData.start + "px" : barData.start - 4 + "px",
            transition: animate ? "bottom 1s ease-out" : "none",
            animation: "fadeIn 0.5s forwards",
            transitionDelay: animate ? `${100 * index + 100}ms` : "0ms",
          }}
        />
      </>
    );
  };

  // Function to render a bar
  const renderBar = (barData, barClass, color, animate, index) => {
    if (barData.height <= 0) return null;

    return (
      <>
        <div
          className={`bar ${barClass}`}
          style={{
            height: animate ? "0px" : barData.height + "px",
            bottom: barData.start + "px",
            transition: "height 1s ease-out, bottom 1s ease-out",
            animation: "fadeIn 0.5s forwards",
            transitionDelay: animate ? `${100 * index}ms` : "0ms",
          }}
          ref={(el) => {
            if (el && animate) {
              setTimeout(() => {
                el.style.height = barData.height + "px";
              }, 100 * index);
            }
          }}
        />
        {renderDots(barData, color, animate, index)}
      </>
    );
  };

  // Function to generate data
  const generatePopulationData = () => {
    return Array(11)
      .fill(0)
      .map(() => ({
        bar2010: {
          height: Math.floor(Math.random() * 100) + 50,
          start: Math.floor(Math.random() * 100) + 50,
        },
        bar2011: {
          height: Math.floor(Math.random() * 100) + 50,
          start: Math.floor(Math.random() * 100) + 50,
        },
        bar2012: {
          height: Math.floor(Math.random() * 100) + 50,
          start: Math.floor(Math.random() * 100) + 50,
        },
      }));
  };

  const generateEconomicData = () => {
    return Array(11)
      .fill(0)
      .map(() => ({
        bar2010: {
          height: Math.floor(Math.random() * 50) + 50,
          start: 50,
        },
        bar2011: {
          height: Math.floor(Math.random() * 50) + 75,
          start: 50,
        },
        bar2012: {
          height: Math.floor(Math.random() * 50) + 100,
          start: 50,
        },
      }));
  };

  const generateCustomData = () => {
    return Array(11)
      .fill(0)
      .map(() => ({
        bar2010: {
          height: Math.floor(Math.random() * 150) + 30,
          start: Math.floor(Math.random() * 150) + 30,
        },
        bar2011: {
          height: Math.floor(Math.random() * 150) + 30,
          start: Math.floor(Math.random() * 150) + 30,
        },
        bar2012: {
          height: Math.floor(Math.random() * 150) + 30,
          start: Math.floor(Math.random() * 150) + 30,
        },
      }));
  };

  // Function to normalize data
  const normalizeData = (data) => {
    return data.map((group) => {
      const newGroup = { ...group };
      ["bar2010", "bar2011", "bar2012"].forEach((barKey) => {
        if (newGroup[barKey].height > 0) {
          if (newGroup[barKey].height + newGroup[barKey].start > 280) {
            newGroup[barKey].height = 280 - newGroup[barKey].start;
          }
          if (newGroup[barKey].height < 20) {
            newGroup[barKey].height = 20;
          }
        }
      });
      return newGroup;
    });
  };

  // Function to fetch data
  const fetchDataFromSource = async (source) => {
    setLoading(true);

    try {
      // Simulate API delay
      return new Promise((resolve) => {
        setTimeout(() => {
          let newData;

          switch (source) {
            case "population":
              newData = generatePopulationData();
              break;
            case "economic":
              newData = generateEconomicData();
              break;
            case "custom":
              newData = generateCustomData();
              break;
            default:
              // Clone current data
              newData = chartData.map((group) => ({
                bar2010: { ...group.bar2010 },
                bar2011: { ...group.bar2011 },
                bar2012: { ...group.bar2012 },
              }));
          }

          resolve(newData);
        }, 1200);
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    const newData = await fetchDataFromSource(dataSource);
    setChartData(normalizeData(newData));
  };

  // Handle animate button click
  const handleAnimate = () => {
    // Force re-render with animation
    setChartData([...chartData]);
  };

  // Handle data source change
  const handleDataSourceChange = async (e) => {
    const source = e.target.value;
    setDataSource(source);
    const newData = await fetchDataFromSource(source);
    setChartData(normalizeData(newData));
  };

  // Toggle year visibility when clicking legend items
  const toggleYear = (year) => {
    setActiveYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  // Set up real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      if (dataSource !== "sample") {
        const newData = await fetchDataFromSource(dataSource);
        setChartData(normalizeData(newData));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [dataSource]);

  return (
    <div className="population-chart-component">
      <div className="header">
        <h1>America</h1>
        <div className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className="controls">
        <button
          className={`btn ${loading ? "pulse" : ""}`}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh Data
        </button>
        <button className="btn" onClick={handleAnimate}>
          Animate
        </button>
        {loading && <span className="loading-indicator">Updating...</span>}
      </div>

      <div className="data-source">
        <span>Data Source:</span>
        <select
          value={dataSource}
          onChange={handleDataSourceChange}
          disabled={loading}
        >
          <option value="sample">Sample Data</option>
          <option value="population">Population Growth</option>
          <option value="economic">Economic Indicators</option>
          <option value="custom">Custom API</option>
        </select>
      </div>

      <div className="chart-container">
        {chartData.map((group, index) => (
          <div className="bar-group" key={index}>
            {activeYears["2010"] &&
              renderBar(group.bar2010, "bar-2010", "#ff3385", true, index)}
            {activeYears["2011"] &&
              renderBar(group.bar2011, "bar-2011", "#8022ef", true, index + 2)}
            {activeYears["2012"] &&
              renderBar(group.bar2012, "bar-2012", "#ffcc00", true, index + 4)}
          </div>
        ))}
      </div>

      <div className="legend">
        <div
          className={`legend-item ${activeYears["2010"] ? "active" : ""}`}
          onClick={() => toggleYear("2010")}
        >
          <div
            className="legend-color"
            style={{ backgroundColor: "#ff3385" }}
          ></div>
          <div className="legend-text">2010</div>
        </div>
        <div
          className={`legend-item ${activeYears["2011"] ? "active" : ""}`}
          onClick={() => toggleYear("2011")}
        >
          <div
            className="legend-color"
            style={{ backgroundColor: "#8022ef" }}
          ></div>
          <div className="legend-text">2011</div>
        </div>
        <div
          className={`legend-item ${activeYears["2012"] ? "active" : ""}`}
          onClick={() => toggleYear("2012")}
        >
          <div
            className="legend-color"
            style={{ backgroundColor: "#ffcc00" }}
          ></div>
          <div className="legend-text">2012</div>
        </div>
      </div>

      <div className="chart-title">{title || "Historic World Population"}</div>
      <div className="chart-description">
        {description ||
          "Real-time visualization of population data across different regions. Toggle years to compare trends and patterns."}
      </div>
    </div>
  );
};

export default PopulationChartComponent;
