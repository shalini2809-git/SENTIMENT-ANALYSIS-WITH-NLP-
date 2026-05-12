import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, MessageSquare, Tag } from 'lucide-react';
import { SentimentResult } from '../services/nlpService';
import { cn } from '../lib/utils';

interface HistoryItem {
  id: string;
  text: string;
  result: SentimentResult;
  timestamp: any; // Can be Date or Firestore Timestamp
}

interface SentimentHistoryProps {
  items: HistoryItem[];
}

export default function SentimentHistory({ items }: SentimentHistoryProps) {
  const formatDate = (ts: any) => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleTimeString();
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
        <p>No analysis history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            tabIndex={0}
            aria-label={`History item: ${item.text.substring(0, 50)}... Sentiment: ${item.result.sentiment}`}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-slate-200 line-clamp-2 text-sm italic pr-12">
                "{item.text}"
              </p>
              <div className={cn(
                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shrink-0",
                item.result.sentiment === 'positive' && "bg-green-500/20 text-green-400",
                item.result.sentiment === 'negative' && "bg-red-500/20 text-red-400",
                item.result.sentiment === 'neutral' && "bg-slate-500/20 text-slate-400",
              )}>
                {item.result.sentiment} {item.result.emoji}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase tracking-tighter">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(item.timestamp)}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Confidence: {(item.result.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
