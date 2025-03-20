import { useState, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { fetchRadarData } from "../services/api";

// Custom colors for demographic groups
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

const BiasRadarChart = () => {
  const [data, setData] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGroups, setActiveGroups] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const radarData = await fetchRadarData();
        setData(radarData);

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

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLegendClick = (group) => {
    setActiveGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const CustomizedLegend = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 20,
        }}
      >
        {groupNames.map((group, index) => (
          <div
            key={group}
            onClick={() => handleLegendClick(group)}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0 10px",
              cursor: "pointer",
              opacity: activeGroups[group] ? 1 : 0.5,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                backgroundColor: COLORS[index % COLORS.length],
                marginRight: 5,
              }}
            ></div>
            <span>{group}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div className="card">Loading radar chart...</div>;
  if (error)
    return <div className="card">Error loading radar chart: {error}</div>;

  return (
    <div className="card">
      <h2>Bias Radar Chart</h2>
      <p>Comparing metrics across demographic groups</p>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <RadarChart outerRadius={150} data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[-1, 1]} />
            <Tooltip />

            {groupNames.map(
              (group, index) =>
                activeGroups[group] && (
                  <Radar
                    key={group}
                    name={group}
                    dataKey={group}
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.3}
                  />
                )
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <CustomizedLegend />
    </div>
  );
};

export default BiasRadarChart;
