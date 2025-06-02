'use client';

import { useState, lazy, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, Play, Lightbulb, Target, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Lazy loading des composants lourds
const MotionDiv = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.div })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-8 rounded"></div>
});

// Lazy loading des sections lourdes
const GraphSection = lazy(() => import('./components/GraphSection'));
const QuizSection = lazy(() => import('./components/QuizSection'));

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

export default function EquationsSecondDegrePage() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-3);
  const [c, setC] = useState(2);
  const [showGraphDetail, setShowGraphDetail] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showCorrection, setShowCorrection] = useState(false);
  const [showExercice5, setShowExercice5] = useState(false);
  const [showExercice6, setShowExercice6] = useState(false);

  // États pour le graphique interactif
  const [coefficients, setCoefficients] = useState({ a: 1, b: 0, c: 0 });
  
  // États pour le quiz
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [currentQuestionAnswered, setCurrentQuestionAnswered] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

  // Données du quiz avec corrections détaillées
  const quizQuestions = [
    { 
      equation: "3x² + 2x - 1 = 0", 
      isSecondDegree: true, 
      explanation: "Forme ax² + bx + c avec a≠0",
      detailedCorrection: {
        why: "Cette équation EST du second degré",
        details: "On a bien la forme ax² + bx + c = 0 avec :\n• a = 3 (≠ 0) ✓\n• b = 2\n• c = -1\nComme a ≠ 0, c'est bien une équation du second degré."
      }
    },
    { 
      equation: "5x - 3 = 0", 
      isSecondDegree: false, 
      explanation: "Pas de terme en x², c'est du 1er degré",
      detailedCorrection: {
        why: "Cette équation N'EST PAS du second degré",
        details: "Il n'y a pas de terme en x² !\n• Terme en x² : absent (a = 0)\n• Terme en x : 5x (b = 5)\n• Terme constant : -3 (c = -3)\nSans terme en x², c'est une équation du 1er degré."
      }
    },
    { 
      equation: "x² = 16", 
      isSecondDegree: true, 
      explanation: "Même si b=0 et c=-16, on a bien x² donc 2nd degré",
      detailedCorrection: {
        why: "Cette équation EST du second degré",
        details: "On peut la réécrire sous forme standard :\n• x² = 16\n• x² - 16 = 0\n• a = 1 (≠ 0) ✓\n• b = 0 (le terme en x peut être absent)\n• c = -16\nMême si b = 0, on a bien x² donc c'est du second degré."
      }
    },
    { 
      equation: "2x³ + x² - 1 = 0", 
      isSecondDegree: false, 
      explanation: "Degré 3 à cause du x³",
      detailedCorrection: {
        why: "Cette équation N'EST PAS du second degré",
        details: "Le terme de plus haut degré est x³ !\n• Terme en x³ : 2x³ (degré 3)\n• Terme en x² : x²\n• Terme constant : -1\nLe degré d'une équation = degré du terme le plus élevé. Ici c'est 3, pas 2."
      }
    },
    { 
      equation: "-x² + 7 = 0", 
      isSecondDegree: true, 
      explanation: "a=-1, b=0, c=7, c'est bien du 2nd degré",
      detailedCorrection: {
        why: "Cette équation EST du second degré",
        details: "Forme ax² + bx + c = 0 avec :\n• a = -1 (≠ 0) ✓\n• b = 0 (pas de terme en x)\n• c = 7\nMême si a est négatif, tant que a ≠ 0, c'est du second degré."
      }
    }
  ];

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Fonction pour générer les points de la parabole
  const generateParabolaPoints = () => {
    const points = [];
    const { a, b, c } = coefficients;
    for (let x = -8; x <= 8; x += 0.3) {
      const y = a * x * x + b * x + c;
      if (y >= -15 && y <= 15) { // Ajuster les limites d'affichage
        points.push(`${(x + 8) * 12.5},${(15 - y) * 8 + 120}`);
      }
    }
    return points.join(' ');
  };

  const handleSectionComplete = (sectionName: string, xp: number) => {
    if (!completedSections.includes(sectionName)) {
      setCompletedSections(prev => [...prev, sectionName]);
      setXpEarned(prev => prev + xp);
    }
  };

  const handleQuizAnswer = (answer: boolean) => {
    if (currentQuestionAnswered) return; // Empêcher double-clic
    
    const correct = answer === quizQuestions[currentQuizQuestion].isSecondDegree;
    setQuizAnswers(prev => [...prev, correct]);
    setCurrentQuestionAnswered(true);
    setLastAnswerCorrect(correct);
    
    if (!correct) {
      setShowCorrection(true);
    } else {
      // Si correct, passer à la suite après un délai
      setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(prev => prev + 1);
      setCurrentQuestionAnswered(false);
      setShowCorrection(false);
    } else {
      setShowQuizResults(true);
      handleSectionComplete('quiz', 35);
    }
  };

  const handleCorrectionValidated = () => {
    setShowCorrection(false);
    setTimeout(() => {
      moveToNextQuestion();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
                <h1 className="text-lg font-bold text-gray-900">Équations du Second Degré</h1>
                <p className="text-sm text-gray-600">Chapitre complet • {xpEarned} XP gagnés</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {completedSections.length}/4 sections
            </div>
          </div>
          
          {/* Navigation par onglets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg font-medium relative overflow-hidden">
              <span className="text-sm font-semibold">1. Intro</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            <Link href="/chapitre/equations-second-degre-forme-canonique" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">2. Canonique</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-variations" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">3. Variations</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-resolution" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">4. Résolution</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-techniques-avancees" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">5. Techniques</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-tableaux-signes" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">6. Inéquations</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-parametres" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">7. Paramètres</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-equations-cube" className="flex items-center justify-center px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors text-center relative overflow-hidden">
              <span className="text-sm font-semibold">8. Cube</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-20 max-w-4xl mx-auto p-6 space-y-12">
        
        {/* Section 1: Introduction */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Découverte</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Qu'est-ce qu'une équation du second degré ? 🤔
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3">Définition</h3>
                <p className="text-lg">
                  Une équation du <strong>second degré</strong> a la forme :
                </p>
                <div className="bg-white/20 p-4 rounded-lg mt-4 text-center">
                  <span className="text-2xl font-mono font-bold">ax² + bx + c = 0</span>
                </div>
                <p className="mt-3 text-sm">
                  avec <strong>a ≠ 0</strong> (sinon ce ne serait plus du 2nd degré !)
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 font-bold">a</span>
                  <span className="text-gray-700">: coefficient de x² (ne peut pas être 0)</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-600 font-bold">b</span>
                  <span className="text-gray-700">: coefficient de x (peut être 0)</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-600 font-bold">c</span>
                  <span className="text-gray-700">: terme constant (peut être 0)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Exemples :</h3>
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                  <div className="font-mono text-lg font-bold text-green-800">2x² + 3x - 1 = 0</div>
                  <div className="text-sm text-green-600">a=2, b=3, c=-1 ✅</div>
                </div>
                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                  <div className="font-mono text-lg font-bold text-green-800">x² - 5 = 0</div>
                  <div className="text-sm text-green-600">a=1, b=0, c=-5 ✅</div>
                </div>
                <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <div className="font-mono text-lg font-bold text-red-800">3x + 7 = 0</div>
                  <div className="text-sm text-red-600">Pas de x² ❌ (1er degré)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => handleSectionComplete('intro', 20)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('intro')
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {completedSections.includes('intro') ? '✓ Compris ! +20 XP' : 'J\'ai compris ! +20 XP'}
            </button>
          </div>
        </section>

        {/* Section 2: Graphique Interactif - Lazy Loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <GraphSection onSectionComplete={handleSectionComplete} completedSections={completedSections} />
        </Suspense>

        {/* Section 3: Détective des Coefficients */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Entraînement</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Détective des Coefficients 🕵️
            </h2>
            <p className="text-gray-600">Identifie les valeurs de a, b et c dans ces équations</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
              <h3 className="font-mono text-xl font-bold text-center mb-4 text-gray-900">2x² - 6x + 3 = 0</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="font-bold text-gray-900">Coefficient a :</span>
                  <span className="bg-green-100 px-3 py-1 rounded text-green-800 font-bold">2</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="font-bold text-gray-900">Coefficient b :</span>
                  <span className="bg-yellow-100 px-3 py-1 rounded text-yellow-800 font-bold">-6</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="font-bold text-gray-900">Coefficient c :</span>
                  <span className="bg-purple-100 px-3 py-1 rounded text-purple-800 font-bold">3</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl border-2 border-green-200">
              <h3 className="font-mono text-xl font-bold text-center mb-4 text-gray-900">-x² + 4 = 0</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="font-bold text-gray-900">Coefficient a :</span>
                  <span className="bg-green-100 px-3 py-1 rounded text-green-800 font-bold">-1</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="font-bold text-gray-900">Coefficient b :</span>
                  <span className="bg-yellow-100 px-3 py-1 rounded text-yellow-800 font-bold">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="font-bold text-gray-900">Coefficient c :</span>
                  <span className="bg-purple-100 px-3 py-1 rounded text-purple-800 font-bold">4</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => handleSectionComplete('detective', 25)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('detective')
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {completedSections.includes('detective') ? '✓ Maîtrisé ! +25 XP' : 'C\'est clair ! +25 XP'}
            </button>
          </div>
        </section>

        {/* Section 4: Quiz - Lazy Loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <QuizSection onSectionComplete={handleSectionComplete} completedSections={completedSections} />
        </Suspense>
      </div>

      {/* Styles pour les sliders */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
} 