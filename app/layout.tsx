import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AnalyticsProvider } from '@/lib/AnalyticsProvider'
import { Suspense } from 'react'
import { PageSkeleton } from '@/components/loading/LoadingSkeletons'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MagiMaths - Apprentissage des Mathématiques',
  description: 'Application d\'apprentissage des mathématiques du CE1 à la Terminale avec cours interactifs et exercices magiques',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

// Composant client pour nettoyer le cache et détecter les problèmes de navigation
function NavigationProtection() {
  if (typeof window !== 'undefined') {
    // Nettoyer toutes les données qui pourraient causer des redirections automatiques
    try {
      // Supprimer les clés problématiques courantes
      const keysToRemove = [
        'user_session',
        'auth_token', 
        'redirect_url',
        'last_page',
        'current_user',
        'student_progress'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    } catch (e) {
      // Ignore les erreurs de storage
    }
  }
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AnalyticsProvider>
          <NavigationProtection />
          <Suspense fallback={<PageSkeleton className="min-h-screen p-8" />}>
            {children}
          </Suspense>
        </AnalyticsProvider>
      </body>
    </html>
  )
} 