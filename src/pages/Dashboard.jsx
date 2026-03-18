import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { mockData } from '../data/mockData';
import { AlertTriangle, Package, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BatchesTable = () => {
  const data = mockData.batches; // Using the data we imported on Day 2
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mt-8">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="font-semibold text-gray-700 text-left">Active Mineral Batches</h2>
        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
          {data.length} Total Batches
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 font-medium">Batch ID</th>
              <th className="px-6 py-3 font-medium">Mineral</th>
              <th className="px-6 py-3 font-medium">Supplier</th>
              <th className="px-6 py-3 font-medium">ETA</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">ESG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((batch, index) => (
              <tr 
                key={index} 
                onClick={() => navigate('/trace', { state: { batchId: batch.id } })}
                className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <td className="p-3 font-mono text-sm text-blue-600 font-bold">{batch.id}</td>
                <td className="p-3 font-semibold">{batch.mineral}</td>
                <td className="p-3 text-gray-600">{batch.supplier}</td>
                <td className="p-3 text-sm">{batch.eta}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    batch.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                    batch.status === 'At-Risk' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {batch.status}
                  </span>
                </td>
                <td className="p-3 font-bold text-green-700">{batch.esg_grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // Data for the "Supply Coverage" Bar Chart (Days remaining)
  const coverageData = [
    { name: 'Lithium', days: 14 },
    { name: 'Cobalt', days: 5 },
    { name: 'Graphite', days: 32 },
    { name: 'Nickel', days: 9 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Procurement Dashboard</h1>

      {/* KPI Row - Source [37] */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg"><Package className="text-blue-600" /></div>
          <div><p className="text-sm text-gray-500">Active Orders</p><p className="text-2xl font-bold">₹4.2 Cr</p></div>
        </div>
        {/* Updated Risks Flagged KPI Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-red-50 rounded-lg"><AlertTriangle className="text-red-600 w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-500">Risks Flagged</p>
              <p className="text-2xl font-bold text-red-600">{mockData.alerts.length}</p>
            </div>
          </div>
          <div className="flex gap-2 text-xs font-bold mt-2">
            <span className="px-2 py-1 bg-red-50 text-red-700 rounded-md border border-red-100">3 High</span>
            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md border border-yellow-100">3 Med</span>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">2 Low</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg"><Globe className="text-green-600" /></div>
          <div><p className="text-sm text-gray-500">Import Dependency</p><p className="text-2xl font-bold">82%</p></div>
        </div>
      </div>

      {/* Supply Coverage Bar */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 text-left">Supply Coverage (Days Remaining)</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={coverageData} layout="vertical" margin={{ left: 20, right: 30 }}> {/* Increased right margin so labels fit */}
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="days" radius={[0, 4, 4, 0]} barSize={30}>
                {coverageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.days < 10 ? '#ef4444' : '#3b82f6'} />
                ))}
                {/* THE FIX: Adds the number label to the end of the bar */}
                <LabelList dataKey="days" position="right" fill="#4b5563" fontSize={14} fontWeight="bold" formatter={(value) => `${value}d`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 mt-2 italic text-left">* Red indicates inventory below 10-day safety buffer.</p>
      </div>
      <BatchesTable />
    </div>
  );
};

export default Dashboard;