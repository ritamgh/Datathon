import { useState } from "react";
import { queryLLM } from "../services/api";

const QueryInterface = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    setIsSubmitted(true);

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

  // Helper function to get metric color based on type and value
  const getMetricColor = (type, value) => {
    switch (type) {
      case "sentiment":
        return value >= 0 ? "#4caf50" : "#f44336";
      case "toxicity":
        return value < 0.1 ? "#4caf50" : value < 0.3 ? "#ff9800" : "#f44336";
      case "hallucination":
        return value < 0.1 ? "#4caf50" : value < 0.3 ? "#ff9800" : "#f44336";
      default:
        return "#4285F4";
    }
  };

  // Prepare data for metrics gauge visualization
  const getGaugeValue = (type, value) => {
    switch (type) {
      case "sentiment":
        return { value: Math.abs(value) * 100, label: value.toFixed(2) };
      case "toxicity":
      case "hallucination":
        return { value: value * 100, label: `${(value * 100).toFixed(1)}%` };
      default:
        return { value: 0, label: "0" };
    }
  };

  // Helper to render a circular gauge metric
  const renderGaugeMetric = (title, type, value, icon) => {
    const gauge = getGaugeValue(type, value);
    const color = getMetricColor(type, value);
    const rotation = gauge.value * 1.8; // 0-100% mapped to 0-180 degrees

    return (
      <div className="metric-gauge">
        <div className="gauge-header">
          <div className="gauge-icon">{icon}</div>
          <h4>{title}</h4>
        </div>
        <div className="gauge-container">
          <div className="gauge-body">
            <div
              className="gauge-fill"
              style={{
                transform: `rotate(${rotation}deg)`,
                borderColor: color,
              }}
            ></div>
            <div className="gauge-cover"></div>
            <div className="gauge-value" style={{ color }}>
              {gauge.label}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="query-interface-card">
      <header className="query-header">
        <h2>Query LLM</h2>
        <p>Test the model with custom prompts and analyze response metrics</p>
      </header>

      <div className="query-content">
        <form onSubmit={handleSubmit} className="query-form">
          <div className="textarea-container">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className={`prompt-input ${isSubmitted ? "submitted" : ""}`}
              disabled={loading}
            />
            <div className="textarea-footer">
              <span className="character-count">
                {prompt.length} characters
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`submit-button ${loading ? "loading" : ""}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span className="button-icon">⚡</span>
                <span>Generate Response</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <div className="error-message">{error}</div>
          </div>
        )}

        {response && (
          <div className="response-container">
            <h3>
              <span className="response-icon">💬</span>
              LLM Response
            </h3>
            <div className="response-content">{response}</div>

            <h3 className="metrics-header">
              <span className="metrics-icon">📊</span>
              Response Analysis
            </h3>

            <div className="metrics-grid">
              {renderGaugeMetric(
                "Sentiment",
                "sentiment",
                metrics.sentiment_compound,
                "😊"
              )}
              {renderGaugeMetric(
                "Toxicity",
                "toxicity",
                metrics.toxicity_score,
                "🛡️"
              )}
              {renderGaugeMetric(
                "Hallucination",
                "hallucination",
                metrics.hallucination_score,
                "🔮"
              )}

              <div className="metric-card stats-card">
                <h4>Response Stats</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-label">Words</div>
                    <div className="stat-value">{metrics.word_count}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Chars</div>
                    <div className="stat-value">{metrics.char_count}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Sentences</div>
                    <div className="stat-value">{metrics.sentence_count}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Words/Sentence</div>
                    <div className="stat-value">
                      {metrics.avg_words_per_sentence.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .query-interface-card {
          background: linear-gradient(145deg, #ffffff, #f5f7fa);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          border: 1px solid rgba(230, 230, 250, 0.7);
          margin-bottom: 30px;
        }

        .query-header {
          padding: 1.8rem 2rem;
          background: linear-gradient(90deg, #2c3e50, #4c5c68);
          color: white;
        }

        .query-header h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.8rem;
          font-weight: 600;
        }

        .query-header p {
          margin: 0;
          opacity: 0.85;
          font-size: 1rem;
        }

        .query-content {
          padding: 1.5rem 2rem;
        }

        .query-form {
          margin-bottom: 1.5rem;
        }

        .textarea-container {
          position: relative;
          margin-bottom: 1.2rem;
        }

        .prompt-input {
          width: 100%;
          padding: 1rem;
          min-height: 120px;
          border-radius: 8px;
          border: 1px solid #d1d9e6;
          background-color: #f9fafc;
          font-size: 1rem;
          line-height: 1.5;
          transition: all 0.3s ease;
          resize: vertical;
          color: #2c3e50;
        }

        .prompt-input:focus {
          outline: none;
          border-color: #4285f4;
          box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.15);
        }

        .prompt-input.submitted {
          border-color: #4285f4;
          background-color: #f5f9ff;
        }

        .prompt-input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .textarea-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }

        .character-count {
          font-size: 0.8rem;
          color: #666;
        }

        .submit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem 1.5rem;
          background: linear-gradient(90deg, #3a86ff, #4361ee);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(58, 134, 255, 0.25);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(58, 134, 255, 0.3);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 5px rgba(58, 134, 255, 0.2);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-icon {
          margin-right: 8px;
          font-size: 1.1rem;
        }

        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 10px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-container {
          display: flex;
          align-items: flex-start;
          margin: 1.5rem 0;
          padding: 1rem;
          background-color: #fff6f6;
          border-left: 4px solid #f44336;
          border-radius: 4px;
        }

        .error-icon {
          font-size: 1.4rem;
          margin-right: 0.8rem;
        }

        .error-message {
          color: #d32f2f;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .response-container {
          margin-top: 2rem;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .response-container h3 {
          display: flex;
          align-items: center;
          font-size: 1.3rem;
          margin: 1.5rem 0 1rem;
          color: #2c3e50;
          font-weight: 600;
        }

        .response-icon,
        .metrics-icon {
          margin-right: 0.5rem;
          font-size: 1.3rem;
        }

        .response-content {
          padding: 1.2rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          white-space: pre-wrap;
          line-height: 1.6;
          color: #333;
          font-size: 1rem;
        }

        .metrics-header {
          margin-top: 2rem;
          border-top: 1px solid #e9ecef;
          padding-top: 1.5rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.2rem;
          margin-top: 1rem;
        }

        .metric-gauge {
          background-color: white;
          border-radius: 10px;
          padding: 1rem;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
          border: 1px solid #eee;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .metric-gauge:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .gauge-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .gauge-icon {
          font-size: 1.3rem;
          margin-right: 0.6rem;
        }

        .gauge-header h4 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 500;
          color: #333;
        }

        .gauge-container {
          display: flex;
          justify-content: center;
        }

        .gauge-body {
          position: relative;
          width: 120px;
          height: 60px;
          margin: 0.5rem 0;
          background-color: #f5f5f5;
          border-radius: 150px 150px 0 0;
          overflow: hidden;
        }

        .gauge-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: transparent;
          border: 10px solid;
          border-color: #4285f4;
          box-sizing: border-box;
          transform-origin: 50% 100%;
          transform: rotate(0deg);
          transition: transform 1.2s ease, border-color 1.2s ease;
        }

        .gauge-cover {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 100px;
          height: 100px;
          background-color: white;
          border-radius: 50%;
        }

        .gauge-value {
          position: absolute;
          bottom: 5px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 1.3rem;
          font-weight: bold;
          color: #4285f4;
          transition: color 1s ease;
        }

        .metric-card {
          background-color: white;
          border-radius: 10px;
          padding: 1rem;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
          border: 1px solid #eee;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .metric-card h4 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          font-weight: 500;
          color: #333;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;
        }

        .stat-item {
          text-align: center;
          padding: 0.8rem;
          background-color: #f8f9fa;
          border-radius: 6px;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 0.3rem;
        }

        .stat-value {
          font-size: 1.4rem;
          font-weight: bold;
          color: #2c3e50;
        }
      `}</style>
    </div>
  );
};

export default QueryInterface;
