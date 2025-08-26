'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DivisionEuclidiennePage() {
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
              🔢 Division euclidienne simple
            </h1>
            <p className="text-lg text-gray-600">
              Découvre la division avec quotient et reste !
            </p>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Que faire quand ça ne tombe pas juste ?
            </h2>
            <p className="text-lg text-gray-600">
              Parfois, il reste des objets après le partage !
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-900 mb-4 text-center">
                Exemple 1 : 7 billes pour 3 enfants
              </h3>
              <div className="flex justify-center items-center space-x-1 mb-4">
                <div className="text-3xl">🔵🔵🔵🔵🔵🔵🔵</div>
              </div>
              <div className="text-center mb-4">
                <div className="text-lg text-orange-700">Partageons :</div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">👦</div>
                  <div className="text-xl">🔵🔵</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">👧</div>
                  <div className="text-xl">🔵🔵</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">👦</div>
                  <div className="text-xl">🔵🔵</div>
                </div>
              </div>
              <div className="text-center mb-4">
                <div className="text-lg text-orange-700">Il reste :</div>
                <div className="text-3xl">🔵</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-900 mb-2">
                  7 ÷ 3 = 2 reste 1
                </div>
                <div className="text-lg text-orange-700">
                  <strong>Quotient :</strong> 2 (ce que chacun reçoit)<br/>
                  <strong>Reste :</strong> 1 (ce qui n'a pas pu être partagé)
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-4 text-center">
                Exemple 2 : 10 bonbons pour 3 enfants
              </h3>
              <div className="flex justify-center items-center space-x-1 mb-4">
                <div className="text-2xl">🍭🍭🍭🍭🍭🍭🍭🍭🍭🍭</div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">👦</div>
                  <div className="text-lg">🍭🍭🍭</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">👧</div>
                  <div className="text-lg">🍭🍭🍭</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">👦</div>
                  <div className="text-lg">🍭🍭🍭</div>
                </div>
              </div>
              <div className="text-center mb-4">
                <div className="text-lg text-purple-700">Il reste :</div>
                <div className="text-2xl">🍭</div>
              </div>
              <div className="text-center text-2xl font-bold text-purple-900">
                10 ÷ 3 = 3 reste 1
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 text-center mt-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              📚 À retenir
            </h3>
            <div className="text-blue-800 text-lg space-y-2">
              <p><strong>Quotient :</strong> Le nombre que chaque personne reçoit</p>
              <p><strong>Reste :</strong> Ce qui n'a pas pu être partagé équitablement</p>
              <p><strong>Le reste est toujours plus petit que le diviseur !</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

