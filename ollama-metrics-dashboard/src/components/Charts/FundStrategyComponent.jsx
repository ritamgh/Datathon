import React, { useState } from 'react';
import './FundStrategyStyles.css';

const FundStrategyComponent = ({ initialData }) => {
  const [strategyData, setStrategyData] = useState(
    initialData || [
      { name: 'STOCKS REFUND', percentage: 67 },
      { name: 'INVESTMENT FUND', percentage: 35 },
      { name: 'CRYPTO ASSETS', percentage: 48 },
      { name: 'REAL ESTATE', percentage: 22 }
    ]
  );
  
  const [approved, setApproved] = useState(true);
  
  const toggleApproval = () => {
    setApproved(!approved);
  };
  
  const addStrategy = () => {
    const strategies = [
      'BOND INVESTMENT', 
      'MUTUAL FUNDS', 
      'ETF PORTFOLIO', 
      'PRECIOUS METALS', 
      'FOREIGN MARKETS'
    ];
    
    const existingNames = strategyData.map(item => item.name);
    const availableStrategies = strategies.filter(s => !existingNames.includes(s));
    
    if (availableStrategies.length > 0) {
      const newStrategy = {
        name: availableStrategies[Math.floor(Math.random() * availableStrategies.length)],
        percentage: Math.floor(Math.random() * 70) + 10
      };
      
      setStrategyData([...strategyData, newStrategy]);
    }
  };
  
  return (
    <div className="fund-strategy-card">
      <div className="fund-strategy-header">
        <div className="fund-strategy-title">Fund strategy</div>
        <div 
          className={`approval-status ${approved ? 'approved' : 'pending'}`}
          onClick={toggleApproval}
        >
          {approved ? 'Approved' : 'Pending'}
        </div>
        <button className="add-button" onClick={addStrategy}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      
      <div className="strategy-list">
        {strategyData.map((item, index) => (
          <div className="strategy-item" key={index}>
            <div className="strategy-name">{item.name}</div>
            <div className="strategy-bar-container">
              <div 
                className="strategy-bar" 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <div className="strategy-percentage">{item.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FundStrategyComponent;