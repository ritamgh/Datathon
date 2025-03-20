import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import InteractiveBackground from "./components/Background/InteractiveBackground";
import Header from "./components/Header/Header";
import Dashboard from "./Pages/Dashboard/Dashboard";
// Change this import to point to the correct location:
import HomePage from "./components/Home/HomePage";

function App() {
  return (
    <Router>
      <div className="app">
        <InteractiveBackground />
        <Header />

        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
