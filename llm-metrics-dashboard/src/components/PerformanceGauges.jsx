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

/**
 * Performance Gauges Component
 *
 * Displays key LLM performance metrics as semi-circular gauges
 * including accuracy, hallucination rate, and toxicity scores.
 */

// Color schemes for different performance metrics
const COLORS = {
  accuracy: ["#e8eaed", "#0088FE"], // Light gray and blue
  hallucination: ["#e8eaed", "#FF8042"], // Light gray and orange
  toxicity: ["#e8eaed", "#FF0000"], // Light gray and red
};

// Constant for angle calculations (PI/180 to convert degrees to radians)
const RADIAN = Math.PI / 180;

/**
 * Custom active shape renderer for the gauge visualization
 * Displays the metric name and value with decorative sectors
 */
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
      {/* Metric name text */}
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

      {/* Metric value text */}
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

      {/* Main sector for the gauge */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      {/* Outer decorative sector */}
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

/**
 * GaugeChart component - Creates a single semi-circular gauge chart
 * @param {Array} data - Array of objects with name and value properties
 * @param {Array} color - Array of colors for the chart segments
 * @param {Number} startAngle - Start angle for the gauge (default: 180)
 * @param {Number} endAngle - End angle for the gauge (default: 0)
 */
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

/**
 * Main component that displays all performance gauges
 */
const PerformanceGauges = () => {
  // State management
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch performance metrics on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPerformanceMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading and error states
  if (loading) {
    return <div className="card">Loading performance metrics...</div>;
  }

  if (error) {
    return (
      <div className="card">Error loading performance metrics: {error}</div>
    );
  }

  if (!metrics) {
    return <div className="card">No metrics available</div>;
  }

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
        {/* Accuracy Gauge */}
        <div style={{ width: "33%", minWidth: "250px" }}>
          <GaugeChart data={accuracyData} color={COLORS.accuracy} />
        </div>

        {/* Hallucination Gauge */}
        <div style={{ width: "33%", minWidth: "250px" }}>
          <GaugeChart data={hallucinationData} color={COLORS.hallucination} />
        </div>

        {/* Toxicity Gauge */}
        <div style={{ width: "33%", minWidth: "250px" }}>
          <GaugeChart data={toxicityData} color={COLORS.toxicity} />
        </div>
      </div>

      {/* Additional information */}
      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Sample Size:</strong> {metrics.sample_size} prompts
        </p>
      </div>
    </div>
  );
};

export default PerformanceGauges;
