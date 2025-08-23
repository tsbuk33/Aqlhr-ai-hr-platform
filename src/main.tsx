import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LocaleProvider } from './i18n/locale'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

// Initialize theme class immediately to prevent flash
const savedTheme = localStorage.getItem('aql-hr-theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.add('light');
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </QueryClientProvider>
);
