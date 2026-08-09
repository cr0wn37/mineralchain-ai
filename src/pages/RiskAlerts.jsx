// src/pages/RiskAlerts.jsx
import { useState } from 'react';
import { ShieldAlert, ArrowRight, Smartphone, Clock, TrendingDown, RefreshCw, Cpu } from 'lucide-react';
import WhatsAppMockup from '../components/WhatsAppMockup';
import { useNavigate } from 'react-router-dom';
import { useRiskAlerts } from '../hooks/useRiskAlerts';

const RiskAlerts = () => {
  const { alerts, loading, error, isSyncingRAG, refetchAlerts, syncRAGNews } = useRiskAlerts();
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  // Filter alerts based on active tab
  const filteredAlerts = alerts.filter(alert => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'High Risk') return alert.severity === 'High';
    if (activeFilter === 'Medium') return alert.severity === 'Medium';
    if (activeFilter === 'Low') return alert.severity === 'Low';
    if (activeFilter === 'Resolved') return alert.status === 'Resolved';
    return true;
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header with AI Trigger Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-red-600 w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold text-left">Live Risk Intelligence</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              Powered by Groq Llama 3 & Supabase Vector Search
            </p>
          </div>
        </div>

        {/* AI Action Control Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={syncRAGNews}
            disabled={isSyncingRAG || loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
            title="Fetch fresh global RSS news & convert to Supabase vectors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingRAG ? 'animate-spin' : ''}`} />
            {isSyncingRAG ? 'Embedding Vectors...' : 'Sync RAG Feeds'}
          </button>

          <button
            onClick={refetchAlerts}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm disabled:opacity-50"
          >
            <Cpu className="w-3.5 h-3.5" />
            {loading ? 'Groq Agent Analyzing...' : 'Run Groq AI Scan'}
          </button>
        </div>
      </div>

      {/* Backend Status Notice */}
      {error && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs flex justify-between items-center">
          <span>⚠️ {error}</span>
          <span className="font-mono text-[10px] bg-amber-200/60 px-2 py-0.5 rounded">Fallback Mode</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['All', 'High Risk', 'Medium', 'Low', 'Resolved'].map(filter => (
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

      {/* AI Loading Skeleton State */}
      {loading && (
        <div className="space-y-4 mb-6">
          <div className="p-8 text-center bg-white border border-indigo-100 rounded-xl shadow-sm animate-pulse">
            <Cpu className="w-8 h-8 text-indigo-500 mx-auto mb-3 animate-spin" />
            <p className="text-sm font-bold text-gray-800">
              Agent Analyzing Active Batches Against Vector DB...
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Querying Groq Llama 3 for real-time supply chain disruptions
            </p>
          </div>
        </div>
      )}

      {/* Live Alerts Cards List */}
      {!loading && (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-blue-300 transition-all text-left"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    alert.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {alert.severity} Risk
                  </span>
                  <span className="text-gray-400 text-sm font-mono">{alert.id}</span>
                </div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">{alert.mineral}</p>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{alert.cause}</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-800">Recommended Action:</span> {alert.action}
                </p>
              </div>

              {/* Impact Estimate Line */}
              <div className="mb-5 flex items-center gap-4 text-sm font-medium text-gray-700 bg-white border border-red-100 p-3 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>Est. Delay: {alert.severity === 'High' ? '3 Weeks' : '1 Week'}</span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span>Cost Impact: {alert.severity === 'High' ? '₹12L - ₹15L' : '₹2L - ₹4L'}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-4">
                <p className="text-xs text-gray-500">
                  Affected Batches: {Array.isArray(alert.affected_batches) ? alert.affected_batches.join(', ') : alert.affected_batches}
                </p>
                
                <div className="flex items-center gap-4">
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
              No {activeFilter.toLowerCase()} risk alerts detected.
            </div>
          )}
        </div>
      )}

      {/* WhatsApp Modal */}
      <WhatsAppMockup 
        isOpen={!!selectedAlert} 
        onClose={() => setSelectedAlert(null)} 
        alert={selectedAlert} 
      />
    </div>
  );
};

export default RiskAlerts;