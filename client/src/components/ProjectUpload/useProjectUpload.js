import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useProjectUpload() {
  const [githubUrl, setGithubUrl] = useState('');
  const [requirementsDoc, setRequirementsDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleUrlChange = (e) => setGithubUrl(e.target.value);
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setRequirementsDoc(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!githubUrl || !requirementsDoc) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('githubUrl', githubUrl);
      formData.append('requirementsDoc', requirementsDoc);

      const response = await fetch('http://localhost:5000/api/projects/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload project');
      }

      const data = await response.json();
      console.log('Project uploaded:', data);
      
      navigate(`/workspace/${data.projectId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Upload failed. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    githubUrl,
    requirementsDoc,
    isLoading,
    handleUrlChange,
    handleFileChange,
    handleSubmit
  };
}
