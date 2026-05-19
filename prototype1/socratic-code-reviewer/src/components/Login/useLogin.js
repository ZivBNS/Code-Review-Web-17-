import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useLogin() {
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'lecturer') {
      navigate('/dashboard');
    } else {
      navigate('/upload');
    }
  };

  return {
    role,
    handleRoleChange,
    handleLogin
  };
}
