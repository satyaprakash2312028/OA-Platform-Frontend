import { StrictMode } from 'react'
import { MotionConfig } from "framer-motion"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <MotionConfig reducedMotion={(1)? "always" : "user"}>
           <App />
        </MotionConfig>
    </BrowserRouter>
)
