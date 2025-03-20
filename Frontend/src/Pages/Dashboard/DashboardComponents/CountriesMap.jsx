import React, { useState, useEffect } from 'react';

const CountriesMap = ({ data }) => {
  const [selectedRegion, setSelectedRegion] = useState('Asia');
  const [animationStarted, setAnimationStarted] = useState(false);
  
  // Start animation when component mounts
  useEffect(() => {
    setAnimationStarted(true);
  }, []);
  
  const regions = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Customer Countries</div>
        <div 
          className="total-customers stat-number" 
          style={{ 
            fontSize: '0.85rem', 
            color: '#a1a1b5',
            opacity: 0,
            animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
            animationDelay: '0.3s'
          }}
        >
          124,285
          <span style={{ marginLeft: '4px', fontSize: '0.8rem' }}>
            total visits
          </span>
        </div>
      </div>
      
      <div 
        className="region-selector" 
        style={{ 
          marginTop: '16px',
          opacity: 0,
          animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
          animationDelay: '0.5s'
        }}
      >
        <select 
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: '#2a2a3a',
            border: 'none',
            color: 'white',
            fontSize: '0.9rem',
            width: '100%',
            cursor: 'pointer'
          }}
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
      
      <div 
        className="world-map" 
        style={{ 
          margin: '20px 0', 
          textAlign: 'center',
          opacity: 0,
          animation: animationStarted ? 'fadeIn 1s ease forwards' : 'none',
          animationDelay: '0.7s'
        }}
      >
        {/* Simplified World Map SVG */}
        <svg width="100%" height="150" viewBox="0 0 240 150" fill="none">
          <path d="M12,35 L28,32 L45,30 L60,40 L75,35 L85,45 L100,40 L115,42 L130,38 L140,45 L155,42 L170,48 L185,50 L200,45 L215,50 L228,40" 
                stroke="#2a2a3a" strokeWidth="1" fill="#2a2a3a" />
          <path d="M30,60 L45,55 L60,65 L75,70 L90,75 L105,68 L120,72 L135,78 L150,70 L165,80 L180,75 L195,85 L210,80" 
                stroke="#2a2a3a" strokeWidth="1" fill="#2a2a3a" />
          <path d="M40,95 L55,90 L70,100 L85,105 L100,95 L115,105 L130,100 L145,110 L160,105 L175,115 L190,110 L205,118" 
                stroke="#2a2a3a" strokeWidth="1" fill="#2a2a3a" />
                
          {/* Highlighted points for the selected countries */}
          <circle 
            cx="85" cy="75" r="5" fill="#2e64fe" opacity="0"
            style={{
              animation: animationStarted ? 'pulseDot 2s ease-in-out infinite' : 'none',
              animationDelay: '1s'
            }}
          /> {/* Indonesia */}
          <circle 
            cx="100" cy="68" r="4" fill="#2e64fe" opacity="0"
            style={{
              animation: animationStarted ? 'pulseDot 2s ease-in-out infinite' : 'none',
              animationDelay: '1.2s'
            }}
          /> {/* Malaysia */}
          <circle 
            cx="105" cy="72" r="3" fill="#2e64fe" opacity="0"
            style={{
              animation: animationStarted ? 'pulseDot 2s ease-in-out infinite' : 'none',
              animationDelay: '1.4s'
            }}
          /> {/* Singapore */}
          <circle 
            cx="130" cy="38" r="3" fill="#2e64fe" opacity="0"
            style={{
              animation: animationStarted ? 'pulseDot 2s ease-in-out infinite' : 'none',
              animationDelay: '1.6s'
            }}
          /> {/* Japan */}
        </svg>
      </div>
      
      <div className="countries-list" style={{ marginTop: '10px' }}>
        {data.map((country, index) => (
          <div 
            key={index} 
            className="country-item" 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: index === data.length - 1 ? 0 : '12px',
              opacity: 0,
              animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
              animationDelay: `${1.8 + index * 0.2}s`
            }}
          >
            <div className="country-flag" style={{ marginRight: '12px', width: '24px', height: '16px' }}>
              {getCountryFlag(country.name)}
            </div>
            
            <div className="country-name" style={{ flex: 1 }}>
              {country.name}
            </div>
            
            <div className="country-percentage" style={{ fontWeight: '500' }}>
              {country.percentage}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get flag emoji for a country
const getCountryFlag = (countryName) => {
  // This is a simplified version using CSS flags
  switch(countryName.toLowerCase()) {
    case 'indonesia':
      return <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom, #ff0000 50%, #ffffff 50%)' }}></div>;
    case 'malaysia':
      return <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(#cc0001 0px, #cc0001 16px, #fff 16px, #fff 32px, #0033A0 32px, #0033A0 48px, #fff 48px, #fff 64px, #FFD700 64px, #FFD700 80px)'}}></div>;
    case 'singapore':
      return <div style={{ width: '100%', height: '100%', backgroundColor: '#ff0000' }}></div>;
    case 'japan':
      return <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '50%', height: '50%', borderRadius: '50%', backgroundColor: '#bc002d' }}></div>
      </div>;
    default:
      return <div style={{ width: '100%', height: '100%', backgroundColor: '#cccccc' }}></div>;
  }
};

export default CountriesMap;