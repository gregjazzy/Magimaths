'use client'

import React from 'react'
import ChapterCardOriginalWithBackground from '@/components/chapter/ChapterCardOriginalWithBackground'

const testChapter = {
  id: 'cp-additions-simples',
  title: 'Additions simples',
  description: 'Découvrir l\'addition avec des objets et des nombres jusqu\'à 20',
  sections: [
    { id: 'sens-addition', title: 'Le sens de l\'addition', completed: false },
    { id: 'decompositions', title: 'Décompositions additives', completed: false },
    { id: 'complements-10', title: 'Compléments à 10', completed: false },
    { id: 'additions-jusqu-20', title: 'Additions jusqu\'à 20', completed: false },
    { id: 'problemes', title: 'Problèmes d\'addition', completed: false }
  ],
  color: 'purple',
  character: 'sam-pirate'
}

export default function TestCardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🎯 Test : Option B - Photo de Sam + Symbole en chevauchement
        </h1>
        
        <div className="mb-8 text-center">
          <p className="text-gray-600 mb-4">
            🏴‍☠️ Photo de Sam + ➕ Symbole mathématique réduit qui chevauche
          </p>
        </div>

        {/* Grille de test avec la nouvelle version */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[3, 4, 5].map((transparency) => (
            <div key={transparency} className="space-y-4">
              <h3 className="text-lg font-semibold text-center text-gray-700">
                Transparence {transparency}/10
              </h3>
              <ChapterCardOriginalWithBackground 
                chapter={testChapter}
                transparencyLevel={transparency}
              />
            </div>
          ))}
        </div>

        {/* Section avec recommandation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/50">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-3">💡</span>
            Avantages de cette approche
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span><strong>Simplicité</strong> : Garde la structure claire et familière des cartes d'origine</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span><strong>Esthétique</strong> : Ajoute subtilement les images de fond avec transparence</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span><strong>Lisibilité</strong> : Texte en gras pour une meilleure visibilité sur les images</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span><strong>Cohérence</strong> : Conserve tous les effets visuels originaux (animations, couleurs, etc.)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span><strong>XP intégré</strong> : Affiche les XP de façon discrète comme dans l'original</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}