import React from 'react';
import { motion } from 'motion/react';
import { 
  Tag, 
  User, 
  MapPin, 
  Building2, 
  AlertTriangle, 
  MessageCircle, 
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';
import { SentimentResult } from '../services/nlpService';
import { cn } from '../lib/utils';

interface AdvancedAnalysisViewProps {
  result: SentimentResult;
}

export default function AdvancedAnalysisView({ result }: AdvancedAnalysisViewProps) {
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'excited': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'sad': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'angry': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'fear': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Emotion & Spam Detection */}
      <div className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md outline-none focus-within:ring-2 focus-within:ring-blue-500" tabIndex={0} aria-label="Emotional Profile analysis">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" aria-hidden="true" />
              Emotional Profile
            </h4>
            {result.isFakeReview && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[10px] font-bold uppercase">
                <AlertTriangle className="w-3 h-3" />
                Spam Detected
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className={cn("px-4 py-2 rounded-xl border text-xl font-bold flex items-center gap-2", getEmotionColor(result.emotion))}>
              {result.emotion.toUpperCase()}
            </div>
            <p className="text-slate-400 text-sm">
              The underlying emotional state is primarily <span className="text-white">{result.emotion}</span> with a focus on intent.
            </p>
          </div>
        </div>

        {/* NER - Named Entity Recognition */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md outline-none focus-within:ring-2 focus-within:ring-blue-500" tabIndex={0} aria-label="Named Entities extracted">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Named Entities (NER)</h4>
          <div className="flex flex-wrap gap-2">
            {result.entities.length > 0 ? result.entities.map((ent, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm">
                {ent.type.toLowerCase().includes('person') && <User className="w-3 h-3 text-blue-400" />}
                {ent.type.toLowerCase().includes('location') && <MapPin className="w-3 h-3 text-green-400" />}
                {ent.type.toLowerCase().includes('org') && <Building2 className="w-3 h-3 text-purple-400" />}
                <span className="text-slate-200">{ent.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">[{ent.type}]</span>
              </div>
            )) : <p className="text-slate-500 text-sm italic">No specific entities detected.</p>}
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-3xl p-6 outline-none focus-within:ring-2 focus-within:ring-blue-400" tabIndex={0} aria-label="AI response suggestion">
          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            AI-Generated Response Suggestion
          </h4>
          <p className="text-white text-lg font-medium leading-relaxed">
            "{result.aiSuggestion}"
          </p>
        </div>
      </div>

      {/* Breakdown & Summarization */}
      <div className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md outline-none focus-within:ring-2 focus-within:ring-blue-500" tabIndex={0} aria-label="Executive Summary">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            Executive Summary
          </h4>
          <p className="text-slate-300 leading-relaxed italic">
            "{result.summary}"
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Sentence-level Breakdown</h4>
          <div className="space-y-3">
            {result.sentences.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div className={cn(
                  "w-1 h-8 rounded shrink-0",
                  s.sentiment === 'positive' && "bg-green-500",
                  s.sentiment === 'negative' && "bg-red-500",
                  s.sentiment === 'neutral' && "bg-slate-500",
                )} />
                <p className="text-xs text-slate-300 leading-normal">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-indigo-400" />
            Extracted Hashtags & Intent
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.keywords.map((kw, i) => (
              <span key={i} className="text-blue-400 font-mono text-sm">#{kw.replace(/\s+/g, '')}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
