import { useState } from 'react';
import { mockData } from '../data/mockData';
import { AlertCircle, ArrowRight, ShieldAlert, Smartphone } from 'lucide-react';
import WhatsAppMockup from '../components/WhatsAppMockup'; // Import the new component
import { useNavigate } from 'react-router-dom';

const RiskAlerts = () => {
  const alerts = mockData.alerts;
  const [selectedAlert, setSelectedAlert] = useState(null); // Track which alert is active
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="text-red-600 w-8 h-8" />
        <h1 className="text-3xl font-bold text-left">Live Risk Intelligence</h1>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-blue-300 transition-all text-left">
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

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-4">
              <p className="text-xs text-gray-500">Affected Batches: {alert.affected_batches.join(', ')}</p>
              
              <div className="flex items-center gap-4">
                {/* NEW BUTTON: Trigger WhatsApp Mockup */}
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
      </div>

      {/* Render the Mockup if an alert is selected */}
      <WhatsAppMockup 
        isOpen={!!selectedAlert} 
        onClose={() => setSelectedAlert(null)} 
        alert={selectedAlert} 
      />
      
    </div>
  );
};

export default RiskAlerts;