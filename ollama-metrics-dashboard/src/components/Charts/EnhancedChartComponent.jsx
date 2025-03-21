import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './EnhancedChartStyles.css';

const EnhancedChartComponent = ({ title, description, dataSource = 'sample' }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    dispersion: { value: 3.1, change: 52 },
    error: { value: 23, change: -4 },
    analysis: { percentage: 75, transactions: 275039 },
    reinvested: { value: 19.2, change: 9 },
    delayed: { value: 110, change: 52 }
  });
  
  // Generate chart data
  const generateChartData = (source) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let data = [];
    
    switch(source) {
      case 'population':
        data = months.map(month => ({
          month,
          value: Math.floor(Math.random() * 50000) + 100000
        }));
        break;
      case 'economic':
        data = months.map((month, index) => ({
          month,
          value: 100000 + (index * 10000) + (Math.random() * 20000 - 10000)
        }));
        break;
      case 'custom':
        data = months.map(month => ({
          month,
          value: Math.floor(Math.random() * 100000) + 50000
        }));
        break;
      default: // sample
        data = months.map(month => ({
          month,
          value: Math.floor(Math.random() * 80000) + 200000
        }));
    }
    
    return data;
  };

  // Fetch data from source
  const fetchDataFromSource = async (source) => {
    setLoading(true);
    
    try {
      // Simulate API delay
      return new Promise((resolve) => {
        setTimeout(() => {
          const newData = generateChartData(source);
          resolve(newData);
        }, 800);
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle data source change
  const handleDataSourceChange = async (e) => {
    const source = e.target.value;
    const newData = await fetchDataFromSource(source);
    setChartData(newData);
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    const newData = await fetchDataFromSource(dataSource);
    setChartData(newData);
    
    // Update some stats randomly to simulate real changes
    setStatsData(prev => ({
      ...prev,
      dispersion: { 
        value: +(prev.dispersion.value + (Math.random() * 0.4 - 0.2)).toFixed(1),
        change: Math.floor(Math.random() * 20) + 40
      },
      error: { 
        value: Math.max(1, Math.floor(prev.error.value + (Math.random() * 6 - 3))),
        change: -Math.floor(Math.random() * 10)
      }
    }));
  };

  // Initialize chart data on mount
  useEffect(() => {
    const initData = async () => {
      const newData = await fetchDataFromSource(dataSource);
      setChartData(newData);
    };
    
    initData();
  }, [dataSource]);

  return (
    <div className="modern-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Fortified financial insight</h1>
        <div className="controls">
          <select 
            className="data-source-select" 
            onChange={handleDataSourceChange}
            defaultValue={dataSource}
          >
            <option value="sample">Sample Data</option>
            <option value="population">Population Growth</option>
            <option value="economic">Economic Indicators</option>
            <option value="custom">Custom API</option>
          </select>
          <button className="refresh-button" onClick={handleRefresh} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {/* Dispersion Card */}
        <div className="stat-card dispersion">
          <div className="stat-header">Dispersion</div>
          <div className="stat-subheader">Central tendency</div>
          <div className="stat-content">
            <div className="stat-value">{statsData.dispersion.value}</div>
            <div className="stat-change positive">+{statsData.dispersion.change}%</div>
          </div>
        </div>
        
        {/* Error Card */}
        <div className="stat-card error">
          <div className="stat-header">Error</div>
          <div className="stat-subheader">Transactions</div>
          <div className="stat-content">
            <div className="stat-value">{statsData.error.value}</div>
            <div className="stat-change negative">{statsData.error.change}%</div>
          </div>
        </div>
        
        {/* Analysis Card */}
        <div className="stat-card analysis">
          <div className="stat-header">Analysis techniques</div>
          <div className="stat-subheader">of approved transactions</div>
          <div className="stat-content">
            <div className="progress-container">
              <div className="progress-value">{statsData.analysis.percentage}%</div>
              <svg width="80" height="80" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255, 224, 138, 0.2)"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#ffe08a"
                  strokeWidth="10"
                  strokeDasharray="282.7"
                  strokeDashoffset={282.7 * (1 - statsData.analysis.percentage / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            <div className="transaction-count">{statsData.analysis.transactions.toLocaleString()}</div>
          </div>
        </div>
        
        {/* Reinvested Card */}
        <div className="stat-card reinvested">
          <div className="stat-header">Reinvested</div>
          <div className="stat-subheader">Profits</div>
          <div className="stat-content">
            <div className="stat-value">{statsData.reinvested.value}</div>
            <div className="stat-change positive">+{statsData.reinvested.change}%</div>
          </div>
        </div>
        
        {/* Delayed Card */}
        <div className="stat-card delayed">
          <div className="stat-header">Delayed</div>
          <div className="stat-subheader">Need to process</div>
          <div className="stat-content">
            <div className="stat-value">{statsData.delayed.value}</div>
            <div className="stat-change positive">+{statsData.delayed.change}%</div>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <div className="chart-title">{title || "Statistics overview"}</div>
          <div className="chart-description">{description || "Trends and patterns of your financial transactions"}</div>
        </div>
        
        <div className="chart-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div>Loading chart data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#888" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#888', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#888" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#888', fontSize: 12 }}
                  tickFormatter={(value) => new Intl.NumberFormat('en', { 
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value)}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: 'none', borderRadius: '4px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => new Intl.NumberFormat('en').format(value)}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2e64fe" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#2e64fe', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <div className="chart-footer">
          <div className="time-periods">
            <div className="time-period">Q4 '22</div>
            <div className="time-period">Q4 '23</div>
            <div className="time-period">Q1 '24</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChartComponent;