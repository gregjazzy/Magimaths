'use client';

import { useState } from 'react';
import { Play, Lightbulb, Target, Trophy, ChevronRight } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';
import { motion } from 'framer-motion';

export default function FormeCanoniquePage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [exerciseType, setExerciseType] = useState<'simple' | 'complex'>('simple');
  const [canonicalParams, setCanonicalParams] = useState({ alpha: 0, beta: 0, a: 1 });

  const simpleExercises = [
    {
      equation: "x² + 6x + 5",
      steps: [
        { text: "x² + 6x + 5", highlight: "none", explanation: "Équation de départ" },
        { text: "x² + 6x + 9 - 9 + 5", highlight: "add", explanation: "On ajoute et soustrait (6/2)² = 9" },
        { text: "(x + 3)² - 9 + 5", highlight: "factor", explanation: "On factorise x² + 6x + 9 = (x + 3)²" },
        { text: "(x + 3)² - 4", highlight: "final", explanation: "Forme canonique : α = -3, β = -4" }
      ],
      alpha: -3,
      beta: -4
    },
    {
      equation: "x² - 4x + 7",
      steps: [
        { text: "x² - 4x + 7", highlight: "none", explanation: "Équation de départ" },
        { text: "x² - 4x + 4 - 4 + 7", highlight: "add", explanation: "On ajoute et soustrait (-4/2)² = 4" },
        { text: "(x - 2)² - 4 + 7", highlight: "factor", explanation: "On factorise x² - 4x + 4 = (x - 2)²" },
        { text: "(x - 2)² + 3", highlight: "final", explanation: "Forme canonique : α = 2, β = 3" }
      ],
      alpha: 2,
      beta: 3
    }
  ];

  const complexExercises = [
    {
      equation: "2x² + 8x + 3",
      steps: [
        { 
          text: "2x² + 8x + 3",
          highlight: "none",
          explanation: "Équation de départ"
        },
        { 
          text: "2(x² + 8x/2) + 3",
          highlight: "factor-a",
          explanation: "On factorise le coefficient a = 2"
        },
        { 
          text: "2(x² + 8x/2 + 16/4 - 16/4) + 3",
          highlight: "add",
          explanation: "Dans la parenthèse : on ajoute et soustrait (8/2)² = 16/4"
        },
        { 
          text: "2((x + 2)² - 4) + 3",
          highlight: "factor",
          explanation: "On factorise x² + 4x + 4 = (x + 2)²"
        },
        { 
          text: "2(x + 2)² - 8 + 3",
          highlight: "distribute",
          explanation: "On distribue le 2"
        },
        { 
          text: "2(x + 2)² - 20/4",
          highlight: "delta",
          explanation: "On fait apparaître Δ = b² - 4ac = 64 - 24 = 40, donc -Δ/4a = -40/8 = -5"
        },
        { 
          text: "2(x + 2)² - 5",
          highlight: "delta-final",
          explanation: "On obtient la forme a(x + b/2a)² - Δ/4a"
        },
        { 
          text: "2(x - (-2))² - 5",
          highlight: "final",
          explanation: "Forme canonique : α = -2 = -b/2a, β = -5 = -Δ/4a"
        }
      ],
      alpha: -2,
      beta: -5
    }
  ];

  const simpleTrainingExercises = [
    {
      equation: "x² + 8x + 12",
      steps: [
        { text: "x² + 8x + 12", explanation: "Équation de départ" },
        { text: "x² + 8x + 16 - 16 + 12", explanation: "On ajoute et soustrait (8/2)² = 16" },
        { text: "(x + 4)² - 16 + 12", explanation: "On utilise l'identité remarquable : x² + 8x + 16 = (x + 4)²" },
        { text: "(x + 4)² - 4", explanation: "On simplifie : -16 + 12 = -4" }
      ],
      alpha: -4,
      beta: -4
    },
    {
      equation: "x² - 6x + 10",
      steps: [
        { text: "x² - 6x + 10", explanation: "Équation de départ" },
        { text: "x² - 6x + 9 - 9 + 10", explanation: "On ajoute et soustrait (-6/2)² = 9" },
        { text: "(x - 3)² - 9 + 10", explanation: "On utilise l'identité remarquable : x² - 6x + 9 = (x - 3)²" },
        { text: "(x - 3)² + 1", explanation: "On simplifie : -9 + 10 = 1" }
      ],
      alpha: 3,
      beta: 1
    },
    {
      equation: "x² + 10x + 21",
      steps: [
        { text: "x² + 10x + 21", explanation: "Équation de départ" },
        { text: "x² + 10x + 25 - 25 + 21", explanation: "On ajoute et soustrait (10/2)² = 25" },
        { text: "(x + 5)² - 25 + 21", explanation: "On utilise l'identité remarquable : x² + 10x + 25 = (x + 5)²" },
        { text: "(x + 5)² - 4", explanation: "On simplifie : -25 + 21 = -4" }
      ],
      alpha: -5,
      beta: -4
    },
    {
      equation: "x² - 2x + 5",
      steps: [
        { text: "x² - 2x + 5", explanation: "Équation de départ" },
        { text: "x² - 2x + 1 - 1 + 5", explanation: "On ajoute et soustrait (-2/2)² = 1" },
        { text: "(x - 1)² - 1 + 5", explanation: "On utilise l'identité remarquable : x² - 2x + 1 = (x - 1)²" },
        { text: "(x - 1)² + 4", explanation: "On simplifie : -1 + 5 = 4" }
      ],
      alpha: 1,
      beta: 4
    }
  ];

  const complexTrainingExercises = [
    {
      equation: "3x² + 12x + 7",
      steps: [
        { text: "3x² + 12x + 7", explanation: "Équation de départ" },
        { text: "3(x² + 4x) + 7", explanation: "On factorise par a = 3" },
        { text: "3(x² + 4x + 4 - 4) + 7", explanation: "Dans la parenthèse : (4/2)² = 4" },
        { text: "3((x + 2)² - 4) + 7", explanation: "On utilise l'identité remarquable : x² + 4x + 4 = (x + 2)²" },
        { text: "3(x + 2)² - 12 + 7", explanation: "On distribue le 3" },
        { text: "3(x + 2)² - 5", explanation: "On simplifie : -12 + 7 = -5" }
      ],
      alpha: -2,
      beta: -5,
      a: 3
    },
    {
      equation: "-2x² + 8x - 3",
      steps: [
        { text: "-2x² + 8x - 3", explanation: "Équation de départ" },
        { text: "-2(x² - 4x) - 3", explanation: "On factorise par a = -2" },
        { text: "-2(x² - 4x + 4 - 4) - 3", explanation: "Dans la parenthèse : (-4/2)² = 4" },
        { text: "-2((x - 2)² - 4) - 3", explanation: "On utilise l'identité remarquable : x² - 4x + 4 = (x - 2)²" },
        { text: "-2(x - 2)² + 8 - 3", explanation: "On distribue le -2" },
        { text: "-2(x - 2)² + 5", explanation: "On simplifie : 8 - 3 = 5" }
      ],
      alpha: 2,
      beta: 5,
      a: -2
    },
    {
      equation: "4x² - 16x + 11",
      steps: [
        { text: "4x² - 16x + 11", explanation: "Équation de départ" },
        { text: "4(x² - 4x) + 11", explanation: "On factorise par a = 4" },
        { text: "4(x² - 4x + 4 - 4) + 11", explanation: "Dans la parenthèse : (-4/2)² = 4" },
        { text: "4((x - 2)² - 4) + 11", explanation: "On utilise l'identité remarquable : x² - 4x + 4 = (x - 2)²" },
        { text: "4(x - 2)² - 16 + 11", explanation: "On distribue le 4" },
        { text: "4(x - 2)² - 5", explanation: "On simplifie : -16 + 11 = -5" }
      ],
      alpha: 2,
      beta: -5,
      a: 4
    },
    {
      equation: "-x² + 6x - 8",
      steps: [
        { text: "-x² + 6x - 8", explanation: "Équation de départ" },
        { text: "-(x² - 6x) - 8", explanation: "On factorise par a = -1" },
        { text: "-(x² - 6x + 9 - 9) - 8", explanation: "Dans la parenthèse : (-6/2)² = 9" },
        { text: "-((x - 3)² - 9) - 8", explanation: "On utilise l'identité remarquable : x² - 6x + 9 = (x - 3)²" },
        { text: "-(x - 3)² + 9 - 8", explanation: "On distribue le -1" },
        { text: "-(x - 3)² + 1", explanation: "On simplifie : 9 - 8 = 1" }
      ],
      alpha: 3,
      beta: 1,
      a: -1
    }
  ];

  const getHighlightClass = (highlight: string) => {
    switch (highlight) {
      case 'add': return 'bg-yellow-300 text-yellow-900 font-semibold';
      case 'factor': return 'bg-green-300 text-green-900 font-semibold';
      case 'factor-a': return 'bg-blue-300 text-blue-900 font-semibold';
      case 'distribute': return 'bg-orange-300 text-orange-900 font-semibold';
      case 'delta': return 'bg-indigo-300 text-indigo-900 font-semibold';
      case 'delta-final': return 'bg-purple-300 text-purple-900 font-semibold';
      case 'final': return 'bg-red-300 text-red-900 font-semibold';
      default: return 'text-gray-800';
    }
  };

  const generateCanonicalParabola = () => {
    const points = [];
    for (let x = -5; x <= 5; x += 0.2) {
      const y = canonicalParams.a * (x - canonicalParams.alpha) ** 2 + canonicalParams.beta;
      if (y >= -5 && y <= 5) {
        points.push(`${150 + x * 30},${150 - y * 30}`);
      }
    }
    return points.join(' ');
  };

  const sections = [
    {
      id: 'introduction',
      title: 'Qu\'est-ce que la forme canonique ? 🎯',
      icon: '🔍',
      content: (
        <div className="space-y-2 sm:space-y-8">
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-8">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 sm:p-6 rounded-lg sm:rounded-2xl shadow-lg">
              <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">Forme canonique</h3>
              <div className="bg-white/10 backdrop-blur-sm p-2 sm:p-6 rounded sm:rounded-xl mb-2 sm:mb-6 border border-white/20">
                <div className="font-mono text-sm sm:text-2xl text-center">f(x) = <span className="text-cyan-300">a</span>(x - <span className="text-pink-300 font-bold">α</span>)² + <span className="text-purple-300 font-bold">β</span></div>
                </div>
              <div className="grid grid-cols-3 gap-1 sm:gap-4 mb-2 sm:mb-6">
                <div className="text-center">
                  <div className="w-6 h-6 sm:w-12 sm:h-12 bg-cyan-500/20 rounded sm:rounded-xl flex items-center justify-center mx-auto mb-0.5 sm:mb-2 border border-cyan-500/30">
                    <span className="font-mono font-bold text-cyan-300 text-xs sm:text-base">a</span>
              </div>
                  <span className="text-[10px] sm:text-sm text-cyan-100">coef</span>
                </div>
                <div className="text-center">
                  <div className="w-6 h-6 sm:w-12 sm:h-12 bg-pink-500/20 rounded sm:rounded-xl flex items-center justify-center mx-auto mb-0.5 sm:mb-2 border border-pink-500/30">
                    <span className="font-mono font-bold text-pink-300 text-xs sm:text-base">α</span>
                </div>
                  <span className="text-[10px] sm:text-sm text-pink-100">abs</span>
                </div>
                <div className="text-center">
                  <div className="w-6 h-6 sm:w-12 sm:h-12 bg-purple-500/20 rounded sm:rounded-xl flex items-center justify-center mx-auto mb-0.5 sm:mb-2 border border-purple-500/30">
                    <span className="font-mono font-bold text-purple-300 text-xs sm:text-base">β</span>
                  </div>
                  <span className="text-[10px] sm:text-sm text-purple-100">ord</span>
              </div>
            </div>

              <div className="flex justify-between items-center bg-white/10 p-1.5 sm:p-4 rounded sm:rounded-xl">
                <div className="flex items-center gap-1 sm:gap-3">
                  <span className="text-pink-300 font-bold text-xs sm:text-xl">α</span>
                  <span className="text-white text-xs sm:text-base">=</span>
                  <div className="flex flex-col items-center">
                    <span className="text-cyan-300 border-b border-cyan-300 px-0.5 sm:px-2 text-xs sm:text-base">-b</span>
                    <span className="text-cyan-300 text-xs sm:text-base">2a</span>
                </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-3">
                  <span className="text-purple-300 font-bold text-xs sm:text-xl">β</span>
                  <span className="text-white text-xs sm:text-base">=</span>
                  <div className="flex flex-col items-center">
                    <span className="text-cyan-300 border-b border-cyan-300 px-0.5 sm:px-2 text-xs sm:text-base">-Δ</span>
                    <span className="text-cyan-300 text-xs sm:text-base">4a</span>
                </div>
              </div>
            </div>
          </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">Représentation graphique</h3>
              <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-6 rounded-lg sm:rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <svg viewBox="0 0 300 300" className="w-full max-w-[300px] mx-auto">
                  {/* Grille de fond */}
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                    </pattern>
                    <linearGradient id="parabola-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#67e8f9', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#f0abfc', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <rect width="300" height="300" fill="url(#grid)" className="opacity-50" />

                  {/* Axes */}
                  <line x1="0" y1="150" x2="300" y2="150" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  <line x1="150" y1="0" x2="150" y2="300" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>

                  {/* Labels des axes */}
                  <text x="85" y="165" className="text-xs font-mono fill-pink-300">α</text>
                  <text x="160" y="85" className="text-xs font-mono fill-purple-300">β</text>

                  {/* Parabole */}
                  <path 
                    d="M 30 150 Q 90 -50 150 150" 
                    fill="none" 
                    stroke="url(#parabola-gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Point S et coordonnées */}
                  <text x="90" y="40" className="text-sm font-mono" fill="#f0abfc">S(α,β)</text>

                  {/* Point sommet */}
                  <circle
                    cx="90"
                    cy="50"
                    r="4"
                    fill="#f0abfc"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <animate
                      attributeName="r"
                      values="4;5;4"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Lignes pointillées */}
                  <line
                    x1="90"
                    y1="50"
                    x2="90"
                    y2="150"
                    stroke="#f0abfc"
                    strokeWidth="1.5"
                    strokeDasharray="4"
                    className="opacity-60"
                  />
                  <line
                    x1="90"
                    y1="50"
                    x2="150"
                    y2="50"
                    stroke="#f0abfc"
                    strokeWidth="1.5"
                    strokeDasharray="4"
                    className="opacity-60"
                  />
                  
                  {/* Labels des coordonnées */}
                  <text x="85" y="165" className="text-sm font-mono fill-yellow-300">α</text>
                  <text x="160" y="55" className="text-sm font-mono fill-yellow-300">β</text>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-6 rounded-r-lg">
            <h4 className="font-bold text-yellow-800 mb-2 sm:mb-3"></h4>
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="text-center bg-white/5 p-2 rounded-lg">
                <div className="font-bold text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">Forme développée</div>
                <div className="font-mono text-base sm:text-lg text-blue-600 tracking-wider">
                  <span className="text-blue-500">a</span>x² + 
                  <span className="text-blue-500">b</span>x + 
                  <span className="text-blue-500">c</span>
                </div>
              </div>
              <div className="text-center bg-white/5 p-2 rounded-lg">
                <div className="font-bold text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">Forme canonique</div>
                <div className="font-mono text-base sm:text-lg text-purple-600 tracking-wider">
                  <span className="text-purple-500">a</span>(x - 
                  <span className="text-purple-500">α</span>)² + 
                  <span className="text-purple-500">β</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 20
    },
    {
      id: 'method-transformation',
      title: 'Transformation animée ✨',
      icon: '🎯',
      content: (
        <div className="space-y-2 sm:space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 sm:p-6 rounded-xl sm:rounded-2xl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Comment passer à la forme canonique ?</h3>
              <p className="text-xs sm:text-base text-blue-200">Transformation étape par étape</p>
            </motion.div>
          </div>

          <div className="grid gap-2 sm:gap-6">
            {/* Étape 1: Forme initiale */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5,
                delay: 0.3,
                type: "spring",
                stiffness: 100
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 sm:p-6 rounded-lg sm:rounded-xl text-white"
            >
              <div className="text-xs sm:text-sm text-blue-200 mb-1 sm:mb-2">On part de la forme développée</div>
              <div className="font-mono text-sm sm:text-2xl text-center relative">
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ delay: 0.5 }}
                  className="text-cyan-300 cursor-pointer"
                  onAnimationComplete={() => {
                    // Créer un clone qui se déplace vers l'étape suivante
                    const clone = document.createElement('span');
                    clone.textContent = 'a';
                    clone.style.position = 'absolute';
                    clone.style.color = 'rgb(103, 232, 249)';
                    document.body.appendChild(clone);
                    
                    const rect = clone.getBoundingClientRect();
                    const target = document.querySelector('.step-2-a');
                    if (!target) return;
                    const targetRect = target.getBoundingClientRect();
                    
                    clone.animate([
                      { transform: `translate(${rect.left}px, ${rect.top}px)` },
                      { transform: `translate(${targetRect.left}px, ${targetRect.top}px)` }
                    ], {
                      duration: 1000,
                      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                      fill: 'forwards'
                    });
                    
                    setTimeout(() => document.body.removeChild(clone), 1000);
                  }}
                >a</motion.span>
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ delay: 0.6 }}
                >x²</motion.span>
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                > + </motion.span>
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ delay: 0.8 }}
                  className="text-pink-300 cursor-pointer"
                >b</motion.span>
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ delay: 0.9 }}
                >x</motion.span>
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                > + </motion.span>
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ delay: 1.1 }}
                  className="text-purple-300 cursor-pointer"
                >c</motion.span>
                </div>
            </motion.div>

            {/* Étape 2: Factorisation */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5,
                delay: 1.3,
                type: "spring",
                stiffness: 100
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 sm:p-6 rounded-lg sm:rounded-xl text-white"
            >
              <div className="text-xs sm:text-sm text-pink-200 mb-1 sm:mb-2">On factorise par a</div>
              <div className="font-mono text-sm sm:text-2xl text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="relative"
                >
                  <motion.div
                    className="step-2-a absolute -left-4 -top-4 w-8 h-8 rounded-full bg-cyan-500/20"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{
                      delay: 1.6,
                      duration: 0.5,
                      times: [0, 0.8, 1]
                    }}
                  />
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.7 }}
                    className="text-cyan-300"
                  >a</motion.span>
                  <motion.div
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      delay: 1.8,
                      duration: 0.3,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="inline-block"
                  >(</motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 1.9,
                      duration: 0.3,
                      type: "spring"
                    }}
                    className="inline-block"
                  >
                    x² + 
                    <motion.span
                      initial={{ color: "#ec4899" }}
                      animate={{ color: "#ffffff" }}
                      transition={{ delay: 2.0, duration: 0.3 }}
                    >b</motion.span>
                    x
                  </motion.div>
                  <motion.div
                    initial={{ scaleX: 0, originX: 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      delay: 2.1,
                      duration: 0.3,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="inline-block"
                  >)</motion.div>
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 2.2,
                      duration: 0.3,
                      type: "spring"
                    }}
                  > + 
                    <motion.span
                      initial={{ color: "#9333ea" }}
                      animate={{ color: "#ffffff" }}
                      transition={{ delay: 2.3, duration: 0.3 }}
                    >c</motion.span>
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>

            {/* Étape 3: Complétion du carré */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2 sm:p-6 rounded-lg sm:rounded-xl text-white"
            >
              <div className="text-xs sm:text-sm text-purple-200 mb-1 sm:mb-2">On complète le carré</div>
              <div className="font-mono text-sm sm:text-2xl text-center">
                <span className="text-cyan-300">a</span>(x² 
                <div className="inline-flex items-center">
                  <div className="flex items-center">
                    <span className="flex flex-col items-center">
                      <span className="h-[1px] invisible">x</span>
                      <span className="text-white">+</span>
                      <span className="h-[1px] invisible">x</span>
                    </span>
                    <span className="text-pink-300 flex flex-col items-center">
                      <span className="border-b border-pink-300">b</span>
                      <span>a</span>
                    </span>
                </div>
                </div>x
                <div className="inline-flex items-center">
                  <div className="flex items-center">
                    <span className="flex flex-col items-center">
                      <span className="h-[1px] invisible">x</span>
                      <span className="text-white">+</span>
                      <span className="h-[1px] invisible">x</span>
                    </span>
                    <span className="text-yellow-300 flex flex-col items-center">
                      <span className="border-b border-yellow-300">b²</span>
                      <span>4a²</span>
                    </span>
              </div>
                </div>
                <div className="inline-flex items-center">
                  <div className="flex items-center">
                    <span className="flex flex-col items-center">
                      <span className="h-[1px] invisible">x</span>
                      <span className="text-white">-</span>
                      <span className="h-[1px] invisible">x</span>
                    </span>
                    <span className="text-yellow-300 flex flex-col items-center">
                      <span className="border-b border-yellow-300">b²</span>
                      <span>4a²</span>
                    </span>
              </div>
                </div>)
                <div className="inline-flex items-center">
                  <div className="flex items-center">
                    <span className="flex flex-col items-center">
                      <span className="h-[1px] invisible">x</span>
                      <span className="text-white">+</span>
                      <span className="h-[1px] invisible">x</span>
                    </span>
                    <span className="text-purple-300">c</span>
                </div>
              </div>
                </div>
            </motion.div>

            {/* Étape 4: Factorisation du trinôme */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="bg-gradient-to-r from-indigo-500 to-blue-600 p-2 sm:p-6 rounded-lg sm:rounded-xl text-white"
            >
              <div className="text-xs sm:text-sm text-indigo-200 mb-1 sm:mb-2">On factorise le trinôme</div>
              <div className="font-mono text-sm sm:text-2xl text-center">
                <span className="text-cyan-300">a</span>
                <span className="relative">
                  (x
                  <div className="inline-flex items-center mx-1">
                    <div className="flex items-center">
                      <span className="flex flex-col items-center">
                        <span className="h-[1px] invisible">x</span>
                        <span className="text-white">+</span>
                        <span className="h-[1px] invisible">x</span>
                      </span>
                      <span className="text-pink-300 flex flex-col items-center">
                        <span className="border-b border-pink-300">b</span>
                        <span>2a</span>
                      </span>
                  </div>
                  </div>)
                  <span className="absolute -top-2 -right-2">²</span>
                </span>
                <span className="mx-4">
                  <div className="inline-flex items-center">
                    <div className="flex items-center">
                      <span className="flex flex-col items-center px-2">
                        <span className="h-[1px] invisible">x</span>
                        <span className="text-white">−</span>
                        <span className="h-[1px] invisible">x</span>
                      </span>
                      <span className="text-yellow-300 flex flex-col items-center">
                        <span className="border-b border-yellow-300">b²</span>
                        <span>4a</span>
                      </span>
                    </div>
                  </div>
                </span>
                <span className="mx-2">
                  <div className="inline-flex items-center">
                    <div className="flex items-center">
                      <span className="flex flex-col items-center">
                        <span className="h-[1px] invisible">x</span>
                        <span className="text-white">+</span>
                        <span className="h-[1px] invisible">x</span>
                      </span>
                      <span className="text-purple-300">c</span>
                </div>
            </div>
                </span>
          </div>
            </motion.div>

            {/* Étape 5: Forme finale */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-6 rounded-lg sm:rounded-xl text-white border border-white/20"
            >
              <div className="text-xs sm:text-sm text-blue-200 mb-1 sm:mb-2">Forme canonique finale</div>
              <div className="font-mono text-sm sm:text-2xl text-center">
                <span className="text-cyan-300">a</span>(x
                <div className="inline-flex items-center">
                  <div className="flex items-center">
                    <span className="flex flex-col items-center">
                      <span className="h-[1px] invisible">x</span>
                      <span className="text-white">-</span>
                      <span className="h-[1px] invisible">x</span>
                    </span>
                    <span className="text-pink-300">α</span>
                </div>
                </div>)²
                <div className="inline-flex items-center">
                  <div className="flex items-center">
                    <span className="flex flex-col items-center">
                      <span className="h-[1px] invisible">x</span>
                      <span className="text-white">+</span>
                      <span className="h-[1px] invisible">x</span>
                    </span>
                    <span className="text-purple-300">β</span>
              </div>
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="mt-4 text-center text-sm"
              >
                <div className="inline-flex items-center gap-4 bg-white/10 px-4 py-2 rounded-full">
                  <div className="flex items-center gap-1">
                    <span className="text-pink-300">α</span>
                    <span className="text-white">=</span>
                    <div className="flex items-center">
                      <span className="text-pink-300 flex flex-col items-center">
                        <span className="h-[1px] invisible">x</span>
                        <span className="text-white">-</span>
                        <span className="h-[1px] invisible">x</span>
                      </span>
                      <span className="text-pink-300 flex flex-col items-center">
                        <span className="border-b border-pink-300">b</span>
                        <span>2a</span>
                      </span>
                </div>
              </div>
                  <span className="text-white">•</span>
                  <div className="flex items-center gap-1">
                    <span className="text-purple-300">β</span>
                    <span className="text-white">=</span>
                    <div className="flex items-center">
                      <span className="text-purple-300 flex flex-col items-center">
                        <span className="h-[1px] invisible">x</span>
                        <span className="text-white">-</span>
                        <span className="h-[1px] invisible">x</span>
                      </span>
                      <span className="text-purple-300 flex flex-col items-center">
                        <span className="border-b border-purple-300">Δ</span>
                        <span>4a</span>
                      </span>
                </div>
              </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Note explicative */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1 }}
              className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-2 sm:p-6 rounded-lg sm:rounded-xl border border-yellow-500/30"
            >
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <span className="text-yellow-600 text-sm sm:text-base">💡</span>
                <span className="font-bold text-yellow-800 text-xs sm:text-base">À retenir</span>
              </div>
              <p className="text-xs sm:text-sm text-yellow-900">
                La forme canonique met en évidence le sommet de la parabole grâce aux coordonnées 
                (<span className="text-pink-600">α</span>, <span className="text-purple-600">β</span>). 
                Elle permet de visualiser directement la position et la hauteur du sommet !
              </p>
            </motion.div>
            </div>
          </div>
      ),
      xpReward: 30
    },
    {
      id: 'example-complex',
      title: 'Exemple',
      icon: '🧮',
      content: (
          <div className="bg-orange-50 p-2 sm:p-6 rounded-lg sm:rounded-xl border sm:border-2 border-orange-300">
          <h4 className="font-bold text-orange-800 text-sm sm:text-base mb-2 sm:mb-4">Exemple détaillé</h4>
            <div className="space-y-2 sm:space-y-4">
              {complexExercises[0].steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2 sm:space-x-4 p-2 sm:p-3 bg-white rounded-lg border">
                  <div className="bg-orange-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className={`font-mono text-[10px] sm:text-lg ${getHighlightClass(step.highlight)}`}>
                      {step.text}
                    </div>
                    <div className="text-[9px] sm:text-sm text-gray-600 mt-0.5 sm:mt-1">{step.explanation}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ),
      xpReward: 20
    },
    {
      id: 'interactive-graph',
      title: 'Graphique Interactif 📊',
      icon: '📈',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-3 sm:p-6 rounded-xl sm:rounded-2xl">
            <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-3">Visualisation de la forme canonique</h3>
            <p className="text-sm sm:text-lg">
              Explorez comment α et β influencent la position du sommet !
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-gray-300">
            <div className="text-center mb-4">
              <div className="font-mono text-lg font-bold text-purple-600">
                f(x) = {canonicalParams.a}(x - {canonicalParams.alpha})² + {canonicalParams.beta}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Sommet : ({canonicalParams.alpha}, {canonicalParams.beta})
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">a = {canonicalParams.a}</label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.5"
                  value={canonicalParams.a}
                  onChange={(e) => setCanonicalParams(prev => ({ ...prev, a: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-1">Ouverture/orientation</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">α = {canonicalParams.alpha}</label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={canonicalParams.alpha}
                  onChange={(e) => setCanonicalParams(prev => ({ ...prev, alpha: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-1">Position horizontale</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">β = {canonicalParams.beta}</label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={canonicalParams.beta}
                  onChange={(e) => setCanonicalParams(prev => ({ ...prev, beta: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-1">Position verticale</div>
              </div>
            </div>

            <svg viewBox="0 0 300 300" className="w-full h-64 bg-gray-50 rounded-lg border">
              <defs>
                <pattern id="canonical-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="300" height="300" fill="url(#canonical-grid)" />
              
              <line x1="0" y1="150" x2="300" y2="150" stroke="#6b7280" strokeWidth="2" opacity="0.7"/>
              <line x1="150" y1="0" x2="150" y2="300" stroke="#6b7280" strokeWidth="2" opacity="0.7"/>
              
              <polyline
                points={generateCanonicalParabola()}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              <circle 
                cx={150 + canonicalParams.alpha * 30} 
                cy={150 - canonicalParams.beta * 30} 
                r="6" 
                fill="#ef4444" 
                stroke="white" 
                strokeWidth="2"
              />
              <text 
                x={150 + canonicalParams.alpha * 30 + 10} 
                y={150 - canonicalParams.beta * 30 - 10} 
                fontSize="12" 
                fill="#ef4444" 
                fontWeight="bold"
              >
                S({canonicalParams.alpha}, {canonicalParams.beta})
              </text>
            </svg>
          </div>
        </div>
      ),
      xpReward: 20
    },
    {
      id: 'exercises-first',
      title: 'Exercices 1 à 4',
      icon: '📝',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Première série d'exercices</h3>
            <p className="text-lg">
              Transformez ces équations en forme canonique
            </p>
          </div>

                     <div className="grid gap-6">
             {simpleTrainingExercises.map((exercise, index) => (
               <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                 <div className="text-center mb-6">
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">
                     Exercice {index + 1}
                   </h3>
                   <div className="font-mono text-xl text-gray-800">
                     {exercise.equation}
                   </div>
                   <p className="text-gray-600 mt-2">Mettez cette équation sous forme canonique</p>
                 </div>

                 {showSolution && currentExercise === index && (
                 <div className="space-y-4 mb-6">
                   <div className="bg-blue-50 p-4 rounded-lg">
                       <h4 className="font-bold text-blue-800 mb-3">🎯 Solution détaillée :</h4>
                     <div className="space-y-2">
                       {exercise.steps.map((step, stepIndex) => (
                         <div key={stepIndex} className="p-3 bg-white rounded border-l-4 border-blue-400">
                           <div className="font-mono font-bold text-gray-800">{step.text}</div>
                           <div className="text-sm text-gray-600">{step.explanation}</div>
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="bg-green-50 p-4 rounded-lg">
                     <h4 className="font-bold text-green-800 mb-3">📝 Résultat :</h4>
                     <div className="text-center">
                       <div className="font-mono text-xl font-bold text-green-600">
                         α = {exercise.alpha}, β = {exercise.beta}
                       </div>
                       <div className="font-mono text-lg text-gray-700 mt-2">
                         Forme canonique : (x - ({exercise.alpha}))² + ({exercise.beta})
                       </div>
                     </div>
                   </div>
                   </div>
                 )}

                 <div className="flex justify-center mt-4">
                   <button
                     onClick={() => {
                       setCurrentExercise(index);
                       setShowSolution(!showSolution);
                     }}
                     className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                   >
                     {showSolution && currentExercise === index ? "Masquer la correction" : "Voir la correction"}
                   </button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      ),
      xpReward: 35
    },
    {
      id: 'exercises-second',
      title: 'Exercices 5 à 8',
      icon: '📝',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-3 sm:p-6 rounded-xl sm:rounded-2xl">
            <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-3">Deuxième série d'exercices</h3>
            <p className="text-sm sm:text-lg">
              Transformez ces équations en forme canonique
            </p>
          </div>

                     <div className="grid gap-6">
             {complexTrainingExercises.map((exercise, index) => (
               <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                 <div className="text-center mb-6">
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">
                     Exercice {index + 5}
                   </h3>
                   <div className="font-mono text-xl text-gray-800">
                     {exercise.equation}
                   </div>
                   <p className="text-gray-600 mt-2">Mettez cette équation sous forme canonique</p>
                 </div>

                 {showSolution && currentExercise === index + 4 && (
                 <div className="space-y-4 mb-6">
                   <div className="bg-orange-50 p-4 rounded-lg">
                       <h4 className="font-bold text-orange-800 mb-3">🎯 Solution détaillée :</h4>
                     <div className="space-y-2">
                       {exercise.steps.map((step, stepIndex) => (
                         <div key={stepIndex} className="p-3 bg-white rounded border-l-4 border-orange-400">
                           <div className="font-mono font-bold text-gray-800">{step.text}</div>
                           <div className="text-sm text-gray-600">{step.explanation}</div>
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="bg-green-50 p-4 rounded-lg">
                     <h4 className="font-bold text-green-800 mb-3">📝 Résultat :</h4>
                     <div className="text-center">
                       <div className="font-mono text-xl font-bold text-green-600">
                         a = {exercise.a}, α = {exercise.alpha}, β = {exercise.beta}
                       </div>
                       <div className="font-mono text-lg text-gray-700 mt-2">
                         Forme canonique : {exercise.a}(x - ({exercise.alpha}))² + ({exercise.beta})
                       </div>
                     </div>
                   </div>
                   </div>
                 )}

                 <div className="flex justify-center mt-4">
                   <button
                     onClick={() => {
                       setCurrentExercise(index + 4);
                       setShowSolution(!showSolution);
                     }}
                     className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                   >
                     {showSolution && currentExercise === index + 4 ? "Masquer la correction" : "Voir la correction"}
                   </button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      ),
      xpReward: 45
    }
  ];

  return (
    <ChapterLayout
      title="Forme Canonique"
      description="Transformer une fonction du second degré en forme canonique"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/equations-second-degre-overview', text: 'Vue d\'ensemble' },
        next: { href: '/chapitre/equations-second-degre-variations', text: 'Variations' },
        backToTop: { href: '/chapitre/equations-second-degre-overview', text: 'Retour au sommaire' }
      }}
    />
  );
} 