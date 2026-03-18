import { useState } from 'react';
import { mockData } from '../data/mockData';
import { useLocation } from 'react-router-dom';
import { Search, MapPin, Box, Leaf, Clock, Send, Building2 } from 'lucide-react';

const SupplierDirectory = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mineralFilter, setMineralFilter] = useState(location.state?.autoFilter || 'All');
  const [stateFilter, setStateFilter] = useState('All');
  const [esgFilter, setEsgFilter] = useState('All');

  // Extract unique states for the dropdown filter
  const uniqueStates = ['All', ...new Set(mockData.suppliers.map(s => s.state))].sort();
  
  // Hardcoded core minerals for the prototype filter
  const coreMinerals = ['All', 'Lithium', 'Cobalt', 'Graphite', 'Nickel', 'Rare Earths'];

  // Filtering Logic
  const filteredSuppliers = mockData.suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMineral = mineralFilter === 'All' || supplier.mineral.includes(mineralFilter);
    const matchesState = stateFilter === 'All' || supplier.state === stateFilter;
    // 4. Check ESG (The missing piece!)
    let matchEsg = true;
    if (esgFilter === 'A') {
      matchEsg = supplier.esg_rating.startsWith('A'); // Catches A, A+, A-
    } else if (esgFilter === 'B') {
      // B & Above means it can start with A or B
      matchEsg = supplier.esg_rating.startsWith('A') || supplier.esg_rating.startsWith('B'); 
    } 
    return matchesSearch && matchesMineral && matchesState && matchEsg;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 text-left">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verified Supplier Directory</h1>
          <p className="text-gray-500">Discover and connect with domestic mineral suppliers.</p>
        </div>
        <div className="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
          {filteredSuppliers.length} Suppliers Found
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search supplier name..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
            value={mineralFilter}
            onChange={(e) => setMineralFilter(e.target.value)}
          >
            {coreMinerals.map(min => <option key={min} value={min}>{min === 'All' ? 'All Minerals' : min}</option>)}
          </select>
        </div>
        <div className="w-full md:w-48">
          <select 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            {uniqueStates.map(state => <option key={state} value={state}>{state === 'All' ? 'All States' : state}</option>)}
          </select>
        </div>
        <div className="w-full md:w-48">
        <select 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
          value={esgFilter}
          onChange={(e) => setEsgFilter(e.target.value)}
        >
          <option value="All">All ESG Grades</option>
          <option value="A">A-Grade Only (A+, A, A-)</option>
          <option value="B">B-Grade & Above</option>
        </select>
      </div>
      </div>

      {/* Supplier Grid - Source [54, 55] */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map(supplier => (
          <div key={supplier.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col text-left overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{supplier.name}</h3>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">{supplier.id}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-md">
                  <Leaf className="w-3 h-3" /> ESG: {supplier.esg_rating}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  supplier.capacity === 'High' ? 'bg-purple-100 text-purple-700' : 
                  supplier.capacity === 'Medium' ? 'bg-blue-100 text-blue-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  {supplier.capacity} Capacity
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Box className="w-3 h-3" /> Minerals</p>
                  <p className="text-sm font-semibold text-gray-800">{supplier.mineral}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                  <p className="text-sm font-semibold text-gray-800">{supplier.state}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-1"><Clock className="w-4 h-4" /> Avg Delivery</span>
                  <span className="font-bold text-gray-900">{supplier.delivery_time}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
              <a 
                href={`mailto:procurement@${supplier.name.toLowerCase().replace(/\s+/g, '')}.com?subject=MineralChain Quote Request - ${supplier.mineral}&body=Hello, I found your profile on MineralChain AI and would like to request a quote...`}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                <Send className="w-4 h-4" /> Request Quote <span className="text-xs font-normal text-gray-300 ml-1">(via email)</span>
              </a>
            </div>
          </div>
        ))}
        
        {/* Empty State */}
        {filteredSuppliers.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white border border-gray-200 rounded-xl border-dashed">
            <p className="text-gray-500 font-medium">No suppliers match your current filters.</p>
            <button onClick={() => {setSearchQuery(''); setMineralFilter('All'); setStateFilter('All');}} className="mt-2 text-blue-600 font-semibold hover:underline">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDirectory;