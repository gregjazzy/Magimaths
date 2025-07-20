'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, Play, Pause, RotateCcw, BookOpen, Calculator, Target, CheckCircle, XCircle, Info, Lightbulb, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Types pour éviter les erreurs d'hydratation
interface Exercise {
  id: string
  question: string
  answer: number
  unit: string
  explanation: string
  diagram: 'triangle' | 'parallel'
  given: {
    AB: number
    AC: number
    AE?: number
    AD?: number
    DE?: number
    BC?: number
  }
}

interface AnimationState {
  step: number
  isPlaying: boolean
  showConstruction: boolean
}

export default function TheoremeThalès() {
  // States sécurisés pour éviter l'hydratation
  const [currentSection, setCurrentSection] = useState(0)
  const [animationState, setAnimationState] = useState<AnimationState>({
    step: 0,
    isPlaying: false,
    showConstruction: false
  })
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [isClient, setIsClient] = useState(false)
  
  const animationRef = useRef<NodeJS.Timeout>()

  // Initialisation côté client uniquement pour éviter l'hydratation
  useEffect(() => {
    setIsClient(true)
    
    // Génération des exercices côté client uniquement
    const generatedExercises: Exercise[] = [
      {
        id: 'ex1',
        question: "Dans le triangle ABC, les droites (DE) et (BC) sont parallèles. AB = 6 cm, AE = 4 cm, AC = 9 cm. Calculer AD.",
        answer: 4.5,
        unit: "cm",
        explanation: "D'après le théorème de Thalès : AE/AC = AD/AB. Donc AD = (AE × AB) / AC = (4 × 6) / 9 = 4.5 cm",
        diagram: 'triangle',
        given: { AB: 6, AE: 4, AC: 9 }
      },
      {
        id: 'ex2', 
        question: "Les droites (MN) et (BC) sont parallèles. AM = 3 cm, AB = 7.5 cm, AN = 4 cm. Calculer AC.",
        answer: 10,
        unit: "cm",
        explanation: "D'après Thalès : AM/AB = AN/AC. Donc AC = (AN × AB) / AM = (4 × 7.5) / 3 = 10 cm",
        diagram: 'parallel',
        given: { AB: 7.5, AC: 4, AE: 3 }
      },
      {
        id: 'ex3',
        question: "Dans le triangle ABC, (DE) // (BC). AD = 2.4 cm, DB = 3.6 cm, AE = 3.2 cm. Calculer EC.",
        answer: 4.8,
        unit: "cm", 
        explanation: "AD/AB = AE/AC avec AB = AD + DB = 6 cm. Donc AC = (AE × AB) / AD = (3.2 × 6) / 2.4 = 8 cm. Ainsi EC = AC - AE = 8 - 3.2 = 4.8 cm",
        diagram: 'triangle',
        given: { AB: 6, AC: 8, AE: 3.2, AD: 2.4 }
      }
    ]
    
    setExercises(generatedExercises)
  }, [])

  // Animation du théorème
  useEffect(() => {
    if (animationState.isPlaying && isClient) {
      animationRef.current = setTimeout(() => {
        setAnimationState(prev => ({
          ...prev,
          step: prev.step >= 4 ? 0 : prev.step + 1
        }))
      }, 2000)
    }
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [animationState.isPlaying, animationState.step, isClient])

  const toggleAnimation = () => {
    setAnimationState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  const resetAnimation = () => {
    setAnimationState({ step: 0, isPlaying: false, showConstruction: false })
  }

  const checkAnswer = () => {
    if (!isClient || exercises.length === 0) return
    
    const correct = Math.abs(parseFloat(userAnswer) - exercises[currentExercise].answer) < 0.1
    setShowResult(true)
    if (correct) {
      setScore(prev => prev + 1)
    }
  }

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1)
      setUserAnswer('')
      setShowResult(false)
    }
  }

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction au théorème de Thalès',
      icon: '📐',
      color: '#3b82f6'
    },
    {
      id: 'demonstration',
      title: 'Démonstration animée',
      icon: '🎯',
      color: '#8b5cf6'
    },
    {
      id: 'applications',
      title: 'Applications pratiques',
      icon: '🔧',
      color: '#06b6d4'
    },
    {
      id: 'exercices',
      title: 'Exercices interactifs',
      icon: '💪',
      color: '#f59e0b'
    }
  ]

  // Rendu conditionnel pour éviter l'hydratation
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {['intro', 'demo', 'app', 'ex'].map(id => (
                  <div key={`loading-${id}`} className="h-20 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
          <Link href="/4eme" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Retour à la 4ème
          </Link>
          
          <div className="flex items-center mb-6">
            <div className="text-4xl mr-4">📐</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Théorème de Thalès</h1>
              <p className="text-gray-600">Proportionnalité dans les triangles et parallélisme</p>
            </div>
          </div>

          {/* Navigation des sections */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  currentSection === index
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="text-2xl mb-2">{section.icon}</div>
                <div className="font-semibold text-sm text-gray-800">{section.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Section Introduction */}
        {currentSection === 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
              Qu'est-ce que le théorème de Thalès ?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-2xl p-6 border-l-4 border-blue-500">
                  <h3 className="font-bold text-lg mb-3 text-blue-900">Énoncé du théorème</h3>
                  <p className="text-blue-800">
                    Si deux droites sont parallèles à une troisième, alors elles découpent 
                    des segments proportionnels sur toute sécante.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-2xl p-6 border-l-4 border-green-500">
                  <h3 className="font-bold text-lg mb-3 text-green-900">En pratique</h3>
                  <p className="text-green-800">
                    Dans un triangle ABC, si (DE) // (BC), alors :
                  </p>
                  <div className="mt-3 text-xl font-mono text-center bg-white rounded-lg p-3">
                    AD/AB = AE/AC = DE/BC
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-2xl p-6 border-l-4 border-purple-500">
                  <h3 className="font-bold text-lg mb-3 text-purple-900">Applications</h3>
                  <ul className="space-y-2 text-purple-800">
                    <li>• Calculer des longueurs inaccessibles</li>
                    <li>• Vérifier le parallélisme de droites</li>
                    <li>• Résoudre des problèmes de proportionnalité</li>
                  </ul>
                </div>
              </div>
              
              {/* Diagramme statique */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 text-center">Configuration de Thalès</h3>
                <svg viewBox="0 0 300 200" className="w-full h-48">
                  {/* Triangle ABC */}
                  <polygon 
                    points="50,150 250,150 150,50" 
                    fill="rgba(59, 130, 246, 0.1)" 
                    stroke="#3b82f6" 
                    strokeWidth="2"
                  />
                  
                  {/* Droite parallèle DE */}
                  <line 
                    x1="100" y1="100" 
                    x2="200" y2="100" 
                    stroke="#ef4444" 
                    strokeWidth="3"
                  />
                  
                  {/* Points */}
                  <circle cx="50" cy="150" r="4" fill="#3b82f6" />
                  <circle cx="250" cy="150" r="4" fill="#3b82f6" />
                  <circle cx="150" cy="50" r="4" fill="#3b82f6" />
                  <circle cx="100" cy="100" r="4" fill="#ef4444" />
                  <circle cx="200" cy="100" r="4" fill="#ef4444" />
                  
                  {/* Labels */}
                  <text x="45" y="165" className="text-sm font-semibold" fill="#3b82f6">A</text>
                  <text x="255" y="165" className="text-sm font-semibold" fill="#3b82f6">B</text>
                  <text x="145" y="40" className="text-sm font-semibold" fill="#3b82f6">C</text>
                  <text x="95" y="90" className="text-sm font-semibold" fill="#ef4444">D</text>
                  <text x="205" y="90" className="text-sm font-semibold" fill="#ef4444">E</text>
                  
                  {/* Notation parallèle */}
                  <text x="140" y="120" className="text-xs" fill="#ef4444">(DE) // (BC)</text>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Section Démonstration */}
        {currentSection === 1 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-purple-600" />
              Démonstration animée
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contrôles d'animation */}
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Contrôles de l'animation</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={toggleAnimation}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      {animationState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {animationState.isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button
                      onClick={resetAnimation}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                </div>
                
                {/* Étapes de la démonstration */}
                <div className="space-y-3">
                  {[
                    { id: 'step1', text: "Construction du triangle ABC", num: 1 },
                    { id: 'step2', text: "Ajout du point D sur [AB]", num: 2 },
                    { id: 'step3', text: "Construction de la parallèle à (BC)", num: 3 },
                    { id: 'step4', text: "Identification du point E", num: 4 },
                    { id: 'step5', text: "Vérification des rapports", num: 5 }
                  ].map((step, index) => (
                    <div
                      key={step.id}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                        isClient && animationState.step >= index
                          ? 'border-purple-500 bg-purple-50 text-purple-900'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isClient && animationState.step >= index ? 'bg-purple-600 text-white' : 'bg-gray-400 text-white'
                        }`}>
                          {step.num}
                        </div>
                        {step.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Animation SVG */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 text-center">Construction pas à pas</h3>
                <svg viewBox="0 0 400 300" className="w-full h-64 border-2 border-gray-200 rounded-lg bg-white">
                  {/* Triangle ABC - apparaît à l'étape 0 */}
                  {isClient && animationState.step >= 0 && (
                    <g className="animate-fadeIn">
                      <polygon 
                        points="80,220 320,220 200,80" 
                        fill="rgba(59, 130, 246, 0.1)" 
                        stroke="#3b82f6" 
                        strokeWidth="2"
                      />
                      <circle cx="80" cy="220" r="5" fill="#3b82f6" />
                      <circle cx="320" cy="220" r="5" fill="#3b82f6" />
                      <circle cx="200" cy="80" r="5" fill="#3b82f6" />
                      <text x="70" y="240" className="text-sm font-semibold" fill="#3b82f6">A</text>
                      <text x="330" y="240" className="text-sm font-semibold" fill="#3b82f6">B</text>
                      <text x="190" y="70" className="text-sm font-semibold" fill="#3b82f6">C</text>
                    </g>
                  )}
                  
                  {/* Point D - apparaît à l'étape 1 */}
                  {isClient && animationState.step >= 1 && (
                    <g className="animate-fadeIn">
                      <circle cx="140" cy="150" r="5" fill="#ef4444" />
                      <text x="130" y="140" className="text-sm font-semibold" fill="#ef4444">D</text>
                    </g>
                  )}
                  
                  {/* Droite parallèle - apparaît à l'étape 2 */}
                  {isClient && animationState.step >= 2 && (
                    <g className="animate-fadeIn">
                      <line 
                        x1="140" y1="150" 
                        x2="260" y2="150" 
                        stroke="#ef4444" 
                        strokeWidth="3"
                        strokeDasharray="5,5"
                      />
                    </g>
                  )}
                  
                  {/* Point E - apparaît à l'étape 3 */}
                  {isClient && animationState.step >= 3 && (
                    <g className="animate-fadeIn">
                      <circle cx="260" cy="150" r="5" fill="#ef4444" />
                      <text x="270" y="140" className="text-sm font-semibold" fill="#ef4444">E</text>
                    </g>
                  )}
                  
                  {/* Mesures et rapports - apparaît à l'étape 4 */}
                  {isClient && animationState.step >= 4 && (
                    <g className="animate-fadeIn">
                      <text x="50" y="280" className="text-xs" fill="#059669">AD/AB = AE/AC = DE/BC</text>
                      <rect x="40" y="265" width="180" height="20" fill="rgba(5, 150, 105, 0.1)" stroke="#059669" rx="5" />
                    </g>
                  )}
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Section Applications */}
        {currentSection === 2 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Calculator className="w-6 h-6 mr-3 text-cyan-600" />
              Applications pratiques
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Exemple 1 */}
              <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
                <h3 className="font-bold text-lg mb-4 text-cyan-900 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Mesurer la hauteur d'un arbre
                </h3>
                <p className="text-cyan-800 mb-4">
                  Un bâton de 2m projette une ombre de 3m. À la même heure, 
                  un arbre projette une ombre de 15m. Quelle est la hauteur de l'arbre ?
                </p>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-lg font-mono">hauteur bâton / ombre bâton = hauteur arbre / ombre arbre</div>
                    <div className="text-lg font-mono mt-2">2 / 3 = h / 15</div>
                    <div className="text-xl font-bold text-cyan-600 mt-2">h = 10 mètres</div>
                  </div>
                </div>
              </div>
              
              {/* Exemple 2 */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h3 className="font-bold text-lg mb-4 text-green-900 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Cartographie et distance
                </h3>
                <p className="text-green-800 mb-4">
                  Sur une carte à l'échelle 1:25000, deux villes sont séparées de 8 cm. 
                  Quelle est la distance réelle ?
                </p>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-lg font-mono">1 cm sur carte = 25000 cm réels</div>
                    <div className="text-lg font-mono mt-2">8 cm = 8 × 25000 = 200000 cm</div>
                    <div className="text-xl font-bold text-green-600 mt-2">Distance = 2 km</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Conseil pratique */}
            <div className="mt-6 bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-amber-600 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-amber-900 mb-2">Conseil pratique</h3>
                  <p className="text-amber-800">
                    Le théorème de Thalès est très utile pour calculer des distances inaccessibles 
                    directement. Il suffit de créer des triangles semblables et d'utiliser les proportions !
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Exercices */}
        {currentSection === 3 && exercises.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-amber-600" />
              Exercices interactifs
            </h2>
            
            {/* Progression */}
            <div className="mb-6 bg-amber-50 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Progression</span>
                <span className="text-sm text-amber-600">{currentExercise + 1}/{exercises.length}</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              <div className="text-right text-sm text-amber-600 mt-1">Score: {score}/{exercises.length}</div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Exercice actuel */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4 text-blue-900">
                    Exercice {currentExercise + 1}
                  </h3>
                  <p className="text-blue-800 leading-relaxed">
                    {exercises[currentExercise].question}
                  </p>
                </div>
                
                {/* Zone de réponse */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <label className="block font-semibold mb-3">Votre réponse :</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      step="0.1"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Entrez votre réponse"
                      disabled={showResult}
                    />
                    <span className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">
                      {exercises[currentExercise].unit}
                    </span>
                  </div>
                  
                  {!showResult ? (
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer}
                      className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      Vérifier ma réponse
                    </button>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {/* Résultat */}
                      <div className={`p-4 rounded-lg border-2 ${
                        Math.abs(parseFloat(userAnswer) - exercises[currentExercise].answer) < 0.1
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {Math.abs(parseFloat(userAnswer) - exercises[currentExercise].answer) < 0.1 ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className="font-semibold">
                            {Math.abs(parseFloat(userAnswer) - exercises[currentExercise].answer) < 0.1
                              ? 'Correct !' 
                              : `Incorrect. La bonne réponse est ${exercises[currentExercise].answer} ${exercises[currentExercise].unit}`
                            }
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {exercises[currentExercise].explanation}
                        </p>
                      </div>
                      
                      {/* Bouton suivant */}
                      {currentExercise < exercises.length - 1 ? (
                        <button
                          onClick={nextExercise}
                          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                          Exercice suivant
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                          <h3 className="font-bold text-lg text-purple-900 mb-2">🎉 Félicitations !</h3>
                          <p className="text-purple-800">
                            Vous avez terminé tous les exercices. Score final : {score}/{exercises.length}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Diagramme de l'exercice */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 text-center">Schéma</h3>
                <svg viewBox="0 0 300 200" className="w-full h-48 border-2 border-gray-200 rounded-lg bg-white">
                  {exercises[currentExercise].diagram === 'triangle' ? (
                    <g>
                      {/* Triangle principal */}
                      <polygon 
                        points="50,150 250,150 150,50" 
                        fill="rgba(59, 130, 246, 0.1)" 
                        stroke="#3b82f6" 
                        strokeWidth="2"
                      />
                      
                      {/* Droite parallèle */}
                      <line 
                        x1="100" y1="100" 
                        x2="200" y2="100" 
                        stroke="#ef4444" 
                        strokeWidth="3"
                      />
                      
                      {/* Points */}
                      <circle cx="50" cy="150" r="4" fill="#3b82f6" />
                      <circle cx="250" cy="150" r="4" fill="#3b82f6" />
                      <circle cx="150" cy="50" r="4" fill="#3b82f6" />
                      <circle cx="100" cy="100" r="4" fill="#ef4444" />
                      <circle cx="200" cy="100" r="4" fill="#ef4444" />
                      
                      {/* Labels */}
                      <text x="45" y="165" className="text-sm font-semibold" fill="#3b82f6">A</text>
                      <text x="255" y="165" className="text-sm font-semibold" fill="#3b82f6">B</text>
                      <text x="145" y="40" className="text-sm font-semibold" fill="#3b82f6">C</text>
                      <text x="95" y="90" className="text-sm font-semibold" fill="#ef4444">D</text>
                      <text x="205" y="90" className="text-sm font-semibold" fill="#ef4444">E</text>
                      
                      {/* Mesures */}
                      <text x="70" y="125" className="text-xs" fill="#059669">
                        AD = {exercises[currentExercise].given.AD || '?'}
                      </text>
                      <text x="170" y="125" className="text-xs" fill="#059669">
                        AE = {exercises[currentExercise].given.AE || '?'}
                      </text>
                    </g>
                  ) : (
                    <g>
                      {/* Configuration parallèle */}
                      <line x1="50" y1="50" x2="250" y2="150" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="100" y1="80" x2="200" y2="120" stroke="#ef4444" strokeWidth="3" />
                      <line x1="70" y1="150" x2="220" y2="50" stroke="#3b82f6" strokeWidth="2" />
                      
                      {/* Points */}
                      <circle cx="75" cy="65" r="4" fill="#3b82f6" />
                      <circle cx="100" cy="80" r="4" fill="#ef4444" />
                      <circle cx="150" cy="110" r="4" fill="#3b82f6" />
                      <circle cx="200" cy="120" r="4" fill="#ef4444" />
                      <circle cx="225" cy="135" r="4" fill="#3b82f6" />
                      
                      {/* Labels */}
                      <text x="70" y="55" className="text-sm font-semibold" fill="#3b82f6">A</text>
                      <text x="95" y="70" className="text-sm font-semibold" fill="#ef4444">M</text>
                      <text x="145" y="100" className="text-sm font-semibold" fill="#3b82f6">N</text>
                      <text x="205" y="110" className="text-sm font-semibold" fill="#ef4444">B</text>
                      <text x="230" y="125" className="text-sm font-semibold" fill="#3b82f6">C</text>
                    </g>
                  )}
                </svg>
                
                {/* Données de l'exercice */}
                <div className="mt-4 bg-blue-50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2">Données :</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(exercises[currentExercise].given).map(([key, value]) => (
                      <div key={key} className="bg-white rounded px-2 py-1">
                        {key} = {value} cm
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 