import React, { useState } from 'react';

const RevenueCard = ({ data, period, onPeriodChange, periodOptions }) => {
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
        <div className="card-title">Total Revenue</div>
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
      
      <div className="card-content">
        <div className="revenue-value">{data.total}</div>
        <div className="revenue-growth">
          <span 
            className="growth-arrow" 
            style={{ marginRight: '6px', color: data.growth.includes('+') ? '#4cd964' : '#ff3b30' }}
          >
            {data.growth.includes('+') ? '↑' : '↓'}
          </span>
          {data.growth}
        </div>
        <div className="revenue-compared">{data.compared}</div>
      </div>
      
      <div className="card-footer" style={{ marginTop: 'auto', paddingTop: '16px' }}>
        <div className="section-title">Revenue Sources</div>
        <div className="source-labels" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem' }}>
          <span>Google</span>
          <span>Facebook</span>
          <span>Twitter</span>
          <span>Reddit</span>
        </div>
        <div className="bar-chart">
          <div className="bar bar-blue" style={{ width: '45%' }}></div>
          <div className="bar bar-yellow" style={{ width: '25%' }}></div>
          <div className="bar bar-purple" style={{ width: '20%' }}></div>
          <div className="bar bar-green" style={{ width: '10%' }}></div>
        </div>
        <div className="source-values" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.8rem', color: '#a1a1b5' }}>
          <span>$645.15k</span>
          <span>$234.15k</span>
          <span>$154.15k</span>
          <span>$42.15k</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;