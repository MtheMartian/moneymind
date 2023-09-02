import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import MoneyManager from './pages/MoneyManager.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MoneyManager />
  </React.StrictMode>,
)
