import React from 'react';

const OngoingSale = ({ data }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">On going sale</div>
      </div>
      
      <div className="sale-content" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="sale-value" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
          {data.total}
        </div>
        
        <div className="date-range" style={{ fontSize: '0.85rem', color: '#a1a1b5', marginBottom: '24px' }}>
          {data.startDate} - {data.endDate}
        </div>
        
        <div className="bar-chart-container" style={{ width: '100%', marginBottom: '24px' }}>
          {/* Custom Bar Chart */}
          <div style={{ display: 'flex', width: '100%', height: '75px', justifyContent: 'space-between' }}>
            {[15, 20, 16, 17, 22, 19, 12].map((value, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  height: '100%',
                  width: '13%'
                }}
              >
                <div 
                  style={{ 
                    width: '100%', 
                    height: `${(value / 22) * 100}%`, 
                    backgroundColor: index === 4 ? '#ffcc00' : '#2e64fe',
                    borderRadius: '4px'
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="sale-metrics" style={{ width: '100%' }}>
          <div className="metric-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div className="metric-name">Store Visits</div>
            <div className="metric-value">10,254</div>
          </div>
          
          <div className="metric-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div className="metric-name">Visitors</div>
            <div className="metric-value">8,767</div>
          </div>
          
          <div className="metric-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="metric-name">Transactions</div>
            <div className="metric-value">6,834</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingSale;