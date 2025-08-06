import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
// --- 1. IMPORTA EL REGISTRO DEL SERVICE WORKER ---
// Esta línea importa el archivo que contiene la lógica para activar la PWA.
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// --- 2. REGISTRA EL SERVICE WORKER ---
// Al cambiar de 'unregister()' a 'register()', le dices a tu aplicación
// que empiece a funcionar como una PWA, permitiendo el uso offline
// y el almacenamiento en caché.
serviceWorkerRegistration.register();