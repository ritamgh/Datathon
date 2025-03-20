const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Path to metrics results
const METRICS_DIR = path.join(__dirname, "metrics_results");

// API to get all available metrics
app.get("/api/metrics/available", (req, res) => {
  try {
    const files = fs.readdirSync(METRICS_DIR);
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to get specific metric file
app.get("/api/metrics/:filename", (req, res) => {
  try {
    const filePath = path.join(METRICS_DIR, req.params.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Metric file not found" });
    }

    const fileExt = path.extname(filePath);

    if (fileExt === ".json") {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      res.json(data);
    } else if (fileExt === ".csv") {
      // Simple CSV to JSON conversion
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");
      const headers = lines[0].split(",");

      const data = lines
        .slice(1)
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const values = line.split(",");
          return headers.reduce((obj, header, index) => {
            // Try to convert to number if possible
            const value = values[index];
            obj[header] = isNaN(value) ? value : Number(value);
            return obj;
          }, {});
        });

      res.json(data);
    } else {
      res.sendFile(filePath);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New endpoint to query the LLM
// Update the query endpoint with better error handling

// New endpoint to query the LLM
app.post("/api/query", (req, res) => {
  const { prompt, model = "llama3.2" } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  console.log(`Querying LLM with prompt: "${prompt.substring(0, 30)}..."`);

  // Call Python script to query the model
  const pythonProcess = spawn("python", ["query_llm.py", prompt, model]);

  let result = "";
  let error = "";

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    error += data.toString();
    console.error(`Python error: ${data.toString()}`);
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({
        error: error || "Failed to query LLM",
        details: `Process exited with code ${code}`,
      });
    }

    try {
      const response = JSON.parse(result);
      res.json(response);
    } catch (e) {
      console.error(`Error parsing JSON: ${e.message}`);
      console.error(`Raw output: ${result}`);
      res.status(500).json({
        error: "Failed to parse LLM response",
        details: e.message,
      });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
