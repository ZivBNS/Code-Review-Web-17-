import React from 'react';
import useLogin from './useLogin';
import LoginView from './LoginView';

export default function LoginContainer() {
  const loginLogic = useLogin();
  return <LoginView {...loginLogic} />;
}
