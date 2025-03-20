import axios from "axios";

const API_URL = "http://localhost:3001/api";

/**
 * Fetches the list of available metrics files
 * @returns {Promise<Array>} - List of available metric files
 */
export const fetchMetricsList = async () => {
  try {
    const response = await axios.get(`${API_URL}/metrics/available`);
    return response.data.files;
  } catch (error) {
    console.error("Error fetching metrics list:", error);
    throw error;
  }
};

/**
 * Fetches data from a specific metrics file
 * @param {string} filename - Name of the metrics file to fetch
 * @returns {Promise<Object|Array>} - Metrics data
 */
export const fetchMetricsData = async (filename) => {
  try {
    const response = await axios.get(`${API_URL}/metrics/${filename}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
    throw error;
  }
};

/**
 * Fetches aggregated metrics data for dashboard display
 * @returns {Promise<Object>} - Metrics data for dashboard
 */
export const fetchAggregatedMetrics = async () => {
  try {
    const response = await axios.get(`${API_URL}/llm-metrics`);

    if (!response.status === 200) {
      throw new Error("Failed to fetch metrics data");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching metrics data:", error);
    throw error;
  }
};

/**
 * Fetches sentiment heatmap data for demographic groups across topics
 * @returns {Promise<Array>} - Heatmap data for visualization
 */
export const fetchHeatmapData = async () => {
  try {
    const data = await fetchMetricsData("sentiment_heatmap.csv");

    // Transform the data for the heatmap component
    // The heatmap expects data in format: [{name: 'demographic', topic1: value, topic2: value, ...}]
    const transformedData = data.map((row) => {
      const { demographic_group, ...topics } = row;
      return {
        name: demographic_group,
        ...topics,
      };
    });

    return transformedData;
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    throw error;
  }
};

/**
 * Fetches bias radar chart data showing bias across different dimensions
 * @returns {Promise<Array>} - Radar chart data for visualization
 */
export const fetchRadarData = async () => {
  try {
    // Use bias_metrics.csv instead of bias_by_group.csv for topic-level data
    const data = await fetchMetricsData("bias_metrics.csv");

    // Get unique topics and demographic groups
    const topics = [...new Set(data.map((item) => item.topic))];
    const groups = [...new Set(data.map((item) => item.demographic_group))];

    // Transform data for radar chart format
    // RadarChart expects: [{subject: 'topic1', group1: value, group2: value, ...}]
    const radarData = topics.map((topic) => {
      const dataPoint = { subject: topic };

      // Add each demographic group's sentiment for this topic
      groups.forEach((group) => {
        // Find the matching data point
        const matchingRow = data.find(
          (row) => row.topic === topic && row.demographic_group === group
        );

        if (matchingRow) {
          dataPoint[group] = matchingRow.sentiment_compound;
        }
      });

      return dataPoint;
    });

    return radarData;
  } catch (error) {
    console.error("Error fetching radar data:", error);
    throw error;
  }
};

/**
 * Fetches performance metrics for gauge visualizations
 * @returns {Promise<Object>} - Performance metrics data
 */
export const fetchPerformanceData = async () => {
  try {
    return await fetchMetricsData("performance_metrics.json");
  } catch (error) {
    console.error("Error fetching performance data:", error);
    throw error;
  }
};

/**
 * Alias for fetchPerformanceData to maintain compatibility
 */
export const fetchPerformanceMetrics = fetchPerformanceData;

/**
 * Sends a query to the LLM and retrieves the response with metrics
 * @param {string} prompt - The user prompt to send to the LLM
 * @param {string} model - Optional model name (defaults to server-side default)
 * @returns {Promise<Object>} - Response containing LLM output and metrics
 */
export const queryLLM = async (prompt, model = "llama3.2") => {
  try {
    const response = await axios.post(`${API_URL}/query`, {
      prompt,
      model,
    });

    if (response.status !== 200) {
      throw new Error("Failed to query LLM");
    }

    return response.data;
  } catch (error) {
    console.error("Error querying LLM:", error);
    throw error;
  }
};
