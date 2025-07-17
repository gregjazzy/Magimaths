'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ExpressionsIntroductionPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/chapitre/4eme-calcul-litteral" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Retour au calcul littéral</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                🎯
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Calcul littéral</h1>
                <p className="text-gray-600 text-lg">
                  Comprendre les bases des expressions avec des lettres
                </p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-600">Durée estimée</div>
                <div className="text-xl font-semibold text-blue-600">8 minutes</div>
              </div>
            </div>


          </div>
        </div>

        {/* Contenu */}
        <div className="space-y-8">
          {/* INTRODUCTION */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">🎯 Qu'est-ce qu'une expression littérale ?</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Définition</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Une <strong>expression littérale</strong> est une expression mathématique qui contient des <strong>lettres</strong> (variables) en plus des nombres et des opérations.
                </p>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important à retenir</h4>
                  <p className="text-yellow-700">
                    Quand on écrit <strong className="font-mono">3x</strong>, cela signifie <strong className="font-mono">3 × x</strong> (3 fois x).
                    On ne met pas le signe × par souci de simplicité d'écriture.
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Exemples</h4>
                  <div className="space-y-2 text-blue-700">
                    <div className="font-mono text-lg">3x + 2</div>
                    <div className="font-mono text-lg">5a - 3b</div>
                    <div className="font-mono text-lg">2y + 7</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Vocabulaire important</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Variable</h4>
                    <p className="text-green-700 text-sm">
                      La lettre qui représente un nombre inconnu (x, y, a, b...)
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">Coefficient</h4>
                    <p className="text-orange-700 text-sm">
                      Le nombre devant la variable (dans 3x, le coefficient est 3)
                    </p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-800 mb-2">Terme</h4>
                    <p className="text-indigo-700 text-sm">
                      Chaque élément séparé par + ou - (3x, 2, -5y...)
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">Constante</h4>
                    <p className="text-yellow-700 text-sm">
                      Un nombre seul, sans variable (le 2 dans 3x + 2)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 