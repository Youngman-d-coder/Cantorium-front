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
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'padding: 2rem; font-family: sans-serif; max-width: 600px; margin: 0 auto;';
    
    const heading = document.createElement('h1');
    heading.style.color = '#ef4444';
    heading.textContent = 'Environment Configuration Error';
    
    const errorMessage = document.createElement('p');
    errorMessage.style.color = '#64748b';
    errorMessage.textContent = error instanceof Error ? error.message : 'Unknown error';
    
    const instruction = document.createElement('p');
    instruction.style.cssText = 'color: #64748b; margin-top: 1rem;';
    instruction.textContent = 'Please check your .env file and ensure all required variables are set.';
    
    errorDiv.appendChild(heading);
    errorDiv.appendChild(errorMessage);
    errorDiv.appendChild(instruction);
    
    document.body.innerHTML = '';
    document.body.appendChild(errorDiv);
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

