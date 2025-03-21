import axios from "axios";

const API_URL = "http://localhost:3001/api";

// Store the currently selected model - default to llama3.2
let currentModel = "llama3.2";

/**
 * Gets the current model being used
 * @returns {string} - The current model name
 */
export const getCurrentModel = () => {
  return currentModel;
};

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
 * Fetches aggregated metrics data for dashboard display
 * @returns {Promise<Object>} - Metrics data for dashboard
 */
export const fetchAggregatedMetrics = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/llm-metrics?model=${currentModel}`
    );

    if (!response.status === 200) {
      throw new Error("Failed to fetch metrics data");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching metrics data:", error);

    // Provide simulated data for demo purposes when API fails
    return {
      performance: generateSimulatedPerformanceMetrics(currentModel),
      bias: generateSimulatedHeatmapData(currentModel),
      biasRadar: generateSimulatedRadarData(currentModel),
    };
  }
};

// Other existing API functions...

/**
 * Fetches performance metrics for gauge visualizations
 * @returns {Promise<Object>} - Performance metrics data
 */
export const fetchPerformanceData = async () => {
  try {
    const data = await fetchMetricsData("performance_metrics.json");
    return data;
  } catch (error) {
    console.error("Error fetching performance data:", error);
    return generateSimulatedPerformanceMetrics(currentModel);
  }
};

/**
 * Generate simulated performance metrics for different models
 * @param {string} model - Model name
 * @returns {Object} - Simulated performance metrics
 */
function generateSimulatedPerformanceMetrics(model) {
  // Base sample size
  const sampleSize = 50;

  // Different metrics for different models
  const modelMetrics = {
    "GPT-4": {
      accuracy: 0.92,
      hallucination_rate: 0.05,
      toxicity_score: 0.02,
      sample_size: sampleSize,
    },
    "Claude 3": {
      accuracy: 0.89,
      hallucination_rate: 0.06,
      toxicity_score: 0.01,
      sample_size: sampleSize,
    },
    "Llama 2": {
      accuracy: 0.76,
      hallucination_rate: 0.18,
      toxicity_score: 0.04,
      sample_size: sampleSize,
    },
    Mistral: {
      accuracy: 0.81,
      hallucination_rate: 0.14,
      toxicity_score: 0.03,
      sample_size: sampleSize,
    },
    PaLM: {
      accuracy: 0.85,
      hallucination_rate: 0.12,
      toxicity_score: 0.04,
      sample_size: sampleSize,
    },
    "llama3.2": {
      accuracy: 0.78,
      hallucination_rate: 0.15,
      toxicity_score: 0.03,
      sample_size: sampleSize,
    },
  };

  // Return metrics for the requested model or default metrics if model not found
  return modelMetrics[model] || modelMetrics["llama3.2"];
}

/**
 * Alias for fetchPerformanceData to maintain compatibility
 */
export const fetchPerformanceMetrics = fetchPerformanceData;

/**
 * Sends a query to the LLM and retrieves the response with metrics
 * @param {string} prompt - The user prompt to send to the LLM
 * @param {string} model - Optional model name (defaults to current model)
 * @returns {Promise<Object>} - Response containing LLM output and metrics
 */
export const queryLLM = async (prompt, model = null) => {
  const modelToUse = model || currentModel;

  try {
    const response = await axios.post(`${API_URL}/query`, {
      prompt,
      model: modelToUse,
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

// Add this new function before the queryLLM function

/**
 * Fetches heatmap data for bias visualization
 * @returns {Promise<Array>} - Heatmap data for bias visualization
 */
export const fetchHeatmapData = async () => {
  try {
    const data = await fetchMetricsData("sentiment_heatmap.csv");
    return data;
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    return generateSimulatedHeatmapData(currentModel);
  }
};

/**
 * Generate simulated heatmap data for different models
 * @param {string} model - Model name
 * @returns {Array} - Simulated heatmap data
 */
function generateSimulatedHeatmapData(model) {
  // Common topics across all models
  const topics = [
    "Finance",
    "Healthcare",
    "Technology",
    "Politics",
    "Education",
  ];

  // Demographic groups
  const groups = [
    "Male",
    "Female",
    "Young",
    "Senior",
    "Low-income",
    "High-income",
  ];

  // Base bias patterns with some variation per model
  const basePatterns = {
    "GPT-4": {
      biasLevel: 0.3, // Lower bias level overall
      variance: 0.2,
    },
    "Claude 3": {
      biasLevel: 0.25, // Lowest bias level
      variance: 0.15,
    },
    "Llama 2": {
      biasLevel: 0.5, // Higher bias level
      variance: 0.4,
    },
    Mistral: {
      biasLevel: 0.45,
      variance: 0.35,
    },
    PaLM: {
      biasLevel: 0.4,
      variance: 0.3,
    },
    "llama3.2": {
      biasLevel: 0.35,
      variance: 0.25,
    },
  };

  // Get pattern for the selected model or use default
  const pattern = basePatterns[model] || basePatterns["llama3.2"];

  // Generate data
  return groups.map((group) => {
    const result = { name: group };

    topics.forEach((topic) => {
      // Generate a value between -1 and 1 with bias influenced by the model's pattern
      const baseValue = (Math.random() * 2 - 1) * pattern.variance;

      // Add some specific biases based on group and topic combinations
      let adjustment = 0;

      // Example bias patterns
      if (
        (group === "Male" && topic === "Technology") ||
        (group === "High-income" && topic === "Finance")
      ) {
        adjustment = 0.3 * pattern.biasLevel; // Positive bias
      } else if (
        (group === "Female" && topic === "Finance") ||
        (group === "Low-income" && topic === "Politics")
      ) {
        adjustment = -0.3 * pattern.biasLevel; // Negative bias
      }

      result[topic] = Math.max(-1, Math.min(1, baseValue + adjustment)); // Clamp between -1 and 1
    });

    return result;
  });
}

/**
 * Fetches radar chart data for bias visualization
 * @returns {Promise<Array>} - Radar data for bias visualization
 */
export const fetchRadarData = async () => {
  try {
    const data = await fetchMetricsData("bias_by_topic.csv");
    return data;
  } catch (error) {
    console.error("Error fetching radar data:", error);
    return generateSimulatedRadarData(currentModel);
  }
};

/**
 * Generate simulated radar data for different models
 * @param {string} model - Model name
 * @returns {Array} - Simulated radar data for bias visualization
 */
function generateSimulatedRadarData(model) {
  // Topics to visualize in the radar chart
  const topics = [
    "Finance",
    "Healthcare",
    "Technology",
    "Politics",
    "Education",
    "Sports",
    "Entertainment",
  ];

  // Demographic groups
  const groups = [
    "Male",
    "Female",
    "Young",
    "Senior",
    "Low-income",
    "High-income",
  ];

  // Model-specific bias configurations
  const modelBiasConfig = {
    "GPT-4": {
      biasLevel: 0.2,
      variance: 0.15,
    },
    "Claude 3": {
      biasLevel: 0.15,
      variance: 0.1,
    },
    "Llama 2": {
      biasLevel: 0.45,
      variance: 0.3,
    },
    Mistral: {
      biasLevel: 0.35,
      variance: 0.25,
    },
    PaLM: {
      biasLevel: 0.3,
      variance: 0.2,
    },
    "llama3.2": {
      biasLevel: 0.3,
      variance: 0.2,
    },
  };

  // Get config for the current model or use default
  const config = modelBiasConfig[model] || modelBiasConfig["llama3.2"];

  // Generate data for the radar chart
  return topics.map((topic) => {
    // Create an object with the topic as the subject
    const dataPoint = { subject: topic };

    // Add bias values for each demographic group
    groups.forEach((group) => {
      // Generate a base value with some randomness
      let value = (Math.random() * 0.4 - 0.2) * config.variance;

      // Add specific biases based on topic and group combinations
      if (
        (topic === "Technology" && group === "Male") ||
        (topic === "Finance" && group === "High-income")
      ) {
        value += 0.2 * config.biasLevel;
      } else if (
        (topic === "Healthcare" && group === "Female") ||
        (topic === "Education" && group === "Female")
      ) {
        value += 0.15 * config.biasLevel;
      } else if (topic === "Sports" && group === "Male") {
        value += 0.25 * config.biasLevel;
      } else if (topic === "Politics" && group === "Low-income") {
        value -= 0.15 * config.biasLevel;
      }

      // Ensure value is between -1 and 1
      dataPoint[group] = Math.max(-1, Math.min(1, value));
    });

    return dataPoint;
  });
}

/**
 * Sets the current model to use for API calls
 * @param {string} model - The model name to set
 */
export const setCurrentModel = (model) => {
  currentModel = model;
  console.log(`Model set to: ${currentModel}`);

  // Dispatch event when model changes for components that don't listen directly
  const event = new CustomEvent("model-change-event", { detail: model });
  window.dispatchEvent(event);
};

/**
 * Fetches data from a specific metrics file
 * @param {string} filename - Name of the metrics file to fetch
 * @returns {Promise<Object|Array>} - Metrics data
 */
export const fetchMetricsData = async (filename) => {
  try {
    const response = await axios.get(
      `${API_URL}/metrics/${filename}?model=${currentModel}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);

    // If we can't fetch real data, simulate different metrics per model
    if (filename === "performance_metrics.json") {
      return generateSimulatedPerformanceMetrics(currentModel);
    } else if (filename === "sentiment_heatmap.csv") {
      return generateSimulatedHeatmapData(currentModel);
    } else if (filename === "bias_by_topic.csv") {
      return generateSimulatedRadarData(currentModel);
    }
    // For any other file, return appropriate simulated data
    return {};
  }
};
