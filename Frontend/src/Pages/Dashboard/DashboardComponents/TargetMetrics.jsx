import React, { useState, useEffect } from 'react';

const TargetMetrics = ({ data, period, onPeriodChange, periodOptions }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  
  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  // Handle period change
  const handlePeriodChange = (newPeriod) => {
    onPeriodChange(newPeriod);
    setIsDropdownOpen(false);
  };
  
  // Start animation when component mounts
  useEffect(() => {
    setAnimationStarted(true);
  }, []);
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{data.title}</div>
        <div className="period-selector" onClick={toggleDropdown}>
          <span>{period}</span>
          {isDropdownOpen && (
            <div className="period-dropdown" style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              background: '#2a2a3a',
              borderRadius: '6px',
              marginTop: '8px',
              zIndex: 10,
              boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
              overflow: 'hidden'
            }}>
              {periodOptions.map((option) => (
                <div
                  key={option}
                  className="period-option"
                  style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    fontSize: '0.8rem'
                  }}
                  onClick={() => handlePeriodChange(option)}
                  onMouseEnter={(e) => e.target.style.background = '#3a3a4a'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div 
        className="card-subtitle" 
        style={{ 
          fontSize: '0.85rem', 
          color: '#a1a1b5', 
          marginBottom: '20px',
          opacity: 0,
          animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none'
        }}
      >
        {data.subtitle}
      </div>
      
      <div className="metrics-list">
        {data.metrics.map((metric, index) => (
          <div 
            key={index} 
            className="metric-item" 
            style={{ 
              marginBottom: '20px',
              opacity: 0,
              animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
              animationDelay: `${0.2 + index * 0.2}s`
            }}
          >
            <div className="metric-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div className="metric-name">{metric.name}</div>
              <div className="metric-percentage" style={{ 
                fontSize: '0.85rem',
                color: index === 0 ? '#4cd964' : '#ff9500' 
              }}>
                {metric.percentage}
              </div>
            </div>
            
            <div className="metric-bar" style={{ position: 'relative', marginBottom: '4px' }}>
              <div style={{ 
                height: '6px', 
                width: '100%', 
                backgroundColor: '#2a2a3a', 
                borderRadius: '3px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: animationStarted ? metric.percentage : '0%',
                  backgroundColor: index === 0 ? '#4cd964' : '#ff9500',
                  borderRadius: '3px',
                  transition: 'width 1s ease',
                  transitionDelay: `${0.4 + index * 0.2}s`
                }}></div>
              </div>
            </div>
            
            <div 
              className="metric-values" 
              style={{ 
                fontSize: '0.85rem', 
                color: '#a1a1b5', 
                opacity: 0,
                animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
                animationDelay: `${0.6 + index * 0.2}s`
              }}
            >
              {metric.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TargetMetrics;