import React, { useState } from 'react';
import Papa from 'papaparse';
import { 
  FileUp, 
  Table, 
  Play, 
  CheckCircle2, 
  Download, 
  Loader2, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { analyzeSentiment } from '../services/nlpService';
import { cn } from '../lib/utils';

export default function BulkAnalysis() {
  const [data, setData] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data.slice(0, 50)); // Limit to 50 for safety
      }
    });
  };

  const runBulkAnalysis = async () => {
    if (data.length === 0) return;
    setAnalyzing(true);
    setResults([]);
    
    const newResults = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      // Search for common "text" column names
      const text = row.text || row.comment || row.message || Object.values(row)[0] as string;
      
      try {
        const result = await analyzeSentiment(text);
        newResults.push({ ...row, ...result });
      } catch (err) {
        newResults.push({ ...row, sentiment: 'Error', confidence: 0 });
      }
      
      setProgress(Math.round(((i + 1) / data.length) * 100));
      setResults([...newResults]); // Update UI incrementally
    }
    setAnalyzing(false);
  };

  const exportCSV = () => {
    const csv = Papa.unparse(results);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentiment_analysis_results.csv';
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-12 bg-white/5 hover:bg-white/10 transition-all group">
        <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30 group-hover:scale-110 transition-transform">
          <FileSpreadsheet className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Bulk Processing Hub</h3>
        <p className="text-slate-400 text-sm mb-8 text-center max-w-sm">
          Upload a CSV file containing user reviews or comments. We'll analyze up to 50 entries in real-time.
        </p>
        
        <label 
          className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-600/20 outline-none focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 focus-within:ring-offset-black"
          aria-label="Upload CSV file for bulk analysis"
        >
          <FileUp className="w-5 h-5 pointer-events-none" />
          Select CSV File
          <input type="file" accept=".csv" onChange={handleFileUpload} className="sr-only" />
        </label>
      </div>

      {data.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h4 className="text-white font-bold">Data Preview</h4>
              <p className="text-xs text-slate-500">{data.length} records detected</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={runBulkAnalysis}
                disabled={analyzing}
                aria-label={analyzing ? `Processing: ${progress}%` : "Start bulk analysis"}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing {progress}%
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Start Analysis
                  </>
                )}
              </button>
              {results.length > 0 && !analyzing && (
                <button
                  onClick={exportCSV}
                  aria-label="Export analysis results to CSV"
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/40 text-slate-400 uppercase text-[10px] tracking-widest font-black sticky top-0">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4 min-w-[200px]">Raw Text</th>
                  <th className="p-4">Sentiment</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4">Emotion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(results.length > 0 ? results : data).map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-slate-600 font-mono">{i + 1}</td>
                    <td className="p-4 text-slate-300 max-w-sm truncate">
                      {row.text || row.comment || row.message || Object.values(row)[0]}
                    </td>
                    <td className="p-4">
                      {row.sentiment ? (
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          row.sentiment === 'positive' && "bg-green-500/20 text-green-400",
                          row.sentiment === 'negative' && "bg-red-500/20 text-red-400",
                          row.sentiment === 'neutral' && "bg-slate-500/20 text-slate-400",
                        )}>
                          {row.sentiment}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-slate-400">
                      {row.confidence ? `${(row.confidence * 100).toFixed(0)}%` : '-'}
                    </td>
                    <td className="p-4 text-slate-400 flex items-center gap-2">
                       {row.emoji} {row.emotion || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
