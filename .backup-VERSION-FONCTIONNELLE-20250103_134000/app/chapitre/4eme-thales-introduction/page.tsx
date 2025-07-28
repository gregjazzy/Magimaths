'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Lightbulb, Eye } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function ThalesIntroductionPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  
  // États pour les animations
  const [currentAnimation, setCurrentAnimation] = useState(0)
  const [animationStep, setAnimationStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isAnimationRunning, setIsAnimationRunning] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // États pour les exercices avec images
  const [exerciseAnswers, setExerciseAnswers] = useState<string[]>(Array(5).fill(''))

  const checkAnswer = () => {
    // À implémenter selon la logique souhaitée
    console.log('Checking answer...')
  }

  const nextExercise = () => {
    if (currentExercise < 5) {
      setCurrentExercise(currentExercise + 1)
      setUserAnswer('')
      setShowAnswer(false)
      setAnswerFeedback(null)
    }
  }

  const resetExercises = () => {
    setCurrentExercise(0)
    setUserAnswer('')
    setShowAnswer(false)
    setScore(0)
    setCorrectAnswers(0)
    setAnswerFeedback(null)
  }



  const startGeometricAnimation = () => {
    // Nettoyer le timeout précédent s'il existe
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
    
    setIsAnimationRunning(true)
    setAnimationKey(prev => prev + 1)
    
    // Arrêter automatiquement l'animation après 7.8 secondes (durée complète)
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimationRunning(false)
      animationTimeoutRef.current = null
    }, 7800)
  }

  const stopGeometricAnimation = () => {
    setIsAnimationRunning(false)
    
    // Nettoyer le timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
      animationTimeoutRef.current = null
    }
  }

  const restartGeometricAnimation = () => {
    // Arrêter l'animation actuelle
    stopGeometricAnimation()
    
    // Relancer après un court délai
    setTimeout(() => {
      startGeometricAnimation()
    }, 100)
  }

  // Nettoyer le timeout au démontage du composant
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  const handleExerciseAnswerChange = (index: number, value: string) => {
    const newAnswers = [...exerciseAnswers]
    newAnswers[index] = value
    setExerciseAnswers(newAnswers)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-theoreme-thales" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">📐 Introduction au théorème de Thalès</h1>
                <p className="text-gray-600">Découvrir les bases de la proportionnalité</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation par onglets */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/70 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/20">
            <button
              onClick={() => setActiveTab('cours')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'cours' 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              📚 Cours
            </button>
            <button
              onClick={() => setActiveTab('exercices')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'exercices' 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              ✏️ Exercices (0/6)
            </button>
          </div>
        </div>

        {activeTab === 'cours' ? (
          /* COURS */
          <div className="space-y-8">
            {/* Section 1: Qu'est-ce que le théorème de Thalès ? */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">📐</span>
                Qu'est-ce que le théorème de Thalès ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-4">L'idée principale</h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800">
                        Le théorème de Thalès établit une relation entre <strong>parallélisme</strong> et <strong>proportionnalité</strong> dans les triangles.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Caricature de Thalès */}
                <div className="flex justify-center items-start">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-xl border border-blue-200 w-full max-w-sm">
                    <div className="text-center">
                      <div className="relative inline-block mb-1">
                        <div className="text-4xl">🧔‍♂️</div>
                        <div className="absolute -top-1 -right-1 text-sm animate-bounce">💡</div>
                      </div>
                      <div className="text-xs text-blue-700 font-medium mb-1">
                        "Les ombres révèlent la hauteur !" 
                      </div>
                      <div className="flex justify-center items-end space-x-1">
                        <span className="text-lg">🏺</span>
                        <span className="text-xs">📏</span>
                        <span className="text-xl">🔺</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Configuration géométrique */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center">
                <span className="bg-emerald-100 p-2 rounded-lg mr-3">⫽</span>
                La configuration de Thalès
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-4">Éléments nécessaires :</h3>
                  <div className="space-y-4">
                    <p className="text-emerald-800 font-medium">Soit :</p>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <span className="bg-emerald-200 text-emerald-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
                        <p className="text-emerald-700">Droites (AB) et (AC) sécantes en A</p>
                      </div>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <span className="bg-teal-200 text-teal-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
                        <p className="text-teal-700">M appartient à [AB] et N appartient à [AC]</p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <span className="bg-green-200 text-green-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
                        <p className="text-green-800 text-xl font-bold">(MN) <span className="text-lg font-bold tracking-wide">//</span> (BC)</p>
                      </div>
                    </div>
                    <p className="text-emerald-800 font-bold text-lg mt-6">Alors :</p>
                    <div className="bg-gradient-to-r from-emerald-100 to-green-100 p-4 rounded-lg border-l-4 border-emerald-500">
                      <div className="text-emerald-800 text-xl font-bold text-center flex items-center justify-center space-x-4">
                        <div className="flex flex-col items-center">
                          <span className="border-b-2 border-emerald-800 pb-1">AM</span>
                          <span className="pt-1">AB</span>
                        </div>
                        <span>=</span>
                        <div className="flex flex-col items-center">
                          <span className="border-b-2 border-emerald-800 pb-1">AN</span>
                          <span className="pt-1">AC</span>
                        </div>
                        <span>=</span>
                        <div className="flex flex-col items-center">
                          <span className="border-b-2 border-emerald-800 pb-1">MN</span>
                          <span className="pt-1">BC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-emerald-800 mb-2 text-center">Animation</h2>
                    <h3 className="text-lg font-bold text-emerald-800 mb-4 text-center">Schéma interactif</h3>
                    
                    {/* Contrôles d'animation */}
                    <div className="flex justify-center gap-3 mb-4">
                      <button
                        onClick={startGeometricAnimation}
                        disabled={isAnimationRunning}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Lancer
                      </button>
                      <button
                        onClick={restartGeometricAnimation}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Recommencer
                      </button>
                    </div>

                    <div className="bg-white p-4 rounded-lg relative">
                      <img 
                        src="/images/Thalesbase.png" 
                        alt="Configuration de base du théorème de Thalès" 
                        className="w-full h-auto object-contain max-h-64"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Configuration "en papillon" */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                <span className="bg-purple-100 p-2 rounded-lg mr-3">🦋</span>
                La configuration "en papillon"
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-purple-800 mb-4">Deuxième cas possible :</h3>
                  <div className="space-y-4">
                    <p className="text-purple-800 font-medium">Soit :</p>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <span className="bg-purple-200 text-purple-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
                        <p className="text-purple-700">Droites (AB) et (AC) sécantes en A</p>
                      </div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <span className="bg-indigo-200 text-indigo-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
                        <p className="text-indigo-700">M et B sont de part et d'autre de A sur la droite</p>
                      </div>
                    </div>
                    <div className="bg-violet-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <span className="bg-violet-200 text-violet-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
                        <p className="text-violet-700">N et C sont de part et d'autre de A sur l'autre droite</p>
                      </div>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <span className="bg-pink-200 text-pink-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">4</span>
                        <p className="text-pink-800 text-xl font-bold">(MN) <span className="text-lg font-bold tracking-wide">//</span> (BC)</p>
                      </div>
                    </div>
                    <p className="text-purple-800 font-bold text-lg mt-6">Alors :</p>
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg border-l-4 border-purple-500">
                      <div className="text-purple-800 text-xl font-bold text-center flex items-center justify-center space-x-4">
                        <div className="flex flex-col items-center">
                          <span className="border-b-2 border-purple-800 pb-1">AM</span>
                          <span className="pt-1">AB</span>
                        </div>
                        <span>=</span>
                        <div className="flex flex-col items-center">
                          <span className="border-b-2 border-purple-800 pb-1">AN</span>
                          <span className="pt-1">AC</span>
                        </div>
                        <span>=</span>
                        <div className="flex flex-col items-center">
                          <span className="border-b-2 border-purple-800 pb-1">MN</span>
                          <span className="pt-1">BC</span>
                  </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-purple-800 mb-4 text-center">Configuration "en papillon"</h3>
                    
                    <div className="bg-white p-4 rounded-lg relative">
                      <img 
                        src="/images/Thalespapillon.png" 
                        alt="Configuration en papillon du théorème de Thalès" 
                        className="w-full h-auto object-contain max-h-64"
                      />
                    </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                <span className="bg-purple-100 p-2 rounded-lg mr-3">📐</span>
                Exprimer les égalités avec Thalès pour les figures suivantes
              </h2>
              
              <div className="space-y-8">
                {/* Exercice 1 */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                  <h3 className="text-lg font-bold text-green-800 mb-4">Exercice 1</h3>
                  <div className="flex justify-center mb-4">
                    <img 
                      src="/images/Thalesex12.png" 
                      alt="Configuration de Thalès 1" 
                      className="max-w-md w-full border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      value={exerciseAnswers[0]}
                      onChange={(e) => handleExerciseAnswerChange(0, e.target.value)}
                      placeholder="Écrivez l'égalité de Thalès pour cette figure..."
                      className="w-full p-4 border border-gray-300 rounded-lg min-h-[100px] text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Vérifier ma réponse
                  </button>
              </div>
              
                {/* Exercice 2 */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                  <h3 className="text-lg font-bold text-purple-800 mb-4">Exercice 2</h3>
                  <div className="flex justify-center mb-4">
                    <img 
                      src="/images/Thalesex13.png" 
                      alt="Configuration de Thalès 2" 
                      className="max-w-md w-full border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      value={exerciseAnswers[1]}
                      onChange={(e) => handleExerciseAnswerChange(1, e.target.value)}
                      placeholder="Écrivez l'égalité de Thalès pour cette figure..."
                      className="w-full p-4 border border-gray-300 rounded-lg min-h-[100px] text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Vérifier ma réponse
                  </button>
                </div>

                {/* Exercice 3 */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                  <h3 className="text-lg font-bold text-orange-800 mb-4">Exercice 3</h3>
                  <div className="flex justify-center mb-4">
                    <img 
                      src="/images/Thalesex14.png" 
                      alt="Configuration de Thalès 3" 
                      className="max-w-md w-full border border-gray-300 rounded"
                    />
            </div>
                  <div className="mb-4">
                    <textarea
                      value={exerciseAnswers[2]}
                      onChange={(e) => handleExerciseAnswerChange(2, e.target.value)}
                      placeholder="Écrivez l'égalité de Thalès pour cette figure..."
                      className="w-full p-4 border border-gray-300 rounded-lg min-h-[100px] text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                    Vérifier ma réponse
                  </button>
                </div>

                {/* Exercice 4 */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-2xl border border-teal-100">
                  <h3 className="text-lg font-bold text-teal-800 mb-4">Exercice 4</h3>
                  <div className="flex justify-center mb-4">
                    <img 
                      src="/images/Thalesex15.png" 
                      alt="Configuration de Thalès 4" 
                      className="max-w-md w-full border border-gray-300 rounded"
                    />
              </div>
                  <div className="mb-4">
                    <textarea
                      value={exerciseAnswers[3]}
                      onChange={(e) => handleExerciseAnswerChange(3, e.target.value)}
                      placeholder="Écrivez l'égalité de Thalès pour cette figure..."
                      className="w-full p-4 border border-gray-300 rounded-lg min-h-[100px] text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Vérifier ma réponse
                    </button>
              </div>
              
                {/* Exercice 5 */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100">
                  <h3 className="text-lg font-bold text-indigo-800 mb-4">Exercice 5</h3>
                  <div className="flex justify-center mb-4">
                    <img 
                      src="/images/Thalesex16.png" 
                      alt="Configuration de Thalès 5" 
                      className="max-w-md w-full border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      value={exerciseAnswers[4]}
                      onChange={(e) => handleExerciseAnswerChange(4, e.target.value)}
                      placeholder="Écrivez l'égalité de Thalès pour cette figure..."
                      className="w-full p-4 border border-gray-300 rounded-lg min-h-[100px] text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Vérifier ma réponse
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 