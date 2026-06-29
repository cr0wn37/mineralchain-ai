import React, { useState } from 'react';
import { Activity, ShieldCheck, MapPin, Factory, Anchor, Clock, AlertTriangle, TrendingUp, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockData } from '../data/mockData';

// --- COMPONENT: Individual Pipeline Train Card ---
const PipelineCard = ({ batch }) => {
  const [isEsgOpen, setIsEsgOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-4 overflow-hidden transition-all hover:shadow-md">
      {/* Main Card Header */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono font-bold text-gray-900">{batch.id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                batch.status === 'On High Seas' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                batch.status === 'Inland Delay' ? 'bg-red-50 text-red-700 border border-red-100' :
                'bg-green-50 text-green-700 border border-green-100'
              }`}>
                {batch.status}
              </span>
            </div>
            <h3 className="text-lg font-bold tracking-tight text-gray-900">{batch.mineral}</h3>
            <p className="text-xs text-gray-500 font-medium">{batch.supplier}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">ETA</p>
            <p className="text-sm font-bold text-gray-900">{batch.eta}</p>
          </div>
        </div>

        {/* The Pipeline Visual */}
        <div className="relative flex justify-between items-center mt-6 mb-2">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -z-10 -translate-y-1/2"></div>
          
          {/* Step 1: Origin */}
          <div className="flex flex-col items-center bg-white px-2">
            <div className="w-8 h-8 rounded-full border-2 border-gray-900 bg-white flex items-center justify-center mb-2 z-10">
              <MapPin size={14} className="text-gray-900" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-900">{batch.origin}</span>
          </div>

          {/* Step 2: Transit */}
          <div className="flex flex-col items-center bg-white px-2">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 z-10 ${
              batch.status === 'Inland Delay' ? 'border-red-500 bg-red-50 text-red-600 animate-pulse' : 'border-blue-500 bg-blue-50 text-blue-600'
            }`}>
              {batch.status === 'Inland Delay' ? <AlertTriangle size={14} /> : <Clock size={14} />}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">In Transit</span>
          </div>

          {/* Step 3: Destination */}
          <div className="flex flex-col items-center bg-white px-2">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center mb-2 z-10">
              <Anchor size={14} className="text-gray-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-900">{batch.destination}</span>
          </div>
        </div>
      </div>

      {/* ESG & Provenance Toggle - Designed for the ESG Expert Meeting */}
      <div 
        className="border-t border-gray-100 bg-gray-50/50 p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsEsgOpen(!isEsgOpen)}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span className="text-xs font-semibold tracking-tight text-gray-700">Upstream Provenance & Verification</span>
        </div>
        {isEsgOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </div>

      {/* Expanded ESG Drawer */}
      {isEsgOpen && (
        <div className="bg-[#f8fafc] border-t border-gray-100 p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Mined Source</p>
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Ethical Sourcing Verified
              </div>
              <p className="text-xs text-gray-500 font-mono mt-1">{batch.esg.cert}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Carbon Intensity</p>
              <div className="text-sm font-medium text-gray-900">{batch.esg.carbon}</div>
              <p className="text-xs text-emerald-600 font-bold mt-1 tracking-tight">ESG Compliant</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/trace', { state: { batchId: batch.id } })}
            className="mt-4 w-full py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            View Full Audit Trail &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

// --- MAIN DASHBOARD LAYOUT ---
const Dashboard = () => {
  // Highly tailored mock data for Adani Pitch & ESG Meeting
  const activeBatches = [
    {
      id: '#Li-9041',
      mineral: 'Lithium Spodumene Concentrate',
      supplier: 'Pilbara Minerals (Western Australia)',
      eta: 'Oct 24, 2026',
      status: 'On High Seas',
      origin: 'Port Hedland, AU',
      destination: 'Port of Mundra, IN', // ADANI EASTER EGG
      esg: { cert: 'Cert #WA-9920-CF', carbon: '1.2 kg CO2e / kg' }
    },
    {
      id: '#Co-5022',
      mineral: 'Cobalt Hydroxide',
      supplier: 'Glencore — Kamoto Copper',
      eta: 'Delayed',
      status: 'Inland Delay',
      origin: 'Kolwezi, DRC',
      destination: 'Chennai Port, IN',
      esg: { cert: 'Cert #DRC-4910-CF', carbon: '3.4 kg CO2e / kg' }
    }
  ];

  const chokepointAlerts = [
    { time: '09:42 AM', type: 'Logistics Lag', title: 'Strait of Malacca Congestion', desc: 'Vessel queue building. +3.5 days estimated delay for incoming APAC shipments.', severity: 'medium' },
    { time: 'Yesterday', type: 'Production Risk', title: 'Energy Caps in Quzhou', desc: 'Provincial mandates restricting downstream refining capacity by 15%.', severity: 'high' }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans p-4 md:p-8">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">Situation Room</h1>
          <p className="text-sm text-gray-500 font-medium">Live geospatial tracking and supply chain systemic risk.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Secured Pipeline Value</p>
            <p className="text-xl font-bold tracking-tight">₹1,250 Cr</p>
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm flex items-center gap-3">
            <Activity className="text-emerald-500 animate-pulse" size={20} />
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Network Status</p>
              <p className="text-sm font-bold tracking-tight">Live Sync Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Asymmetric Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMN 1: Global Chokepoint Stream (Narrow) */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <AlertTriangle size={14} /> Chokepoint Feed
          </h2>
          <div className="relative border-l-2 border-gray-100 ml-2 pl-4 pb-4">
            {chokepointAlerts.map((alert, i) => (
              <div key={i} className="mb-6 relative">
                {/* Timeline Dot */}
                <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                  alert.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'
                }`}></div>
                
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase bg-gray-50 px-2 py-0.5 rounded">{alert.time}</span>
                <h4 className={`text-sm font-bold tracking-tight mt-2 ${alert.severity === 'high' ? 'text-red-600' : 'text-amber-600'}`}>
                  {alert.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{alert.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: Active Transit Pipeline Flow (Wide Center) */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <TrendingUp size={14} /> Active Transit Pipeline
          </h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {/* THIS IS THE MAGIC LINE: It now maps over your external data file */}
            {mockData.batches.map((batch, index) => (
              <PipelineCard key={index} batch={batch} />
            ))}
          </div>
        </div>

        {/* COLUMN 3: Systemic Sovereignty Index (Medium Right) */}
        <div className="lg:col-span-3 order-3 lg:order-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <Factory size={14} /> Systemic Sovereignty
          </h2>
          
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Import Dependency</p>
            <div className="text-4xl font-black tracking-tighter text-gray-900 mb-2">82<span className="text-2xl text-gray-400">%</span></div>
            <p className="text-xs text-gray-500 font-medium leading-tight mb-6">
              Critical mineral requirements sourced outside domestic borders.
            </p>

            {/* Custom Sleek Progress Bars replacing Recharts */}
            <div className="space-y-5">
              {/* Lithium Breakdown */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-gray-700">Lithium Upstream</span>
                </div>
                <div className="h-2.5 w-full flex rounded-full overflow-hidden bg-gray-100">
                  <div className="bg-gray-800" style={{ width: '64%' }} title="Australia: 64%"></div>
                  <div className="bg-gray-400" style={{ width: '22%' }} title="Chile: 22%"></div>
                </div>
                <div className="flex gap-3 mt-1.5 text-[9px] font-bold tracking-wider text-gray-400 uppercase">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-800"></span>AU (64%)</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>CL (22%)</span>
                </div>
              </div>

              {/* Cobalt Breakdown */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-gray-700">Cobalt Downstream</span>
                </div>
                <div className="h-2.5 w-full flex rounded-full overflow-hidden bg-gray-100">
                  <div className="bg-red-500" style={{ width: '72%' }} title="China: 72%"></div>
                  <div className="bg-gray-300" style={{ width: '28%' }} title="Other: 28%"></div>
                </div>
                <div className="flex gap-3 mt-1.5 text-[9px] font-bold tracking-wider text-gray-400 uppercase">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>CN (72%)</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;