import React from 'react';

const IntensityChart = () => {
  // List of intensity dots colors
  const intensityColors = [
    '#6b46c1', // purple
    '#8a3ffc', // medium purple
    '#9f5afd', // light purple
    '#c77dff', // lavender
    '#e9d5ff'  // light lavender
  ];

  return (
    <div className="card" style={{ 
      backgroundColor: '#191927', 
      borderRadius: '16px', 
      padding: '20px',
      height: '100%'
    }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div className="card-title" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Intensity</div>
        <div className="card-date" style={{ fontSize: '0.85rem', color: '#a1a1b5' }}>
          September 2021
        </div>
      </div>

      <div className="intensity-content">
        <p className="intensity-description" style={{ fontSize: '0.9rem', color: '#a1a1b5', marginBottom: '20px' }}>
          Minim dolor in amet nulla laboris enim dolore consequatt.
        </p>

        <div className="intensity-chart" style={{ position: 'relative', height: '180px', marginBottom: '30px' }}>
          {/* SVG for wave visualization */}
          <svg width="100%" height="100%" viewBox="0 0 400 180" preserveAspectRatio="none">
            {/* Definitions for gradients */}
            <defs>
              <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d946ef" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="purpleGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8a3ffc" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#8a3ffc" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="purpleGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9f5afd" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#9f5afd" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="purpleGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c77dff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#c77dff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lavenderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Center divider line */}
            <rect x="0" y="88" width="400" height="4" fill="#c026d3" />

            {/* Top Waves - multiple overlapping layers with wavy patterns */}
            <path d="M0,90 C10,70 20,50 30,70 C40,90 50,40 60,60 C70,80 80,30 90,40 C100,50 110,20 120,40 C130,60 140,30 150,50 C160,70 170,40 180,45 C190,50 200,30 210,60 C220,90 230,40 240,30 C250,20 260,40 270,65 C280,90 290,60 300,40 C310,20 320,50 330,70 C340,90 350,50 360,30 C370,10 380,40 390,70 C395,85 400,90 400,90 L0,90 Z" 
                 fill="#c026d3" fillOpacity="0.3" />
                  
            <path d="M0,90 C15,75 30,60 40,70 C50,80 60,60 70,50 C80,40 90,65 100,75 C110,85 120,50 130,40 C140,30 150,60 160,75 C170,90 180,70 190,50 C200,30 210,65 220,75 C230,85 240,60 250,40 C260,20 270,50 280,65 C290,80 300,60 310,45 C320,30 330,55 340,75 C350,95 360,60 370,40 C380,20 390,60 400,90 L0,90 Z" 
                 fill="url(#purpleGradient1)" />
                  
            <path d="M0,90 C20,80 40,70 55,55 C70,40 85,70 100,80 C115,90 130,70 145,50 C160,30 175,65 190,80 C205,95 220,70 235,50 C250,30 265,60 280,75 C295,90 310,70 325,50 C340,30 355,70 370,85 C385,100 400,90 400,90 L0,90 Z" 
                 fill="url(#purpleGradient2)" />
                  
            <path d="M0,90 C25,80 50,60 70,65 C90,70 110,85 130,80 C150,75 170,55 190,60 C210,65 230,80 250,75 C270,70 290,50 310,55 C330,60 350,75 370,70 C390,65 400,90 400,90 L0,90 Z" 
                 fill="url(#purpleGradient3)" />
                  
            <path d="M0,90 C30,85 60,75 80,80 C100,85 120,75 140,70 C160,65 180,75 200,80 C220,85 240,75 260,70 C280,65 300,75 320,80 C340,85 360,75 380,70 C390,65 400,90 400,90 L0,90 Z" 
                 fill="url(#lavenderGradient)" />

            {/* Bottom Waves - mirrored versions of the top waves */}
            <path d="M0,90 C10,110 20,130 30,110 C40,90 50,140 60,120 C70,100 80,150 90,140 C100,130 110,160 120,140 C130,120 140,150 150,130 C160,110 170,140 180,135 C190,130 200,150 210,120 C220,90 230,140 240,150 C250,160 260,140 270,115 C280,90 290,120 300,140 C310,160 320,130 330,110 C340,90 350,130 360,150 C370,170 380,140 390,110 C395,95 400,90 400,90 L0,90 Z" 
                 fill="#c026d3" fillOpacity="0.3" />
                  
            <path d="M0,90 C15,105 30,120 40,110 C50,100 60,120 70,130 C80,140 90,115 100,105 C110,95 120,130 130,140 C140,150 150,120 160,105 C170,90 180,110 190,130 C200,150 210,115 220,105 C230,95 240,120 250,140 C260,160 270,130 280,115 C290,100 300,120 310,135 C320,150 330,125 340,105 C350,85 360,120 370,140 C380,160 390,120 400,90 L0,90 Z" 
                 fill="url(#purpleGradient1)" />
                  
            <path d="M0,90 C20,100 40,110 55,125 C70,140 85,110 100,100 C115,90 130,110 145,130 C160,150 175,115 190,100 C205,85 220,110 235,130 C250,150 265,120 280,105 C295,90 310,110 325,130 C340,150 355,110 370,95 C385,80 400,90 400,90 L0,90 Z" 
                 fill="url(#purpleGradient2)" />
                  
            <path d="M0,90 C25,100 50,120 70,115 C90,110 110,95 130,100 C150,105 170,125 190,120 C210,115 230,100 250,105 C270,110 290,130 310,125 C330,120 350,105 370,110 C390,115 400,90 400,90 L0,90 Z" 
                 fill="url(#purpleGradient3)" />
                  
            <path d="M0,90 C30,95 60,105 80,100 C100,95 120,105 140,110 C160,115 180,105 200,100 C220,95 240,105 260,110 C280,115 300,105 320,100 C340,95 360,105 380,110 C390,115 400,90 400,90 L0,90 Z" 
                 fill="url(#lavenderGradient)" />
          </svg>
        </div>

        <div className="intensity-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="intensity-label" style={{ fontSize: '0.9rem', marginRight: '10px', whiteSpace: 'nowrap' }}>
              Intensity zones
            </div>
            <div className="intensity-dots" style={{ display: 'flex', gap: '3px' }}>
              {intensityColors.map((color, index) => (
                <div 
                  key={index} 
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: color 
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="intensity-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
            80%
          </div>

          <div className="menu-dots" style={{ cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a1a1b5" strokeWidth="2">
              <circle cx="12" cy="5" r="1" fill="#a1a1b5" />
              <circle cx="12" cy="12" r="1" fill="#a1a1b5" />
              <circle cx="12" cy="19" r="1" fill="#a1a1b5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntensityChart;