import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { X, ChevronRight } from 'lucide-react';
import { globalData } from '../data/miningData'; // IMPORTANT: Import the separated global data
import MiningTable from './MiningTable'; 

// --- Config & Colors ---
const MINERALS = ['All', 'Lithium', 'Rare Earths', 'Cobalt', 'Nickel'];
const STATUSES = ['All', 'Active', 'Development', 'Exploration'];

const STATUS_COLORS = {
  'Active': '#10b981',       // Emerald Green
  'Development': '#3b82f6',  // Blue
  'Exploration': '#f59e0b',  // Amber
};

export default function GlobalSourcingDashboard() {
  const [viewMode, setViewMode] = useState('map'); 
  const [selectedMineral, setSelectedMineral] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Tracks if a user clicked "View Data" on a specific company from the map
  const [selectedCompany, setSelectedCompany] = useState(null);

  // 1. Filter the raw data based on top bar selections
  const tableData = useMemo(() => {
    return globalData.filter(row => {
      const matchMineral = selectedMineral === 'All' || row.commodity === selectedMineral;
      const matchStatus = selectedStatus === 'All' || (row.status || 'Active') === selectedStatus;
      const matchCompany = !selectedCompany || row.company === selectedCompany;
      
      return matchMineral && matchStatus && matchCompany;
    });
  }, [selectedMineral, selectedStatus, selectedCompany]);

  // 2. Extract UNIQUE sites for the map (avoids overlapping dots for multiple quarters)
  const uniqueMapSites = useMemo(() => {
    const unique = [];
    const map = new Map();
    for (const item of tableData) {
      if (!map.has(item.operation)) {
        map.set(item.operation, true);
        unique.push(item);
      }
    }
    return unique;
  }, [tableData]);

  const handleViewDataClick = (companyName) => {
    setSelectedCompany(companyName);
    setViewMode('table');
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-140px)] bg-gray-50 relative">
      
      {/* 1. TOP FILTER BAR (Matches your uploaded screenshot perfectly) */}
      <div className="bg-white p-4 border-b border-gray-200 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 z-10 relative">
        
        <div className="flex flex-wrap items-center gap-6">
          {/* Commodity Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Mineral:</span>
            {MINERALS.map(min => (
              <button
                key={min}
                onClick={() => { setSelectedMineral(min); setSelectedCompany(null); }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedMineral === min 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {min}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Status:</span>
            {STATUSES.map(stat => (
              <button
                key={stat}
                onClick={() => setSelectedStatus(stat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  selectedStatus === stat 
                    ? `text-white border-transparent` 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
                style={selectedStatus === stat && stat !== 'All' ? { backgroundColor: STATUS_COLORS[stat] } : {}}
                {...(selectedStatus === 'All' && stat === 'All' && { style: { backgroundColor: '#111827', color: 'white' } })}
              >
                {stat}
              </button>
            ))}
          </div>

          {/* Active Company Filter Alert (Shows if they clicked a map popup) */}
          {selectedCompany && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
              <span className="text-xs font-bold text-blue-700">Filtering: {selectedCompany}</span>
              <button onClick={() => setSelectedCompany(null)} className="text-blue-500 hover:text-blue-800">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 flex-shrink-0">
          <button 
            onClick={() => setViewMode('map')} 
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'map' ? 'bg-gray-900 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Global Map
          </button>
          <button 
            onClick={() => setViewMode('table')} 
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'table' ? 'bg-gray-900 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Data Table
          </button>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA (Map or Table) */}
      <div className="relative flex-grow w-full z-0 overflow-hidden bg-[#1a1a1a]">
        
        {viewMode === 'map' ? (
          <MapContainer 
            center={[15.0, 45.0]} 
            zoom={3} 
            className="h-full w-full" 
            zoomControl={false} 
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />

            {uniqueMapSites.map(site => {
              const color = STATUS_COLORS[site.status || 'Active'] || '#3b82f6';
              return (
                <CircleMarker
                  key={site.id}
                  center={site.coordinates}
                  radius={10}
                  fillColor={color}
                  color={color}
                  weight={2}
                  opacity={0.8}
                  fillOpacity={0.5}
                >
                  <Popup className="custom-popup" closeButton={true}>
                    <div className="p-2 w-56">
                      <h3 className="font-bold text-gray-900 text-base">{site.operation}</h3>
                      <p className="text-xs text-gray-500 mb-3">{site.company} - {site.country}</p>
                      
                      <div className="flex justify-between items-center bg-gray-50 p-2 rounded mb-3 border border-gray-100">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                          <span className="w-2 h-2 rounded-full" style={{backgroundColor: color}}></span> {site.commodity}
                        </span>
                        <span className="text-xs font-black text-gray-900">{site.value} {site.unit}</span>
                      </div>

                      <p className="text-[10px] text-gray-400 mb-2 border-b border-gray-100 pb-2 text-center">
                        {globalData.filter(d => d.company === site.company).length} quarterly records available
                      </p>

                      <button 
                        onClick={() => handleViewDataClick(site.company)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        View Historical Data <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        ) : (
          /* TABLE VIEW CONTAINER */
          <div className="w-full h-full overflow-y-auto p-6 bg-[#0B0F19]">
             <MiningTable data={tableData} />
          </div>
        )}
      </div>
    </div>
  );
}