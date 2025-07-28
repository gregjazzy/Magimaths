'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function DecompositionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/chapitre/cp-additions-simples" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  🧩
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Décompositions additives</h1>
                  <p className="text-base text-gray-600 mt-1">Toutes les façons de faire un nombre</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-orange-200/50">
          <div className="text-center">
            <div className="text-6xl mb-6 animate-bounce">🧩</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Décompositions additives
            </h2>
            <p className="text-gray-600 mb-8">
              Cette section est en cours de développement. Elle permettra d'apprendre toutes les façons de décomposer un nombre.
            </p>
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>Exemple :</strong> 5 = 2+3 = 1+4 = 0+5
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 