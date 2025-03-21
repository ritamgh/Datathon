import React, { useState, useEffect } from 'react';
import './Dashboard.css';
// Import all the animated components
import RevenueCard from './DashboardComponents/RevenueCard';
import SalesFunnel from './DashboardComponents/SalesFunnel';
import RevenueSourcesChart from './DashboardComponents/RevenueSourcesChart';
import CountriesMap from './DashboardComponents/CountriesMap';
import DeviceVisits from './DashboardComponents/DeviceVisits';
import OngoingSale from './DashboardComponents/OngoingSale';
import TopProducts from './DashboardComponents/TopProducts';
import RecentTransactions from './DashboardComponents/RecentTransactions';
import TargetMetrics from './DashboardComponents/TargetMetrics';
import IntensityChart from './DashboardComponents/IntensityChart';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This month');
  const [isLoading, setIsLoading] = useState(true);
  const key = useState(Date.now())[0]; // Key for forcing re-render of components
  // Removed unused isRefreshing state
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  
  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle refresh click
  // Removed unused handleRefresh function
  
  // Demo data
  const revenueData = {
    total: '$1,253,235',
    growth: '+24%',
    compared: '$345.45 this month!',
  };
  
  const salesFunnelData = {
    visitors: '115.4k',
    views: '125.4k',
    carts: '95.4k',
    buyers: '75.4k',
  };
  
  const revenueSourcesData = [
    { name: 'Google', value: '$645.15k' },
    { name: 'Facebook', value: '$234.15k' },
    { name: 'Twitter', value: '$154.15k' },
    { name: 'Reddit', value: '$42.15k' },
  ];
  
  const countriesData = [
    { name: 'Indonesia', percentage: '91.1k', percent: '55%' },
    { name: 'Malaysia', percentage: '64.1k', percent: '25%' },
    { name: 'Singapore', percentage: '10.2k', percent: '15%' },
    { name: 'Japan', percentage: '2.1k', percent: '5%' },
  ];
  
  const deviceData = {
    total: '45,234',
    change: '-0.44%',
    devices: [
      { name: 'Mobile', value: '1,696', percentage: '60%' },
      { name: 'Desktop', value: '696', percentage: '30%' },
    ],
    platforms: [
      { name: 'Android', value: '1,244' },
      { name: 'iOS', value: '452' },
      { name: 'Win', value: '124' },
      { name: 'Mac', value: '507' },
    ]
  };
  
  const ongoingSaleData = {
    total: '11,141',
    startDate: '23/06/2023',
    endDate: '12:12 PM',
  };
  
  const topProductsData = [
    { name: 'Dunlop Racket', sold: 'Sold 4,124', value: '$14,516', change: '+$4,516' },
    { name: 'Shuttlecock', sold: 'Sold 3,124', value: '$8,516', change: '+$4,516' },
    { name: 'Badminton Shoes', sold: 'Sold 1,124', value: '$7,516', change: '+$4,516' },
    { name: 'Hand Grip', sold: 'Sold 824', value: '$6,516', change: '+$4,516' },
    { name: 'Toner Bag', sold: 'Sold 724', value: '$5,516', change: '+$4,516' },
  ];
  
  const recentTransactionsData = [
    { id: '#12416323323', product: 'iPhone 14 128 GB Black iBox', date: '24/05/2024', price: '$799.00', status: 'Success' },
    { id: '#78325245', product: 'Magsafe Charger 25 W Original', date: '14/05/2024', price: '$125.00', status: 'Pending' },
  ];
  
  const targetData = {
    title: 'Target',
    subtitle: 'traffic parameter',
    metrics: [
      { name: 'New user', value: '120/450', percentage: '56%' },
      { name: 'Outbound clicks', value: '1,120/5,000', percentage: '25%' },
    ]
  };
  
  const periodOptions = ['This month', 'Last month', 'This year', 'Custom'];
  
  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="M18 17l-2-4l-5 2l-3-6" />
            </svg>
          </span>
          <span className="logo-text">MarketSavvy</span>
        </div>
        
        <div className="sidebar-section">
          <div className="section-title">MAIN MENU</div>
          <ul className="sidebar-menu">
            <li className={`menu-item ${activeMenuItem === 'Home' ? 'active' : ''}`} onClick={() => setActiveMenuItem('Home')}>
              <span className="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </span>
              Home
            </li>
            <li className={`menu-item ${activeMenuItem === 'Orders' ? 'active' : ''}`} onClick={() => setActiveMenuItem('Orders')}>
              <span className="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </span>
              Orders
              <span className="badge">12</span>
            </li>
            <li className={`menu-item ${activeMenuItem === 'Customers' ? 'active' : ''}`} onClick={() => setActiveMenuItem('Customers')}>
              <span className="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              Customers
            </li>
            <li className={`menu-item ${activeMenuItem === 'Products' ? 'active' : ''}`} onClick={() => setActiveMenuItem('Products')}>
              <span className="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </span>
              Products
            </li>
            <li className={`menu-item ${activeMenuItem === 'Analytics' ? 'active' : ''}`} onClick={() => setActiveMenuItem('Analytics')}>
              <span className="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </span>
              Analytics
            </li>
          </ul>
        </div>
        
        <div className="sidebar-section">
          <div className="section-title">FINANCE</div>
          <ul className="sidebar-menu">
            <li className={`menu-item ${activeMenuItem === 'Overview' ? 'active' : ''}`} onClick={() => setActiveMenuItem('Overview')}>
              <span className="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </span>
              Overview
            </li>
            <li className={`menu-item ${activeMenuItem === 'Billing' ? 'active' : ''}`} onClick={() => setActiveMenuItem('Billing')}>
              <span className="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </span>
              Billing
              <span className="badge">4</span>
            </li>
            <li className={`menu-item ${activeMenuItem === 'Payouts' ? 'active' : ''}`} onClick={() => setActiveMenuItem('Payouts')}>
              <span className="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </span>
              Payouts
            </li>
          </ul>
        </div>
        
        <div className="sidebar-section" style={{ marginTop: 'auto' }}>
          <ul className="sidebar-menu">
            <li className={`menu-item ${activeMenuItem === 'LogOut' ? 'active' : ''}`} onClick={() => setActiveMenuItem('LogOut')}>
              <span className="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </span>
              Log Out
            </li>
          </ul>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="dashboard-content">
        {/* Top Header */}
        <div className="top-header">
          <div className="top-header-left">
            Dashboard
          </div>
          
          <div className="top-header-right">
            <div className="search-bar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Search here..." />
            </div>
            
            <div className="notification-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            
            <div className="theme-toggle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </div>
            
            <div className="user-profile">
              <div className="avatar">B</div>
              <div className="user-info">
                <div className="user-name">Bambang</div>
                <div className="user-role">Administrator</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard Grid Layout */}
        <div className="dashboard-grid" key={key}>
          {/* Total Revenue Card */}
          <div className="total-revenue-card card-animation delay-1">
            <RevenueCard 
              data={revenueData} 
              period={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              periodOptions={periodOptions}
            />
          </div>
          
          {/* Sales Funnel Card */}
          <div className="sales-funnel-card card-animation delay-2">
            <SalesFunnel 
              data={salesFunnelData} 
              period={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              periodOptions={periodOptions}
            />
          </div>
          
          {/* Ongoing Sale Card */}
          <div className="ongoing-sale-card card-animation delay-3">
            <OngoingSale data={ongoingSaleData} />
          </div>
          
          {/* Customers Countries Card */}
          <div className="customers-countries-card card-animation delay-4">
            <CountriesMap data={countriesData} />
          </div>
          
          {/* Device Visits Card */}
          <div className="device-visits-card card-animation delay-5">
            <DeviceVisits 
              data={deviceData} 
              period={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              periodOptions={periodOptions}
            />
          </div>
          
          {/* Top Products Card */}
          <div className="top-products-card card-animation delay-6">
            <TopProducts data={topProductsData} />
          </div>
          
          {/* Recent Transactions Card */}
          <div className="recent-transactions-card card-animation delay-7">
            <RecentTransactions data={recentTransactionsData} />
          </div>
          
          {/* Target Metrics Card */}
          <div className="target-metrics-card card-animation delay-8">
            <TargetMetrics 
              data={targetData} 
              period={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              periodOptions={periodOptions}
            />
          </div>
          
          {/* Revenue Sources Chart */}
          <div className="revenue-sources-chart card-animation delay-9">
            <RevenueSourcesChart data={revenueSourcesData} />
          </div>

          {/* Optionally include the Intensity Chart if needed */}
{/* Intensity Chart */}
<div className="intensity-chart-card card-animation delay-9">
  <IntensityChart />
</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;