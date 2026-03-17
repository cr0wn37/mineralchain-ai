import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockData } from '../data/mockData';
import { CheckCircle2, MapPin, Beaker, ShieldCheck, Download, QrCode, X } from 'lucide-react';

const BatchTrace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);

  // Catch the clicked batch, or default to the first one
  const targetBatchId = location.state?.batchId;
  const batch = mockData.batches.find(b => b.id === targetBatchId) || mockData.batches[0];

  // Making the timeline slightly dynamic based on the batch
  const steps = [
    { stage: 'Extraction', location: 'Mine Site Alpha', date: 'Day 1', detail: 'Verified Source', status: 'verified' },
    { stage: 'Processing', location: `${batch.supplier} Facility`, date: 'Day 5', detail: `Refined to ${batch.purity}`, status: 'verified' },
    { stage: 'Transit', location: 'Global Logistics Hub', date: 'Day 12', detail: 'In Transit', status: batch.status === 'Delayed' ? 'pending' : 'verified' },
    { stage: 'Arrival', location: 'Destination Port', date: batch.eta, detail: batch.status, status: 'pending' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div className="text-left">
          <h1 className="text-3xl font-bold mb-2">Batch Traceability</h1>
          <p className="text-gray-500 font-mono text-sm">Tracing Batch: {batch.id} • Mineral: {batch.mineral}</p>
        </div>
        <div className="flex gap-2">
          {/* UPDATED: Route to ESG Report with this batch selected */}
          <button 
            onClick={() => navigate('/esg', { state: { batchId: batch.id } })}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
          >
            <Download className="w-4 h-4" /> Export ESG PDF
          </button>
          {/* UPDATED: Open QR Modal */}
          <button 
            onClick={() => setShowQR(true)}
            className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
          >
            <QrCode className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="md:col-span-2 space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-gray-300 before:to-transparent">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {step.status === 'verified' ? <CheckCircle2 className="w-5 h-5 text-blue-600" /> : <MapPin className="w-5 h-5 text-gray-400" />}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-white shadow-sm text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900">{step.stage}</span>
                  <time className="font-mono text-xs text-blue-600">{step.date}</time>
                </div>
                <p className="text-sm text-gray-600 font-medium">{step.location}</p>
                <p className="text-xs text-gray-400 mt-1">{step.detail}</p>
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