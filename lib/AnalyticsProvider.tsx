'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AnalyticsContextType {
  visitorSessionId: string | null;
  isInitialized: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  visitorSessionId: null,
  isInitialized: false
});

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [visitorSessionId, setVisitorSessionId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initializeAnalytics() {
      try {
        // Vérifier si on a déjà une session dans le localStorage
        const existingSessionId = localStorage.getItem('visitor_session_id');
        
        if (existingSessionId) {
          setVisitorSessionId(existingSessionId);
          setIsInitialized(true);
          return;
        }

        // Créer une nouvelle session
        const response = await fetch('/api/analytics/visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const result = await response.json();
          const sessionId = result.visitorSessionId;
          
          setVisitorSessionId(sessionId);
          localStorage.setItem('visitor_session_id', sessionId);
          
          console.log('📊 Analytics initialisé avec session:', sessionId);
        } else if (response.status === 404) {
          // API analytics non disponible, continuer sans analytics
          console.log('⚠️ API analytics non disponible, fonctionnement sans analytics');
          const fallbackSessionId = 'local-' + Date.now();
          setVisitorSessionId(fallbackSessionId);
          localStorage.setItem('visitor_session_id', fallbackSessionId);
        }
      } catch (error) {
        console.error('❌ Erreur initialisation analytics:', error);
        // Créer une session locale en cas d'erreur
        const fallbackSessionId = 'local-' + Date.now();
        setVisitorSessionId(fallbackSessionId);
        localStorage.setItem('visitor_session_id', fallbackSessionId);
      } finally {
        setIsInitialized(true);
      }
    }

    initializeAnalytics();
  }, []);

  return (
    <AnalyticsContext.Provider value={{ visitorSessionId, isInitialized }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
}