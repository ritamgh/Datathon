import React from 'react';

const RecentTransactions = ({ data }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Recent Transaction</div>
      </div>
      
      <div className="transaction-table" style={{ marginTop: '16px' }}>
        <div className="table-header" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr', padding: '8px 0', borderBottom: '1px solid #2a2a3a' }}>
          <div className="header-cell" style={{ fontSize: '0.85rem', color: '#a1a1b5' }}>CODE</div>
          <div className="header-cell" style={{ fontSize: '0.85rem', color: '#a1a1b5' }}>PRODUCT</div>
          <div className="header-cell" style={{ fontSize: '0.85rem', color: '#a1a1b5' }}>DATE</div>
          <div className="header-cell" style={{ fontSize: '0.85rem', color: '#a1a1b5' }}>PRICE</div>
          <div className="header-cell" style={{ fontSize: '0.85rem', color: '#a1a1b5' }}>STATUS</div>
        </div>
        
        {data.map((transaction, index) => (
          <div 
            key={index} 
            className="table-row" 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr', 
              padding: '16px 0',
              borderBottom: index === data.length - 1 ? 'none' : '1px solid #2a2a3a',
              fontSize: '0.9rem'
            }}
          >
            <div className="cell">{transaction.id}</div>
            <div className="cell">{transaction.product}</div>
            <div className="cell">{transaction.date}</div>
            <div className="cell">{transaction.price}</div>
            <div className="cell">
              <span 
                className={`status ${transaction.status.toLowerCase() === 'success' ? 'status-success' : 'status-pending'}`}
              >
                {transaction.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="see-all-link" style={{ marginTop: '16px', textAlign: 'right' }}>
        <a href="#" style={{ color: '#a1a1b5', textDecoration: 'none', fontSize: '0.9rem' }}>
          See all
        </a>
      </div>
    </div>
  );
};

export default RecentTransactions;