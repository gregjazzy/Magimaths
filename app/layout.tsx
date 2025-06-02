import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MathPremière - Cours interactifs de mathématiques',
  description: 'Application interactive pour l\'apprentissage des mathématiques en classe de première. Cours, exercices et évaluations selon le programme français.',
  keywords: 'mathématiques, première, cours, exercices, interactif, programme français',
  authors: [{ name: 'MathPremière Team' }],
  openGraph: {
    title: 'MathPremière - Cours interactifs de mathématiques',
    description: 'Apprenez les mathématiques de première de manière interactive et engageante',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50`}>
        <AuthProvider>
          <div className="relative min-h-screen">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-bounce-subtle"></div>
              <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-bounce-subtle" style={{animationDelay: '2s'}}></div>
            </div>
            
            <main className="relative z-10">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
} 