'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PartageEquitablePage() {
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
              ⚖️ Partage équitable
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à partager équitablement des objets !
            </p>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎂</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Comment partager équitablement ?
            </h2>
            <p className="text-lg text-gray-600">
              Chaque personne doit recevoir la même quantité !
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-pink-900 mb-4 text-center">
                Exemple 1 : 8 bonbons pour 4 enfants
              </h3>
              <div className="flex justify-center items-center space-x-4 mb-4">
                <div className="text-4xl">🍬🍬🍬🍬🍬🍬🍬🍬</div>
              </div>
              <div className="text-center mb-4">
                <div className="text-lg text-pink-700">Partageons :</div>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">👦</div>
                  <div className="text-xl">🍬🍬</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">👧</div>
                  <div className="text-xl">🍬🍬</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">👦</div>
                  <div className="text-xl">🍬🍬</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">👧</div>
                  <div className="text-xl">🍬🍬</div>
                </div>
              </div>
              <div className="text-center text-2xl font-bold text-pink-900">
                8 ÷ 4 = 2 bonbons chacun
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">
                Exemple 2 : 12 crayons pour 3 enfants
              </h3>
              <div className="flex justify-center items-center space-x-1 mb-4">
                <div className="text-2xl">✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️</div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">👦</div>
                  <div className="text-lg">✏️✏️✏️✏️</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">👧</div>
                  <div className="text-lg">✏️✏️✏️✏️</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">👦</div>
                  <div className="text-lg">✏️✏️✏️✏️</div>
                </div>
              </div>
              <div className="text-center text-2xl font-bold text-blue-900">
                12 ÷ 3 = 4 crayons chacun
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 text-center mt-8">
            <h3 className="text-xl font-bold text-green-900 mb-4">
              🌟 Règle d'or du partage équitable
            </h3>
            <p className="text-green-800 text-lg">
              Pour partager équitablement, je distribue un par un jusqu'à ce qu'il n'y en ait plus !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

