import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css' // <-- FIX: Change from './index.css' to reference the new styles directory

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)