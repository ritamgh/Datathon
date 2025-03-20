import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
  Legend,
  Tooltip,
} from "recharts";
import { fetchPerformanceMetrics } from "../services/api";

// Colors for different performance metrics
const COLORS = {
  accuracy: ["#e8eaed", "#0088FE"],
  hallucination: ["#e8eaed", "#FF8042"],
  toxicity: ["#e8eaed", "#FF0000"],
};

// RADIAN constant for angle calculations
const RADIAN = Math.PI / 180;

// Custom active shape for gauge visualization
const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy - 20}
        dy={8}
        textAnchor="middle"
        fill="#333"
        fontSize={20}
        fontWeight="bold"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 10}
        dy={8}
        textAnchor="middle"
        fill="#333"
        fontSize={24}
      >
        {value}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

// Component to create a single gauge
const GaugeChart = ({ data, color, startAngle = 180, endAngle = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={color[index % color.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

const PerformanceGauges = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPerformanceMetrics();
        setMetrics(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <div className="card">Loading performance metrics...</div>;
  if (error)
    return (
      <div className="card">Error loading performance metrics: {error}</div>
    );
  if (!metrics) return <div className="card">No metrics available</div>;

  // Prepare data for the gauge charts
  const accuracyData = [
    { name: "Remaining", value: 100 - metrics.accuracy * 100 },
    { name: "Accuracy", value: +(metrics.accuracy * 100).toFixed(1) },
  ];

  const hallucinationData = [
    { name: "Remaining", value: 100 - metrics.hallucination_rate * 100 },
    {
      name: "Hallucination",
      value: +(metrics.hallucination_rate * 100).toFixed(1),
    },
  ];

  const toxicityData = [
    { name: "Remaining", value: 100 - metrics.toxicity_score * 100 },
    { name: "Toxicity", value: +(metrics.toxicity_score * 100).toFixed(1) },
  ];

  return (
    <div className="card">
      <h2>Performance Metrics</h2>
      <p>Key model performance indicators</p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        <div style={{ width: "33%", minWidth: "250px" }}>
          <GaugeChart data={accuracyData} color={COLORS.accuracy} />
        </div>

        <div style={{ width: "33%", minWidth: "250px" }}>
          <GaugeChart data={hallucinationData} color={COLORS.hallucination} />
        </div>

        <div style={{ width: "33%", minWidth: "250px" }}>
          <GaugeChart data={toxicityData} color={COLORS.toxicity} />
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Sample Size:</strong> {metrics.sample_size} prompts
        </p>
      </div>
    </div>
  );
};

export default PerformanceGauges;
