import { useState } from 'react';
import { ShieldAlert, ArrowRight, Smartphone, Clock, TrendingDown, Loader2, Activity } from 'lucide-react';
import WhatsAppMockup from '../components/WhatsAppMockup'; 
import { useNavigate } from 'react-router-dom';
import { useRiskAlerts } from '../hooks/useRiskAlerts';

const RiskAlerts = () => {
  const { alerts, loading } = useRiskAlerts();
  const [selectedAlert, setSelectedAlert] = useState(null);
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600 font-semibold text-lg">Aggregating Live Global Risks...</p>
      </div>
    );
  }

  const marketAlert = alerts.find(a => a.mineral === 'Market Overview');
  const actualRisks = alerts.filter(a => a.mineral !== 'Market Overview');

  const filteredAlerts = actualRisks.filter(alert => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'High Risk') return alert.severity === 'HIGH';
    if (activeFilter === 'Medium') return alert.severity === 'MEDIUM';
    if (activeFilter === 'Resolved') return alert.status === 'Resolved'; 
    return true;
  });

  const priceText = marketAlert ? marketAlert.summary.replace('Latest Rates (USD/Tonne): ', '') : 'Awaiting Market Data...';

  return (
    <div className="p-8 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <ShieldAlert className="text-red-600 w-8 h-8" />
        <h1 className="text-3xl font-bold text-left">Live Risk Intelligence</h1>
      </div>

      {/* LIVE MARKET TICKER */}
      {marketAlert && (
        <div className="mb-8 bg-gray-900 border border-gray-800 rounded-lg p-3 shadow-md flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold whitespace-nowrap">
            <Activity className="w-4 h-4" /> LME SPOT
          </div>
          <div className="text-gray-300 text-sm font-mono font-medium whitespace-nowrap overflow-x-auto hide-scrollbar flex-1">
            {priceText.split(', ').map((priceStr, index) => (
              <span key={index} className="mr-6 inline-block">
                {priceStr.split(': ')[0]}: <span className="text-orange-400">{priceStr.split(': ')[1]}</span>
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-500 whitespace-nowrap hidden sm:block">
            Updated Today
          </div>
        </div>
      )}

      {/* FILTER ROW */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['All', 'High Risk', 'Medium', 'Resolved'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* RISK CARDS */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-blue-300 transition-all text-left">
            
            {/* ADVANCED CARD HEADER (Fixes missing Score Circles) */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 shadow-sm ${
                  alert.severity === 'HIGH' 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-yellow-500 bg-yellow-50 text-yellow-700'
                }`}>
                  <span className="text-[10px] font-black leading-none opacity-70">SCORE</span>
                  <span className="text-xl font-black">{alert.intelligence_score || '--'}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      alert.severity === 'HIGH' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                      {alert.severity} RISK
                    </span>
                    <span className="bg-gray-800 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {alert.category || 'MARKET'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                    📍 {alert.location || 'Global'}
                  </p>
                </div>
              </div>

              <p className="text-sm font-black text-blue-600 uppercase tracking-tighter border-b-2 border-blue-600">
                {alert.mineral}
              </p>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">{alert.cause}</h3>
            
            {/* AI ANALYSIS BLOCK */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
              <p className="text-sm text-gray-700 leading-relaxed italic">
                "{alert.summary?.split('🔴')[0].split('🟡')[0]}"
              </p>
              
              {(alert.intelligence_score || alert.summary?.includes('AI Insight')) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm font-bold text-gray-900">
                    {alert.severity === 'HIGH' ? '🔴' : '🟡'} 
                    {alert.summary?.includes('AI Insight:') 
                      ? alert.summary.split('AI Insight:')[1] 
                      : ' Strategic analysis pending...'}
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                <span className="font-semibold text-gray-800">Action:</span> {alert.action}
              </p>
            </div>

            {/* IMPACT ESTIMATES */}
            <div className="mb-4 flex items-center gap-4 text-sm font-medium text-gray-700 bg-white border border-red-100 p-3 rounded-lg">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Est. Delay: {alert.severity === 'HIGH' ? '3 Weeks' : '1 Week'}</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span>Cost Impact: {alert.severity === 'HIGH' ? '₹12L - ₹15L' : '₹2L - ₹4L'}</span>
              </div>
            </div>

            {/* FIX 1: IMPACTED BATCHES ON A SINGLE LINE */}
            <div className="py-3 border-t border-gray-100 flex items-center gap-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Impacted Supply Chain:</p>
              <div className="flex flex-wrap gap-1">
                {(alert.affected_batches || ['All Active Batches']).map((batch, i) => (
                  <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-mono border border-gray-200">
                    {batch}
                  </span>
                ))}
              </div>
            </div>

            {/* FIX 2: CLEAN SOURCE LINKS THAT NEVER OVERFLOW */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-gray-100 gap-4 overflow-hidden">
              <div className="text-xs text-gray-500 truncate flex-1 min-w-0 pr-4">
                Source: <a href={alert.source} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">View Article ↗</a> • {new Date(alert.created_at).toLocaleDateString()}
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                <button 
                  onClick={() => setSelectedAlert(alert)}
                  className="flex items-center gap-1 text-sm font-bold text-green-700 hover:text-green-800 bg-green-50 px-3 py-1.5 rounded-lg transition-all"
                >
                  <Smartphone className="w-4 h-4" /> Preview Alert
                </button>

                <button 
                onClick={() => navigate('/suppliers', { state: { autoFilter: alert.mineral } })}
                className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:gap-2 transition-all"
              >
                Find Alternative <ArrowRight className="w-4 h-4" />
              </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredAlerts.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No {activeFilter.toLowerCase()} alerts active. The supply chain is stable.
          </div>
        )}
      </div>

      <WhatsAppMockup 
        isOpen={!!selectedAlert} 
        onClose={() => setSelectedAlert(null)} 
        alert={selectedAlert} 
      />
      
    </div>
  );
};

export default RiskAlerts;