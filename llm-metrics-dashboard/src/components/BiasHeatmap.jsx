import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Rectangle,
  ScatterChart,
  Scatter,
} from "recharts";
import { fetchHeatmapData } from "../services/api";

const BiasHeatmap = () => {
  const [data, setData] = useState([]);
  const [topics, setTopics] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

    fetchData();
  }, []);

  const getColorByValue = (value) => {
    // Color scale from red (negative) to white (neutral) to blue (positive)
    if (value > 0) {
      // Positive sentiment: blue scale
      const intensity = Math.min(255, Math.round(value * 255));
      return `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
    } else {
      // Negative sentiment: red scale
      const intensity = Math.min(255, Math.round(-value * 255));
      return `rgb(255, ${255 - intensity}, ${255 - intensity})`;
    }
  };

  if (loading) return <div className="card">Loading sentiment heatmap...</div>;
  if (error) return <div className="card">Error loading heatmap: {error}</div>;

  return (
    <div className="card">
      <h2>Sentiment Analysis Heatmap</h2>
      <p>Sentiment bias across demographic groups and topics</p>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 20, right: 50, bottom: 90, left: 100 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="topic"
              tick={{ angle: -45, textAnchor: "end" }}
              tickFormatter={(value) => topics[value] || ""}
              domain={[0, topics.length - 1]}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="demographic"
              tickFormatter={(value) => groups[value] || ""}
              domain={[0, groups.length - 1]}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value, name) => {
                if (name === "z") {
                  return [`${value.toFixed(2)}`, "Sentiment"];
                }
                return [value, name];
              }}
              labelFormatter={(value, name, props) => {
                const dataPoint = props.payload[0];
                return `${dataPoint.group} - ${dataPoint.topic}`;
              }}
            />
            <Scatter
              data={data}
              shape={(props) => {
                const { x, y, width, height, z } = props;
                return (
                  <Rectangle
                    x={x - width / 2}
                    y={y - height / 2}
                    width={width}
                    height={height}
                    fill={getColorByValue(z)}
                    stroke="#ccc"
                  />
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div
        className="legend"
        style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 200,
              height: 20,
              background:
                "linear-gradient(to right, #ff0000, #ffffff, #0000ff)",
              marginRight: 10,
            }}
          ></div>
          <span>Negative</span>
          <span style={{ margin: "0 10px" }}>Neutral</span>
          <span>Positive</span>
        </div>
      </div>
    </div>
  );
};

export default BiasHeatmap;
