import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  History, 
  BarChart3, 
  BrainCircuit, 
  Send, 
  Loader2, 
  Cpu, 
  ChevronRight,
  RefreshCcw,
  Sparkles,
  LogOut,
  User as UserIcon,
  Fingerprint,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';
import { analyzeSentiment, SentimentResult } from './services/nlpService';
import SentimentHistory from './components/SentimentHistory';
import MetricsDashboard from './components/MetricsDashboard';
import AdvancedAnalysisView from './components/AdvancedAnalysisView';
import BulkAnalysis from './components/BulkAnalysis';
import VoiceInput from './components/VoiceInput';
import { cn } from './lib/utils';

interface HistoryItem {
  id: string;
  text: string;
  result: SentimentResult;
  timestamp: any;
}

export default function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'analyze' | 'metrics' | 'history' | 'bulk' | 'admin'>('analyze');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const handleAnalyze = async (textToUse?: string) => {
    const final_text = textToUse || inputText;
    if (!final_text.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const analysis = await analyzeSentiment(final_text);
      setResult(analysis);
      
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        text: final_text,
        result: analysis,
        timestamp: new Date(),
      };
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'border-green-500/50 bg-green-500/10 text-green-400';
      case 'negative': return 'border-red-500/50 bg-red-500/10 text-red-400';
      default: return 'border-slate-500/50 bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500 selection:bg-blue-500/30",
      theme === 'dark' ? "bg-[#0a0a0b] text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }} />
      </div>

      <header className={cn(
        "relative border-b border-white/5 backdrop-blur-md sticky top-0 z-50 transition-colors",
        theme === 'dark' ? "bg-black/20" : "bg-white/70"
      )}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className={cn("text-xl font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-black")}>
                Sentiment<span className="text-blue-500">Lab</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Public NLP Lab</p>
            </div>
          </div>

          <nav className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 mx-4 overflow-x-auto no-scrollbar">
            {[
              { id: 'analyze', icon: Search, label: 'Analysis' },
              { id: 'bulk', icon: FileSpreadsheet, label: 'Bulk' },
              { id: 'metrics', icon: BarChart3, label: 'Reports' },
              { id: 'history', icon: History, label: 'Session' },
              { id: 'admin', icon: ShieldCheck, label: 'Admin' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                aria-label={tab.label}
                aria-pressed={activeTab === tab.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-nowrap uppercase tracking-tighter outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                  activeTab === tab.id 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "text-slate-500 hover:text-blue-400 hover:bg-white/5"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 pl-4 border-l border-white/10 shrink-0">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'analyze' && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className={cn("text-5xl font-black mb-4 tracking-tighter leading-none", theme === 'dark' ? "text-white" : "text-black")}>
                  Advanced Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Intelligence</span>
                </h2>
                <p className="text-slate-500 text-xl font-medium">
                  Deep neural text classification, emotion mining, and semantic entity recognition.
                </p>
              </div>

              <div className={cn(
                "border rounded-[3rem] p-8 backdrop-blur-xl shadow-2xl transition-colors",
                theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-slate-200"
              )}>
                <div className="relative group">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Describe a user experience, news article, or product review..."
                    aria-label="Text to analyze"
                    className={cn(
                      "w-full rounded-2xl p-8 text-2xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[250px] resize-none transition-all focus-visible:ring-blue-500",
                      theme === 'dark' ? "bg-black/40 border border-white/10 text-white placeholder:text-slate-700" : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400"
                    )}
                  />
                  <div className="absolute bottom-6 left-6">
                    <VoiceInput onTranscript={(text) => {
                      setInputText(text);
                      handleAnalyze(text);
                    }} />
                  </div>
                  <div className="absolute bottom-6 right-6 flex items-center gap-4">
                    <button
                      onClick={() => handleAnalyze()}
                      disabled={loading || !inputText.trim()}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/30 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing
                        </>
                      ) : (
                        <>
                          Compute
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>

              {result && !loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={cn(
                      "lg:col-span-1 rounded-[2.5rem] border p-10 flex flex-col items-center justify-center text-center shadow-xl",
                      getSentimentStyles(result.sentiment)
                    )}>
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-8xl mb-6 drop-shadow-2xl"
                      >
                        {result.emoji}
                      </motion.div>
                      <h3 className="text-4xl font-black uppercase tracking-tighter mb-1">
                        {result.sentiment}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-black opacity-80 uppercase tracking-widest bg-black/10 px-4 py-1.5 rounded-full mt-4">
                        Confidence: {(result.confidence * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className={cn(
                      "lg:col-span-2 border rounded-[2.5rem] p-10 space-y-8 shadow-xl",
                      theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
                    )}>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                          Nuance Logic
                        </h4>
                        <p className={cn("leading-relaxed text-2xl font-serif italic font-medium", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>
                          "{result.explanation}"
                        </p>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Top Vectors</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.tokens.map((token, i) => (
                            <div 
                              key={i} 
                              className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-bold text-slate-400 flex items-center gap-2 hover:bg-blue-500/20 hover:text-white transition-all cursor-default"
                            >
                              <span className="text-blue-500 font-mono text-[10px]">VECTOR_{i+1}</span>
                              {token}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[3rem]">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-black uppercase tracking-tighter text-blue-400">Deep Spectrum Analysis</h3>
                       <div className="px-3 py-1 bg-blue-500 text-white text-[10px] font-bold rounded">ADVANCED</div>
                    </div>
                    <AdvancedAnalysisView result={result} />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'bulk' && (
            <motion.div
              key="bulk"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
               <BulkAnalysis />
            </motion.div>
          )}

          {activeTab === 'metrics' && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className={cn("text-3xl font-black tracking-tighter uppercase", theme === 'dark' ? "text-white" : "text-black")}>
                  System Benchmarks
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  NLP Kernel v3.4: ACTIVE
                </div>
              </div>
              <MetricsDashboard />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className={cn("text-3xl font-black tracking-tighter uppercase", theme === 'dark' ? "text-white" : "text-black")}>
                  Archive Log
                </h2>
                <button 
                  onClick={handleClearHistory}
                  aria-label="Clear session history"
                  className="text-xs font-bold text-red-500/60 hover:text-red-500 transition-colors flex items-center gap-1 uppercase tracking-widest outline-none focus-visible:underline decoration-2"
                >
                  <RefreshCcw className="w-3 h-3" />
                  Wipe Data Storage
                </button>
              </div>
              <SentimentHistory items={history} />
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
               <div className="p-12 bg-white/5 border border-white/10 rounded-[3rem] text-center">
                  <ShieldCheck className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Security Center</h2>
                  <p className="text-slate-500 max-w-md mx-auto mb-8">
                    User management and system-wide analytics are restricted to authorized administrators.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Active Sessions', value: '42' },
                      { label: 'Total API Tokens', value: '1.2M' },
                      { label: 'System Uptime', value: '99.9%' }
                    ].map(stat => (
                      <div key={stat.label} className="p-6 bg-black/40 rounded-2xl border border-white/5">
                        <div className="text-2xl font-black text-white">{stat.value}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{stat.label}</div>
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className={cn(
        "border-t border-white/5 py-16 mt-20 transition-colors",
        theme === 'dark' ? "bg-black/40" : "bg-slate-100"
      )}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-slate-500 text-sm">
          <div className="md:col-span-1">
            <h4 className={cn("font-black mb-6 uppercase tracking-[0.2em]", theme === 'dark' ? "text-white" : "text-black")}>
              NLP Architecture
            </h4>
            <p className="leading-relaxed opacity-80 mb-6">
              SentimentLab leverages Gemini 1.5 Flash alongside vector-embedding pipelines to deliver 
              context-aware emotional classification across 50+ languages.
            </p>
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-blue-400 cursor-pointer transition-colors font-bold text-xs">Tw</div>
               <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-red-400 cursor-pointer transition-colors font-bold text-xs">Yt</div>
               <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-purple-400 cursor-pointer transition-colors font-bold text-xs">In</div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h4 className={cn("font-black mb-6 uppercase tracking-[0.2em]", theme === 'dark' ? "text-white" : "text-black")}>
              Engine Status
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                 <span className="font-bold uppercase tracking-widest">Model Stability</span>
                 <span className="text-green-500 font-mono">STABLE (99.2%)</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[92%]" />
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="font-bold uppercase tracking-widest">Token Latency</span>
                 <span className="text-blue-400 font-mono">14ms average</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-[14%]" />
              </div>
            </div>
          </div>

          <div className="md:col-span-1 flex flex-col md:items-end gap-2">
            <span className={cn("text-[10px] uppercase font-black", theme === 'dark' ? "text-white/20" : "text-slate-300")}>
              Public NLP Engine
            </span>
            <span className={cn("text-[10px] uppercase font-black", theme === 'dark' ? "text-white/20" : "text-slate-300")}>
              Session Active
            </span>
            <span className="font-mono text-[10px] tracking-tighter">REF_2026_05_12_NLP_CORE</span>
            <a 
              href="/python_sentiment_project/GUIDE.md" 
              className="flex items-center gap-2 mt-8 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all hover:scale-105"
            >
              Project Documentation
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
