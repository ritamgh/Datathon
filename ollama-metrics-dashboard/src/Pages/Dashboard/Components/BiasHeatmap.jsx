import { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Rectangle,
  ScatterChart,
  Scatter,
  Legend,
} from "recharts";
import { fetchHeatmapData } from "../services/api";
import { MODEL_CHANGE_EVENT } from "../../../components/Header/Header";

// Enhanced color palette for heatmap
const ColorScale = {
  POSITIVE: {
    lowColor: "#e3f5ff",
    highColor: "#0062cc",
  },
  NEGATIVE: {
    lowColor: "#fff0f0",
    highColor: "#cc0000",
  },
  NEUTRAL: "#f8f9fa",
};

// Custom tooltip component for better data presentation
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const dataPoint = payload[0].payload;
    let sentimentCategory = "Neutral";
    let bgColor = "#f8f9fa";
    let textColor = "#333";

    if (dataPoint.z > 0.3) {
      sentimentCategory = "Strongly Positive";
      bgColor = "rgba(0, 98, 204, 0.1)";
      textColor = "#0062cc";
    } else if (dataPoint.z > 0) {
      sentimentCategory = "Slightly Positive";
      bgColor = "rgba(0, 98, 204, 0.05)";
      textColor = "#0076f5";
    } else if (dataPoint.z < -0.3) {
      sentimentCategory = "Strongly Negative";
      bgColor = "rgba(204, 0, 0, 0.1)";
      textColor = "#cc0000";
    } else if (dataPoint.z < 0) {
      sentimentCategory = "Slightly Negative";
      bgColor = "rgba(204, 0, 0, 0.05)";
      textColor = "#e60000";
    }

    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "white",
          padding: "12px",
          border: "1px solid #e0e0e0",
          borderRadius: "6px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            padding: "4px 8px",
            marginBottom: "8px",
            backgroundColor: bgColor,
            borderRadius: "4px",
            color: textColor,
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {sentimentCategory}
        </div>
        <div style={{ margin: "5px 0", fontWeight: "bold" }}>
          <span style={{ color: "#555" }}>Group:</span>{" "}
          <span>{dataPoint.group}</span>
        </div>
        <div style={{ margin: "5px 0", fontWeight: "bold" }}>
          <span style={{ color: "#555" }}>Topic:</span>{" "}
          <span>{dataPoint.topic}</span>
        </div>
        <div style={{ margin: "8px 0" }}>
          <span style={{ color: "#555" }}>Sentiment Score:</span> // Update the
          CustomTooltip component to handle non-numeric values // Find this part
          in the CustomTooltip component
          <span
            style={{
              fontWeight: "bold",
              color:
                dataPoint.z > 0
                  ? "#0062cc"
                  : dataPoint.z < 0
                  ? "#cc0000"
                  : "#333",
            }}
          >
            {typeof dataPoint.z === "number"
              ? dataPoint.z.toFixed(2)
              : String(dataPoint.z || "N/A")}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const BiasHeatmap = () => {
  const [data, setData] = useState([]);
  const [topics, setTopics] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedTopic, setHighlightedTopic] = useState(null);
  const [highlightedGroup, setHighlightedGroup] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const heatmapData = await fetchHeatmapData();

      if (heatmapData.length > 0) {
        // Extract topics from the first row (excluding 'name')
        const topicList = Object.keys(heatmapData[0]).filter(
          (key) => key !== "name"
        );
        setTopics(topicList);

        // Extract demographic groups
        const groupList = heatmapData.map((item) => item.name);
        setGroups(groupList);

        // Transform data for the heatmap
        const transformedData = [];
        heatmapData.forEach((row, rowIndex) => {
          topicList.forEach((topic, colIndex) => {
            transformedData.push({
              x: colIndex,
              y: rowIndex,
              z: row[topic],
              group: row.name,
              topic: topic,
            });
          });
        });

        setData(transformedData);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen for model changes
    const handleModelChange = () => {
      console.log("BiasHeatmap: Model changed, fetching new data...");
      fetchData();
    };

    window.addEventListener(MODEL_CHANGE_EVENT, handleModelChange);
    return () => {
      window.removeEventListener(MODEL_CHANGE_EVENT, handleModelChange);
    };
  }, []);

  // Function to calculate cell size based on available topics and groups
  const getCellSize = useMemo(() => {
    const baseSize = 40;
    return {
      width: Math.max(30, Math.min(baseSize, 800 / Math.max(topics.length, 1))),
      height: Math.max(
        30,
        Math.min(baseSize, 400 / Math.max(groups.length, 1))
      ),
    };
  }, [topics.length, groups.length]);

  // Enhanced color calculation for better visual representation
  const getColorByValue = (value) => {
    // Color scale from red (negative) to white (neutral) to blue (positive)
    if (value > 0) {
      // Positive sentiment: blue scale
      const intensity = Math.min(1, Math.max(0, value));
      const ratio = intensity; // Scale 0-1

      // Interpolate between lowColor and highColor
      const r = Math.round(
        parseInt(ColorScale.POSITIVE.lowColor.slice(1, 3), 16) * (1 - ratio) +
          parseInt(ColorScale.POSITIVE.highColor.slice(1, 3), 16) * ratio
      );
      const g = Math.round(
        parseInt(ColorScale.POSITIVE.lowColor.slice(3, 5), 16) * (1 - ratio) +
          parseInt(ColorScale.POSITIVE.highColor.slice(3, 5), 16) * ratio
      );
      const b = Math.round(
        parseInt(ColorScale.POSITIVE.lowColor.slice(5, 7), 16) * (1 - ratio) +
          parseInt(ColorScale.POSITIVE.highColor.slice(5, 7), 16) * ratio
      );

      return `rgb(${r}, ${g}, ${b})`;
    } else if (value < 0) {
      // Negative sentiment: red scale
      const intensity = Math.min(1, Math.max(0, -value));
      const ratio = intensity; // Scale 0-1

      // Interpolate between lowColor and highColor
      const r = Math.round(
        parseInt(ColorScale.NEGATIVE.lowColor.slice(1, 3), 16) * (1 - ratio) +
          parseInt(ColorScale.NEGATIVE.highColor.slice(1, 3), 16) * ratio
      );
      const g = Math.round(
        parseInt(ColorScale.NEGATIVE.lowColor.slice(3, 5), 16) * (1 - ratio) +
          parseInt(ColorScale.NEGATIVE.highColor.slice(3, 5), 16) * ratio
      );
      const b = Math.round(
        parseInt(ColorScale.NEGATIVE.lowColor.slice(5, 7), 16) * (1 - ratio) +
          parseInt(ColorScale.NEGATIVE.highColor.slice(5, 7), 16) * ratio
      );

      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Neutral sentiment
      return ColorScale.NEUTRAL;
    }
  };

  // Loading state with animation
  if (loading) {
    return (
      <div className="card loading-card">
        <div className="loading-spinner"></div>
        <p>Loading sentiment heatmap data...</p>
      </div>
    );
  }

  // Error state with details
  if (error) {
    return (
      <div className="card error-card">
        <div className="error-icon">!</div>
        <h3>Unable to load heatmap data</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="card heatmap-card">
      <div className="card-header">
        <h2>Sentiment Analysis Heatmap</h2>
        <p>
          Visualization of sentiment bias across demographic groups and topics
        </p>
      </div>

      <div className="heatmap-container">
        <ResponsiveContainer
          width="100%"
          height={Math.max(400, groups.length * 40)}
        >
          <ScatterChart margin={{ top: 30, right: 50, bottom: 90, left: 100 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="topic"
              tick={{
                angle: -45,
                textAnchor: "end",
                fontSize: 12,
                fill: "#555",
              }}
              tickFormatter={(value) => topics[value] || ""}
              domain={[0, topics.length - 1]}
              label={{
                value: "Topics",
                position: "insideBottom",
                offset: -10,
                fill: "#555",
                fontSize: 14,
              }}
              stroke="#ccc"
            />
            <YAxis
              type="number"
              dataKey="y"
              name="demographic"
              tickFormatter={(value) => groups[value] || ""}
              domain={[0, groups.length - 1]}
              label={{
                value: "Demographic Groups",
                angle: -90,
                position: "insideLeft",
                fill: "#555",
                fontSize: 14,
              }}
              stroke="#ccc"
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              data={data}
              shape={(props) => {
                const { x, y, z, payload } = props;
                // Removed 'width' and 'height' since they're not used

                // Determine if this cell should be highlighted
                const isHighlighted =
                  (highlightedTopic !== null &&
                    payload.topic === topics[highlightedTopic]) ||
                  (highlightedGroup !== null &&
                    payload.group === groups[highlightedGroup]);

                const cellWidth = getCellSize.width;
                const cellHeight = getCellSize.height;

                return (
                  <Rectangle
                    x={x - cellWidth / 2}
                    y={y - cellHeight / 2}
                    width={cellWidth}
                    height={cellHeight}
                    fill={getColorByValue(z)}
                    stroke={isHighlighted ? "#000" : "#ccc"}
                    strokeWidth={isHighlighted ? 2 : 0.5}
                    style={{ transition: "all 0.3s ease" }}
                  />
                );
              }}
              onMouseOver={(data) => {
                // Removed 'index' parameter since it's not used
                const topicIndex = topics.indexOf(data.topic);
                const groupIndex = groups.indexOf(data.group);
                setHighlightedTopic(topicIndex);
                setHighlightedGroup(groupIndex);
              }}
              onMouseOut={() => {
                setHighlightedTopic(null);
                setHighlightedGroup(null);
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="heatmap-legend">
        <div className="legend-item">
          <div className="legend-label">Sentiment Scale:</div>
          <div className="legend-gradient">
            <div className="color-scale">
              <div
                className="gradient"
                style={{
                  background: `linear-gradient(to right, ${ColorScale.NEGATIVE.highColor}, ${ColorScale.NEGATIVE.lowColor}, ${ColorScale.NEUTRAL}, ${ColorScale.POSITIVE.lowColor}, ${ColorScale.POSITIVE.highColor})`,
                }}
              ></div>
              <div className="scale-labels">
                <span>Negative</span>
                <span>Neutral</span>
                <span>Positive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="heatmap-insights">
        <div className="insight-item">
          <div className="insight-icon">💡</div>
          <div className="insight-content">
            <h4>How to Read This Chart</h4>
            <p>
              This heatmap shows sentiment scores for different demographic
              groups across various topics. Blue cells indicate positive
              sentiment, red cells indicate negative sentiment, and white cells
              are neutral. Hover over cells to see exact values.
            </p>
          </div>
        </div>

        <div className="insight-item">
          <div className="insight-icon">⚠️</div>
          <div className="insight-content">
            <h4>Bias Awareness</h4>
            <p>
              Look for patterns where specific demographic groups consistently
              receive more negative sentiment for certain topics compared to
              others, which may indicate potential bias in the model.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this CSS to your App.css or inject it
const styles = `
  .heatmap-card {
    background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 12px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    border: 1px solid rgba(230,230,230,0.7);
    overflow: hidden;
    margin-bottom: 30px;
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

  .heatmap-container {
    padding: 20px;
    background: rgba(250,250,252,0.5);
  }

  .heatmap-legend {
    display: flex;
    justify-content: center;
    padding: 20px;
    border-top: 1px solid rgba(0,0,0,0.05);
  }

  .legend-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .legend-label {
    font-weight: 600;
    color: #555;
    margin-bottom: 10px;
  }

  .legend-gradient {
    display: flex;
    align-items: center;
  }

  .color-scale {
    display: flex;
    flex-direction: column;
    width: 300px;
  }

  .gradient {
    height: 20px;
    width: 100%;
    border-radius: 4px;
    border: 1px solid #ddd;
  }

  .scale-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 5px;
    color: #666;
    font-size: 0.9rem;
  }

  .heatmap-insights {
    padding: 20px 30px;
    border-top: 1px solid rgba(0,0,0,0.05);
  }

  .insight-item {
    display: flex;
    align-items: flex-start;
    margin: 15px 0;
  }

  .insight-icon {
    font-size: 1.4rem;
    margin-right: 15px;
    margin-top: 2px;
  }

  .insight-content h4 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 1.1rem;
  }

  .insight-content p {
    margin: 0;
    color: #666;
    line-height: 1.5;
    font-size: 0.95rem;
  }

  .loading-card, .error-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    padding: 20px;
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

  .custom-tooltip {
    max-width: 250px;
    font-size: 14px;
  }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default BiasHeatmap;
