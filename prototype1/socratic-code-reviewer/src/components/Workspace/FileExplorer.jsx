import React from 'react';
import { Folder, File as FileIcon, ChevronRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const FileTreeNode = ({ node, level, activeFile, onFileSelect }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const isDir = node.type === 'folder';

  return (
    <div className="w-full">
      <div 
        className={`flex items-center py-1.5 px-2 hover:bg-muted/50 cursor-pointer rounded-md text-sm transition-colors \${activeFile === node.path ? 'bg-blue-500/10 text-blue-500' : 'text-foreground'}`}
        style={{ paddingLeft: `\${level * 12 + 8}px` }}
        onClick={() => isDir ? setIsOpen(!isOpen) : onFileSelect(node)}
      >
        {isDir ? (
          isOpen ? <ChevronDown className="w-4 h-4 mr-1 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 mr-1 text-muted-foreground" />
        ) : (
          <span className="w-5" /> 
        )}
        
        {isDir ? <Folder className="w-4 h-4 mr-2 text-blue-400" /> : <FileIcon className="w-4 h-4 mr-2 text-muted-foreground" />}
        <span className="truncate">{node.name}</span>
      </div>
      
      {isDir && isOpen && node.children && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {node.children.map((child, idx) => (
            <FileTreeNode key={idx} node={child} level={level + 1} activeFile={activeFile} onFileSelect={onFileSelect} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default function FileExplorer({ tree, activeFile, onFileSelect }) {
  return (
    <div className="flex flex-col">
      {tree.map((node, idx) => (
        <FileTreeNode key={idx} node={node} level={0} activeFile={activeFile} onFileSelect={onFileSelect} />
      ))}
    </div>
  );
}
