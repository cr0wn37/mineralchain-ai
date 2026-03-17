import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { mockData } from '../data/mockData';
import { FileText, Download, ShieldCheck, Globe, Calendar, CheckCircle2, Factory, Loader2 } from 'lucide-react';

const ESGReport = () => {
  const location = useLocation();
  const [selectedBatchId, setSelectedBatchId] = useState(location.state?.batchId || mockData.batches[0].id);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null); // This acts as our camera target
  

  const batch = mockData.batches.find(b => b.id === selectedBatchId) || mockData.batches[0];
  const reportDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  // The PDF Generation Magic
  const handleExportPDF = () => {
    // This triggers the browser's native, high-quality "Save as PDF" engine
    window.print();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      {/* Top Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-green-600" />
            ESG Compliance Generator
          </h1>
          <p className="text-gray-500 mt-1">Generate EU Battery Regulation compliant reports.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <select 
            className="px-4 py-2 border-r border-gray-200 outline-none bg-transparent cursor-pointer font-medium text-gray-700"
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
          >
            {mockData.batches.map(b => (
              <option key={b.id} value={b.id}>{b.id} - {b.mineral} ({b.supplier})</option>
            ))}
          </select>
          
          {/* UPDATED BUTTON */}
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-md font-semibold transition-colors ${isExporting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? 'Generating...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* A4 Document Preview - Added ref={reportRef} */}
      <div className="flex justify-center overflow-hidden">
        <div 
          id="esg-report-frame"
          ref={reportRef} 
          style={{ backgroundColor: '#ffffff', color: '#111827' }}
          className="bg-white w-[210mm] min-h-[297mm] shadow-2xl p-12 text-left border border-gray-200 shrink-0"
        >
          
          {/* Document Header */}
          <div className="border-b-2 border-gray-900 pb-6 mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">MINERAL<span className="text-blue-600">CHAIN</span></h2>
              <p className="text-gray-500 font-mono text-sm mt-1">PROVENANCE & ESG CERTIFICATE</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">Date: {reportDate}</p>
              <p className="text-xs text-gray-500 mt-1">Ref: EU-BAT-{batch.id}-2026</p>
            </div>
          </div>

          {/* Batch Summary */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Material Details</h3>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-semibold w-24 inline-block text-gray-600">Mineral:</span> <span className="font-bold text-gray-900">{batch.mineral}</span></p>
                <p className="text-sm"><span className="font-semibold w-24 inline-block text-gray-600">Batch ID:</span> <span className="font-mono bg-gray-100 px-1 rounded">{batch.id}</span></p>
                <p className="text-sm"><span className="font-semibold w-24 inline-block text-gray-600">Quantity:</span> {batch.quantity}</p>
                <p className="text-sm"><span className="font-semibold w-24 inline-block text-gray-600">Purity:</span> {batch.purity}</p>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Supplier Origin</h3>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-semibold w-24 inline-block text-gray-600">Entity:</span> {batch.supplier}</p>
                <p className="text-sm"><span className="font-semibold w-24 inline-block text-gray-600">Status:</span> {batch.status}</p>
                <p className="text-sm flex items-center gap-2"><span className="font-semibold w-24 text-gray-600">Verification:</span> <CheckCircle2 className="w-4 h-4 text-green-600"/> Cleared</p>
              </div>
            </div>
          </div>

          {/* ESG Score Box */}
          <div 
            style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }} 
            className="border p-6 rounded-lg mb-8 flex items-center gap-8"
          >
            <div style={{ borderColor: '#e5e7eb' }} className="text-center border-r pr-8">
              <ShieldCheck style={{ color: '#16a34a' }} className="w-12 h-12 mx-auto mb-2" />
              <div style={{ color: '#15803d' }} className="text-5xl font-black">
                {batch.esg_grade}
              </div>
              <p style={{ color: '#166534' }} className="text-xs font-bold uppercase mt-1">
                Overall ESG Rating
              </p>
            </div>
            
            <div className="flex-1 space-y-4">
              <div style={{ borderColor: '#e5e7eb' }} className="flex justify-between items-center text-sm border-b pb-2">
                <span style={{ color: '#4b5563' }} className="font-semibold">Scope 1 & 2 Carbon Intensity</span>
                <span className="font-bold">2.4t CO₂e / ton</span>
              </div>
              <div style={{ borderColor: '#e5e7eb' }} className="flex justify-between items-center text-sm border-b pb-2">
                <span style={{ color: '#4b5563' }} className="font-semibold">Water Consumption Rating</span>
                <span style={{ color: '#16a34a' }} className="font-bold">Minimal Impact (Class A)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span style={{ color: '#4b5563' }} className="font-semibold">Child Labor Free Certification</span>
                <span className="font-bold flex items-center gap-1">
                  <CheckCircle2 style={{ color: '#16a34a' }} className="w-4 h-4" /> Audited 2026
                </span>
              </div>
            </div>
          </div>

          {/* Provenance Chain */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-4 uppercase">Chain of Custody (Provenance)</h3>
            <div className="space-y-4 ml-2 border-l-2 border-blue-200 pl-6 relative">
              <div className="relative">
                <Globe className="w-5 h-5 text-blue-600 absolute -left-[35px] bg-white" />
                <p className="text-sm font-bold text-gray-900">Extraction <span className="font-normal text-gray-500 ml-2">Feb 10, 2026</span></p>
                <p className="text-xs text-gray-600">Mine Site 4A, Atacama Region. Verified by GSI.</p>
              </div>
              <div className="relative">
                <Factory className="w-5 h-5 text-blue-600 absolute -left-[35px] bg-white" />
                <p className="text-sm font-bold text-gray-900">Refining & Processing <span className="font-normal text-gray-500 ml-2">Feb 15, 2026</span></p>
                <p className="text-xs text-gray-600">Facility: {batch.supplier} Processing Plant. Purity elevated to {batch.purity}.</p>
              </div>
              <div className="relative">
                <CheckCircle2 className="w-5 h-5 text-green-600 absolute -left-[35px] bg-white" />
                <p className="text-sm font-bold text-gray-900">Quality Control <span className="font-normal text-gray-500 ml-2">Feb 18, 2026</span></p>
                <p className="text-xs text-gray-600">Independent Lab Analysis complete. EU Battery Directive compliant.</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
            Generated by MineralChain AI • Immutable Audit Trail Record • Page 1 of 1
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESGReport;