
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { logErrorToSplunk, logToMonitoring } from '@/integrations/supabase/client';

// Enhanced error handling for the entire application
const handleError = (error: Error, errorInfo?: React.ErrorInfo) => {
  console.error('Application error:', error);
  console.error('Error details:', errorInfo);
  
  // Log to Splunk
  logErrorToSplunk(error, 'GlobalErrorHandler', errorInfo);
};

// Add global error handler
window.addEventListener('error', (event) => {
  handleError(event.error);
});

// Define application metrics with type-safe connection checks
const getAppMetrics = () => {
  // Type guard for navigator.connection
  const getConnectionType = () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.effectiveType || 'unknown';
    }
    return 'unknown';
  };

  // Type guard for connection downlink
  const getConnectionDownlink = () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.downlink || 'unknown';
    }
    return 'unknown';
  };

  return {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    connection: {
      type: getConnectionType(),
      downlink: getConnectionDownlink()
    },
    memory: window.performance && (performance as any).memory ? {
      jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      usedJSHeapSize: (performance as any).memory.usedJSHeapSize
    } : 'unavailable'
  };
};

// Get root element
const rootElement = document.getElementById("root");

// Ensure root element exists before rendering
if (!rootElement) {
  console.error("Root element not found! Failed to render application.");
  logToMonitoring('criticalError', { message: 'Root element not found' });
} else {
  const root = createRoot(rootElement);
  
  try {
    // Log application initialization with detailed metrics
    logToMonitoring('applicationInitialized', getAppMetrics());
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    handleError(error as Error);
    // Render a fallback UI if the app fails to initialize
    root.render(
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-700">
            Sorry, something went wrong while loading the application. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}

