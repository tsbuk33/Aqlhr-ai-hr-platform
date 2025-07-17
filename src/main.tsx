import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize theme class immediately to prevent flash
const savedTheme = localStorage.getItem('aql-hr-theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.add('light');
}

createRoot(document.getElementById("root")!).render(<App />);
