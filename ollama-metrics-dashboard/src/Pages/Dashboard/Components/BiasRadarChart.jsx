import { useState, useEffect, useCallback } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { fetchRadarData, getCurrentModel } from "../services/api";

// Enhanced color palette with better visual contrast
const COLORS = [
  "#7F3FBF", // Rich purple
  "#00A9A5", // Teal
  "#FF6B8B", // Coral pink
  "#FFB000", // Amber
  "#4285F4", // Google blue
  "#0CCE6B", // Emerald
  "#EF5350", // Tomato red
  "#7E57C2", // Deep purple
];

// Define gradient IDs for each radar area
const GRADIENTS = [
  {
    id: "radarGradient1",
    startColor: "#7F3FBF",
    stopColor: "rgba(127, 63, 191, 0.1)",
  },
  {
    id: "radarGradient2",
    startColor: "#00A9A5",
    stopColor: "rgba(0, 169, 165, 0.1)",
  },
  {
    id: "radarGradient3",
    startColor: "#FF6B8B",
    stopColor: "rgba(255, 107, 139, 0.1)",
  },
  {
    id: "radarGradient4",
    startColor: "#FFB000",
    stopColor: "rgba(255, 176, 0, 0.1)",
  },
  {
    id: "radarGradient5",
    startColor: "#4285F4",
    stopColor: "rgba(66, 133, 244, 0.1)",
  },
  {
    id: "radarGradient6",
    startColor: "#0CCE6B",
    stopColor: "rgba(12, 206, 107, 0.1)",
  },
  {
    id: "radarGradient7",
    startColor: "#EF5350",
    stopColor: "rgba(239, 83, 80, 0.1)",
  },
  {
    id: "radarGradient8",
    startColor: "#7E57C2",
    stopColor: "rgba(126, 87, 194, 0.1)",
  },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="radar-custom-tooltip">
        <p className="tooltip-label">{payload[0].payload.subject}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="tooltip-item">
            <div
              className="tooltip-color"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="tooltip-name">{entry.name}: </span>
            <span className="tooltip-value">
              {typeof entry.value === "number"
                ? entry.value.toFixed(2)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const BiasRadarChart = () => {
  const [data, setData] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGroups, setActiveGroups] = useState({});
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [currentModelDisplay, setCurrentModelDisplay] = useState(
    getCurrentModel()
  );

  // Function to fetch data that can be called when model changes
  const fetchData = async () => {
    try {
      setLoading(true);
      const radarData = await fetchRadarData();
      setData(radarData);
      setCurrentModelDisplay(getCurrentModel());

      // Extract group names from the first data point
      if (radarData.length > 0) {
        const groups = Object.keys(radarData[0]).filter(
          (key) => key !== "subject"
        );
        setGroupNames(groups);

        // Initialize all groups as active
        const initialActiveState = {};
        groups.forEach((group) => {
          initialActiveState[group] = true;
        });
        setActiveGroups(initialActiveState);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch radar data on initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Set up event listener for model changes
  useEffect(() => {
    // Add event listener for model changes
    const handleModelChange = () => {
      fetchData();
    };

    window.addEventListener("model-change-event", handleModelChange);

    // Cleanup
    return () => {
      window.removeEventListener("model-change-event", handleModelChange);
    };
  }, []);

  // Handle legend item click
  const handleLegendClick = useCallback((group) => {
    setActiveGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  }, []);

  // Handle legend item hover
  const handleLegendHover = useCallback((group) => {
    setHoveredGroup(group);
  }, []);

  // Handle mouse leave from legend
  const handleLegendLeave = useCallback(() => {
    setHoveredGroup(null);
  }, []);

  // Custom legend component with enhanced styling
  const CustomizedLegend = () => {
    return (
      <div className="radar-legend">
        {groupNames.map((group, index) => {
          const isActive = activeGroups[group];
          const isHovered = hoveredGroup === group;
          const opacity = hoveredGroup
            ? isHovered
              ? 1
              : 0.3
            : isActive
            ? 1
            : 0.5;

          return (
            <div
              key={group}
              onClick={() => handleLegendClick(group)}
              onMouseEnter={() => handleLegendHover(group)}
              onMouseLeave={handleLegendLeave}
              className={`legend-item ${isActive ? "active" : ""} ${
                isHovered ? "hovered" : ""
              }`}
              style={{ opacity }}
            >
              <div
                className="legend-color"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="legend-text">{group}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Loading state
  if (loading)
    return (
      <div className="card loading-card">
        <div className="loading-spinner"></div>
        <p>Loading bias radar data...</p>
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="card error-card">
        <div className="error-icon">!</div>
        <h3>Unable to load radar chart</h3>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="card radar-card">
      <div className="card-header">
        <h2>Demographic Bias Analysis</h2>
        <p>Sentiment comparison across demographic groups and topics</p>
      </div>

      <div className="radar-chart-container">
        <ResponsiveContainer width="100%" height={450}>
          <RadarChart outerRadius={170} data={data}>
            {/* Define gradients for each radar area */}
            <defs>
              {GRADIENTS.map((gradient) => (
                <linearGradient
                  key={gradient.id}
                  id={gradient.id}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={gradient.startColor}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="100%"
                    stopColor={gradient.stopColor}
                    stopOpacity={0.2}
                  />
                </linearGradient>
              ))}
            </defs>

            {/* Chart grid and axes */}
            <PolarGrid stroke="#ccc" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#666", fontSize: 12 }}
              stroke="#888"
            />
            <PolarRadiusAxis
              angle={30}
              domain={[-1, 1]}
              tick={{ fill: "#666", fontSize: 11 }}
              stroke="#888"
              tickCount={5}
            />

            {/* Custom tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* Radar areas for each demographic group */}
            {groupNames.map((group, index) => {
              const isActive = activeGroups[group];
              const isHovered = hoveredGroup === group;
              const opacity = hoveredGroup
                ? isHovered
                  ? 0.8
                  : 0.2
                : isActive
                ? 0.6
                : 0;
              const strokeWidth = isHovered ? 3 : 2;

              return (
                isActive && (
                  <Radar
                    key={group}
                    name={group}
                    dataKey={group}
                    stroke={COLORS[index % COLORS.length]}
                    fill={`url(#${GRADIENTS[index % GRADIENTS.length].id})`}
                    fillOpacity={opacity}
                    strokeWidth={strokeWidth}
                    dot={true}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                  />
                )
              );
            })}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <CustomizedLegend />

      <div className="radar-insights">
        <div className="insight-item">
          <div className="insight-icon">💡</div>
          <div className="insight-content">
            <h4>Interpretation Guide</h4>
            <p>
              Positive values indicate favorable sentiment, while negative
              values represent potential bias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this CSS to your App.css or create a new CSS file and import it
const styles = `
  .radar-card {
    background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 12px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    border: 1px solid rgba(230,230,230,0.7);
    overflow: hidden;
  }

  .card-header {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }

  .card-header h2 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
    color: #333;
    font-weight: 600;
  }

  .card-header p {
    color: #666;
    margin: 0;
  }

  .radar-chart-container {
    padding: 0.5rem;
    background: rgba(250,250,252,0.5);
  }

  .radar-legend {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: 1rem 0;
    padding: 1rem;
    border-top: 1px solid rgba(0,0,0,0.05);
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin: 0.5rem 0.8rem;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(250,250,252,0.7);
    border: 1px solid rgba(0,0,0,0.05);
  }

  .legend-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  .legend-item.active {
    background: rgba(240,240,250,1);
  }

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
    border: 1px solid rgba(255,255,255,0.8);
  }

  .legend-text {
    font-size: 0.9rem;
    color: #444;
    font-weight: 500;
  }

  .radar-insights {
    padding: 1rem 2rem;
    margin-top: 0.5rem;
    border-top: 1px solid rgba(0,0,0,0.05);
  }

  .insight-item {
    display: flex;
    align-items: flex-start;
    margin: 0.8rem 0;
  }

  .insight-icon {
    font-size: 1.4rem;
    margin-right: 1rem;
  }

  .insight-content h4 {
    margin: 0 0 0.3rem 0;
    font-size: 1.1rem;
    color: #333;
  }

  .insight-content p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
  }

  .radar-custom-tooltip {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border: 1px solid #eee;
    min-width: 150px;
  }

  .tooltip-label {
    margin: 0 0 8px 0;
    padding-bottom: 6px;
    border-bottom: 1px solid #eee;
    font-weight: 600;
    color: #333;
  }

  .tooltip-item {
    display: flex;
    align-items: center;
    margin: 4px 0;
  }

  .tooltip-color {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .tooltip-name {
    color: #555;
    margin-right: 4px;
  }

  .tooltip-value {
    font-weight: 600;
    color: #333;
  }

  .loading-card, .error-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
  }

  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #3498db;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #f44336;
    color: white;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
  }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default BiasRadarChart;
