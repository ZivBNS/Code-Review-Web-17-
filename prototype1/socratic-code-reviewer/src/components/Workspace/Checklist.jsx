import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Checklist({ items, onToggle }) {
  const completedCount = items.filter(i => i.checked).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground mb-2 flex items-center justify-between">
          <span>Review Progress</span>
          <span className="text-sm font-normal text-muted-foreground">{completedCount} of {items.length}</span>
        </h3>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `\${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onToggle(item.id)}
            className={`flex items-center gap-3 p-3 my-1 rounded-lg cursor-pointer transition-all hover:bg-muted \${item.checked ? 'opacity-70' : ''}`}
          >
            {item.checked ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
            )}
            <span className={`text-sm font-medium transition-colors \${item.checked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {item.category}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
