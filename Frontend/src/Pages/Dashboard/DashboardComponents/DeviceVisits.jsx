import React, { useState, useEffect } from 'react';

const DeviceVisits = ({ data, period, onPeriodChange, periodOptions }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState('0');
  
  // Start animation when component mounts
  useEffect(() => {
    setAnimationStarted(true);
    
    // Animate the total value
    const animateValue = () => {
      const numericValue = parseInt(data.total.replace(/,/g, ''));
      const duration = 1500; // ms
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;
      
      const timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentValue = Math.floor(numericValue * progress);
        
        // Format with commas
        const formattedValue = currentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setAnimatedTotal(formattedValue);
        
        if (frame === totalFrames) {
          clearInterval(timer);
          setAnimatedTotal(data.total);
        }
      }, frameDuration);
      
      return () => clearInterval(timer);
    };
    
    animateValue();
  }, [data.total]);
  
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
        <div className="card-title">Visit by Device</div>
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
      
      <div className="visits-content">
        <div 
          className="value-large stat-number" 
          style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            opacity: 0,
            animation: animationStarted ? 'countUp 0.8s ease forwards' : 'none',
            animationDelay: '0.2s'
          }}
        >
          {animatedTotal}
        </div>
        
        <div 
          className="change" 
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255, 59, 48, 0.15)',
            color: '#ff3b30', 
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: '500',
            fontSize: '0.8rem',
            marginBottom: '20px',
            opacity: 0,
            animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
            animationDelay: '0.6s'
          }}
        >
          <span style={{ marginRight: '4px' }}>↓</span>
          {data.change}
        </div>
        
        <div className="device-types" style={{ marginBottom: '30px' }}>
          {/* Mobile */}
          <div 
            className="device-type"
            style={{ 
              marginBottom: '16px',
              opacity: 0,
              animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
              animationDelay: '0.8s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#4cd964', marginRight: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12" y2="18" />
                  </svg>
                </span>
                <span>Mobile</span>
              </div>
              <div>{data.devices[0].value}</div>
            </div>
            
            <div className="progress-bar" style={{ height: '6px', backgroundColor: '#2a2a3a', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                className="progress" 
                style={{ 
                  height: '100%', 
                  width: animationStarted ? data.devices[0].percentage : '0%',
                  backgroundColor: '#4cd964',
                  transition: 'width 1s ease',
                  transitionDelay: '1s'
                }}
              />
            </div>
            
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#a1a1b5', marginTop: '4px' }}>{data.devices[0].percentage}</div>
          </div>
          
          {/* Desktop */}
          <div 
            className="device-type"
            style={{ 
              opacity: 0,
              animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
              animationDelay: '1s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#ff9500', marginRight: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </span>
                <span>Desktop</span>
              </div>
              <div>{data.devices[1].value}</div>
            </div>
            
            <div className="progress-bar" style={{ height: '6px', backgroundColor: '#2a2a3a', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                className="progress" 
                style={{ 
                  height: '100%', 
                  width: animationStarted ? data.devices[1].percentage : '0%',
                  backgroundColor: '#ff9500',
                  transition: 'width 1s ease',
                  transitionDelay: '1.2s'
                }}
              />
            </div>
            
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#a1a1b5', marginTop: '4px' }}>{data.devices[1].percentage}</div>
          </div>
        </div>
        
        {/* Platform stats */}
        <div 
          className="device-platforms" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '12px',
            borderTop: '1px solid #2a2a3a',
            paddingTop: '16px',
            opacity: 0,
            animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
            animationDelay: '1.5s'
          }}
        >
          {data.platforms.map((platform, index) => (
            <div key={index} className="platform-stat">
              <div style={{ fontSize: '0.75rem', color: '#a1a1b5', marginBottom: '4px' }}>{platform.name}</div>
              <div style={{ fontWeight: '500' }}>{platform.value}</div>
              <div style={{ height: '4px', background: getPlatformColor(platform.name), width: '100%', borderRadius: '2px', marginTop: '4px' }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get color based on platform name
const getPlatformColor = (platformName) => {
  switch(platformName.toLowerCase()) {
    case 'android': return '#4cd964';  // Green
    case 'ios': return '#5ac8fa';      // Blue
    case 'win': return '#ffcc00';      // Yellow
    case 'mac': return '#ff9500';      // Orange
    default: return '#a1a1b5';         // Gray
  }
};

export default DeviceVisits;