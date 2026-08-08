import React, { useState } from 'react';
import axios from 'axios';
import { Zap, AlertTriangle, Activity, Settings, Shield, Gauge, RefreshCw, Radio, TrendingDown } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState('');

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshStatus('Checking API health...');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`);
      setRefreshStatus(`API status: ${response.status} ${response.statusText}`);
    } catch (error) {
      setRefreshStatus(`API health check failed: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'reactors', name: 'Reactors', icon: Zap },
    { id: 'radiation', name: 'Radiation', icon: Radio },
    { id: 'safety', name: 'Safety', icon: Shield },
    { id: 'alerts', name: 'Alerts', icon: AlertTriangle },
    { id: 'analytics', name: 'Analytics', icon: TrendingDown },
    { id: 'system', name: 'System', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'reactors':
        return <ReactorsTab />;
      case 'radiation':
        return <RadiationTab />;
      case 'safety':
        return <SafetyTab />;
      case 'alerts':
        return <AlertsTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'system':
        return (
          <div className="space-y-6">
            <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-6 border border-red-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">System Configuration</h3>
              <p className="text-gray-300">MONTU nuclear safety system settings and configuration.</p>
            </div>
          </div>
        );
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-red-900/30 backdrop-blur-sm border-b border-red-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-lg mr-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MONTU</h1>
                <p className="text-red-200 text-sm">Nuclear Safety & Radiation Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-3 py-1 bg-red-500/20 text-red-300 rounded-full hover:bg-red-500/30 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <div className="flex items-center px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-400 text-sm font-medium">System Online</span>
              </div>
              {refreshStatus && (
                <div className="text-xs text-gray-400">{refreshStatus}</div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-red-900/20 backdrop-blur-sm border-b border-red-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-red-400 text-red-400'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = () => (
  <div className="space-y-6">
    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-6 border border-red-500/20">
        <div className="flex items-center">
          <Zap className="w-8 h-8 text-red-400 mr-3" />
          <div>
            <p className="text-red-200 text-sm">Active Reactors</p>
            <p className="text-2xl font-bold text-white">8</p>
          </div>
        </div>
      </div>

      <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-6 border border-red-500/20">
        <div className="flex items-center">
          <Radio className="w-8 h-8 text-yellow-400 mr-3" />
          <div>
            <p className="text-yellow-200 text-sm">Radiation Level</p>
            <p className="text-2xl font-bold text-white">2.4 mSv</p>
          </div>
        </div>
      </div>

      <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-6 border border-red-500/20">
        <div className="flex items-center">
          <Shield className="w-8 h-8 text-green-400 mr-3" />
          <div>
            <p className="text-green-200 text-sm">Safety Status</p>
            <p className="text-2xl font-bold text-white">SECURE</p>
          </div>
        </div>
      </div>

      <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-6 border border-red-500/20">
        <div className="flex items-center">
          <Gauge className="w-8 h-8 text-blue-400 mr-3" />
          <div>
            <p className="text-blue-200 text-sm">System Efficiency</p>
            <p className="text-2xl font-bold text-white">96.8%</p>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-6 border border-red-500/20">
      <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {[
          { time: '5 minutes ago', event: 'Routine maintenance completed on Reactor 4', type: 'maintenance' },
          { time: '32 minutes ago', event: 'Radiation level check passed all thresholds', type: 'safety' },
          { time: '1 hour ago', event: 'Emergency system test completed successfully', type: 'test' },
          { time: '3 hours ago', event: 'Daily safety briefing conducted', type: 'briefing' }
        ].map((activity, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-red-500/20 last:border-b-0">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-3 ${
                activity.type === 'safety' ? 'bg-green-400' :
                activity.type === 'test' ? 'bg-blue-400' :
                activity.type === 'briefing' ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
              <span className="text-gray-300">{activity.event}</span>
            </div>
            <span className="text-red-400 text-sm">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Placeholder components for other tabs
const ReactorsTab = () => (
  <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-8 text-center border border-red-500/20">
    <Zap className="w-16 h-16 text-red-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">Reactor Management</h3>
    <p className="text-gray-300">Monitor and manage all nuclear reactors</p>
  </div>
);

const RadiationTab = () => (
  <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-8 text-center border border-red-500/20">
    <Radio className="w-16 h-16 text-red-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">Radiation Monitoring</h3>
    <p className="text-gray-300">Real-time radiation level tracking and analysis</p>
  </div>
);

const SafetyTab = () => (
  <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-8 text-center border border-red-500/20">
    <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">Safety Systems</h3>
    <p className="text-gray-300">Safety protocol management and emergency response</p>
  </div>
);

const AlertsTab = () => (
  <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-8 text-center border border-red-500/20">
    <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">Alert Management</h3>
    <p className="text-gray-300">System alerts and anomaly detection</p>
  </div>
);

const AnalyticsTab = () => (
  <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-8 text-center border border-red-500/20">
    <TrendingDown className="w-16 h-16 text-red-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">Performance Analytics</h3>
    <p className="text-gray-300">View detailed operational metrics and trends</p>
  </div>
);

export default Dashboard;
