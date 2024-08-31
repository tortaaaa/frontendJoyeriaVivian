// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { CartProvider } from './presentation/context/CartContext'; // Importa el CartProvider

ReactDOM.render(
  <React.StrictMode>
    <CartProvider> {/* Envuelve la aplicación con el CartProvider */}
      <App />
    </CartProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
