/**
 * Performance monitoring utilities for tracking app performance
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

/**
 * Observe and report Core Web Vitals
 */
export function observeWebVitals(callback: (metric: PerformanceMetric) => void): void {
  // Only run in production
  if (import.meta.env.DEV) {
    return;
  }

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
        const value = lastEntry.renderTime || lastEntry.loadTime || 0;
        
        callback({
          name: 'LCP',
          value,
          rating: value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor',
          timestamp: Date.now(),
        });
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer failed:', e);
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEntry & { processingStart?: number };
          const value = fidEntry.processingStart ? fidEntry.processingStart - entry.startTime : 0;
          
          callback({
            name: 'FID',
            value,
            rating: value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor',
            timestamp: Date.now(),
          });
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer failed:', e);
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0;
          }
        });
        
        callback({
          name: 'CLS',
          value: clsValue,
          rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
          timestamp: Date.now(),
        });
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer failed:', e);
    }
  }
}

/**
 * Log performance metrics (can be extended to send to analytics service)
 */
export function logPerformanceMetric(metric: PerformanceMetric): void {
  if (import.meta.env.DEV) {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      timestamp: new Date(metric.timestamp).toISOString(),
    });
  }

  // In production, metrics could be sent to an analytics service
  // Example: sendToAnalytics(metric);
}

/**
 * Measure navigation timing using Navigation Timing Level 2 API
 */
export function measureNavigationTiming(): void {
  if (!window.performance) {
    return;
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      // Use Navigation Timing Level 2 API (preferred)
      const navEntries = window.performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const navTiming = navEntries[0] as PerformanceNavigationTiming;
        
        const metrics = {
          'DNS Lookup': navTiming.domainLookupEnd - navTiming.domainLookupStart,
          'TCP Connection': navTiming.connectEnd - navTiming.connectStart,
          'Request Time': navTiming.responseStart - navTiming.requestStart,
          'Response Time': navTiming.responseEnd - navTiming.responseStart,
          'DOM Processing': navTiming.domComplete - navTiming.domInteractive,
          'Total Load Time': navTiming.loadEventEnd - navTiming.fetchStart,
        };

        if (import.meta.env.DEV) {
          console.log('[Performance] Navigation Timing:', metrics);
        }
      } else if (window.performance.timing) {
        // Fallback to Navigation Timing Level 1 API (deprecated but still widely supported)
        const timing = window.performance.timing;
        const navigationStart = timing.navigationStart;

        const metrics = {
          'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart,
          'TCP Connection': timing.connectEnd - timing.connectStart,
          'Request Time': timing.responseStart - timing.requestStart,
          'Response Time': timing.responseEnd - timing.responseStart,
          'DOM Processing': timing.domComplete - timing.domLoading,
          'Total Load Time': timing.loadEventEnd - navigationStart,
        };

        if (import.meta.env.DEV) {
          console.log('[Performance] Navigation Timing (deprecated API):', metrics);
        }
      }
    }, 0);
  });
}
