import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [selectedModel, setSelectedModel] = useState('GPT-4');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const models = ['GPT-4', 'Claude 3', 'Llama 2', 'Mistral', 'PaLM'];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      <div className="left-content">
        <Link to="/" className="logo">MarketSavvy</Link>
        
        <div className="model-select" ref={dropdownRef}>
          <div className="selected-model" onClick={toggleDropdown}>
            {selectedModel}
          </div>
          {isDropdownOpen && (
            <div className="models-dropdown">
              {models.map((model) => (
                <div 
                  key={model} 
                  className="model-option"
                  onClick={() => handleModelSelect(model)}
                >
                  {model}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Navigation Links */}
        <nav className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
        </nav>
      </div>
      
      <div className="right-content">
        <a href="#" className="nav-link">About</a>
        <a href="#" className="nav-link">More</a>
        <a href="#" className="button outline">Sign In</a>
        <a href="#" className="button primary">Join MarketSavvy</a>
      </div>
    </div>
  );
};

export default Header;