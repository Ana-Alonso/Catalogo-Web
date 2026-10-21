import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/yanone-kaffeesatz'
import './i18n'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/errors/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
