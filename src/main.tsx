import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { validateEnv } from './env.ts';
import { observeWebVitals, logPerformanceMetric, measureNavigationTiming } from './performance.ts';

// Validate environment variables before starting the app
try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error);
  // Show error message if in development
  if (import.meta.env.DEV) {
    document.body.innerHTML = `
      <div style="padding: 2rem; font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">Environment Configuration Error</h1>
        <p style="color: #64748b;">${error instanceof Error ? error.message : 'Unknown error'}</p>
        <p style="color: #64748b; margin-top: 1rem;">Please check your .env file and ensure all required variables are set.</p>
      </div>
    `;
    throw error;
  }
}

// Initialize performance monitoring
observeWebVitals(logPerformanceMetric);
measureNavigationTiming();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);

