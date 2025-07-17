'use client';

import { useState } from 'react';
import { ArrowLeft, Target, CheckCircle, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function DomaineDerivabilitePage() {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-100">
      {/* Header avec navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-red-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/chapitre/fonctions-references-derivees" 
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour au chapitre</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full">
                <Trophy className="h-4 w-4" />
                <span className="font-bold">30 XP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-24 max-w-6xl mx-auto p-6 space-y-10">
        
        {/* Introduction */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl p-8 shadow-xl text-white">
          <div className="text-center">
            <div className="text-6xl mb-6">📍</div>
            <h1 className="text-4xl font-bold mb-6">
              DOMAINE DE DÉRIVABILITÉ
            </h1>
            <div className="text-2xl mb-6">
              Où peut-on dériver une fonction ?
            </div>
            <div className="text-lg text-red-100">
              🎯 Objectif : Comprendre les restrictions de dérivabilité
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-800">Domaine de Dérivabilité</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📍 Où peut-on dériver ?
            </h2>
            <p className="text-xl text-gray-600">
              Avant de calculer des dérivées, il faut savoir <strong>où</strong> la fonction est dérivable
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl border-2 border-red-200">
              <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                ✅ Fonctions TOUJOURS dérivables
              </h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-red-300">
                  <div className="font-bold text-red-700">Polynômes</div>
                  <div className="text-sm text-gray-600">f(x) = x³, g(x) = 2x² + 5x - 1</div>
                  <div className="text-xs text-green-600">Dérivable sur ℝ</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-red-300">
                  <div className="font-bold text-red-700">Exponentielle</div>
                  <div className="text-sm text-gray-600">f(x) = e^x</div>
                  <div className="text-xs text-green-600">Dérivable sur ℝ</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-2xl border-2 border-orange-200">
              <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                ⚠️ Fonctions avec RESTRICTIONS
              </h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-orange-300">
                  <div className="font-bold text-orange-700">Racine carrée</div>
                  <div className="text-sm text-gray-600">f(x) = √x</div>
                  <div className="text-xs text-red-600">Dérivable sur ]0, +∞[</div>
                  <div className="text-xs text-gray-500">Non dérivable en x = 0</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-orange-300">
                  <div className="font-bold text-orange-700">Fonction inverse</div>
                  <div className="text-sm text-gray-600">f(x) = 1/x</div>
                  <div className="text-xs text-red-600">Dérivable sur ℝ*</div>
                  <div className="text-xs text-gray-500">Non définie en x = 0</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl border-2 border-blue-300">
            <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">
              🎯 RÈGLE D'OR
            </h3>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-900 mb-2">
                Une fonction est dérivable là où elle est définie ET "lisse"
              </div>
              <div className="text-blue-700">
                ✓ Pas de division par zéro • ✓ Pas de racine de nombre négatif • ✓ Pas de "coin" ou "pointe"
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button 
              onClick={handleComplete}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
                completed
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {completed 
                ? '✓ Domaine de dérivabilité maîtrisé ! +30 XP' 
                : 'J\'ai compris le domaine de dérivabilité ! +30 XP'
              }
            </button>
          </div>
        </section>

        {/* Navigation */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 shadow-xl text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Prochaine étape</h2>
            <Link href="/chapitre/fonctions-references-derivees/formules-base">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all">
                Continuer vers les Formules de base →
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 