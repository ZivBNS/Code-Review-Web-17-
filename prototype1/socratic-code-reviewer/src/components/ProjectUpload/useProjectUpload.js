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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!githubUrl || !requirementsDoc) return;
    
    setIsLoading(true);
    // Simulate API call and validation
    setTimeout(() => {
      setIsLoading(false);
      navigate('/workspace');
    }, 1500);
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
