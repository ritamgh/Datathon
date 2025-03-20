import React, { useState, useEffect } from 'react';

const RevenueCard = ({ data, period, onPeriodChange, periodOptions }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [animatedValue, setAnimatedValue] = useState('$0');
  
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
    
    // Animate the revenue value
    const animateValue = () => {
      const numericValue = parseFloat(data.total.replace(/[^0-9.]/g, ''));
      const duration = 1500; // ms
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;
      
      const timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentValue = Math.floor(numericValue * progress);
        
        // Format with commas
        const formattedValue = `${currentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        setAnimatedValue(formattedValue);
        
        if (frame === totalFrames) {
          clearInterval(timer);
          setAnimatedValue(data.total);
        }
      }, frameDuration);
      
      return () => clearInterval(timer);
    };
    
    animateValue();
  }, [data.total]);
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Total Revenue</div>
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
      
      <div className="card-content" style={{ marginBottom: '20px' }}>
        <div 
          className="revenue-value stat-number" 
          style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            marginBottom: '6px',
            opacity: 0,
            animation: animationStarted ? 'countUp 0.8s ease forwards' : 'none',
            animationDelay: '0.2s'
          }}
        >
          {animatedValue}
        </div>
        <div 
          className="revenue-growth" 
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(76, 217, 100, 0.15)',
            color: '#4cd964',
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: '500',
            fontSize: '0.8rem',
            marginBottom: '6px',
            opacity: 0,
            animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
            animationDelay: '0.6s'
          }}
        >
          <span style={{ marginRight: '4px' }}>↑</span>
          {data.growth}
        </div>
        <div 
          className="revenue-compared" 
          style={{ 
            fontSize: '0.85rem', 
            color: '#a1a1b5',
            opacity: 0,
            animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
            animationDelay: '0.8s'
          }}
        >
          Gained {data.compared}
        </div>
      </div>
      
      <div className="revenue-sources" style={{ marginTop: 'auto', paddingTop: '16px' }}>
        <div 
          className="section-title" 
          style={{ 
            fontSize: '0.9rem',
            color: 'white',
            marginBottom: '12px',
            opacity: 0,
            animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
            animationDelay: '1s'
          }}
        >
          Revenue Sources
        </div>
        
        <div className="source-buttons" style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '12px',
          opacity: 0,
          animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
          animationDelay: '1.1s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem', color: '#a1a1b5' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: '#2e64fe',
              marginRight: '4px' 
            }}></span>
            <span>Google</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem', color: '#a1a1b5' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: '#ffcc00',
              marginRight: '4px' 
            }}></span>
            <span>Facebook</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem', color: '#a1a1b5' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: '#8022ef',
              marginRight: '4px' 
            }}></span>
            <span>Twitter</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem', color: '#a1a1b5' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: '#4cd964',
              marginRight: '4px' 
            }}></span>
            <span>Reddit</span>
          </div>
        </div>
        
        <div className="source-bars" style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', height: '8px', width: '100%', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: animationStarted ? '45%' : '0%', 
                height: '100%', 
                backgroundColor: '#2e64fe',
                transition: 'width 1s ease',
                transitionDelay: '1.2s'
              }}
            ></div>
            <div 
              style={{ 
                width: animationStarted ? '25%' : '0%', 
                height: '100%', 
                backgroundColor: '#ffcc00',
                transition: 'width 1s ease',
                transitionDelay: '1.3s'
              }}
            ></div>
            <div 
              style={{ 
                width: animationStarted ? '20%' : '0%', 
                height: '100%', 
                backgroundColor: '#8022ef',
                transition: 'width 1s ease',
                transitionDelay: '1.4s'
              }}
            ></div>
            <div 
              style={{ 
                width: animationStarted ? '10%' : '0%', 
                height: '100%', 
                backgroundColor: '#4cd964',
                transition: 'width 1s ease',
                transitionDelay: '1.5s'
              }}
            ></div>
          </div>
        </div>
        
        <div 
          className="source-values" 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '0.8rem', 
            color: '#a1a1b5',
            opacity: 0,
            animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
            animationDelay: '1.6s'
          }}
        >
          <span>$645.12k</span>
          <span>$234.12k</span>
          <span>$134.12k</span>
          <span>$42.12k</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;