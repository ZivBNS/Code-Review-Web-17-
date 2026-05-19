import { useState, useEffect } from 'react';
import { fetchMockTree, fetchMockFile } from '../../services/mockGitHub';
import { sendMockChatMessage } from '../../services/mockAI';

export default function useWorkspace() {
  const [fileTree, setFileTree] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [selectedLine, setSelectedLine] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Welcome to the review session. Let\'s start by looking at the App.jsx file. What do you notice?', timestamp: new Date().toISOString() }
  ]);
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
    fetchMockTree().then(tree => {
      setFileTree(tree);
    });
  }, []);

  const handleFileSelect = async (file) => {
    setActiveFile(file.path);
    setSelectedLine(null);
    const content = await fetchMockFile(file.path);
    setFileContent(content);
  };

  const handleLineClick = (lineNumber) => {
    setSelectedLine(lineNumber);
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString(), contextLine: selectedLine };
    setChatMessages(prev => [...prev, userMsg]);

    const botResponse = await sendMockChatMessage(text, selectedLine);
    setChatMessages(prev => [...prev, botResponse]);
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
    toggleChecklistCategory
  };
}
