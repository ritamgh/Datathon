import React, { useState, useEffect } from 'react';

const OngoingSale = ({ data }) => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [animatedValue, setAnimatedValue] = useState('0');
  
  // Generate sample bar data for the chart
  const barValues = [15, 22, 17, 24, 20, 18, 13]; // Height percentages
  
  // Start animation when component mounts
  useEffect(() => {
    setAnimationStarted(true);
    
    // Animate the value counter
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
        <div className="card-title">On going sale</div>
      </div>
      
      <div className="card-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div 
          className="sale-value stat-number" 
          style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            marginBottom: '6px',
            opacity: 0,
            animation: animationStarted ? 'countUp 0.8s ease forwards' : 'none',
            animationDelay: '0.2s',
            textAlign: 'center'
          }}
        >
          {animatedValue}
        </div>
        
        <div 
          className="date-range" 
          style={{ 
            fontSize: '0.8rem', 
            color: '#a1a1b5', 
            marginBottom: '24px',
            opacity: 0,
            animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
            animationDelay: '0.6s',
            textAlign: 'center'
          }}
        >
          {data.startDate} • {data.endDate}
        </div>
        
        <div 
          className="chart-container" 
          style={{ 
            flex: 1,
            marginBottom: '16px',
            opacity: 0,
            animation: animationStarted ? 'fadeIn 0.8s ease forwards' : 'none',
            animationDelay: '0.8s'
          }}
        >
          <div style={{ display: 'flex', height: '100%', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            {barValues.map((value, index) => (
              <div 
                key={index}
                style={{ 
                  width: '12%',
                  height: animationStarted ? `${value * 3}px` : '0',
                  backgroundColor: '#ffcc00',
                  borderRadius: '2px',
                  transition: 'height 1s ease',
                  transitionDelay: `${0.8 + index * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingSale;