import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';

// Configuration for Firebase deployment
if (window.location.hostname.includes('web.app') || window.location.hostname.includes('firebaseapp.com')) {
    // Point to the Render backend
    axios.defaults.baseURL = 'https://teashop-9dk1.onrender.com';
    console.log('configured for firebase: using render backend');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
