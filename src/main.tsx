import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, NotificationProvider, AuthProvider } from './contexts'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/global.scss'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  </StrictMode>,
)
