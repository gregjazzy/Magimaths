'use client';

import { useState, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, BookOpen, Calculator, Target, Trophy, Brain, CheckCircle, XCircle, Lightbulb, Zap } from 'lucide-react';
import Link from 'next/link';

// Lazy loading des composants lourds
const MotionDiv = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.div })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-8 rounded"></div>
});

// Lazy loading des sections lourdes
const ExponentialGraphSection = lazy(() => import('./components/ExponentialGraphSection'));
const ExponentialQuizSection = lazy(() => import('./components/ExponentialQuizSection'));

// Composant de loading
const SectionSkeleton = () => (
  <div className="animate-pulse bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function ExponentielPage() {
  const [xpEarned, setXpEarned] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  
  // États pour les exercices
  const [simpleExerciceAnswers, setSimpleExerciceAnswers] = useState<{ [key: string]: string }>({});
  const [simpleExerciceResults, setSimpleExerciceResults] = useState<{ [key: string]: boolean | null }>({});
  const [difficultExerciceAnswers, setDifficultExerciceAnswers] = useState<{ [key: string]: string }>({});
  const [difficultExerciceResults, setDifficultExerciceResults] = useState<{ [key: string]: boolean | null }>({});

  const handleSectionComplete = (sectionName: string, xp: number) => {
    if (!completedSections.includes(sectionName)) {
      setCompletedSections(prev => [...prev, sectionName]);
      setXpEarned(prev => prev + xp);
    }
  };

  // Exercices simples de simplification
  const simpleExercices = [
    {
      id: 'ex1',
      question: 'e^3 × e^5 = ?',
      answer: 'e^8',
      explanation: "Propriété : e^a × e^b = e^(a+b)\nDonc e^3 × e^5 = e^(3+5) = e^8"
    },
    {
      id: 'ex2',
      question: 'e^7 ÷ e^4 = ?',
      answer: 'e^3',
      explanation: "Propriété : e^a ÷ e^b = e^(a-b)\nDonc e^7 ÷ e^4 = e^(7-4) = e^3"
    },
    {
      id: 'ex3',
      question: '(e^2)^3 = ?',
      answer: 'e^6',
      explanation: "Propriété : (e^a)^n = e^(a×n)\nDonc (e^2)^3 = e^(2×3) = e^6"
    },
    {
      id: 'ex4',
      question: 'e^0 × e^x = ?',
      answer: 'e^x',
      explanation: "e^0 = 1, donc e^0 × e^x = 1 × e^x = e^x"
    }
  ];

  // Exercices plus difficiles
  const difficultExercices = [
    {
      id: 'diff1',
      question: 'Simplifier : (e^(2x+1) × e^(x-3)) ÷ e^(x+2)',
      answer: 'e^(2x-4)',
      explanation: "Étape 1 : e^(2x+1) × e^(x-3) = e^(2x+1+x-3) = e^(3x-2)\nÉtape 2 : e^(3x-2) ÷ e^(x+2) = e^(3x-2-x-2) = e^(2x-4)"
    },
    {
      id: 'diff2',
      question: 'Simplifier : (e^x)^3 × e^(-2x)',
      answer: 'e^x',
      explanation: "Étape 1 : (e^x)^3 = e^(3x)\nÉtape 2 : e^(3x) × e^(-2x) = e^(3x-2x) = e^x"
    },
    {
      id: 'diff3',
      question: 'Résoudre : e^(2x-1) = e^5',
      answer: 'x=3',
      explanation: "Si e^(2x-1) = e^5, alors les exposants sont égaux :\n2x - 1 = 5\n2x = 6\nx = 3"
    }
  ];

  const checkSimpleAnswer = (id: string, userAnswer: string) => {
    const exercice = simpleExercices.find(ex => ex.id === id);
    if (!exercice) return;
    
    const isCorrect = userAnswer.toLowerCase().replace(/\s/g, '') === exercice.answer.toLowerCase().replace(/\s/g, '');
    setSimpleExerciceResults(prev => ({ ...prev, [id]: isCorrect }));
    
    if (isCorrect && !completedSections.includes(`simple-${id}`)) {
      handleSectionComplete(`simple-${id}`, 10);
    }
  };

  const checkDifficultAnswer = (id: string, userAnswer: string) => {
    const exercice = difficultExercices.find(ex => ex.id === id);
    if (!exercice) return;
    
    const isCorrect = userAnswer.toLowerCase().replace(/\s/g, '') === exercice.answer.toLowerCase().replace(/\s/g, '');
    setDifficultExerciceResults(prev => ({ ...prev, [id]: isCorrect }));
    
    if (isCorrect && !completedSections.includes(`difficult-${id}`)) {
      handleSectionComplete(`difficult-${id}`, 20);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Header fixe avec navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Retour</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Fonction Exponentielle</h1>
                <p className="text-sm text-gray-600">Programme Première • {xpEarned} XP gagnés</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {completedSections.length} sections complétées
            </div>
          </div>
          
          {/* Navigation par onglets */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            <div className="flex items-center justify-center px-3 py-2 bg-orange-500 text-white rounded-lg font-medium relative overflow-hidden">
              <span className="text-sm font-semibold">1. Cours</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center justify-center px-3 py-2 bg-orange-400 text-white rounded-lg font-medium text-center">
              <span className="text-sm">2. Propriétés</span>
            </div>
            <div className="flex items-center justify-center px-3 py-2 bg-orange-400 text-white rounded-lg font-medium text-center">
              <span className="text-sm">3. Graphique</span>
            </div>
            <div className="flex items-center justify-center px-3 py-2 bg-orange-400 text-white rounded-lg font-medium text-center">
              <span className="text-sm">4. Exercices</span>
            </div>
            <div className="flex items-center justify-center px-3 py-2 bg-orange-400 text-white rounded-lg font-medium text-center">
              <span className="text-sm">5. Difficiles</span>
            </div>
            <div className="flex items-center justify-center px-3 py-2 bg-orange-400 text-white rounded-lg font-medium text-center">
              <span className="text-sm">6. Démonstrations</span>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-20 max-w-4xl mx-auto p-6 space-y-12">
        
        {/* Section 1: Cours - Généralités */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <BookOpen className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Cours</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              La fonction exponentielle 📚
            </h2>
            <p className="text-gray-600">Découverte et propriétés fondamentales</p>
          </div>

          <div className="space-y-8">
            {/* Découverte graphique */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">🔍 Découverte : Qu'est-ce que e^x ?</h3>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-lg">
                    Regardons d'abord le <strong>graphique de la fonction e^x</strong> pour comprendre ses propriétés :
                  </p>
                  <div className="bg-white/20 p-4 rounded-lg space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-300">✓</span>
                      <span><strong>e^x {'>'} 0</strong> : toujours positive !</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-300">✓</span>
                      <span><strong>Définie sur ℝ</strong> : fonctionne pour tout x</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-300">✓</span>
                      <span><strong>e^x croissante</strong> : monte toujours</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-300">✓</span>
                      <span><strong>e^(-x) décroissante</strong> : descend toujours</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-300">✓</span>
                      <span><strong>e^0 = 1</strong> : point de passage obligé</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-3 text-center">Graphique de e^x (jusqu'à x=3)</h4>
                  <svg viewBox="0 0 350 200" className="w-full h-40">
                    {/* Grille */}
                    <defs>
                      <pattern id="discoveryGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="350" height="200" fill="url(#discoveryGrid)" />
                    
                    {/* Axes */}
                    <line x1="50" y1="160" x2="300" y2="160" stroke="#6b7280" strokeWidth="2" />
                    <line x1="100" y1="20" x2="100" y2="180" stroke="#6b7280" strokeWidth="2" />
                    
                    {/* Courbe e^x avec vraies valeurs (limité à x=3) */}
                    <path
                      d="M 50 159.5 
                         C 75 158 100 150 
                         C 125 135 150 110 
                         C 175 75 200 40 
                         C 225 25 250 20"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                    />
                    
                    {/* Points avec vraies valeurs */}
                    {/* e^(-2) ≈ 0.135 */}
                    <circle cx="50" cy="158.5" r="2" fill="#10b981" />
                    <text x="25" y="155" fontSize="8" fill="#10b981">e^(-2)≈0.14</text>
                    
                    {/* e^(-1) ≈ 0.368 */}
                    <circle cx="75" cy="157" r="2" fill="#10b981" />
                    <text x="55" y="145" fontSize="8" fill="#10b981">e^(-1)≈0.37</text>
                    
                    {/* e^0 = 1 */}
                    <circle cx="100" cy="150" r="4" fill="#dc2626" />
                    <text x="105" y="145" fontSize="10" fill="#dc2626" className="font-bold">e^0=1</text>
                    
                    {/* e^1 ≈ 2.718 */}
                    <circle cx="125" cy="135" r="3" fill="#10b981" />
                    <text x="130" y="130" fontSize="9" fill="#10b981">e^1≈2.7</text>
                    
                    {/* e^2 ≈ 7.389 */}
                    <circle cx="150" cy="110" r="3" fill="#10b981" />
                    <text x="155" y="105" fontSize="9" fill="#10b981">e^2≈7.4</text>
                    
                    {/* e^3 ≈ 20.086 */}
                    <circle cx="175" cy="75" r="3" fill="#ef4444" />
                    <text x="180" y="70" fontSize="9" fill="#ef4444">e^3≈20</text>
                    
                    {/* Graduations X */}
                    <text x="45" y="175" fontSize="10" fill="#6b7280">-2</text>
                    <text x="70" y="175" fontSize="10" fill="#6b7280">-1</text>
                    <text x="97" y="175" fontSize="10" fill="#6b7280">0</text>
                    <text x="122" y="175" fontSize="10" fill="#6b7280">1</text>
                    <text x="147" y="175" fontSize="10" fill="#6b7280">2</text>
                    <text x="172" y="175" fontSize="10" fill="#6b7280">3</text>
                    
                    {/* Graduations Y */}
                    <text x="85" y="155" fontSize="10" fill="#6b7280">1</text>
                    <text x="85" y="135" fontSize="10" fill="#6b7280">3</text>
                    <text x="85" y="115" fontSize="10" fill="#6b7280">7</text>
                    <text x="80" y="95" fontSize="10" fill="#6b7280">15</text>
                    <text x="80" y="75" fontSize="10" fill="#6b7280">20</text>
                    
                    {/* Annotation croissance */}
                    <text x="200" y="50" fontSize="9" fill="#22c55e" className="font-bold">Croissance</text>
                    <text x="200" y="62" fontSize="9" fill="#22c55e" className="font-bold">explosive !</text>
                    
                    {/* Flèche */}
                    <path d="M 195 75 L 180 78 M 195 75 L 192 82" stroke="#22c55e" strokeWidth="2" fill="none" />
                  </svg>
                  <p className="text-xs text-gray-600 text-center mt-2">
                    <strong>Échelle raisonnable :</strong> de e^(-2)≈0,14 à e^3≈20 - on voit bien la forme en "J" !
                  </p>
                </div>
              </div>
            </div>

            {/* Propriétés fondamentales */}
            <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">⚡ Propriétés fondamentales</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-blue-800 text-lg font-serif italic">
                    e<sup className="font-bold">a</sup> × e<sup className="font-bold">b</sup> = e<sup className="font-bold">a+b</sup>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-blue-800 text-lg font-serif italic">
                    e<sup className="font-bold">a</sup> ÷ e<sup className="font-bold">b</sup> = e<sup className="font-bold">a−b</sup>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-blue-800 text-lg font-serif italic">
                    (e<sup className="font-bold">a</sup>)<sup className="font-bold text-red-600">n</sup> = e<sup className="font-bold">a×n</sup>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-green-800 text-lg font-serif italic">
                    e<sup className="font-bold">x</sup> {'>'} 0 pour tout x ∈ ℝ
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-green-800 text-lg font-serif italic">
                    lim<sub className="text-sm">x→−∞</sub> e<sup className="font-bold">x</sup> = 0
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-4 rounded-lg text-center border-2 border-orange-300">
                  <div className="text-purple-800 text-lg font-serif italic">
                    Si e<sup className="font-bold">a</sup> = e<sup className="font-bold">b</sup> alors a = b
                  </div>
                  <div className="text-xs text-gray-600 mt-1">(Injectivité)</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center border-2 border-orange-300">
                  <div className="text-purple-800 text-lg font-serif italic">
                    Si e<sup className="font-bold">a</sup> {'>'} e<sup className="font-bold">b</sup> alors a {'>'} b
                  </div>
                  <div className="text-xs text-gray-600 mt-1">(Croissance stricte)</div>
                </div>
              </div>
            </div>

            {/* Propriétés de dérivation */}
            <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">📐 Propriétés de dérivation</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-purple-300">
                  <h4 className="text-lg font-bold text-purple-800 mb-3 text-center">Dérivée simple</h4>
                  <div className="text-purple-900 text-xl font-serif italic text-center">
                    (e<sup className="font-bold">x</sup>)' = e<sup className="font-bold">x</sup>
                  </div>
                  <div className="text-xs text-gray-600 text-center mt-2">
                    La fonction exponentielle est sa propre dérivée !
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-purple-300">
                  <h4 className="text-lg font-bold text-purple-800 mb-3 text-center">Dérivée composée</h4>
                  <div className="text-purple-900 text-xl font-serif italic text-center">
                    (e<sup className="font-bold">u</sup>)' = u' × e<sup className="font-bold">u</sup>
                  </div>
                  <div className="text-xs text-gray-600 text-center mt-2">
                    Avec u fonction de x (règle de dérivation en chaîne)
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-yellow-100 p-3 rounded-lg border border-yellow-300">
                <p className="text-yellow-800 text-sm text-center">
                  <strong>💡 Remarque :</strong> C'est la seule fonction (à une constante multiplicative près) qui est égale à sa propre dérivée !
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => handleSectionComplete('cours', 25)}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  completedSections.includes('cours')
                    ? 'bg-green-500 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {completedSections.includes('cours') ? '✓ Cours maîtrisé ! +25 XP' : 'J\'ai compris le cours ! +25 XP'}
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Simplifications algébriques */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <Calculator className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Simplifications</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Calculs et simplifications 🧮
            </h2>
            <p className="text-gray-600">Maîtrise les propriétés pour simplifier les expressions</p>
          </div>

          <div className="space-y-6">
            {/* Rappel des propriétés */}
            <div className="bg-blue-50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-blue-900 mb-4">📝 Rappel des propriétés essentielles</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-blue-800 text-lg font-serif italic">
                    e<sup className="font-bold">a</sup> × e<sup className="font-bold">b</sup> = e<sup className="font-bold">a+b</sup>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-blue-800 text-lg font-serif italic">
                    e<sup className="font-bold">a</sup> ÷ e<sup className="font-bold">b</sup> = e<sup className="font-bold">a−b</sup>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-blue-800 text-lg font-serif italic">
                    (e<sup className="font-bold">a</sup>)<sup className="font-bold text-red-600">n</sup> = e<sup className="font-bold">a×n</sup>
                  </div>
                </div>
              </div>
            </div>

            {/* Exemples détaillés */}
            <div className="bg-green-50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-green-900 mb-4">💡 Exemples détaillés</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Exemple 1 : Produit</h4>
                  <div className="text-lg text-center font-serif italic">
                    <span className="text-blue-800">e<sup className="font-bold">3</sup> × e<sup className="font-bold">7</sup></span>
                    <span className="text-gray-600 mx-2">=</span>
                    <span className="text-green-600">e<sup className="font-bold">3+7</sup></span>
                    <span className="text-gray-600 mx-2">=</span>
                    <span className="text-purple-600 font-bold">e<sup className="font-bold">10</sup></span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Exemple 2 : Quotient</h4>
                  <div className="text-lg text-center font-serif italic">
                    <span className="text-blue-800">e<sup className="font-bold">8</sup> ÷ e<sup className="font-bold">3</sup></span>
                    <span className="text-gray-600 mx-2">=</span>
                    <span className="text-green-600">e<sup className="font-bold">8−3</sup></span>
                    <span className="text-gray-600 mx-2">=</span>
                    <span className="text-purple-600 font-bold">e<sup className="font-bold">5</sup></span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Exemple 3 : Puissance</h4>
                  <div className="text-lg text-center font-serif italic">
                    <span className="text-blue-800">(e<sup className="font-bold">4</sup>)<sup className="font-bold text-red-600">3</sup></span>
                    <span className="text-gray-600 mx-2">=</span>
                    <span className="text-green-600">e<sup className="font-bold">4×3</sup></span>
                    <span className="text-gray-600 mx-2">=</span>
                    <span className="text-purple-600 font-bold">e<sup className="font-bold">12</sup></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => handleSectionComplete('simplifications', 20)}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  completedSections.includes('simplifications')
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {completedSections.includes('simplifications') ? '✓ Propriétés maîtrisées ! +20 XP' : 'J\'ai compris ! +20 XP'}
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Graphique interactif */}
        <Suspense fallback={<SectionSkeleton />}>
          <ExponentialGraphSection onSectionComplete={handleSectionComplete} completedSections={completedSections} />
        </Suspense>

        {/* Section 4: Exercices simples */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Exercices simples</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exercices d'application 🎯
            </h2>
            <p className="text-gray-600">Applique les propriétés de base</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {simpleExercices.map((exercice) => (
              <div key={exercice.id} className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{exercice.question}</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Ta réponse..."
                    value={simpleExerciceAnswers[exercice.id] || ''}
                    onChange={(e) => setSimpleExerciceAnswers(prev => ({ ...prev, [exercice.id]: e.target.value }))}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none font-mono"
                  />
                  <button
                    onClick={() => checkSimpleAnswer(exercice.id, simpleExerciceAnswers[exercice.id] || '')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                  >
                    Vérifier
                  </button>
                  
                  {simpleExerciceResults[exercice.id] !== undefined && (
                    <div className={`p-3 rounded-lg ${simpleExerciceResults[exercice.id] ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'} border-2`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {simpleExerciceResults[exercice.id] ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className={`font-bold ${simpleExerciceResults[exercice.id] ? 'text-green-800' : 'text-red-800'}`}>
                          {simpleExerciceResults[exercice.id] ? 'Correct ! +10 XP' : 'Incorrect'}
                        </span>
                      </div>
                      {!simpleExerciceResults[exercice.id] && (
                        <div className="text-red-700 text-sm whitespace-pre-line">
                          <strong>Réponse :</strong> {exercice.answer}
                          <br /><strong>Explication :</strong><br />{exercice.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Exercices difficiles */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
              <Trophy className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Exercices difficiles</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Défis avancés 🏆
            </h2>
            <p className="text-gray-600">Expressions complexes et équations exponentielles</p>
          </div>

          <div className="space-y-8">
            {difficultExercices.map((exercice) => (
              <div key={exercice.id} className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{exercice.question}</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Ta réponse..."
                    value={difficultExerciceAnswers[exercice.id] || ''}
                    onChange={(e) => setDifficultExerciceAnswers(prev => ({ ...prev, [exercice.id]: e.target.value }))}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none font-mono"
                  />
                  <button
                    onClick={() => checkDifficultAnswer(exercice.id, difficultExerciceAnswers[exercice.id] || '')}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                  >
                    Vérifier
                  </button>
                  
                  {difficultExerciceResults[exercice.id] !== undefined && (
                    <div className={`p-4 rounded-lg ${difficultExerciceResults[exercice.id] ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'} border-2`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {difficultExerciceResults[exercice.id] ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className={`font-bold ${difficultExerciceResults[exercice.id] ? 'text-green-800' : 'text-red-800'}`}>
                          {difficultExerciceResults[exercice.id] ? 'Excellent ! +20 XP' : 'Pas tout à fait'}
                        </span>
                      </div>
                      {!difficultExerciceResults[exercice.id] && (
                        <div className="text-red-700 text-sm whitespace-pre-line">
                          <strong>Réponse :</strong> {exercice.answer}
                          <br /><strong>Méthode :</strong><br />{exercice.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Démonstrations complexes */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-full mb-4">
              <Brain className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-800">Démonstrations</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Démonstrations complexes 🧠
            </h2>
            <p className="text-gray-600">Niveau expert : "Montrer que..."</p>
          </div>

          <div className="space-y-8">
            {/* Démonstration 1 */}
            <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                💪 Démonstration 1
              </h3>
              <div className="bg-white p-4 rounded-lg mb-4">
                <p className="text-lg font-semibold text-gray-900">
                  Montrer que : (e^(2x+1) × e^(3-x)) ÷ (e^x × e^2) = e^(2-2x)
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">💡 Méthode :</h4>
                  <ol className="list-decimal list-inside space-y-2 text-blue-700">
                    <li>Simplifier le numérateur : e^(2x+1) × e^(3-x)</li>
                    <li>Simplifier le dénominateur : e^x × e^2</li>
                    <li>Effectuer la division</li>
                    <li>Vérifier le résultat</li>
                  </ol>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-bold text-yellow-800 mb-2">📝 Solution détaillée :</h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div><span className="text-blue-600">Étape 1 :</span> e^(2x+1) × e^(3-x) = e^(2x+1+3-x) = e^(x+4)</div>
                    <div><span className="text-blue-600">Étape 2 :</span> e^x × e^2 = e^(x+2)</div>
                    <div><span className="text-blue-600">Étape 3 :</span> e^(x+4) ÷ e^(x+2) = e^(x+4-x-2) = e^2</div>
                    <div className="text-red-600 font-bold">❌ Ce n'est pas égal à e^(2-2x) !</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Démonstration 2 */}
            <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                🔥 Démonstration 2
              </h3>
              <div className="bg-white p-4 rounded-lg mb-4">
                <p className="text-lg font-semibold text-gray-900">
                  Montrer que : e^(2x) - 2e^x + 1 = (e^x - 1)²
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">✅ Solution :</h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div><span className="text-blue-600">Développons (e^x - 1)² :</span></div>
                    <div>(e^x - 1)² = (e^x)² - 2(e^x)(1) + 1²</div>
                    <div>= e^(2x) - 2e^x + 1</div>
                    <div className="text-green-600 font-bold">✅ C'est bien égal au membre de gauche !</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Démonstration 3 */}
            <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ⚡ Démonstration 3
              </h3>
              <div className="bg-white p-4 rounded-lg mb-4">
                <p className="text-lg font-semibold text-gray-900">
                  Résoudre : e^(2x-1) = (e^3)^(x-2)
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-800 mb-2">🎯 Solution :</h4>
                  <div className="space-y-2 font-mono text-sm">
                    <div><span className="text-blue-600">Simplifions le membre de droite :</span></div>
                    <div>(e^3)^(x-2) = e^(3(x-2)) = e^(3x-6)</div>
                    <div><span className="text-blue-600">L'équation devient :</span></div>
                    <div>e^(2x-1) = e^(3x-6)</div>
                    <div><span className="text-blue-600">Les bases sont égales, donc :</span></div>
                    <div>2x - 1 = 3x - 6</div>
                    <div>-1 + 6 = 3x - 2x</div>
                    <div>5 = x</div>
                    <div className="text-purple-600 font-bold">✅ Solution : x = 5</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => handleSectionComplete('demonstrations', 50)}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  completedSections.includes('demonstrations')
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {completedSections.includes('demonstrations') ? '✓ Expert ! +50 XP' : 'J\'ai tout compris ! +50 XP'}
              </button>
            </div>
          </div>
        </section>

        {/* Section 7: Quiz final */}
        <Suspense fallback={<SectionSkeleton />}>
          <ExponentialQuizSection onSectionComplete={handleSectionComplete} completedSections={completedSections} />
        </Suspense>
      </div>

      {/* Styles pour les sliders */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
} 