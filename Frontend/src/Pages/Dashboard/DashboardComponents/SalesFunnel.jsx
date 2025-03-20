import React, { useState } from 'react';

const SalesFunnel = ({ data, period, onPeriodChange, periodOptions }) => {
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
        <div className="card-title">Sales Funnel</div>
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
      
      <div className="funnel-metrics" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div className="metric">
          <div className="metric-label" style={{ fontSize: '0.85rem', color: '#a1a1b5', marginBottom: '6px' }}>
            Visitors
          </div>
          <div className="metric-value" style={{ fontSize: '1.5rem', fontWeight: '500' }}>
            {data.visitors}
          </div>
        </div>
        
        <div className="metric">
          <div className="metric-label" style={{ fontSize: '0.85rem', color: '#a1a1b5', marginBottom: '6px' }}>
            Views
          </div>
          <div className="metric-value" style={{ fontSize: '1.5rem', fontWeight: '500' }}>
            {data.views}
          </div>
        </div>
        
        <div className="metric">
          <div className="metric-label" style={{ fontSize: '0.85rem', color: '#a1a1b5', marginBottom: '6px' }}>
            Carts
          </div>
          <div className="metric-value" style={{ fontSize: '1.5rem', fontWeight: '500' }}>
            {data.carts}
          </div>
        </div>
        
        <div className="metric">
          <div className="metric-label" style={{ fontSize: '0.85rem', color: '#a1a1b5', marginBottom: '6px' }}>
            Buyers
          </div>
          <div className="metric-value" style={{ fontSize: '1.5rem', fontWeight: '500' }}>
            {data.buyers}
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        {/* SVG Funnel Chart */}
        <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2e64fe" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2e64fe" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {/* Background Grid Lines */}
          <line x1="0" y1="40" x2="600" y2="40" stroke="#2a2a3a" strokeWidth="1" />
          <line x1="0" y1="80" x2="600" y2="80" stroke="#2a2a3a" strokeWidth="1" />
          <line x1="0" y1="120" x2="600" y2="120" stroke="#2a2a3a" strokeWidth="1" />
          <line x1="0" y1="160" x2="600" y2="160" stroke="#2a2a3a" strokeWidth="1" />
          
          {/* Chart Line */}
          <path 
            d="M50,30 C100,30 150,60 200,80 S300,120 400,140 S500,170 550,180" 
            fill="none" 
            stroke="#2e64fe" 
            strokeWidth="3" 
          />
          
          {/* Filled Area */}
          <path 
            d="M50,30 C100,30 150,60 200,80 S300,120 400,140 S500,170 550,180 L550,200 L50,200 Z" 
            fill="url(#chartGradient)" 
          />
          
          {/* Data Points */}
          <circle cx="50" cy="30" r="5" fill="#2e64fe" />
          <circle cx="200" cy="80" r="5" fill="#2e64fe" />
          <circle cx="400" cy="140" r="5" fill="#2e64fe" />
          <circle cx="550" cy="180" r="5" fill="#2e64fe" />
        </svg>
      </div>
    </div>
  );
};

export default SalesFunnel;