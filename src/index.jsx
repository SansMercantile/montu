import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import Dashboard from './pages/Dashboard';

// Mounts into the dashboard-root section embedded in the static landing page
// (index.html) — the original App.js had duplicate conflicting component
// definitions concatenated together (invalid JS, two default exports) and no
// working mount target anyway, so it's removed rather than fixed/kept.
const root = ReactDOM.createRoot(document.getElementById('dashboard-root'));
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
