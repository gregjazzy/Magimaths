'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CE1DivisionPage() {
  const [showExercises, setShowExercises] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce1-quatre-operations" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux quatre opérations</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              ➗ Division - CE1
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Découvre la division : partager équitablement !
            </p>
          </div>
        </div>

        {/* Onglets Cours/Exercices */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-4 sm:space-y-8">
            {/* Introduction ludique */}
            <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-3 sm:p-6 text-white text-center">
              <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">➗</div>
              <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">La Division</h2>
              <p className="text-sm sm:text-xl">
                Apprends à partager équitablement !
              </p>
            </div>

            {/* Contenu du cours */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🎯 Qu'est-ce que la division ?
              </h2>
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-gray-700">
                  La division permet de partager équitablement. 
                  C'est comme distribuer des objets de façon égale !
                </p>
                
                <div className="bg-orange-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-bold text-orange-800 mb-2">Exemple simple :</h3>
                  <p className="text-sm sm:text-base text-orange-700">
                    Tu as 6 cookies 🍪🍪🍪🍪🍪🍪 à partager entre 2 amis.
                    <br/>
                    Chaque ami aura : 6 ÷ 2 = 3 cookies ! 🍪🍪🍪
                  </p>
                </div>
              </div>
            </div>

            {/* Ce qu'il faut retenir */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🏆 Ce qu'il faut retenir
              </h2>
              <div className="bg-orange-50 rounded-xl p-3 sm:p-6 border-2 border-orange-200">
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">➗</div>
                  <h3 className="text-sm sm:text-xl font-bold text-orange-800 mb-2 sm:mb-3">La division</h3>
                  <p className="text-orange-700 text-xs sm:text-base">
                    La division permet de <strong>partager équitablement</strong>.
                    <br/>
                    On distribue de façon égale !
                    <br/>
                    <span className="text-xs sm:text-sm font-bold mt-1 sm:mt-2 block">6 ÷ 2 = 3</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ✏️ Exercices à venir
              </h2>
              <p className="text-lg text-gray-600">
                Les exercices de division seront bientôt disponibles !
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}