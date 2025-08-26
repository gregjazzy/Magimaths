'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SensDivisionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-quatre-operations/division-ce1" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la division</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎯 Le sens de la division
            </h1>
            <p className="text-lg text-gray-600">
              Comprendre ce que signifie diviser : partager et grouper !
            </p>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🍰</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Qu'est-ce que diviser ?
            </h2>
            <p className="text-lg text-gray-600">
              Diviser, c'est partager équitablement ou grouper des objets !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🍎🍎🍎🍎</div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Partager</h3>
              <p className="text-blue-700">
                4 pommes à partager entre 2 enfants = 2 pommes chacun
              </p>
              <div className="mt-4 text-2xl font-bold text-blue-900">
                4 ÷ 2 = 2
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🟦🟦 🟦🟦 🟦🟦</div>
              <h3 className="text-xl font-bold text-green-900 mb-2">Grouper</h3>
              <p className="text-green-700">
                6 carrés groupés par 2 = 3 groupes
              </p>
              <div className="mt-4 text-2xl font-bold text-green-900">
                6 ÷ 2 = 3
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-yellow-900 mb-4">
              💡 À retenir
            </h3>
            <p className="text-yellow-800 text-lg">
              La division nous aide à partager équitablement ou à compter combien de groupes on peut faire !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

