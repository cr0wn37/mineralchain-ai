import React, { useState } from 'react';
import { MapPin, Globe2 } from 'lucide-react';

// Import both of your separated dashboards
import DomesticDashboard from './DomesticDashboard'; 
import GlobalSourcingDashboard from './GlobalSourcingDashboard'; 

export default function AssetMapPage() {
  // State to track which map is currently active
  const [activeRegion, setActiveRegion] = useState('domestic'); // 'domestic' or 'global'

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      
      {/* 1. TOP HEADER & TOGGLE BAR */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shadow-sm z-20 relative">
        
        <div>
          <h1 className="text-xl font-bold text-gray-900">Asset Intelligence</h1>
          <p className="text-xs text-gray-500 mt-1">Live tracking of active supply chain nodes</p>
        </div>

        {/* The Dual-Mode Toggle Switch */}
        <div className="flex bg-gray-100 p-1.5 rounded-lg border border-gray-200 shadow-inner">
          <button 
            onClick={() => setActiveRegion('domestic')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${
              activeRegion === 'domestic' 
                ? 'bg-white text-blue-700 shadow border border-gray-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MapPin className="w-4 h-4" /> Domestic Operations
          </button>
          
          <button 
            onClick={() => setActiveRegion('global')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${
              activeRegion === 'global' 
                ? 'bg-gray-900 text-white shadow border border-gray-800' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Globe2 className="w-4 h-4" /> Global Sourcing
          </button>
        </div>

      </div>

      {/* 2. DYNAMIC MAP CONTAINER */}
      {/* This renders whichever map the user has selected */}
      <div className="flex-grow relative overflow-hidden">
        {activeRegion === 'domestic' ? <DomesticDashboard /> : <GlobalSourcingDashboard />}
      </div>

    </div>
  );
}