import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { SearchProvider } from './utils/SearchContext.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <StrictMode>
        <SearchProvider>
          <App />
        </SearchProvider>
      </StrictMode>
    </BrowserRouter>
  )
