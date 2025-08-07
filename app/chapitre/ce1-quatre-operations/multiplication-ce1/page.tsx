'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CE1MultiplicationPage() {
  const [showExercises, setShowExercises] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce1-quatre-operations" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux quatre opérations</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              ✖️ Multiplication - CE1
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Découvre la multiplication : addition répétée !
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
                  ? 'bg-blue-500 text-white shadow-md' 
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
            <div className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl p-3 sm:p-6 text-white text-center">
              <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">✖️</div>
              <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">La Multiplication</h2>
              <p className="text-sm sm:text-xl">
                La multiplication, c'est comme une addition rapide !
              </p>
            </div>

            {/* Contenu du cours */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🎯 Qu'est-ce que la multiplication ?
              </h2>
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-gray-700">
                  La multiplication, c'est additionner le même nombre plusieurs fois. 
                  C'est un raccourci pour aller plus vite !
                </p>
                
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-bold text-blue-800 mb-2">Exemple simple :</h3>
                  <p className="text-sm sm:text-base text-blue-700">
                    3 groupes de 2 voitures 🚗🚗 🚗🚗 🚗🚗
                    <br/>
                    C'est comme : 2 + 2 + 2 = 6
                    <br/>
                    Ou plus rapide : 3 × 2 = 6 voitures !
                  </p>
                </div>
              </div>
            </div>

            {/* Ce qu'il faut retenir */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🏆 Ce qu'il faut retenir
              </h2>
              <div className="bg-blue-50 rounded-xl p-3 sm:p-6 border-2 border-blue-200">
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">✖️</div>
                  <h3 className="text-sm sm:text-xl font-bold text-blue-800 mb-2 sm:mb-3">La multiplication</h3>
                  <p className="text-blue-700 text-xs sm:text-base">
                    La multiplication = <strong>addition répétée</strong>
                    <br/>
                    C'est plus rapide que d'additionner !
                    <br/>
                    <span className="text-xs sm:text-sm font-bold mt-1 sm:mt-2 block">3 × 2 = 2 + 2 + 2 = 6</span>
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
                Les exercices de multiplication seront bientôt disponibles !
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}