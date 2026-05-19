import React from 'react';
import { motion } from 'framer-motion';

export default function CodeViewer({ content, filename, selectedLine, onLineClick }) {
  const lines = content.split('\\n');

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-mono text-sm overflow-hidden">
      <div className="flex items-center px-4 py-2 border-b border-[#30363d] bg-[#161b22] text-xs font-semibold text-[#8b949e]">
        {filename}
      </div>
      <div className="flex-1 overflow-auto p-4 pt-2 pb-10">
        <div className="flex flex-col">
          {lines.map((line, idx) => {
            const lineNumber = idx + 1;
            const isSelected = selectedLine === lineNumber;
            return (
              <motion.div
                key={lineNumber}
                className={`flex hover:bg-[#161b22] cursor-pointer group transition-colors \${isSelected ? 'bg-[#1f6feb]/20' : ''}`}
                onClick={() => onLineClick(lineNumber)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.005, 0.5) }}
              >
                <div className={`w-12 text-right pr-4 select-none \${isSelected ? 'text-[#58a6ff]' : 'text-[#484f58] group-hover:text-[#8b949e]'}`}>
                  {lineNumber}
                </div>
                <div className="flex-1 whitespace-pre pl-2 border-l border-[#30363d]/50">
                  {line || ' '}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
