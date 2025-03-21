import React, { useState, useEffect, useRef } from 'react';

const IntensityChart = () => {
  const canvasRef = useRef(null);
  const [animationStarted, setAnimationStarted] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;
    
    // Set canvas dimensions with high resolution
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    setAnimationStarted(true);
    
    // Create gradients for different wave layers
    const createPurpleGradient = (y, opacity) => {
      const gradient = ctx.createLinearGradient(0, y, 0, y + 80);
      gradient.addColorStop(0, `rgba(180, 120, 230, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(120, 40, 180, ${opacity})`);
      gradient.addColorStop(1, `rgba(80, 20, 120, ${opacity})`);
      return gradient;
    };
    
    // Animation function to draw the waves
    const animate = () => {
      time += 0.01;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      // Clear canvas with dark background
      ctx.fillStyle = '#121212';
      ctx.fillRect(0, 0, width, height);
      
      // Draw multiple wave layers with different phases and amplitudes
      const waveLayers = [
        { amplitude: 20, frequency: 0.02, speed: 1.0, opacity: 0.7, verticalPosition: 0.3 },
        { amplitude: 25, frequency: 0.03, speed: 0.8, opacity: 0.5, verticalPosition: 0.4 },
        { amplitude: 15, frequency: 0.01, speed: 1.2, opacity: 0.6, verticalPosition: 0.5 },
        { amplitude: 30, frequency: 0.02, speed: 0.7, opacity: 0.4, verticalPosition: 0.6 },
        { amplitude: 20, frequency: 0.04, speed: 0.9, opacity: 0.7, verticalPosition: 0.7 }
      ];
      
      waveLayers.forEach(layer => {
        ctx.fillStyle = createPurpleGradient(layer.verticalPosition * height, layer.opacity);
        
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        // Draw wave path
        for (let x = 0; x <= width; x += 5) {
          const y = layer.verticalPosition * height + 
                  Math.sin(x * layer.frequency + time * layer.speed) * layer.amplitude +
                  Math.sin(x * layer.frequency * 0.5 + time * layer.speed * 1.3) * layer.amplitude * 0.5;
          
          ctx.lineTo(x, y);
        }
        
        // Complete the path to fill the area below the wave
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  // Create intensity dots
  const intensityDots = [];
  for (let i = 0; i < 5; i++) {
    const active = (i + 1) * 20 <= 80; // 80% is the current value shown
    intensityDots.push(
      <div 
        key={i} 
        style={{ 
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          marginRight: '3px',
          backgroundColor: active 
            ? `rgba(${180 - i * 25}, ${100 + i * 30}, ${230 - i * 20}, ${active ? 1 : 0.4})` 
            : '#555'
        }}
      />
    );
  }
  
  return (
    <div className="card" style={{ 
      backgroundColor: '#191927', 
      borderRadius: '16px', 
      padding: '20px',
      height: '100%',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '500' }}>Intensity</div>
        <div style={{ color: '#a1a1b5', fontSize: '0.9rem' }}>September 2021</div>
      </div>
      
      <div style={{ color: '#a1a1b5', fontSize: '0.9rem', marginBottom: '20px' }}>
        Minim dolor in amet nulla laboris enim dolore consequat.
      </div>
      
      <div style={{ position: 'relative', height: '180px', marginBottom: '20px' }}>
        <canvas 
          ref={canvasRef} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transition: 'opacity 0.5s ease',
            opacity: animationStarted ? 1 : 0
          }}
        />
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '10px' }}>Intensity zones</div>
          <div style={{ display: 'flex' }}>
            {intensityDots}
          </div>
        </div>
        
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          80%
        </div>
        
        <div style={{ cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default IntensityChart;