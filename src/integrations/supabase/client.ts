
import { createClient } from '@supabase/supabase-js';

// Environment variables or defaults for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wcqgdwcbvufenljnydim.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjcWdkd2NidnVmZW5sam55ZGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyNTMxMzIsImV4cCI6MjAyNjgyOTEzMn0.YhBJXxuNmY7EHyhR5Tks68xtKnb7T5YM13OwNKFy8GE';

// Generate a unique session ID for this browser session
const SESSION_ID = Math.random().toString(36).substring(2, 15);

// Splunk configuration
const SPLUNK_ENABLED = import.meta.env.VITE_SPLUNK_ENABLED === 'true' || false;
const SPLUNK_API_ENDPOINT = import.meta.env.VITE_SPLUNK_API_ENDPOINT || '/api/monitoring/splunk';
const SPLUNK_TOKEN = import.meta.env.VITE_SPLUNK_TOKEN || '';
const SPLUNK_INDEX = import.meta.env.VITE_SPLUNK_INDEX || 'main';
const SPLUNK_SOURCE = import.meta.env.VITE_SPLUNK_SOURCE || 'lpu_portal';
const SPLUNK_SOURCETYPE = import.meta.env.VITE_SPLUNK_SOURCETYPE || 'lpu_web_logs';
const SPLUNK_HOST = import.meta.env.VITE_SPLUNK_HOST || window.location.hostname;
const SPLUNK_BATCH_ENABLED = import.meta.env.VITE_SPLUNK_BATCH_ENABLED === 'true' || false;
const SPLUNK_BATCH_INTERVAL = parseInt(import.meta.env.VITE_SPLUNK_BATCH_INTERVAL || '10000', 10);
const SPLUNK_BATCH_SIZE = parseInt(import.meta.env.VITE_SPLUNK_BATCH_SIZE || '10', 10);

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
  },
});

// Helper function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Log user authentication status for monitoring
    logToMonitoring('userAuthentication', { 
      status: user ? 'authenticated' : 'not_authenticated' 
    });
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    logToMonitoring('authError', { error: String(error) });
    return null;
  }
};

// Helper function to check if a user is logged in
export const isLoggedIn = async () => {
  const user = await getCurrentUser();
  return !!user;
};

// Store logs in memory if batching is enabled
const logQueue: Record<string, any>[] = [];
let batchTimerId: number | null = null;

// Function to send batched logs to Splunk
const sendBatchedLogs = async () => {
  if (!SPLUNK_ENABLED || logQueue.length === 0) return;
  
  const batchToSend = [...logQueue];
  logQueue.length = 0; // Clear the queue
  
  try {
    const response = await fetch(SPLUNK_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SPLUNK_TOKEN}`
      },
      body: JSON.stringify({
        events: batchToSend.map(event => ({
          ...event,
          index: SPLUNK_INDEX,
          source: SPLUNK_SOURCE,
          sourcetype: SPLUNK_SOURCETYPE,
          host: SPLUNK_HOST,
        }))
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send logs to Splunk: ${response.status} ${response.statusText}`);
    }
    
    console.debug(`Successfully sent ${batchToSend.length} logs to Splunk`);
  } catch (error) {
    console.error('Error sending logs to Splunk:', error);
  }
};

// Start the batch timer if batching is enabled
const startBatchTimer = () => {
  if (SPLUNK_BATCH_ENABLED && !batchTimerId) {
    batchTimerId = window.setInterval(sendBatchedLogs, SPLUNK_BATCH_INTERVAL);
  }
};

// Enhanced monitoring function for Splunk integration
export const logToMonitoring = async (event: string, details?: Record<string, any>) => {
  try {
    // Get the current user ID if available
    let userId = 'anonymous';
    try {
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id || 'anonymous';
    } catch (e) {
      // Silently handle auth errors to ensure logging still works
    }
    
    const logData = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userId,
      sessionId: SESSION_ID,
      url: window.location.href,
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      appVersion: import.meta.env.VITE_APP_VERSION || 'unknown',
      environment: import.meta.env.MODE || 'development'
    };
    
    // For now, log to console for development visibility
    console.log('[SPLUNK EVENT]:', JSON.stringify(logData, null, 2));
    
    // Send to Splunk if enabled
    if (SPLUNK_ENABLED) {
      if (SPLUNK_BATCH_ENABLED) {
        // Add to batch queue
        logQueue.push(logData);
        
        // Start batch timer if not already started
        startBatchTimer();
        
        // Send immediately if batch size threshold is reached
        if (logQueue.length >= SPLUNK_BATCH_SIZE) {
          sendBatchedLogs();
        }
      } else {
        // Send immediately without batching
        try {
          const response = await fetch(SPLUNK_API_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SPLUNK_TOKEN}`
            },
            body: JSON.stringify({
              event: logData,
              index: SPLUNK_INDEX,
              source: SPLUNK_SOURCE,
              sourcetype: SPLUNK_SOURCETYPE,
              host: SPLUNK_HOST
            })
          });
          
          if (!response.ok) {
            throw new Error(`Failed to send log to Splunk: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          console.error('Failed to send log to Splunk:', error);
        }
      }
    }
    
    return true;
  } catch (error) {
    // Never throw errors from logging functions
    console.error('Error in logging:', error);
    return false;
  }
};

// Function to handle application errors for Splunk
export const logErrorToSplunk = (error: Error, componentName?: string, additionalInfo?: Record<string, any>) => {
  logToMonitoring('applicationError', {
    message: error.message,
    stack: error.stack,
    componentName,
    ...additionalInfo
  });
};

// Register window error handler for global error monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logToMonitoring('windowError', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    logToMonitoring('unhandledPromiseRejection', {
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack
    });
  });
}

// Clean up batch timer on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (batchTimerId !== null) {
      clearInterval(batchTimerId);
      // Attempt to send any remaining logs before page unload
      if (logQueue.length > 0) {
        // Use synchronous approach for beforeunload
        const xhr = new XMLHttpRequest();
        xhr.open('POST', SPLUNK_API_ENDPOINT, false); // false makes it synchronous
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${SPLUNK_TOKEN}`);
        xhr.send(JSON.stringify({
          events: logQueue.map(event => ({
            ...event,
            index: SPLUNK_INDEX,
            source: SPLUNK_SOURCE,
            sourcetype: SPLUNK_SOURCETYPE,
            host: SPLUNK_HOST,
          }))
        }));
      }
    }
  });
}

// Register auth state change listener for monitoring
supabase.auth.onAuthStateChange((event, session) => {
  logToMonitoring('authStateChange', { 
    event, 
    user: session?.user?.id || null 
  });
});

// Add additional performance monitoring
if (typeof window !== 'undefined' && 'performance' in window) {
  // Monitor page load performance
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const domReadyTime = perfData.domComplete - perfData.domLoading;
      
      logToMonitoring('pageLoadPerformance', {
        pageLoadTime,
        domReadyTime,
        redirectTime: perfData.redirectEnd - perfData.redirectStart,
        dnsLookupTime: perfData.domainLookupEnd - perfData.domainLookupStart,
        tcpConnectTime: perfData.connectEnd - perfData.connectStart,
        serverResponseTime: perfData.responseEnd - perfData.requestStart,
        domParsingTime: perfData.domInteractive - perfData.responseEnd,
        resourcesLoadTime: perfData.loadEventEnd - perfData.domContentLoadedEventEnd
      });
    }, 0);
  });
}
