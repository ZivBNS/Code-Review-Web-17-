import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function useWorkspace() {
  const { projectId } = useParams();
  const [fileTree, setFileTree] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContent, setFileContent] = useState('// Select a file to view its contents');
  const [selectedLine, setSelectedLine] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [checklist, setChecklist] = useState([
    { id: 1, category: 'Security', checked: false },
    { id: 2, category: 'Performance', checked: false },
    { id: 3, category: 'Readability', checked: false },
    { id: 4, category: 'Architecture', checked: false },
    { id: 5, category: 'Testing', checked: false },
    { id: 6, category: 'Error Handling', checked: false },
    { id: 7, category: 'State Management', checked: false },
    { id: 8, category: 'Accessibility', checked: false },
    { id: 9, category: 'Documentation', checked: false },
    { id: 10, category: 'Scalability', checked: false },
    { id: 11, category: 'Best Practices', checked: false },
    { id: 12, category: 'Reusability', checked: false },
  ]);

  useEffect(() => {
    // Fetch GitHub tree
    if (projectId) {
      fetch(`http://localhost:5000/api/projects/${projectId}/github/tree`)
        .then(res => res.json())
        .then(tree => {
          if (Array.isArray(tree)) setFileTree(tree);
        })
        .catch(err => console.error("Error fetching file tree:", err));
    }

    // Fetch chat history
    if (projectId) {
      fetch(`http://localhost:5000/api/projects/${projectId}/messages`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setChatMessages(data);
          } else {
            // First time load, save initial bot message
            const initialMsg = { role: 'assistant', content: "Welcome to the review session. Let's start by looking at the code. What do you notice?" };
            setChatMessages([initialMsg]);
            fetch(`http://localhost:5000/api/projects/${projectId}/messages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(initialMsg)
            });
          }
        })
        .catch(err => console.error("Error fetching messages:", err));
    }
  }, [projectId]);

  const handleFileSelect = async (file) => {
    setActiveFile(file.path);
    setSelectedLine(null);
    setFileContent('// Loading...');
    
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/github/file?path=${encodeURIComponent(file.path)}`);
      if (response.ok) {
        const content = await response.text();
        setFileContent(content);
      } else {
        setFileContent('// Error loading file content');
      }
    } catch (err) {
      console.error('Error fetching file content:', err);
      setFileContent('// Error loading file content');
    }
  };

  const handleLineClick = (lineNumber) => {
    setSelectedLine(lineNumber);
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || !projectId) return;
    
    const tempUserMsg = { role: 'user', content: text, contextLine: selectedLine, timestamp: new Date().toISOString() };
    
    // Optimistic UI update
    setChatMessages(prev => [...prev, tempUserMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, contextLine: selectedLine, activeFile })
      });

      if (response.ok) {
        const { userMessage, botMessage } = await response.json();
        // Replace optimistic user message with real one from DB, and append bot message
        setChatMessages(prev => {
          const updated = [...prev];
          updated.pop(); // Remove optimistic
          return [...updated, userMessage, botMessage];
        });
      } else {
         console.error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error in chat:', error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const toggleChecklistCategory = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return {
    fileTree,
    activeFile,
    fileContent,
    selectedLine,
    chatMessages,
    checklist,
    handleFileSelect,
    handleLineClick,
    handleSendMessage,
    toggleChecklistCategory,
    isChatLoading
  };
}
