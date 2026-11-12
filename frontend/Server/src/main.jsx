import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '../../src/App.jsx'

const[page, setPage]= useState(
  new 
  URLSearchParams(window.loca.search).get
  ("page") == "dashboard"
  ? "dashboard"
  : "home"
);

// Renders the app inside the root element on the webpage.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
