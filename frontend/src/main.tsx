import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './design-tokens.css' // Global design tokens
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
