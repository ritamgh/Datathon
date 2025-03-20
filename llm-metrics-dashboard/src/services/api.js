import axios from "axios";

const API_URL = "http://localhost:3001/api";

export const fetchMetricsList = async () => {
  try {
    const response = await axios.get(`${API_URL}/metrics/available`);
    return response.data.files;
  } catch (error) {
    console.error("Error fetching metrics list:", error);
    throw error;
  }
};

export const fetchMetricsData = async (filename) => {
  try {
    const response = await axios.get(`${API_URL}/metrics/${filename}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
    throw error;
  }
};

// Helper function to fetch and process heatmap data
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

// Helper function to fetch and process radar chart data
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

// Helper function to fetch performance metrics
export const fetchPerformanceMetrics = async () => {
  try {
    return await fetchMetricsData("performance_metrics.json");
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
    throw error;
  }
};

export const queryLLM = async (prompt, model = "llama3.2") => {
  try {
    const response = await axios.post(`${API_URL}/query`, {
      prompt,
      model,
    });
    return response.data;
  } catch (error) {
    console.error("Error querying LLM:", error);
    throw error;
  }
};
