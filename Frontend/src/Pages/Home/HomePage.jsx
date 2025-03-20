import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to MarketSavvy</h1>
        <p className="hero-subtitle">Your comprehensive analytics solution for business intelligence</p>
        
        <div className="cta-buttons">
          <Link to="/dashboard" className="cta-button primary">
            View Dashboard
          </Link>
          <a href="#features" className="cta-button secondary">
            Learn More
          </a>
        </div>
      </div>
      
      <div className="features-section" id="features">
        <h2 className="section-title">Key Features</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 20V10" />
                <path d="M12 20V4" />
                <path d="M6 20v-6" />
              </svg>
            </div>
            <h3 className="feature-title">Real-time Analytics</h3>
            <p className="feature-description">
              Get up-to-the-minute insights about your business performance with live data updates.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 className="feature-title">Scheduled Reports</h3>
            <p className="feature-description">
              Automate your reporting process with customizable scheduled reports delivered directly to your inbox.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3 className="feature-title">Data Visualization</h3>
            <p className="feature-description">
              Transform complex data into clear, actionable visuals with our advanced charting tools.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <h3 className="feature-title">Custom Dashboards</h3>
            <p className="feature-description">
              Build personalized dashboards tailored to your specific business needs and goals.
            </p>
          </div>
        </div>
        
        <div className="feature-cta">
          <Link to="/dashboard" className="cta-button primary">
            Explore the Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;