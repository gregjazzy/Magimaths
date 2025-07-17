'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Target, Calculator, Lightbulb, CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export default function ExpressionsLitteralesPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices' | 'outils'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  
  // États pour l'animation des chats
  const [catAnimationStep, setCatAnimationStep] = useState(0)
  const [isCatAnimating, setIsCatAnimating] = useState(false)
  const [catAnimationStepNeg, setCatAnimationStepNeg] = useState(0)
  const [isCatAnimatingNeg, setIsCatAnimatingNeg] = useState(false)
  
  // État pour les onglets des règles de calcul
  const [calculRulesTab, setCalculRulesTab] = useState<'addition' | 'multiplication'>('addition')

  const exercises = [
    {
      id: 'expr1',
      question: 'Quelle expression représente "trois fois un nombre x" ?',
      options: ['3 + x', '3x', 'x + 3', 'x/3'],
      correct: 1,
      explanation: 'Trois fois un nombre x s\'écrit 3x (sans le signe ×)'
    },
    {
      id: 'expr2',
      question: 'Comment écrire "un nombre y augmenté de 5" ?',
      options: ['5y', 'y - 5', 'y + 5', '5 - y'],
      correct: 2,
      explanation: 'Augmenter signifie ajouter, donc y + 5'
    },
    {
      id: 'expr3',
      question: 'Quelle expression représente "le produit d\'un nombre a par 7" ?',
      options: ['a + 7', '7a', 'a - 7', 'a ÷ 7'],
      correct: 1,
      explanation: 'Le produit signifie multiplication, donc 7a'
    },
    {
      id: 'expr4',
      question: 'Comment écrire "un nombre b diminué de 3" ?',
      options: ['3b', 'b + 3', '3 - b', 'b - 3'],
      correct: 3,
      explanation: 'Diminuer signifie soustraire, donc b - 3'
    },
    {
      id: 'expr5',
      question: 'Quelle expression représente "le double d\'un nombre t" ?',
      options: ['t + 2', '2t', 't²', 't/2'],
      correct: 1,
      explanation: 'Le double signifie multiplier par 2, donc 2t'
    },
    {
      id: 'expr6',
      question: 'Dans l\'expression 5x + 3, quel est le coefficient de x ?',
      options: ['3', '5', '5x', '8'],
      correct: 1,
      explanation: 'Le coefficient de x est le nombre qui multiplie x, donc 5'
    }
  ]

  const currentEx = exercises[currentExercise]

  const checkAnswer = (answerIndex: number) => {
    if (answerIndex === currentEx.correct) {
      setScore(score + 1)
      setShowAnswer(true)
      return true
    } else {
      setShowAnswer(true)
      return false
    }
  }

  const startCatAnimation = () => {
    setIsCatAnimating(true);
    setCatAnimationStep(0);
    const interval = setInterval(() => {
      setCatAnimationStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setIsCatAnimating(false);
          return 4;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const resetCatAnimation = () => {
    setCatAnimationStep(0);
    setIsCatAnimating(false);
  };

  const startCatAnimationNeg = () => {
    setIsCatAnimatingNeg(true);
    setCatAnimationStepNeg(0);
    const interval = setInterval(() => {
      setCatAnimationStepNeg(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setIsCatAnimatingNeg(false);
          return 4;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const resetCatAnimationNeg = () => {
    setCatAnimationStepNeg(0);
    setIsCatAnimatingNeg(false);
  };

  // Gestion du scroll automatique vers les sections
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/chapitre/5eme-calcul-litteral" 
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Retour au calcul littéral</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                📝
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Expressions littérales</h1>
                <p className="text-gray-600 text-lg">
                  Comprendre et utiliser les expressions avec des lettres
                </p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-600">Durée estimée</div>
                <div className="text-xl font-semibold text-purple-600">20 minutes</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {[
                { id: 'cours', label: 'Cours', icon: BookOpen },
                { id: 'exercices', label: 'Exercices', icon: Target },
                { id: 'outils', label: 'Outils', icon: Calculator }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu */}
        {activeTab === 'cours' && (
          <div className="space-y-8">
            {/* 1. INTRODUCTION */}
            <div id="introduction" className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
              <h2 className="text-2xl font-bold text-blue-800 mb-6">🎯 Introduction - Qu'est-ce qu'une expression littérale ?</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Définition</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Une <strong>expression littérale</strong> est une expression mathématique qui contient des <strong>lettres</strong> (variables) en plus des nombres et des opérations.
                  </p>
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
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">Terme</h4>
                      <p className="text-purple-700 text-sm">
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

            {/* 2. RÈGLES DE CALCUL */}
            <div id="regles" className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-200">
              <h2 className="text-2xl font-bold text-purple-800 mb-6">📐 Règles de calcul</h2>
              
              <div className="space-y-6">


                {/* Onglets */}
                <div className="bg-white rounded-lg p-6 border border-purple-100">
                  <div className="flex justify-center gap-4 mb-6">
                    <button
                      onClick={() => setCalculRulesTab('addition')}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        calculRulesTab === 'addition'
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ➕ Addition
                    </button>
                    <button
                      onClick={() => setCalculRulesTab('multiplication')}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        calculRulesTab === 'multiplication'
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ✖️ Multiplication
                    </button>
                  </div>

                  {/* Contenu onglet Addition */}
                  {calculRulesTab === 'addition' && (
                    <div className="space-y-6">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="text-lg font-semibold text-green-800 mb-4">Règle fondamentale</h3>
                        <p className="text-green-700 font-medium mb-2">
                          ✅ On ne peut additionner que des termes <strong>strictement identiques</strong>
                        </p>
                        <p className="text-green-600 text-sm">
                          Cela signifie : même variable ET même puissance
                        </p>
                      </div>

                      {/* Animations avec les chats */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Colonne 1 : Exemple avec nombres positifs */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-3">📘 Exemple 1 : 2x + 3x</h4>
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-center gap-4 mb-4">
                              <button
                                onClick={startCatAnimation}
                                disabled={isCatAnimating}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                              >
                                <Play size={14} />
                                {isCatAnimating ? 'Animation...' : 'Voir l\'animation 🐱'}
                              </button>
                              <button
                                onClick={resetCatAnimation}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                              >
                                <RotateCcw size={14} />
                                Reset
                              </button>
                            </div>
                          
                            <div className="text-center space-y-4">
                              <div className="text-2xl font-mono bg-gray-50 p-4 rounded-lg border border-gray-300 text-gray-800">
                                {catAnimationStep === 0 && <span>2x + 3x</span>}
                                {catAnimationStep === 1 && <span>2🐱 + 3🐱</span>}
                                {catAnimationStep === 2 && <span>2🐱 + 3🐱 = 5🐱</span>}
                                {catAnimationStep === 3 && <span>2🐱 + 3🐱 = 5🐱 = 5x</span>}
                                {catAnimationStep === 4 && <span>2x + 3x = 5x</span>}
                              </div>
                              <div className="text-sm text-gray-600">
                                {catAnimationStep === 0 && 'Expression de départ'}
                                {catAnimationStep === 1 && 'Dans ton esprit, remplace x par un chat 🐱'}
                                {catAnimationStep === 2 && '2 chats + 3 chats = 5 chats'}
                                {catAnimationStep === 3 && 'Remplace les chats par x : 5x'}
                                {catAnimationStep === 4 && 'Résultat final : 2x + 3x = 5x'}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Colonne 2 : Exemple avec nombres relatifs */}
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-3">📗 Exemple 2 : -5x + 7x</h4>
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-center gap-4 mb-4">
                              <button
                                onClick={startCatAnimationNeg}
                                disabled={isCatAnimatingNeg}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                              >
                                <Play size={14} />
                                {isCatAnimatingNeg ? 'Animation...' : 'Voir l\'animation 🐱'}
                              </button>
                              <button
                                onClick={resetCatAnimationNeg}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                              >
                                <RotateCcw size={14} />
                                Reset
                              </button>
                            </div>
                            
                            <div className="text-center space-y-4">
                              <div className="text-2xl font-mono bg-gray-50 p-4 rounded-lg border border-gray-300 text-gray-800">
                                {catAnimationStepNeg === 0 && <span>-5x + 7x</span>}
                                {catAnimationStepNeg === 1 && <span>-5🐱 + 7🐱</span>}
                                {catAnimationStepNeg === 2 && <span>-5🐱 + 7🐱 = 2🐱</span>}
                                {catAnimationStepNeg === 3 && <span>-5🐱 + 7🐱 = 2🐱 = 2x</span>}
                                {catAnimationStepNeg === 4 && <span>-5x + 7x = 2x</span>}
                              </div>
                              <div className="text-sm text-gray-600">
                                {catAnimationStepNeg === 0 && 'Expression avec nombres relatifs'}
                                {catAnimationStepNeg === 1 && 'Remplace x par un chat 🐱'}
                                {catAnimationStepNeg === 2 && 'On enlève 5 chats, on ajoute 7 chats = 2 chats'}
                                {catAnimationStepNeg === 3 && 'Remplace les chats par x : 2x'}
                                {catAnimationStepNeg === 4 && 'Résultat final : -5x + 7x = 2x'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Ce qui fonctionne et ne fonctionne pas */}
                      <div className="bg-white rounded-lg p-6 border border-green-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚠️ Attention aux erreurs courantes</h3>
                        
                        <div className="space-y-4">
                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <h4 className="font-semibold text-red-800 mb-3">❌ Ce qui ne fonctionne pas</h4>
                            <div className="space-y-3 text-sm">
                              <div className="bg-red-100 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-red-600 font-bold">❌</span>
                                  <span className="font-mono text-red-800">2x + 3x²</span>
                                  <span className="text-red-600">ne peut pas se simplifier</span>
                                </div>
                                <p className="text-red-600 text-xs">
                                  x et x² sont des termes différents (puissances différentes)
                                </p>
                              </div>
                              
                              <div className="bg-red-100 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-red-600 font-bold">❌</span>
                                  <span className="font-mono text-red-800">3x + 2y</span>
                                  <span className="text-red-600">ne peut pas se simplifier</span>
                                </div>
                                <p className="text-red-600 text-xs">
                                  x et y sont des variables différentes
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-3">✅ Ce qui fonctionne</h4>
                            <div className="space-y-3 text-sm">
                              <div className="bg-green-100 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-green-600 font-bold">✅</span>
                                  <span className="font-mono text-green-800">4x² + 5x² = 9x²</span>
                                  <span className="text-green-600">fonctionne</span>
                                </div>
                                <p className="text-green-600 text-xs">
                                  Même variable (x) avec la même puissance (²)
                                </p>
                              </div>
                              
                              <div className="bg-green-100 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-green-600 font-bold">✅</span>
                                  <span className="font-mono text-green-800">7a + 3a = 10a</span>
                                  <span className="text-green-600">fonctionne</span>
                                </div>
                                <p className="text-green-600 text-xs">
                                  Même variable (a) avec la même puissance (1)
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contenu onglet Multiplication */}
                  {calculRulesTab === 'multiplication' && (
                    <div className="space-y-6">
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <h3 className="text-lg font-semibold text-amber-800 mb-4">Règles importantes</h3>
                        <ul className="text-amber-700 space-y-2">
                          <li>• On ne met pas le signe × entre un nombre et une variable</li>
                          <li>• On écrit le coefficient devant la variable</li>
                          <li>• On ordonne les variables par ordre alphabétique</li>
                        </ul>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6 border border-amber-100">
                          <h4 className="font-semibold text-amber-800 mb-4">🔢 Multiplier un nombre par une variable</h4>
                          <div className="space-y-3">
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span className="font-mono text-lg">3 × x = 3x</span>
                              </div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span className="font-mono text-lg">5 × a = 5a</span>
                              </div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span className="font-mono text-lg">x × 4 = 4x</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-6 border border-amber-100">
                          <h4 className="font-semibold text-amber-800 mb-4">🔤 Multiplier des variables</h4>
                          <div className="space-y-3">
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2">
                                <span className="text-green-600 font-bold">•</span>
                                <span className="font-mono text-lg">x × y = xy</span>
                              </div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2">
                                <span className="text-green-600 font-bold">•</span>
                                <span className="font-mono text-lg">a × b = ab</span>
                              </div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2">
                                <span className="text-green-600 font-bold">•</span>
                                <span className="font-mono text-lg">x × x = x²</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-6 border border-amber-100">
                        <h4 className="font-semibold text-amber-800 mb-4">🎯 Exemples plus complexes</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <h5 className="font-semibold text-amber-800 mb-3">Avec coefficients</h5>
                            <div className="space-y-2 text-sm">
                              <div className="font-mono text-lg">2x × 3y = 6xy</div>
                              <div className="font-mono text-lg">4a × 5b = 20ab</div>
                              <div className="font-mono text-lg">3x × 2x = 6x²</div>
                            </div>
                          </div>
                          
                          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <h5 className="font-semibold text-amber-800 mb-3">Avec puissances</h5>
                            <div className="space-y-2 text-sm">
                              <div className="font-mono text-lg">x² × x = x³</div>
                              <div className="font-mono text-lg">2x² × 3x = 6x³</div>
                              <div className="font-mono text-lg">x² × y² = x²y²</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exercices' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Exercices - Expressions littérales</h2>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Score</div>
                  <div className="text-2xl font-bold text-purple-600">{score}</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentEx.question}</h3>
                
                <div className="space-y-3">
                  {currentEx.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => checkAnswer(index)}
                      disabled={showAnswer}
                      className={`w-full p-4 text-left border rounded-lg transition-colors ${
                        showAnswer
                          ? index === currentEx.correct
                            ? 'bg-green-100 border-green-300 text-green-800'
                            : 'bg-gray-100 border-gray-300 text-gray-600'
                          : 'bg-white border-gray-300 hover:bg-purple-50 hover:border-purple-300'
                      }`}
                    >
                      <span className="font-mono text-lg">{option}</span>
                    </button>
                  ))}
                </div>

                {showAnswer && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 Explication</h4>
                    <p className="text-blue-700 text-sm">{currentEx.explanation}</p>
                    
                    <button
                      onClick={() => {
                        setCurrentExercise((currentExercise + 1) % exercises.length)
                        setShowAnswer(false)
                      }}
                      className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                      Exercice suivant
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'outils' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">🧮 Aide-mémoire</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">Traduction français → maths</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• "un nombre x" → x</li>
                      <li>• "deux fois x" → 2x</li>
                      <li>• "x augmenté de 3" → x + 3</li>
                      <li>• "x diminué de 5" → x - 5</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Multiplication</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• 3 × x = 3x</li>
                      <li>• a × b = ab</li>
                      <li>• x × x = x²</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-2">Conventions</h3>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• On ne met pas le signe ×</li>
                      <li>• Les lettres en ordre alphabétique</li>
                      <li>• Le coefficient devant la variable</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h3 className="font-semibold text-yellow-800 mb-2">Exemples</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 2a + 3b - 5</li>
                      <li>• 4xy + 7</li>
                      <li>• 3x² - 2x + 1</li>
                    </ul>
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