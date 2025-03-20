import React, { useState } from 'react';

const TargetMetrics = ({ data, period, onPeriodChange, periodOptions }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handlePeriodChange = (newPeriod) => {
    onPeriodChange(newPeriod);
    setIsDropdownOpen(false);
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{data.title}</div>
        <div className="period-selector">
          <div 
            className="selected-period" 
            onClick={toggleDropdown}
          >
            {period}
          </div>
          {isDropdownOpen && (
            <div className="period-dropdown">
              {periodOptions.map((option) => (
                <div 
                  key={option}
                  className="period-option"
                  onClick={() => handlePeriodChange(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="card-subtitle" style={{ fontSize: '0.85rem', color: '#a1a1b5', marginBottom: '20px' }}>
        {data.subtitle}
      </div>
      
      <div className="metrics-list">
        {data.metrics.map((metric, index) => (
          <div key={index} className="metric-item" style={{ marginBottom: '20px' }}>
            <div className="metric-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div className="metric-name">{metric.name}</div>
              <div className="metric-percentage" style={{ color: getProgressColor(metric.percentage) }}>
                {metric.percentage}
              </div>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress"
                style={{ 
                  width: metric.percentage,
                  backgroundColor: getProgressColor(metric.percentage)
                }}
              ></div>
            </div>
            
            <div className="metric-values" style={{ fontSize: '0.85rem', color: '#a1a1b5', marginTop: '8px' }}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>
      
      <div 
        className="target-visualization" 
        style={{ 
          marginTop: '30px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Circular progress indicator */}
        <div 
          className="circular-progress" 
          style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%',
            background: `radial-gradient(closest-side, #1e1e2d 79%, transparent 80% 100%),
                        conic-gradient(#2e64fe 65%, #2a2a3a 0)`,
            marginBottom: '16px'
          }}
        >
          <div 
            style={{ 
              position: 'relative', 
              width: '100%', 
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
          >
            65%
          </div>
        </div>
        
        <div className="progress-label" style={{ textAlign: 'center', fontSize: '0.9rem', color: '#a1a1b5' }}>
          Overall Target Completion
        </div>
      </div>
    </div>
  );
};

// Helper function to determine progress color based on percentage
const getProgressColor = (percentage) => {
  const value = parseInt(percentage);
  if (value >= 75) return '#4cd964';
  if (value >= 50) return '#ffcc00';
  if (value >= 25) return '#ff9500';
  return '#ff3b30';
};

export default TargetMetrics;