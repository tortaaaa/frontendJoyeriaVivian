import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  // Cambia esto según donde guardas el token, aquí localStorage:
  const token = localStorage.getItem('transbank_token');
  if (!token) {
    return <Navigate to="/transbank-login" replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
