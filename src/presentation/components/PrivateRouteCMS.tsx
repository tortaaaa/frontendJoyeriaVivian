import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const PrivateRouteCMS: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('cms_token');

  // Si no hay token, redirige al login del CMS
  if (!token) {
    return <Navigate to="/cms/login" replace />;
  }

  // Si hay token, muestra el contenido privado
  return <>{children}</>;
};

export default PrivateRouteCMS;
