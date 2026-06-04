import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // CRITICAL: Map breaks without this
import { X, Factory, Truck, ShieldCheck, Mail, ChevronRight, BrainCircuit } from 'lucide-react';
import { miningSites } from '../data/miningData';
import { analyzeLogisticsRoutes } from '../utils/logisticsOptimizer'; // Import your newly created data

// --- Config & Colors ---
const MINERALS = ['All', 'Lithium', 'Graphite', 'Nickel', 'Cobalt', 'Copper', 'Aluminum', 'Iron Ore'];
const STATUSES = ['All', 'Active', 'Suspended', 'Exploration', 'Auction'];

const STATUS_COLORS = {
  'Active': '#10b981',       // Emerald Green
  'Exploration': '#f59e0b',  // Amber
  'Suspended': '#ef4444',    // Red
  'Auction': '#8b5cf6',      // Purple
};

const MINERAL_COLORS = {
  'Lithium': '#3b82f6',      // Blue
  'Copper': '#f97316',       // Orange
  'Aluminum': '#94a3b8',     // Silver/Slate
  'Iron Ore': '#78350f',     // Rust/Brown
  'Graphite': '#334155',
  'Nickel': '#14b8a6',
  'Cobalt': '#4f46e5'
};

const getMidpoint = (coords1, coords2) => [
  (coords1[0] + coords2[0]) / 2,
  (coords1[1] + coords2[1]) / 2
];

const MiningMap = () => {
  const [selectedMineral, setSelectedMineral] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activePanelSite, setActivePanelSite] = useState(null);

  const [evaluatedLogistics, setEvaluatedLogistics] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // --- Filtering Logic ---
  const filteredSites = miningSites.filter(site => {
    const matchMineral = selectedMineral === 'All' || site.mineral === selectedMineral;
    const matchStatus = selectedStatus === 'All' || site.status === selectedStatus;
    return matchMineral && matchStatus;
  });

  // --- Helper: Get Marker Color ---
  const getMarkerColor = (site) => {
    // If filtering by specific status or 'All' minerals, use Status colors for urgency.
    // If filtering by specific mineral, keep it status colored so we know if it's active/suspended
    return STATUS_COLORS[site.status] || '#6b7280'; 
  };

  const handleSiteClick = async (site) => {
    setActivePanelSite(site);
    setEvaluatedLogistics(null);

    // If this site has multiple port options, run the AI Optimizer!
    if (site.logistics && site.logistics.port_options) {
      setIsCalculating(true);
      const results = await analyzeLogisticsRoutes(site, site.logistics.port_options);
      setEvaluatedLogistics(results);
      setIsCalculating(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)] bg-gray-50 border-t border-gray-200 rounded-xl overflow-hidden shadow-sm relative">
      
      {/* 1. FILTER BAR (Top) */}
      <div className="bg-white p-4 border-b border-gray-200 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 z-10 relative">
        
        {/* Mineral Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Mineral:</span>
          {MINERALS.map(min => (
            <button
              key={min}
              onClick={() => setSelectedMineral(min)}
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
              // If "All" is selected, just use dark gray
              {...(selectedStatus === 'All' && stat === 'All' && { style: { backgroundColor: '#111827', color: 'white' } })}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. LEAFLET MAP */}
      <div className="relative flex-grow w-full z-0">
        <MapContainer 
          center={[22.5, 82.0]} // Center of India
          zoom={3} 
          className="h-full w-full bg-[#1a1a1a]" // Dark background to blend with tiles
          zoomControl={false} // Hide default zoom to keep it sleek
        >
          {/* CartoDB Dark Matter Tiles for the "Sleek Dashboard" look */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {/* Render Markers */}
          {filteredSites.map(site => {
            const color = getMarkerColor(site);
            // Size scaling based on your spec (tweaked slightly so 0% isn't too tiny to click)
            const radius = 8 + (site.utilisation / 4); 

            return (
              <CircleMarker
                key={site.id}
                center={site.coordinates}
                radius={radius}
                fillColor={color}
                color={color}
                weight={2}
                opacity={0.8}
                fillOpacity={0.5}
                eventHandlers={{
                  click: () => {
                    // Optional: You could directly open the side panel here instead of popup
                    // setActivePanelSite(site);
                  },
                }}
              >
                <Popup className="custom-popup" closeButton={false}>
                  <div className="p-1 w-64">
                    <div className="mb-3 border-b border-gray-100 pb-2">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">{site.mineral}</span>
                      <h3 className="font-bold text-gray-900 leading-tight">{site.name}</h3>
                      <p className="text-xs text-gray-500">{site.operator}</p>
                    </div>
                    
                   {/* 2x3 Grid (Safe Version) */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-3 mb-4">
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase">Capacity</p>
                        <p className="text-xs font-bold">{site.production.capacity?.split(' ')[0] || '--'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase">Utilisation</p>
                        <p className="text-xs font-bold">{site.utilisation}%</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase">ROM</p>
                        <p className="text-xs font-bold">{site.production.runOfMine?.split(' ')[0] || '--'} T/D</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase">Est. Delivery</p>
                        <p className="text-xs font-bold">{site.logistics.estDelivery?.split(' ')[0] || '--'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase">Status</p>
                        <p className="text-xs font-bold" style={{color: STATUS_COLORS[site.status]}}>{site.status}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase">ESG Score</p>
                        <p className="text-xs font-bold text-green-600">{site.compliance.esg_score || 'N/A'}</p>
                      </div>
                    </div>

                   <button 
                    onClick={() => handleSiteClick(site)} // <-- This is the crucial change!
                    className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    View Full Intelligence <ChevronRight className="w-3 h-3" />
                  </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
          {/* DYNAMIC LOGISTICS PATHWAYS */}
          {activePanelSite && activePanelSite.logistics && (
            <>
              {/* --- 1. MINE TO RAILHEAD (Always show if rail exists) --- */}
              {activePanelSite.logistics.rail_coordinates && (
                <>
                  <Polyline
                    positions={[activePanelSite.coordinates, activePanelSite.logistics.rail_coordinates]}
                    pathOptions={{ color: '#f59e0b', dashArray: '5, 5', weight: 2, opacity: 0.6 }}
                  />
                  
                  {/* Travel Time Label for Rail (at Midpoint) */}
                  <Marker 
                    position={getMidpoint(activePanelSite.coordinates, activePanelSite.logistics.rail_coordinates)}
                    icon={L.divIcon({
                      html: `<div style="background: rgba(0,0,0,0.7); color: #f59e0b; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid #f59e0b;">${activePanelSite.logistics.travel_time_rail || '1 hr'}</div>`,
                      className: 'bg-transparent',
                      iconSize: [50, 20]
                    })}
                  />

                  <Marker 
                    position={activePanelSite.logistics.rail_coordinates} 
                    icon={L.divIcon({
                      html: `
                        <div style="text-align: center;">
                          <div style="font-size: 20px;">🚂</div>
                          <div style="color: white; font-size: 9px; font-weight: bold; text-shadow: 1px 1px 2px black; background: rgba(0,0,0,0.4); padding: 1px 4px; border-radius: 2px; white-space: nowrap;">
                            ${activePanelSite.logistics.nearest_railhead.split(',')[0]}
                          </div>
                        </div>`,
                      className: 'bg-transparent',
                      iconAnchor: [25, 0]
                    })}
                  />
                </>
              )}

              {/* --- 2. PORT ROUTES: AI OPTIMIZED vs STANDARD --- */}
              {evaluatedLogistics && activePanelSite.logistics.port_options ? (
                // AI OPTIMIZER MODE: Multiple Port Options
                evaluatedLogistics.comparison.map((route, idx) => {
                  const portData = activePanelSite.logistics.port_options.find(p => p.name === route.portName);
                  const isWinner = route.isWinner;
                  const lineColor = isWinner ? '#10b981' : '#6b7280'; // Emerald Green for winner, Gray for loser
                  const lineOpacity = isWinner ? 0.9 : 0.4;
                  const zIndexOffset = isWinner ? 100 : 0; // Bring winner to front

                  return (
                    <React.Fragment key={idx}>
                      <Polyline 
                        positions={[activePanelSite.coordinates, portData.coordinates]} 
                        pathOptions={{ color: lineColor, dashArray: '5, 5', weight: isWinner ? 3 : 2, opacity: lineOpacity }} 
                      />
                      
                      {/* AI Travel Time Label */}
                      <Marker 
                        position={getMidpoint(activePanelSite.coordinates, portData.coordinates)} 
                        zIndexOffset={zIndexOffset}
                        icon={L.divIcon({
                          html: `<div style="background: rgba(0,0,0,0.8); color: ${lineColor}; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid ${lineColor}; opacity: ${lineOpacity};">${route.totalTime} hrs TTS</div>`,
                          className: 'bg-transparent', 
                          iconSize: [60, 20]
                        })} 
                      />

                      {/* Port Node */}
                      <Marker 
                        position={portData.coordinates} 
                        zIndexOffset={zIndexOffset}
                        icon={L.divIcon({
                          html: `
                            <div style="text-align: center; opacity: ${lineOpacity};">
                              <div style="font-size: 24px;">⚓</div>
                              <div style="color: white; font-size: 9px; font-weight: bold; text-shadow: 1px 1px 2px black; background: rgba(0,0,0,0.4); padding: 1px 4px; border-radius: 2px; white-space: nowrap;">
                                ${route.portName?.split(' ')[0] || 'Port'}
                              </div>
                            </div>`,
                          className: 'bg-transparent', 
                          iconAnchor: [30, 0]
                        })} 
                      />
                    </React.Fragment>
                  );
                })
              ) : (
                // STANDARD MODE: Single Port (Your exact original blue layout)
                activePanelSite.logistics.port_coordinates && (
                  <>
                    <Polyline
                      positions={[activePanelSite.coordinates, activePanelSite.logistics.port_coordinates]}
                      pathOptions={{ color: '#3b82f6', dashArray: '5, 5', weight: 2, opacity: 0.6 }}
                    />

                    <Marker 
                      position={getMidpoint(activePanelSite.coordinates, activePanelSite.logistics.port_coordinates)}
                      icon={L.divIcon({
                        html: `<div style="background: rgba(0,0,0,0.7); color: #3b82f6; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid #3b82f6;">${activePanelSite.logistics.travel_time_port || '5 hrs'}</div>`,
                        className: 'bg-transparent',
                        iconSize: [50, 20]
                      })}
                    />
                    
                    <Marker 
                      position={activePanelSite.logistics.port_coordinates} 
                      icon={L.divIcon({
                        html: `
                          <div style="text-align: center;">
                            <div style="font-size: 24px;">⚓</div>
                            <div style="color: white; font-size: 9px; font-weight: bold; text-shadow: 1px 1px 2px black; background: rgba(0,0,0,0.4); padding: 1px 4px; border-radius: 2px; white-space: nowrap;">
                              ${activePanelSite.logistics.nearest_port?.split(',')[0] || 'N/A'}
                            </div>
                          </div>`,
                        className: 'bg-transparent',
                        iconAnchor: [30, 0]
                      })}
                    />
                  </>
                )
              )}
            </>
          )}
        </MapContainer>

        {/* 3. SLIDE-OUT SIDE PANEL (Absolute positioning over the map) */}
        <div 
          className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-[1000] transform transition-transform duration-300 ease-in-out flex flex-col ${
            activePanelSite ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {activePanelSite && (
            <>
              {/* Panel Header */}
              <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                <div>
                  <div className="flex gap-2 items-center mb-1">
                    <span className="bg-gray-800 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">{activePanelSite.typeBadge}</span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{activePanelSite.mineral}</span>
                  </div>
                  <h2 className="text-lg font-black text-gray-900 leading-tight">{activePanelSite.name}</h2>
                  <p className="text-sm text-gray-500 font-medium">{activePanelSite.operator}</p>
                </div>
                <button onClick={() => setActivePanelSite(null)} className="text-gray-400 hover:text-gray-800 bg-gray-200 p-1 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Panel Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">

                {/* NEW: AI Logistics Optimizer Result Box (Only shows if options exist) */}
                {evaluatedLogistics && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 shadow-sm">
                    <h3 className="flex items-center gap-1.5 text-xs font-black text-emerald-800 uppercase tracking-widest mb-2">
                      <BrainCircuit className="w-4 h-4" /> AI Route Optimization
                    </h3>
                    <p className="text-[11px] text-emerald-700 leading-relaxed mb-3 font-medium">
                      Calculated Total Time to Sea (TTS) including road transit and live port wait times.
                    </p>
                    <div className="space-y-1.5">
                      {evaluatedLogistics.comparison.map((r, i) => (
                        <div key={i} className={`flex justify-between items-center text-xs p-2 rounded border ${r.isWinner ? 'bg-emerald-200 border-emerald-300 font-bold text-emerald-900 shadow-sm' : 'border-transparent text-gray-500'}`}>
                          <span className="flex items-center gap-1">
                            {r.isWinner && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                            {r.portName}
                          </span>
                          <span>{r.totalTime} Hrs</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Production Section */}
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">
                    <Factory className="w-4 h-4 text-gray-400" /> Production
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-sm text-gray-500">Capacity</span><span className="text-sm font-semibold">{activePanelSite.production.capacity}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-gray-500">Run of Mine (ROM)</span><span className="text-sm font-semibold">{activePanelSite.production.runOfMine}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-gray-500">Ore Quality</span><span className="text-sm font-semibold">{activePanelSite.production.quality}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-gray-500">Utilisation</span><span className="text-sm font-semibold">{activePanelSite.utilisation}%</span></div>
                    
                    {/* Current Supply Line */}
                    <div className="flex justify-between pt-2 mt-2 border-t border-gray-100">
                      <span className="text-sm font-bold text-gray-700">Current Supply</span>
                      <span className="text-sm font-black text-green-600 bg-green-50 px-2 py-0.5 rounded">{activePanelSite.production.currentSupply}</span>
                    </div>
                  </div>
                </div>

                {/* Logistics Section */}
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">
                    <Truck className="w-4 h-4 text-gray-400" /> Logistics & Trade
                  </h3>
                  <div className="space-y-2">
                    {/* Railhead (Only shown if applicable) */}
                    {activePanelSite.logistics.nearest_railhead && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Nearest Rail</span>
                        <span className="text-sm font-semibold text-right">{activePanelSite.logistics.nearest_railhead.split(',')[0]}</span>
                      </div>
                    )}

                    {/* Port / Global Trade Hub */}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">{activePanelSite.typeBadge === "Strategic G2G" ? "Origin Port" : "Default Port"}</span>
                      <span className="text-sm font-semibold text-right">{activePanelSite.logistics.nearest_port?.split(',')[0] || 'Multiple Hubs'}</span>
                    </div>

                    {/* NEW: HS Code (Crucial for customs/importing) */}
                    {activePanelSite.logistics.hs_code && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Customs HS Code</span>
                        <span className="text-sm font-mono font-semibold bg-gray-100 px-1.5 rounded">{activePanelSite.logistics.hs_code}</span>
                      </div>
                    )}

                    {/* NEW: Trade Flow (Helps VCs understand supply reliability) */}
                    {activePanelSite.logistics.trade_flow && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Trade Flow</span>
                        <span className="text-sm font-semibold text-emerald-600">{activePanelSite.logistics.trade_flow}</span>
                      </div>
                    )}

                    <div className="flex justify-between pt-1 border-t border-gray-50">
                      <span className="text-sm text-gray-500">Est. Delivery</span>
                      <span className="text-sm font-semibold">{activePanelSite.logistics.estDelivery || 'Dynamic'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Compliance Section */}
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">
                    <ShieldCheck className="w-4 h-4 text-gray-400" /> Compliance & Risk
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-sm text-gray-500">ESG Score</span><span className="text-sm font-bold text-green-600">{activePanelSite.compliance.esg_score}</span></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Risk Level</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${activePanelSite.compliance.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : activePanelSite.compliance.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {activePanelSite.compliance.riskLevel}
                      </span>
                    </div>
                    <div className="pt-2">
                      <span className="text-xs text-gray-500 block mb-1">Active Threat Factor:</span>
                      <p className="text-xs text-gray-800 bg-gray-100 p-2 rounded">{activePanelSite.compliance.riskFactor}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel Footer */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <a 
                  href={`mailto:procurement@supplier.com?subject=Quote Request: ${activePanelSite.mineral} from ${activePanelSite.name}`}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Mail className="w-4 h-4" /> Request Supply Quote
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4. LEGEND (Bottom) */}
      <div className="bg-gray-900 text-gray-300 p-3 text-xs flex flex-wrap justify-between items-center z-10 relative">
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-500 uppercase tracking-widest">Status:</span>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border border-gray-600" style={{ backgroundColor: color }}></span>
              <span>{status}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-3 opacity-70">
          <span className="italic">Radius scales with asset utilisation (%)</span>
        </div>
      </div>

    </div>
  );
};

export default MiningMap;
