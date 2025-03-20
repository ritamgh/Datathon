import { useState } from "react";
import { queryLLM } from "../services/api";

const QueryInterface = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);
    setMetrics(null);

    try {
      const result = await queryLLM(prompt);
      setResponse(result.response);
      setMetrics(result.metrics);
    } catch (err) {
      console.error("Query error:", err);

      // Get more detailed error message if available
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.details ||
        err.message ||
        "Failed to get response from LLM";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Query LLM</h2>
      <p>Enter a prompt to query the LLM and analyze its response</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            style={{
              width: "100%",
              padding: "10px",
              minHeight: "100px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#3a86ff",
            color: "white",
            padding: "10px 20px",
            borderRadius: "4px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Querying..." : "Submit Query"}
        </button>
      </form>

      {error && <div style={{ marginTop: "20px", color: "red" }}>{error}</div>}

      {response && (
        <div style={{ marginTop: "20px" }}>
          <h3>Response</h3>
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              whiteSpace: "pre-wrap",
            }}
          >
            {response}
          </div>

          <h3 style={{ marginTop: "20px" }}>Response Metrics</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >
            <div className="metric-box">
              <h4>Sentiment</h4>
              <div
                style={{
                  height: "20px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "10px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: `${Math.abs(metrics.sentiment_compound) * 100}%`,
                    backgroundColor:
                      metrics.sentiment_compound >= 0 ? "#4caf50" : "#f44336",
                    left:
                      metrics.sentiment_compound >= 0
                        ? "50%"
                        : `calc(50% - ${
                            Math.abs(metrics.sentiment_compound) * 100
                          }%)`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: "2px",
                    backgroundColor: "#333",
                    left: "50%",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "5px",
                }}
              >
                <span>Negative</span>
                <span>{metrics.sentiment_compound.toFixed(2)}</span>
                <span>Positive</span>
              </div>
            </div>

            <div className="metric-box">
              <h4>Word Count</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                {metrics.word_count}
              </p>
            </div>

            <div className="metric-box">
              <h4>Toxicity Score</h4>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: metrics.toxicity_score > 0.1 ? "#f44336" : "#4caf50",
                }}
              >
                {(metrics.toxicity_score * 100).toFixed(1)}%
              </p>
            </div>

            <div className="metric-box">
              <h4>Hallucination Score</h4>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color:
                    metrics.hallucination_score > 0.1 ? "#f44336" : "#4caf50",
                }}
              >
                {(metrics.hallucination_score * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryInterface;
