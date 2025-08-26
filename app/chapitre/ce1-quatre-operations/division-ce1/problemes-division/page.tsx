'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProblemesDivisionPage() {
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
              🧩 Problèmes de division
            </h1>
            <p className="text-lg text-gray-600">
              Résous des problèmes concrets avec la division !
            </p>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎪</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              La division dans la vie de tous les jours
            </h2>
            <p className="text-lg text-gray-600">
              Découvre comment la division nous aide à résoudre des problèmes !
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-900 mb-4">
                🎂 Problème 1 : L'anniversaire
              </h3>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-lg text-gray-700 mb-4">
                  "Maman a préparé 12 cupcakes pour l'anniversaire de Tom. 
                  Il y a 4 enfants à la fête. Combien de cupcakes aura chaque enfant ?"
                </p>
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🧁🧁🧁🧁🧁🧁🧁🧁🧁🧁🧁🧁</div>
                  <div className="text-lg text-gray-600">12 cupcakes pour 4 enfants</div>
                </div>
              </div>
              <div className="bg-yellow-100 rounded-lg p-4">
                <h4 className="font-bold text-yellow-900 mb-2">Solution :</h4>
                <p className="text-yellow-800 mb-2">Je dois partager 12 cupcakes entre 4 enfants.</p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-900">12 ÷ 4 = 3</div>
                  <p className="text-yellow-800">Chaque enfant aura 3 cupcakes !</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-900 mb-4">
                🚗 Problème 2 : Le voyage
              </h3>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-lg text-gray-700 mb-4">
                  "Papa doit transporter 15 personnes à la fête. Sa voiture peut transporter 5 personnes. 
                  Combien de voyages doit-il faire ?"
                </p>
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">👥👥👥👥👥👥👥👥👥👥👥👥👥👥👥</div>
                  <div className="text-lg text-gray-600">15 personnes, 5 par voyage</div>
                </div>
              </div>
              <div className="bg-green-100 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-2">Solution :</h4>
                <p className="text-green-800 mb-2">Je dois grouper 15 personnes par groupes de 5.</p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">15 ÷ 5 = 3</div>
                  <p className="text-green-800">Papa doit faire 3 voyages !</p>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-pink-900 mb-4">
                🍓 Problème 3 : Les fraises
              </h3>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-lg text-gray-700 mb-4">
                  "Grand-mère a cueilli 14 fraises. Elle veut les mettre dans des barquettes de 4 fraises. 
                  Combien de barquettes peut-elle remplir ? Combien de fraises restera-t-il ?"
                </p>
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓</div>
                  <div className="text-lg text-gray-600">14 fraises, 4 par barquette</div>
                </div>
              </div>
              <div className="bg-pink-100 rounded-lg p-4">
                <h4 className="font-bold text-pink-900 mb-2">Solution :</h4>
                <p className="text-pink-800 mb-2">Je dois grouper 14 fraises par groupes de 4.</p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-900">14 ÷ 4 = 3 reste 2</div>
                  <p className="text-pink-800">3 barquettes pleines et 2 fraises qui restent !</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 text-center mt-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              🎯 Stratégie pour résoudre un problème de division
            </h3>
            <div className="text-blue-800 text-left space-y-2">
              <p><strong>1.</strong> Je lis bien le problème</p>
              <p><strong>2.</strong> Je cherche ce qu'il faut partager ou grouper</p>
              <p><strong>3.</strong> Je cherche en combien de parts ou de groupes</p>
              <p><strong>4.</strong> Je fais la division</p>
              <p><strong>5.</strong> Je vérifie si ma réponse a du sens</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

