import React from 'react';
import ReactDOM from 'react-dom/client';

import WeatherWidget from './WeatherWidget';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WeatherWidget />
  </React.StrictMode>,
)
