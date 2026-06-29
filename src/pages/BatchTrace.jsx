import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockData } from '../data/mockData';
import { CheckCircle2, MapPin, Beaker, ShieldCheck, Download, QrCode, X } from 'lucide-react';

const BatchTrace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);

  // 1. Manage active batch with State
  const targetBatchId = location.state?.batchId;
  const [activeBatchId, setActiveBatchId] = useState(targetBatchId || mockData.batches[0].id);

  // Auto-update if navigating from another page
  useEffect(() => {
    if (targetBatchId) setActiveBatchId(targetBatchId);
  }, [targetBatchId]);

  const batch = mockData.batches.find(b => b.id === activeBatchId) || mockData.batches[0];

  // 2. Dynamic India-First Locations
  const getMineLocation = (mineral) => {
    if (mineral === 'Lithium') return 'Salal Block, Reasi, J&K';
    if (mineral === 'Cobalt') return 'Singhbhum Reserve, Jharkhand';
    if (mineral === 'Graphite') return 'Sivaganga Mine, Tamil Nadu';
    return 'Eastern Mining Block, Odisha';
  };

  // 3. Dynamic Delay Context
  const getDelayContext = (status) => {
    if (status === 'Delayed') return 'Delayed by 14 Days (Port Congestion)';
    if (status === 'At-Risk') return 'At-Risk (ETA variance +5 days)';
    return 'Arriving On-Schedule';
  };

  const steps = [
    { 
      stage: 'Extraction & Processing', 
      location: batch.origin, // Dynamically pulls "Port Hedland, AU" or "Kolwezi, DRC"
      date: 'Origin Scan', 
      detail: `${batch.supplier} — Provenance: ${batch.esg?.cert || 'Verified'}`, 
      status: 'verified' 
    },
    { 
      stage: 'Port Departure', 
      location: 'Export Terminal', 
      date: 'In Transit', 
      detail: `Maritime Transit / Bulk Freight`, 
      status: 'verified' 
    },
    { 
      stage: 'Regional Arrival', 
      location: batch.destination, // Dynamically pulls "Port of Mundra, IN" or "Chennai Port, IN"
      date: batch.eta, 
      detail: batch.status === 'Delayed' || batch.status === 'At-Risk' || batch.status === 'Inland Delay' ? 'Chokepoint Alert Triggered' : 'Customs Clearance Pending', 
      status: batch.status === 'Delayed' || batch.status === 'At-Risk' || batch.status === 'Inland Delay' ? 'alert' : 'pending' 
    },
    { 
      stage: 'Final Delivery', 
      location: 'Manufacturing Facility', 
      date: 'TBD', 
      detail: 'Awaiting inland freight confirmation', 
      status: 'pending' 
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8 border-b border-gray-200 pb-6">
        <div className="text-left flex-1">
          <h1 className="text-3xl font-bold mb-3">Batch Traceability</h1>
          
          {/* NEW: Batch Selector Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500 font-mono text-sm uppercase tracking-wider">Trace ID:</span>
            <select 
              value={activeBatchId}
              onChange={(e) => setActiveBatchId(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 cursor-pointer shadow-sm transition-all"
            >
              {mockData.batches.map(b => (
                <option key={b.id} value={b.id}>{b.id} — {b.mineral}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/esg', { state: { batchId: batch.id } })}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export ESG PDF
          </button>
          <button 
            onClick={() => setShowQR(true)}
            className="p-2 bg-gray-900 border border-gray-900 rounded-lg shadow-sm hover:bg-gray-800 transition-all"
          >
            <QrCode className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* NEW: Straight Vertical Timeline */}
        <div className="md:col-span-2 space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-gray-300 before:to-transparent">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-start gap-6 group">
              
              {/* Timeline Icon */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow-md shrink-0 z-10 transition-colors ${step.status === 'verified' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                {step.status === 'verified' ? <CheckCircle2 className="w-6 h-6 text-blue-600" /> : <MapPin className="w-6 h-6 text-gray-400" />}
              </div>
              
              {/* Timeline Card */}
              <div className="flex-1 p-5 rounded-xl border border-gray-200 bg-white shadow-sm text-left hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900 text-lg">{step.stage}</span>
                  <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md font-mono text-xs font-bold text-blue-600">
                    {step.date}
                  </span>
                </div>
                <p className="text-sm text-gray-800 font-semibold">{step.location}</p>
                <p className={`text-xs mt-1.5 font-medium ${step.detail.includes('Delayed') ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ESG Scorecard */}
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-100 p-6 rounded-2xl text-left">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-green-600" />
              <h3 className="font-bold text-green-800 uppercase tracking-wider text-sm">ESG Scorecard</h3>
            </div>
            <div className="text-4xl font-black text-green-700 mb-2">{batch.esg_grade}</div>
            <p className="text-xs text-green-600 font-medium mb-4 italic">Certified by Pax Silica (EU Std)</p>
            <div className="space-y-3">
              <div className="text-xs">
                <div className="flex justify-between mb-1"><span>Carbon Intensity</span><span className="font-bold">2.4t CO2e</span></div>
                <div className="w-full bg-green-200 h-1 rounded-full"><div className="bg-green-600 h-1 w-3/4 rounded-full"></div></div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-left">
            <div className="flex items-center gap-2 mb-4 text-blue-800 font-bold text-sm uppercase">
              <Beaker className="w-4 h-4" /> Lab Analysis
            </div>
            <p className="text-2xl font-bold text-blue-700">{batch.purity}</p>
            <p className="text-xs text-blue-600">{batch.mineral} Quality Checked</p>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center relative animate-fade-in shadow-2xl">
            <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X /></button>
            <QrCode className="w-32 h-32 mx-auto text-gray-800 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Scan for Audit Trail</h3>
            <p className="text-sm text-gray-500 mb-6">Auditors can scan this code to instantly verify provenance and EU battery compliance on the blockchain.</p>
            <div className="bg-gray-100 p-3 rounded-lg font-mono text-xs text-gray-600 break-all border border-gray-200">
              hash: 0x8f2a...{batch.id.toLowerCase()}...9c1
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchTrace;