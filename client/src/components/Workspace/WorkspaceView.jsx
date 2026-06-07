import React, { useState } from 'react';
import FileExplorer from './FileExplorer';
import CodeViewer from './CodeViewer';
import AIChat from './AIChat';
import Checklist from './Checklist';
import { Layout, MessageSquare, CheckSquare } from 'lucide-react';

export default function WorkspaceView(props) {
  const [activeRightPanel, setActiveRightPanel] = useState('chat');

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-background">
      <div className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border font-semibold flex items-center gap-2">
          <Layout className="w-4 h-4 text-blue-500" />
          Project Files
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <FileExplorer tree={props.fileTree} activeFile={props.activeFile} onFileSelect={props.handleFileSelect} />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
        {props.activeFile ? (
          <CodeViewer
            content={props.fileContent}
            filename={props.activeFile}
            selectedLine={props.selectedLine}
            onLineClick={props.handleLineClick}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a file to begin review
          </div>
        )}
      </div>

      <div className="w-96 border-l border-border bg-card flex flex-col z-10 shadow-xl">
        <div className="flex border-b border-border bg-background/50">
          <button
            className={`flex-1 py-3 px-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors \${activeRightPanel === 'chat' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveRightPanel('chat')}
          >
            <MessageSquare className="w-4 h-4" />
            Socratic AI
          </button>
          <button
            className={`flex-1 py-3 px-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors \${activeRightPanel === 'checklist' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveRightPanel('checklist')}
          >
            <CheckSquare className="w-4 h-4" />
            Framework
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {activeRightPanel === 'chat' ? (
            <AIChat
              messages={props.chatMessages}
              onSendMessage={props.handleSendMessage}
              selectedLine={props.selectedLine}
              activeFile={props.activeFile}
              isLoading={props.isChatLoading}
            />
          ) : (
            <Checklist
              items={props.checklist}
              onToggle={props.toggleChecklistCategory}
            />
          )}
        </div>
      </div>
    </div>
  );
}
