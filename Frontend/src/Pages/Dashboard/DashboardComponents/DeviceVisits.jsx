import React, { useState } from 'react';

const DeviceVisits = ({ data, period, onPeriodChange, periodOptions }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handlePeriodChange = (newPeriod) => {
    onPeriodChange(newPeriod);
    setIsDropdownOpen(false);
  };
  
  const getDeviceIcon = (deviceName) => {
    switch(deviceName.toLowerCase()) {
      case 'mobile':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12" y2="18" />
          </svg>
        );
      case 'desktop':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        );
      case 'tablet':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12" y2="18" />
          </svg>
        );
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        );
    }
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Visit by Device</div>
        <div className="period-selector">
          <div className="selected-period" onClick={toggleDropdown}>
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
      
      <div className="visits-total">
        <div className="value-large" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>
          {data.total}
        </div>
        <div className="change" style={{ color: data.change.includes('+') ? '#4cd964' : '#ff3b30', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '4px' }}>
            {data.change.includes('+') ? '↑' : '↓'}
          </span>
          {data.change}
        </div>
      </div>
      
      <div className="devices-list" style={{ marginTop: '24px' }}>
        {data.devices.map((device, index) => (
          <div key={index} className="device-item" style={{ marginBottom: '16px' }}>
            <div className="device-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div className="device-info" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="device-icon" style={{ marginRight: '8px', color: getDeviceIconColor(device.name) }}>
                  {getDeviceIcon(device.name)}
                </div>
                <div className="device-name">{device.name}</div>
              </div>
              <div className="device-value">{device.value}</div>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress ${device.name.toLowerCase() === 'mobile' ? 'progress-green' : 'progress-orange'}`}
                style={{ width: device.percentage }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="device-types" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #2a2a3a', paddingTop: '16px' }}>
        <div className="device-type">
          <div className="type-label" style={{ fontSize: '0.8rem', color: '#a1a1b5' }}>iOS</div>
          <div className="type-value">505</div>
        </div>
        <div className="device-type">
          <div className="type-label" style={{ fontSize: '0.8rem', color: '#a1a1b5' }}>Android</div>
          <div className="type-value">225</div>
        </div>
        <div className="device-type">
          <div className="type-label" style={{ fontSize: '0.8rem', color: '#a1a1b5' }}>Win</div>
          <div className="type-value">365</div>
        </div>
        <div className="device-type">
          <div className="type-label" style={{ fontSize: '0.8rem', color: '#a1a1b5' }}>Mac</div>
          <div className="type-value">522</div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color based on device name
const getDeviceIconColor = (deviceName) => {
  switch(deviceName.toLowerCase()) {
    case 'mobile': return '#4cd964';
    case 'desktop': return '#ff9500';
    case 'tablet': return '#5ac8fa';
    default: return '#a1a1b5';
  }
};

export default DeviceVisits;