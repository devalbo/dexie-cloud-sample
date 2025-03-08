import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ShoppingListDemoApp } from './app'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShoppingListDemoApp />
  </StrictMode>,
)
