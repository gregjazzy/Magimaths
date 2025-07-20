'use client'

import { useState } from 'react'
import { ChevronLeft, Clock, Trophy, BookOpen, Play } from 'lucide-react'
import Link from 'next/link'
import { getChaptersByClass } from '@/lib/chapters'

export default function QuatrièmePage() {
  // DIAGNOSTIC : Code mis en sommeil pour identifier source erreur hydratation
  /*
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null)
  
  const quatriemeChapters = getChaptersByClass('4eme').filter(chapter => 
    !['4eme-calcul-litteral-expressions-regles', 
      '4eme-calcul-litteral-developpement', 
      '4eme-calcul-litteral-expressions-introduction', 
      '4eme-calcul-litteral-substitution', 
      '4eme-calcul-litteral-problemes',
      '4eme-calcul-litteral-factorisation',
      '4eme-cosinus-introduction',
      '4eme-cosinus-calculs',
      '4eme-cosinus-applications',
      '4eme-cosinus-constructions',
      '4eme-pythagore-introduction',
      '4eme-pythagore-calculs-directs',
      '4eme-pythagore-calculs-inverses',
      '4eme-pythagore-applications',
      '4eme-pythagore-reciproque'].includes(chapter.id)
  )
  const config = { color: '#54a0ff', icon: '📊', name: '4ème' }
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">4ème - Page en diagnostic</h1>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">🔧 Mode diagnostic activé</h2>
            <p className="text-yellow-700">
              Le code de la page 4ème a été temporairement mis en sommeil pour identifier la source des erreurs d'hydratation.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              Si cette page s'affiche sans erreur dans la console, alors le problème venait du code complexe de la page 4ème.
            </p>
            <p className="text-gray-700">
              Sinon, l'erreur vient d'ailleurs dans l'application (layout, components globaux, etc.).
            </p>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Instructions de test :</h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Ouvrez la console du navigateur (F12)</li>
              <li>Rechargez cette page</li>
              <li>Vérifiez s'il y a encore des erreurs d'hydratation</li>
              <li>Naviguez vers d'autres pages pour localiser le problème</li>
            </ol>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Timestamp de diagnostic : {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 