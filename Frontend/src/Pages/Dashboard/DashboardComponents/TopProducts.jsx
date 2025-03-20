import React from 'react';

const TopProducts = ({ data }) => {
  // Generate a random avatar/circle for each product
  const getProductIcon = (index) => {
    const colors = ['#2e64fe', '#4cd964', '#ff9500', '#ff3b30', '#5ac8fa'];
    const color = colors[index % colors.length];
    
    return (
      <div 
        className="product-icon" 
        style={{ 
          width: '36px', 
          height: '36px', 
          borderRadius: '50%', 
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}
      >
        {data[index].name.charAt(0)}
      </div>
    );
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Top Product</div>
        <div className="card-subtitle" style={{ fontSize: '0.8rem', color: '#a1a1b5' }}>
          Based on sales and rank
        </div>
        <div className="menu-icon" style={{ cursor: 'pointer', marginLeft: 'auto' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </div>
      </div>
      
      <div className="products-list" style={{ marginTop: '16px' }}>
        {data.map((product, index) => (
          <div 
            key={index} 
            className="product-item" 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: index === data.length - 1 ? 'none' : '1px solid #2a2a3a'
            }}
          >
            {getProductIcon(index)}
            
            <div className="product-info" style={{ marginLeft: '12px', flex: 1 }}>
              <div className="product-name" style={{ fontSize: '0.95rem', marginBottom: '4px' }}>
                {product.name}
              </div>
              <div className="product-sold" style={{ fontSize: '0.8rem', color: '#a1a1b5' }}>
                {product.sold}
              </div>
            </div>
            
            <div className="product-metrics" style={{ textAlign: 'right' }}>
              <div className="product-value" style={{ fontSize: '0.95rem', color: '#2e64fe', marginBottom: '4px' }}>
                {product.value}
              </div>
              <div className="product-change" style={{ fontSize: '0.8rem', color: '#4cd964' }}>
                {product.change}
              </div>
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

export default TopProducts;