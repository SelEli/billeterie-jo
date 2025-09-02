import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // ← il te manque sûrement cette ligne !

import './styles/tailwind.css';   // Tailwind d’abord
import './styles/main.scss';      // Ton Sass ensuite

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
