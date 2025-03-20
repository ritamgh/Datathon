import React, { useState, useEffect } from 'react';

const TopProducts = ({ data }) => {
  const [animationStarted, setAnimationStarted] = useState(false);
  
  // Start animation when component mounts
  useEffect(() => {
    setAnimationStarted(true);
  }, []);
  
  // Product icons for the reference layout
  const getProductIcon = (productName, index) => {
    const productIcons = {
      'Dunlop Racket': (
        <div style={{ 
          width: '36px', 
          height: '36px', 
          borderRadius: '50%', 
          backgroundColor: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <path d="M6 6h12v12H6z" />
            <path d="M6 6v12l12-12v12" />
          </svg>
        </div>
      ),
      'Shuttlecock': (
        <div style={{ 
          width: '36px', 
          height: '36px', 
          borderRadius: '50%', 
          backgroundColor: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
        </div>
      ),
      'Badminton Shoes': (
        <div style={{ 
          width: '36px', 
          height: '36px', 
          borderRadius: '50%', 
          backgroundColor: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <path d="M15 2H9l-3 6v8h12v-8l-3-6z" />
            <path d="M3 18h18" />
          </svg>
        </div>
      ),
      'Hand Grip': (
        <div style={{ 
          width: '36px', 
          height: '36px', 
          borderRadius: '50%', 
          backgroundColor: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <path d="M12 2v10l4 4" />
            <path d="M12 12l-4 4" />
            <path d="M20 12l-8 8-8-8" />
          </svg>
        </div>
      ),
      'Toner Bag': (
        <div style={{ 
          width: '36px', 
          height: '36px', 
          borderRadius: '50%', 
          backgroundColor: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <rect x="3" y="6" width="18" height="15" rx="2" />
            <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            <line x1="8" y1="10" x2="8" y2="16" />
            <line x1="12" y1="10" x2="12" y2="16" />
            <line x1="16" y1="10" x2="16" y2="16" />
          </svg>
        </div>
      )
    };
    
    // Return specific icon if it exists in our mapping, otherwise return a default circle
    return productIcons[productName] || (
      <div style={{ 
        width: '36px', 
        height: '36px', 
        borderRadius: '50%', 
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#333',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        opacity: 0,
        animation: animationStarted ? 'circleGrow 0.5s ease forwards' : 'none',
        animationDelay: `${0.3 + index * 0.1}s`
      }}>
        {productName.charAt(0)}
      </div>
    );
  };
  
  return (
    <div className="card">
      <div className="card-header" style={{ position: 'relative' }}>
        <div>
          <div className="card-title">Top Product</div>
          <div 
            className="card-subtitle" 
            style={{ 
              fontSize: '0.8rem', 
              color: '#a1a1b5',
              marginTop: '4px'
            }}
          >
            Based on sales and rate
          </div>
        </div>
        
        <div 
          className="menu-icon" 
          style={{ 
            position: 'absolute',
            right: '0',
            top: '0',
            cursor: 'pointer'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </div>
      </div>
      
      <div className="products-list" style={{ marginTop: '20px' }}>
        {data.map((product, index) => (
          <div 
            key={index} 
            className="product-item" 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: index === data.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
              opacity: 0,
              animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
              animationDelay: `${0.4 + index * 0.2}s`,
              transform: animationStarted ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'transform 0.5s ease',
              transitionDelay: `${0.4 + index * 0.2}s`
            }}
          >
            {getProductIcon(product.name, index)}
            
            <div className="product-info" style={{ marginLeft: '12px', flex: 1 }}>
              <div className="product-name" style={{ fontSize: '0.95rem', marginBottom: '4px' }}>
                {product.name}
              </div>
              <div className="product-sold" style={{ fontSize: '0.8rem', color: '#a1a1b5' }}>
                {product.sold}
              </div>
            </div>
            
            <div className="product-metrics" style={{ textAlign: 'right' }}>
              <div 
                className="product-value" 
                style={{ 
                  fontSize: '0.95rem', 
                  color: '#4cd964', 
                  marginBottom: '4px',
                  opacity: 0,
                  animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
                  animationDelay: `${0.6 + index * 0.2}s`
                }}
              >
                {product.change}
              </div>
              <div 
                className="product-change" 
                style={{ 
                  fontSize: '0.8rem', 
                  color: '#a1a1b5',
                  opacity: 0,
                  animation: animationStarted ? 'fadeIn 0.5s ease forwards' : 'none',
                  animationDelay: `${0.7 + index * 0.2}s`
                }}
              >
                {product.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;