import React from 'react';

const RevenueSourcesChart = ({ data }) => {
  // Color mapping for revenue sources
  const getSourceColor = (index) => {
    const colors = ['#2e64fe', '#ffcc00', '#8022ef', '#4cd964'];
    return colors[index % colors.length];
  };
  
  // Calculate percentage based on values for visualization
  const calculatePercentages = () => {
    const totalValue = data.reduce((sum, item) => {
      const numericValue = parseFloat(item.value.replace(/[^0-9.-]+/g, ''));
      return sum + numericValue;
    }, 0);
    
    return data.map((item, index) => {
      const numericValue = parseFloat(item.value.replace(/[^0-9.-]+/g, ''));
      return {
        ...item,
        percentage: (numericValue / totalValue * 100).toFixed(1),
        color: getSourceColor(index)
      };
    });
  };
  
  const sourcesWithPercentages = calculatePercentages();
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Revenue Sources</div>
      </div>
      
      <div className="revenue-pie-chart" style={{ marginTop: '16px', height: '180px', position: 'relative' }}>
        {/* SVG Donut Chart */}
        <svg width="100%" height="100%" viewBox="0 0 160 160" style={{ display: 'block', margin: '0 auto' }}>
          <circle cx="80" cy="80" r="70" fill="transparent" stroke="#2a2a3a" strokeWidth="20" />
          
          {/* Create donut chart segments */}
          <circle 
            cx="80" 
            cy="80" 
            r="70" 
            fill="transparent" 
            stroke="#2e64fe" 
            strokeWidth="20" 
            strokeDasharray="439.6"
            strokeDashoffset={(439.6 * (100 - parseFloat(sourcesWithPercentages[0].percentage))) / 100}
            transform="rotate(-90 80 80)"
          />
          
          <circle 
            cx="80" 
            cy="80" 
            r="70" 
            fill="transparent" 
            stroke="#ffcc00" 
            strokeWidth="20" 
            strokeDasharray="439.6"
            strokeDashoffset="329.7"
            transform="rotate(-90 80 80)"
            style={{ opacity: 0.85 }}
          />
          
          <circle 
            cx="80" 
            cy="80" 
            r="70" 
            fill="transparent" 
            stroke="#8022ef" 
            strokeWidth="20" 
            strokeDasharray="439.6"
            strokeDashoffset="395.6"
            transform="rotate(-90 80 80)"
            style={{ opacity: 0.85 }}
          />
          
          <circle 
            cx="80" 
            cy="80" 
            r="70" 
            fill="transparent" 
            stroke="#4cd964" 
            strokeWidth="20" 
            strokeDasharray="439.6"
            strokeDashoffset="417.6"
            transform="rotate(-90 80 80)"
            style={{ opacity: 0.85 }}
          />
          
          {/* Center text */}
          <text x="80" y="75" textAnchor="middle" fill="white" fontSize="12">
            Total Revenue
          </text>
          <text x="80" y="95" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
            $1.07M
          </text>
        </svg>
      </div>
      
      <div className="sources-legend" style={{ marginTop: '16px' }}>
        {sourcesWithPercentages.map((source, index) => (
          <div 
            key={index} 
            className="legend-item" 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: index === sourcesWithPercentages.length - 1 ? 0 : '12px'
            }}
          >
            <div className="source-info" style={{ display: 'flex', alignItems: 'center' }}>
              <div 
                className="color-indicator" 
                style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: source.color,
                  borderRadius: '2px',
                  marginRight: '8px'
                }}
              ></div>
              <div className="source-name">
                {source.name}
              </div>
            </div>
            
            <div className="metrics" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="percentage" style={{ marginRight: '12px', color: '#a1a1b5' }}>
                {source.percentage}%
              </div>
              <div className="value" style={{ fontWeight: '500' }}>
                {source.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueSourcesChart;