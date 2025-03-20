import React, { useState } from 'react';
import './Dashboard.css';
import RevenueCard from './DashboardComponents/RevenueCard';
import SalesFunnel from './DashboardComponents/SalesFunnel';
import RevenueSourcesChart from './DashboardComponents/RevenueSourcesChart';
import CountriesMap from './DashboardComponents/CountriesMap';
import DeviceVisits from './DashboardComponents/DeviceVisits';
import OngoingSale from './DashboardComponents/OngoingSale';
import TopProducts from './DashboardComponents/TopProducts';
import RecentTransactions from './DashboardComponents/RecentTransactions';
import TargetMetrics from './DashboardComponents/TargetMetrics';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This month');
  
  // Demo data
  const revenueData = {
    total: '$1,253,235',
    growth: '+24%',
    compared: '$345.45 this month',
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
    { name: 'Indonesia', percentage: '91.5%' },
    { name: 'Malaysia', percentage: '64.1%' },
    { name: 'Singapore', percentage: '10.2%' },
    { name: 'Japan', percentage: '2.1%' },
  ];
  
  const deviceData = {
    total: '45,234',
    change: '+44%',
    devices: [
      { name: 'Mobile', value: '1,696', percentage: '60%' },
      { name: 'Desktop', value: '696', percentage: '30%' },
    ]
  };
  
  const ongoingSaleData = {
    total: '17,141',
    startDate: '03/04/2024',
    endDate: '05/07/2024',
  };
  
  const topProductsData = [
    { name: 'Dumbp Racket', sold: 'Sold 4,123', value: '$14,516', change: '+$4,516' },
    { name: 'Shuttlecock', sold: 'Sold 3,124', value: '$8,516', change: '+$4,516' },
    { name: 'Badminton Shoes', sold: 'Sold 1,124', value: '$7,516', change: '+$4,516' },
    { name: 'Hand Grip', sold: 'Sold 824', value: '$6,516', change: '+$4,516' },
    { name: 'Toner Bag', sold: 'Sold 724', value: '$5,516', change: '+$4,516' },
  ];
  
  const recentTransactionsData = [
    { id: '#08351523', product: 'iPhone 14 128 GB Black Black', date: '24/05/2024', price: '£799.00', status: 'Success' },
    { id: '#76522545', product: 'Magsafe Charger 25 W Original', date: '16/05/2024', price: '$25.00', status: 'Pending' },
  ];
  
  const targetData = {
    title: 'Target',
    subtitle: 'traffic per parameter',
    metrics: [
      { name: 'New user', value: '1200/1420', percentage: '56%' },
      { name: 'Outbound clicks', value: '1200/5000', percentage: '25%' },
    ]
  };
  
  const periodOptions = ['This month', 'Last month', 'This year', 'Custom'];
  
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="revenue-card">
          <RevenueCard 
            data={revenueData} 
            period={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            periodOptions={periodOptions}
          />
        </div>
        
        <div className="sales-funnel">
          <SalesFunnel 
            data={salesFunnelData} 
            period={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            periodOptions={periodOptions}
          />
        </div>
        
        <div className="ongoing-sale">
          <OngoingSale data={ongoingSaleData} />
        </div>
        
        <div className="revenue-sources">
          <RevenueSourcesChart data={revenueSourcesData} />
        </div>
        
        <div className="countries-map">
          <CountriesMap data={countriesData} />
        </div>
        
        <div className="top-products">
          <TopProducts data={topProductsData} />
        </div>
        
        <div className="device-visits">
          <DeviceVisits 
            data={deviceData} 
            period={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            periodOptions={periodOptions}
          />
        </div>
        
        <div className="target-metrics">
          <TargetMetrics 
            data={targetData} 
            period={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            periodOptions={periodOptions}
          />
        </div>
        
        <div className="recent-transactions">
          <RecentTransactions data={recentTransactionsData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;