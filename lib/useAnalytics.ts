import { useEffect, useRef } from 'react';
import { useAnalyticsContext } from './AnalyticsProvider';

interface AnalyticsData {
  pageType: 'class' | 'chapter';
  pageId: string;
  pageTitle: string;
  classLevel?: string;
}

export function useAnalytics(data: AnalyticsData) {
  const { visitorSessionId, isInitialized } = useAnalyticsContext();
  const startTime = useRef<number>(Date.now());
  const isTracked = useRef<boolean>(false);

  // Tracker la vue de page
  useEffect(() => {
    if (!visitorSessionId || !isInitialized || isTracked.current) return;
    
    async function trackPageView() {
      try {
        await fetch('/api/analytics/page-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorSessionId,
            ...data
          })
        });
        
        isTracked.current = true;
        console.log('📊 Page trackée:', data.pageTitle);
      } catch (error) {
        console.error('Erreur tracking page:', error);
      }
    }
    
    trackPageView();
  }, [visitorSessionId, isInitialized, data]);

  // Tracker le temps passé sur la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (visitorSessionId && isTracked.current) {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        
        // Utiliser sendBeacon pour un envoi fiable
        navigator.sendBeacon('/api/analytics/page-view', JSON.stringify({
          visitorSessionId,
          ...data,
          timeSpent
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [visitorSessionId, data]);
}