import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/main.scss';
import './styles/extra.scss';

createRoot(document.getElementById('root')).render(<App />);
