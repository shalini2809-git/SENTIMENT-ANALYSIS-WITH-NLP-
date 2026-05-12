import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie } from 'recharts';

const benchmarkData = [
  { name: 'Log. Regression', accuracy: 88, f1: 87 },
  { name: 'Support Vector', accuracy: 89, f1: 88 },
  { name: 'Random Forest', accuracy: 85, f1: 84 },
  { name: 'LSTM (Deep)', accuracy: 92, f1: 91 },
  { name: 'BERT (Trans)', accuracy: 94, f1: 94 },
];

const distributionData = [
  { name: 'Positive', value: 45, color: '#22c55e' },
  { name: 'Negative', value: 35, color: '#ef4444' },
  { name: 'Neutral', value: 20, color: '#94a3b8' },
];

export default function MetricsDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div 
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 outline-none focus-within:ring-2 focus-within:ring-blue-500" 
        tabIndex={0}
        aria-label="Model Architecture Comparison Bar Chart"
      >
        <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-tighter">Model Architecture Comparison</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarkData} margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              />
              <Bar dataKey="accuracy" name="Accuracy %" radius={[4, 4, 0, 0]} barSize={25}>
                {benchmarkData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name.includes('(Deep)') || entry.name.includes('(Trans)') ? '#3b82f6' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-slate-500 mt-6 leading-relaxed">
          *BERT-based transformers show superior sequence understanding. Traditional ML models serve as baseline controls.
        </p>
      </div>

      <div 
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 outline-none focus-within:ring-2 focus-within:ring-blue-500"
        tabIndex={0}
        aria-label="Example Dataset Distribution Pie Chart"
      >
        <h3 className="text-lg font-semibold mb-4 text-white">Example Dataset Distribution</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 text-xs">
          {distributionData.map(d => (
            <div key={d.name} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-slate-300">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div 
        className="md:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 outline-none focus-within:ring-2 focus-within:ring-blue-500"
        tabIndex={0}
        aria-label="Confusion Matrix - Prediction Accuracy Visualization"
      >
        <h3 className="text-lg font-semibold mb-4 text-white">Confusion Matrix (Training Visualization)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse">
            <caption className="sr-only">Table showing actual vs predicted sentiment classifications</caption>
            <thead>
              <tr>
                <th className="p-2"></th>
                <th colSpan={3} className="p-2 text-slate-400 uppercase tracking-wider border-b border-white/10">Predicted</th>
              </tr>
              <tr className="text-slate-300 uppercase text-xs">
                <th className="p-2 border-r border-white/10">Actual</th>
                <th className="p-2">Positive</th>
                <th className="p-2">Neutral</th>
                <th className="p-2">Negative</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Positive', values: [842, 45, 13], bg: 'bg-green-500/20' },
                { label: 'Neutral', values: [32, 756, 42], bg: 'bg-blue-500/20' },
                { label: 'Negative', values: [18, 56, 810], bg: 'bg-red-500/20' },
              ].map((row, i) => (
                <tr key={i} className="text-white border-t border-white/5">
                  <td className="p-4 font-bold text-slate-400 border-r border-white/10">{row.label}</td>
                  {row.values.map((v, j) => (
                    <td key={j} className={`p-4 ${i === j ? row.bg : ''}`}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
