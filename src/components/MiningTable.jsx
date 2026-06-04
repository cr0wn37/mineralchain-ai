import React from 'react';

export default function MiningTable({ data }) {
  return (
    <div className="w-full bg-[#0B0F19] rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs font-semibold bg-[#121824]">
              <th className="p-3 pl-4">Company ↑</th>
              <th className="p-3">Operation ↕</th>
              <th className="p-3">Commodity ↕</th>
              {/* NEW: Metric Header */}
              <th className="p-3">Metric ↕</th>
              <th className="p-3">Period ↕</th>
              <th className="p-3 text-right">Volume ↕</th>
              <th className="p-3">Unit ↕</th>
              <th className="p-3 text-right text-emerald-500">Realized Price ↕</th>
              <th className="p-3">Country ↕</th>
              <th className="p-3 text-center">Source ↕</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-gray-300 text-sm">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-[#161F30] transition-colors">
                <td className="p-3 pl-4 font-semibold text-gray-200">
                  {row.company} <span className="text-xs text-gray-600 font-normal ml-1">{row.ticker}</span>
                </td>
                <td className="p-3 text-gray-400">{row.operation || '-'}</td>
                <td className="p-3">
                  <span className="flex items-center gap-1.5 text-xs text-blue-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {row.commodity}
                    {/* Shows the variant (e.g., Lithium Carbonate) in smaller text */}
                    <span className="text-[10px] text-gray-500 ml-1 hidden sm:inline">({row.variant})</span>
                  </span>
                </td>
                
                {/* NEW: Metric Data Cell with dynamic styling */}
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    row.metric?.toLowerCase().includes('guidance') 
                      ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50' 
                      : 'bg-gray-800 text-gray-300 border border-gray-700'
                  }`}>
                    {row.metric || 'Production'}
                  </span>
                </td>

                <td className="p-3 text-gray-400">{row.period}</td>
                <td className="p-3 text-right font-mono font-bold text-amber-500">{row.value}</td>
                <td className="p-3 text-gray-400">{row.unit}</td>
                
                <td className="p-3 text-right font-mono font-bold text-emerald-400">
                  {row.price || '-'}
                </td>

                <td className="p-3 text-gray-400">{row.country}</td>
                <td className="p-3 text-center">
                  <a href={row.source_pdf} target="_blank" rel="noreferrer" className="text-amber-600 hover:text-amber-500 flex justify-center">
                    PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}