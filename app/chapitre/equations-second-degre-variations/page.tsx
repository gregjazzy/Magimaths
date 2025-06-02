'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Target, Trophy, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function VariationsPage() {
  const [xpEarned, setXpEarned] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [chapterCompleted, setChapterCompleted] = useState(false);
  const [aValue, setAValue] = useState(1);
  const [alpha, setAlpha] = useState(1);
  const [beta, setBeta] = useState(-2);
  const [manivelleTurns, setManivelleTurns] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseAngle, setLastMouseAngle] = useState(0);
  const [exerciseAnswers, setExerciseAnswers] = useState<{[key: string]: any}>({});
  const [exerciseValidated, setExerciseValidated] = useState<{[key: string]: boolean}>({});
  const [exerciseCorrect, setExerciseCorrect] = useState<{[key: string]: boolean}>({});
  const [showCorrection, setShowCorrection] = useState<{[key: string]: boolean}>({});

  // Calcul de l'angle de la souris par rapport au centre de la manivelle
  const calculateMouseAngle = (event: MouseEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  };

  // Conversion de l'angle en valeur de a
  const angleToAValue = (angle: number) => {
    // Normaliser l'angle entre 0 et 360
    const normalizedAngle = ((angle % 360) + 360) % 360;
    // Convertir en valeur de a entre -2 et 2
    const aVal = Math.cos((normalizedAngle * Math.PI) / 180) * 2;
    return Math.round(aVal * 10) / 10; // Arrondir à 1 décimale
  };

  // Gestion du début de la rotation
  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    const angle = calculateMouseAngle(event.nativeEvent, event.currentTarget as HTMLElement);
    setLastMouseAngle(angle);
    event.preventDefault();
  };

  // Gestion de la rotation
  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return;
    
    const manivelle = document.querySelector('.manivelle-handle') as HTMLElement;
    if (!manivelle) return;
    
    const currentAngle = calculateMouseAngle(event, manivelle);
    const angleDelta = currentAngle - lastMouseAngle;
    
    setManivelleTurns(prev => prev + angleDelta);
    setLastMouseAngle(currentAngle);
    
    // Mettre à jour la valeur de a en temps réel
    const newAValue = angleToAValue(manivelleTurns + angleDelta);
    setAValue(newAValue);
  };

  // Gestion de la fin de la rotation
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Ajout des event listeners globaux
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, lastMouseAngle, manivelleTurns]);

  // États détaillés du smiley selon la valeur de a
  const getSmileyState = () => {
    if (aValue >= 2) return { emoji: "😄", mood: "Très content", color: "#16a34a" };
    if (aValue >= 1.5) return { emoji: "😊", mood: "Content", color: "#22c55e" };
    if (aValue >= 1) return { emoji: "🙂", mood: "Souriant", color: "#65a30d" };
    if (aValue >= 0.5) return { emoji: "😐", mood: "Neutre+", color: "#84cc16" };
    if (aValue >= 0.2) return { emoji: "😑", mood: "Légèrement positif", color: "#a3a3a3" };
    if (aValue >= -0.2) return { emoji: "😶", mood: "Neutre", color: "#6b7280" };
    if (aValue >= -0.5) return { emoji: "😕", mood: "Légèrement négatif", color: "#f59e0b" };
    if (aValue >= -1) return { emoji: "🙁", mood: "Pas content", color: "#f97316" };
    if (aValue >= -1.5) return { emoji: "😞", mood: "Triste", color: "#ef4444" };
    return { emoji: "😢", mood: "Très triste", color: "#dc2626" };
  };

  // Génération de la parabole
  const generateParabola = () => {
    const points = [];
    for (let x = -4; x <= 4; x += 0.2) {
      const y = aValue * (x - alpha) ** 2 + beta;
      if (y >= -4 && y <= 4) {
        points.push(`${150 + x * 25},${150 - y * 25}`);
      }
    }
    return points.join(' ');
  };

  // Emoji du smiley selon le signe de a
  const getSmileyEmoji = () => {
    if (aValue > 0) return "😊"; // Sourit (descend puis remonte)
    if (aValue < 0) return "☹️"; // Boude (monte puis descend)
    return "😐"; // Neutre
  };

  // Exercices de variations
  const variationExercises = [
    {
      equation: "f(x) = 2x² - 4x + 1",
      a: 2, alpha: 1, beta: -1,
      variations: aValue > 0 ? "décroissante puis croissante" : "croissante puis décroissante",
      minimum: aValue > 0 ? -1 : null,
      maximum: aValue < 0 ? -1 : null
    },
    {
      equation: "g(x) = -x² + 6x - 5",
      a: -1, alpha: 3, beta: 4,
      variations: aValue < 0 ? "croissante puis décroissante" : "décroissante puis croissante",
      minimum: aValue > 0 ? 4 : null,
      maximum: aValue < 0 ? 4 : null
    },
    {
      equation: "h(x) = 0.5x² + 2x + 3",
      a: 0.5, alpha: -2, beta: 1,
      variations: aValue > 0 ? "décroissante puis croissante" : "croissante puis décroissante",
      minimum: aValue > 0 ? 1 : null,
      maximum: aValue < 0 ? 1 : null
    }
  ];

  const handleSectionComplete = (sectionName: string, xp: number) => {
    if (!completedSections.includes(sectionName)) {
      setCompletedSections(prev => [...prev, sectionName]);
      setXpEarned(prev => prev + xp);
    }
  };

  const validateExercise = (exerciseId: string, correctAnswer: any) => {
    const userAnswer = exerciseAnswers[exerciseId];
    if (!userAnswer) return;

    // Validation complète : type d'extremum, coordonnées α et β, et variations
    const isCorrect = (
      userAnswer.extremumType === correctAnswer.extremumType &&
      userAnswer.alpha === correctAnswer.alpha &&
      userAnswer.beta === correctAnswer.beta &&
      userAnswer.leftVariation === correctAnswer.leftVariation &&
      userAnswer.rightVariation === correctAnswer.rightVariation
    );
    
    setExerciseValidated(prev => ({ ...prev, [exerciseId]: true }));
    setExerciseCorrect(prev => ({ ...prev, [exerciseId]: isCorrect }));

    if (isCorrect) {
      setXpEarned(prev => prev + 15); // 15 XP par exercice complet
    }
  };

  // Bonus XP quand le chapitre est terminé
  useEffect(() => {
    if (completedSections.length >= 4 && !chapterCompleted) {
      setChapterCompleted(true);
      setXpEarned(prev => prev + 50); // Bonus de 50 XP pour avoir terminé le chapitre
    }
  }, [completedSections.length, chapterCompleted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header fixe */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/equations-second-degre" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Retour</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Variations d'une Fonction du Second Degré</h1>
                <p className="text-sm text-gray-600">Tableau de variations • {xpEarned} XP gagnés</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {completedSections.length}/8 sections
            </div>
          </div>
          
          {/* Navigation par onglets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Link href="/chapitre/equations-second-degre" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">1. Intro</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-forme-canonique" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">2. Canonique</span>
            </Link>
            <div className="flex items-center justify-center px-3 py-2 bg-indigo-500 text-white rounded-lg font-medium relative overflow-hidden">
              <span className="text-sm font-semibold">3. Variations</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
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

      <div className="pt-20 max-w-4xl mx-auto p-6 space-y-10">
        
        {/* Section 1: Introduction aux variations */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Découverte</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Les Variations d'une Parabole 📈
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-7 items-start">
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-5 rounded-2xl">
                <h3 className="text-xl font-bold mb-3">Qu'est-ce que les variations ?</h3>
                <p className="text-lg mb-4">
                  Les <strong>variations</strong> décrivent comment la fonction <strong>monte</strong> ou <strong>descend</strong> :
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>📈 Croissante :</strong> la fonction monte (y augmente)</div>
                  <div><strong>📉 Décroissante :</strong> la fonction descend (y diminue)</div>
                  <div><strong>🎯 Extremum :</strong> point le plus haut ou le plus bas</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Les 2 cas selon le signe de a :</h3>
                
                {/* Rappel important sur la forme canonique */}
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                  <div className="font-bold text-yellow-800 flex items-center mb-2">
                    📐 Étape préalable INDISPENSABLE
                  </div>
                  <div className="text-sm text-yellow-700">
                    <strong>Avant d'étudier les variations</strong>, il faut d'abord mettre la fonction sous 
                    <strong> forme canonique</strong> : f(x) = a(x - α)² + β
                    <br />
                    Cela permet d'identifier directement le <strong>sommet (α, β)</strong> de la parabole.
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                    <div className="font-bold text-green-800 flex items-center">
                      😊 Si a &gt; 0 : La parabole "sourit"
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      <strong>Décroissante</strong> puis <strong>croissante</strong>
                      <br />Possède un <strong>minimum</strong> au sommet
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                    <div className="font-bold text-red-800 flex items-center">
                      ☹️ Si a &lt; 0 : La parabole "boude"
                    </div>
                    <div className="text-sm text-red-600 mt-1">
                      <strong>Croissante</strong> puis <strong>décroissante</strong>
                      <br />Possède un <strong>maximum</strong> au sommet
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animation interactive avec vraie manivelle et smiley */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 text-center">🎮 Animation Interactive :</h3>
              
              {/* Vraie manivelle avec base et smiley */}
              <div className="text-center relative">
                <div className="relative inline-block">
                  {/* Tige de la manivelle */}
                  <div className="relative w-2 h-16 bg-gradient-to-b from-gray-400 to-gray-600 mx-auto rounded-full shadow-md">
                    {/* Mécanisme de rotation */}
                    <div 
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 manivelle-handle cursor-grab hover:cursor-grab active:cursor-grabbing"
                      onMouseDown={handleMouseDown}
                      style={{ 
                        transform: `translateX(-50%) rotate(${manivelleTurns}deg)`,
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                      }}
                    >
                      {/* Bras de la manivelle */}
                      <div className="w-16 h-2 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full shadow-lg relative">
                        {/* Poignée interactive */}
                        <div 
                          className={`absolute -right-1 -top-2 w-6 h-6 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-lg border-2 border-red-800 flex items-center justify-center transition-all duration-200 ${
                            isDragging ? 'scale-110 shadow-xl' : 'hover:scale-105 hover:shadow-xl'
                          }`}
                          style={{
                            boxShadow: isDragging ? '0 0 20px rgba(239, 68, 68, 0.8)' : undefined
                          }}
                        >
                          <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
                        </div>
                        {/* Axe central */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-800 rounded-full border border-gray-600"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Base de la manivelle en bas */}
                  <div className="w-24 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg shadow-lg border border-gray-500 mt-2"></div>
                </div>
                
                {/* Indication clignotante pour la manivelle */}
                {!isDragging && (
                  <div className="absolute top-2 -left-2 animate-bounce">
                    <div className="flex items-center space-x-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      <span className="text-lg">👆</span>
                      <span>Tourne-moi !</span>
                    </div>
                    {/* Flèche pointant vers la manivelle */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-yellow-400"></div>
                    </div>
                  </div>
                )}
                
                {/* Instructions avec animation */}
                <div className="mt-4 text-sm text-gray-600">
                  <div className={`font-medium transition-all duration-300 ${isDragging ? 'text-red-600 font-bold' : ''}`}>
                    {isDragging ? 
                      '🎯 Continue de faire tourner la manivelle !' : 
                      '🎮 Clique et fais glisser la poignée rouge pour tourner la manivelle !'
                    }
                  </div>
                  <div className="text-xs mt-1 text-gray-500">
                    Rotation continue • Valeur de a en temps réel
                  </div>
                </div>
              </div>

              {/* Smiley principal avec états détaillés */}
              <div className="text-center">
                <div className="relative inline-block">
                  {/* Smiley avec animation fluide */}
                  <div 
                    className="text-8xl transition-all duration-700 ease-in-out transform"
                    style={{ 
                      filter: `hue-rotate(${aValue * 20}deg) brightness(${1 + Math.abs(aValue) * 0.1})`,
                      transform: `scale(${1 + Math.abs(aValue) * 0.1}) rotate(${aValue * 2}deg)`,
                      textShadow: `0 0 ${Math.abs(aValue) * 10}px ${getSmileyState().color}`
                    }}
                  >
                    {getSmileyState().emoji}
                  </div>
                  
                  {/* Indicateur détaillé de l'état */}
                  <div className="mt-4 space-y-2">
                    <div 
                      className="inline-flex items-center px-6 py-3 rounded-full font-bold text-lg transition-all duration-500 shadow-lg"
                      style={{ 
                        backgroundColor: `${getSmileyState().color}20`,
                        borderColor: getSmileyState().color,
                        border: '2px solid',
                        transform: `scale(${1 + Math.abs(aValue) * 0.05})`
                      }}
                    >
                      <span className="mr-3 text-2xl">{getSmileyState().emoji}</span>
                      <div className="text-left">
                        <div className="font-bold" style={{ color: getSmileyState().color }}>
                          a = {aValue}
                        </div>
                        <div className="text-sm opacity-75" style={{ color: getSmileyState().color }}>
                          {getSmileyState().mood}
                        </div>
                      </div>
                    </div>
                    
                    {/* Barre de progression de l'humeur */}
                    <div className="w-64 mx-auto">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>😢 Très triste</span>
                        <span>😶 Neutre</span>
                        <span>😄 Très content</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500 relative"
                          style={{ 
                            width: `${((aValue + 2) / 4) * 100}%`,
                            backgroundColor: getSmileyState().color,
                            boxShadow: `0 0 10px ${getSmileyState().color}`
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="text-center mt-1">
                        <div 
                          className="inline-block w-2 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            backgroundColor: getSmileyState().color,
                            transform: `translateX(${((aValue + 2) / 4) * 240 - 120}px)`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphique avec animation améliorée */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="bg-white rounded-xl p-4 border-2 border-gray-200 h-72 relative overflow-hidden">
                  {/* Smiley de fond qui suit la courbure */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center text-8xl opacity-40 transition-all duration-700"
                    style={{ 
                      transform: aValue > 0 ? 'scaleY(1) rotate(0deg)' : 'scaleY(-1) rotate(180deg)',
                      filter: `hue-rotate(${aValue * 45}deg) brightness(${Math.abs(aValue) * 0.5 + 0.5})`
                    }}
                  >
                    {getSmileyState().emoji}
                  </div>
                  
                  <svg viewBox="0 0 300 300" className="w-full h-full relative z-10">
                    {/* Grille */}
                    <defs>
                      <pattern id="grid" width="15" height="15" patternUnits="userSpaceOnUse">
                        <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="300" height="300" fill="url(#grid)" />
                    
                    {/* Axes */}
                    <line x1="150" y1="0" x2="150" y2="300" stroke="#9ca3af" strokeWidth="2" />
                    <line x1="0" y1="150" x2="300" y2="150" stroke="#9ca3af" strokeWidth="2" />
                    
                    {/* Parabole avec animation fluide */}
                    <polyline
                      points={generateParabola()}
                      fill="none"
                      stroke={getSmileyState().color}
                      strokeWidth="4"
                      className="drop-shadow-sm"
                      style={{
                        transition: 'stroke 0.5s ease-in-out',
                        filter: `drop-shadow(0 0 ${Math.abs(aValue) * 3}px ${getSmileyState().color})`
                      }}
                    />
                    
                    {/* Sommet avec animation */}
                    <circle
                      cx={150 + alpha * 25}
                      cy={150 - beta * 25}
                      r={8 + Math.abs(aValue)}
                      fill={getSmileyState().color}
                      stroke="white"
                      strokeWidth="3"
                      className="drop-shadow-lg"
                      style={{
                        transition: 'all 0.5s ease-in-out',
                        filter: `drop-shadow(0 0 8px ${getSmileyState().color})`
                      }}
                    />
                    
                    {/* Flèches de variation avec animation fluide */}
                    <g style={{ transition: 'all 0.7s ease-in-out' }}>
                      {aValue > 0 ? (
                        <>
                          <path 
                            d="M 50 50 L 130 130" 
                            stroke="#ef4444" 
                            strokeWidth="3" 
                            markerEnd="url(#arrowRed)"
                            className="animate-pulse"
                            style={{ opacity: Math.abs(aValue) * 0.5 + 0.5 }}
                          />
                          <path 
                            d="M 170 130 L 250 50" 
                            stroke="#10b981" 
                            strokeWidth="3" 
                            markerEnd="url(#arrowGreen)"
                            className="animate-pulse"
                            style={{ opacity: Math.abs(aValue) * 0.5 + 0.5 }}
                          />
                        </>
                      ) : (
                        <>
                          <path 
                            d="M 50 250 L 130 170" 
                            stroke="#10b981" 
                            strokeWidth="3" 
                            markerEnd="url(#arrowGreen)"
                            className="animate-pulse"
                            style={{ opacity: Math.abs(aValue) * 0.5 + 0.5 }}
                          />
                          <path 
                            d="M 170 170 L 250 250" 
                            stroke="#ef4444" 
                            strokeWidth="3" 
                            markerEnd="url(#arrowRed)"
                            className="animate-pulse"
                            style={{ opacity: Math.abs(aValue) * 0.5 + 0.5 }}
                          />
                        </>
                      )}
                    </g>
                    
                    {/* Définition des flèches */}
                    <defs>
                      <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L9,3 z" fill="#ef4444"/>
                      </marker>
                      <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L9,3 z" fill="#10b981"/>
                      </marker>
                    </defs>
                  </svg>
                  
                  {/* Informations sur la fonction avec animation */}
                  <div 
                    className="absolute bottom-2 left-2 bg-white/90 p-3 rounded-lg text-xs transition-all duration-500 shadow-lg"
                    style={{
                      transform: `translateY(${aValue < 0 ? '-10px' : '0'}) scale(${1 + Math.abs(aValue) * 0.1})`,
                      borderColor: getSmileyState().color,
                      borderWidth: '2px',
                      borderStyle: 'solid'
                    }}
                  >
                    <div className="font-bold" style={{ color: getSmileyState().color }}>
                      f(x) = {aValue}(x - {alpha})² + {beta}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {aValue > 0 ? `Minimum en (${alpha}, ${beta})` : `Maximum en (${alpha}, ${beta})`}
                    </div>
                    <div className="text-xs mt-1" style={{ color: getSmileyState().color }}>
                      {getSmileyState().mood}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status de la parabole avec animation détaillée */}
              <div className="text-center">
                <div 
                  className="inline-flex items-center px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-500 transform shadow-lg"
                  style={{ 
                    backgroundColor: `${getSmileyState().color}15`,
                    borderColor: getSmileyState().color,
                    border: '3px solid',
                    transform: `scale(${1 + Math.abs(aValue) * 0.05})`,
                    boxShadow: `0 0 20px ${getSmileyState().color}40`
                  }}
                >
                  <span className="mr-4 text-4xl" style={{ 
                    animation: 'bounce 2s infinite',
                    filter: `drop-shadow(0 0 10px ${getSmileyState().color})`
                  }}>
                    {getSmileyState().emoji}
                  </span>
                  <div className="text-left">
                    <div className="font-bold text-xl" style={{ color: getSmileyState().color }}>
                      {aValue > 0 ? "La parabole SOURIT" : aValue < 0 ? "La parabole BOUDE" : "La parabole est NEUTRE"}
                    </div>
                    <div className="text-sm opacity-75 mt-1" style={{ color: getSmileyState().color }}>
                      {aValue > 0 ? "Descend puis Monte ↘↗" : aValue < 0 ? "Monte puis Descend ↗↘" : "Ni monte ni descend →"}
                    </div>
                    <div className="text-xs mt-1 font-medium" style={{ color: getSmileyState().color }}>
                      État : {getSmileyState().mood} | Rotation : {isDragging ? 'EN COURS' : 'ARRÊTÉE'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('intro-variations', 25)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('intro-variations')
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              {completedSections.includes('intro-variations') ? '✓ Compris ! +25 XP' : 'J\'ai compris ! +25 XP'}
            </button>
          </div>
        </section>

        {/* Section 2: Tableaux de variation - Cas a > 0 */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Cas Positif</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tableau de Variations : a &gt; 0 😊
            </h2>
            <p className="text-gray-600">Quand la parabole "sourit"</p>
          </div>

          <div className="grid md:grid-cols-2 gap-7">
            {/* Explication du tableau */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Comment construire le tableau :</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-100 rounded-lg border border-blue-300">
                  <span className="font-bold text-blue-900">1.</span> <span className="text-gray-800">Trouver α (abscisse du sommet)</span>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                  <span className="font-bold text-yellow-900">2.</span> <span className="text-gray-800">Calculer le minimum β = f(α)</span>
                </div>
                <div className="p-3 bg-green-100 rounded-lg border border-green-300">
                  <span className="font-bold text-green-900">3.</span> <span className="text-gray-800">Dessiner : ↘ puis ↗</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-xl">
                <h4 className="font-bold text-blue-800 mb-2">🎯 Méthode :</h4>
                <div className="text-sm text-blue-700 space-y-2">
                  <div className="p-2 bg-blue-100 rounded-lg border border-blue-400">
                    <span className="font-bold text-blue-900">Étape 0 :</span> <span className="text-gray-800">Mettre sous <strong>forme canonique</strong> f(x) = a(x - α)² + β</span>
                  </div>
                  <div>• <strong>Identifier α</strong> (abscisse du sommet) et <strong>β</strong> (ordonnée du sommet)</div>
                  <div>• À gauche de α : fonction <strong>décroissante</strong> ↘</div>
                  <div>• En α : <strong>minimum</strong> = β</div>
                  <div>• À droite de α : fonction <strong>croissante</strong> ↗</div>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-red-500 text-xl">↘</span>
                  <span className="text-red-700 font-medium">Décroissante</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <span className="text-yellow-500 text-xl">●</span>
                  <span className="text-green-700 font-medium">Minimum en α</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-green-500 text-xl">↗</span>
                  <span className="text-green-700 font-medium">Croissante</span>
                </div>
              </div>
            </div>

            {/* Tableau de variation modèle */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Tableau modèle :</h3>
              <div className="bg-white p-6 rounded-xl border-2 border-gray-300 shadow-lg">
                {/* Titre du tableau */}
                <div className="text-center mb-4">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full">
                    <span className="text-green-800 font-bold">📊 Tableau de Variations (a &gt; 0)</span>
                  </div>
                </div>
                
                {/* Tableau avec design amélioré */}
                <div className="overflow-hidden rounded-lg border-2 border-gray-800 max-w-full">
                  <table className="w-full border-collapse text-sm">
                    {/* En-tête avec les valeurs de x */}
                    <thead>
                      <tr>
                        <th className="w-16 p-3 bg-gray-800 text-white font-bold border-r-2 border-gray-800">
                          x
                        </th>
                        <th className="p-3 bg-gray-50 text-gray-800 font-bold border-r border-gray-400">
                          -∞
                        </th>
                        <th className="p-3 bg-yellow-100 text-yellow-900 font-bold text-lg border-r border-gray-400">
                          α
                        </th>
                        <th className="p-3 bg-gray-50 text-gray-800 font-bold">
                          +∞
                        </th>
                      </tr>
                    </thead>
                    {/* Trait de séparation épais */}
                    <tbody>
                      <tr>
                        <td colSpan={4} className="p-0 bg-gray-900" style={{height: 4}}></td>
                      </tr>
                      {/* Ligne des variations */}
                      <tr>
                        <td className="p-3 bg-gray-800 text-white font-bold border-r-2 border-gray-800">
                          f(x)
                        </td>
                        <td className="p-4 text-center border-r border-gray-400 bg-white relative">
                          {/* Valeur à l'infini en haut à gauche */}
                          <div className="absolute top-1 left-1">
                            <span className="text-xs font-bold text-gray-700">+∞</span>
                          </div>
                          {/* Flèche de variation */}
                          <div className="flex justify-center items-center h-16">
                            <div className="text-center">
                              <div className="text-2xl text-red-500 font-bold">↘</div>
                              <div className="text-xs text-red-600 mt-1">décroît</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center border-r border-gray-400 bg-green-50 relative">
                          {/* Minimum en bas */}
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className="text-center">
                              <div className="text-xs text-green-700 font-bold uppercase mb-1">MIN</div>
                              <div className="text-lg font-bold text-green-800">β</div>
                              <div className="w-2 h-2 bg-green-600 rounded-full mx-auto mt-1"></div>
                            </div>
                          </div>
                          {/* Espace pour le minimum */}
                          <div className="h-16"></div>
                        </td>
                        <td className="p-4 text-center bg-green-50 relative">
                          {/* Valeur à l'infini en haut à droite */}
                          <div className="absolute top-1 right-1">
                            <span className="text-xs font-bold text-gray-700">+∞</span>
                          </div>
                          {/* Flèche de variation */}
                          <div className="flex justify-center items-center h-16">
                            <div className="text-center">
                              <div className="text-2xl text-green-500 font-bold">↗</div>
                              <div className="text-xs text-green-600 mt-1">croît</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* Légende explicative */}
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-red-500 text-xl">↘</span>
                    <span className="text-red-700 font-medium">Décroissante</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span className="text-green-700 font-medium">Minimum en α</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-500 text-xl">↗</span>
                    <span className="text-green-700 font-medium">Croissante</span>
                  </div>
                </div>
              </div>

              {/* Exemple concret amélioré */}
              {/* SUPPRIMÉ : Tableau d'exemple concret */}
            </div>
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('tableau-positif', 30)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('tableau-positif')
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {completedSections.includes('tableau-positif') ? '✓ Maîtrisé ! +30 XP' : 'J\'ai compris ! +30 XP'}
            </button>
          </div>
        </section>

        {/* Section 3: Tableaux de variation - Cas a < 0 */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-full mb-4">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-800">Cas Négatif</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tableau de Variations : a &lt; 0 ☹️
            </h2>
            <p className="text-gray-600">Quand la parabole "boude"</p>
          </div>

          <div className="grid md:grid-cols-2 gap-7">
            {/* Explication du tableau négatif */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Différences importantes :</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-100 rounded-lg border border-blue-300">
                  <span className="font-bold text-blue-900">1.</span> <span className="text-gray-800">Même α (abscisse du sommet)</span>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                  <span className="font-bold text-yellow-900">2.</span> <span className="text-gray-800">Mais β est un <strong>maximum</strong></span>
                </div>
                <div className="p-3 bg-red-100 rounded-lg border border-red-300">
                  <span className="font-bold text-red-900">3.</span> <span className="text-gray-800">Dessiner : ↗ puis ↘</span>
                </div>
              </div>

              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl">
                <h4 className="font-bold text-red-800 mb-2">🎯 Méthode :</h4>
                <div className="text-sm text-red-700 space-y-2">
                  <div className="p-2 bg-red-100 rounded-lg border border-red-400">
                    <span className="font-bold text-red-900">Étape 0 :</span> <span className="text-gray-800">Mettre sous <strong>forme canonique</strong> f(x) = a(x - α)² + β</span>
                  </div>
                  <div>• <strong>Identifier α</strong> (abscisse du sommet) et <strong>β</strong> (ordonnée du sommet)</div>
                  <div>• À gauche de α : fonction <strong>croissante</strong> ↗</div>
                  <div>• En α : <strong>maximum</strong> = β</div>
                  <div>• À droite de α : fonction <strong>décroissante</strong> ↘</div>
                </div>
              </div>
            </div>

            {/* Tableau de variation négatif */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Tableau modèle :</h3>
              <div className="bg-white p-6 rounded-xl border-2 border-gray-300 shadow-lg">
                {/* Titre du tableau */}
                <div className="text-center mb-4">
                  <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-full">
                    <span className="text-red-800 font-bold">📊 Tableau de Variations (a &lt; 0)</span>
                  </div>
                </div>
                
                {/* Tableau avec design amélioré */}
                <div className="overflow-hidden rounded-lg border-2 border-gray-800 max-w-full">
                  <table className="w-full border-collapse text-sm">
                    {/* En-tête avec les valeurs de x */}
                    <thead>
                      <tr>
                        <th className="w-16 p-3 bg-gray-800 text-white font-bold border-r-2 border-gray-800">
                          x
                        </th>
                        <th className="p-3 bg-gray-50 text-gray-800 font-bold border-r border-gray-400">
                          -∞
                        </th>
                        <th className="p-3 bg-yellow-100 text-yellow-900 font-bold text-lg border-r border-gray-400">
                          α
                        </th>
                        <th className="p-3 bg-gray-50 text-gray-800 font-bold">
                          +∞
                        </th>
                      </tr>
                    </thead>
                    {/* Trait de séparation épais */}
                    <tbody>
                      <tr>
                        <td colSpan={4} className="p-0 bg-gray-900" style={{height: 4}}></td>
                      </tr>
                      {/* Ligne des variations */}
                      <tr>
                        <td className="p-3 bg-gray-800 text-white font-bold border-r-2 border-gray-800">
                          f(x)
                        </td>
                        <td className="p-4 text-center border-r border-gray-400 bg-white relative">
                          {/* Valeur à l'infini en haut à gauche */}
                          <div className="absolute top-1 left-1">
                            <span className="text-xs font-bold text-gray-700">+∞</span>
                          </div>
                          {/* Flèche de variation */}
                          <div className="flex justify-center items-center h-16">
                            <div className="text-center">
                              <div className="text-2xl text-red-500 font-bold">↘</div>
                              <div className="text-xs text-red-600 mt-1">décroît</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center border-r border-gray-400 bg-green-50 relative">
                          {/* Minimum en bas */}
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className="text-center">
                              <div className="text-xs text-green-700 font-bold uppercase mb-1">MIN</div>
                              <div className="text-lg font-bold text-green-800">β</div>
                              <div className="w-2 h-2 bg-green-600 rounded-full mx-auto mt-1"></div>
                            </div>
                          </div>
                          {/* Espace pour le minimum */}
                          <div className="h-16"></div>
                        </td>
                        <td className="p-4 text-center bg-green-50 relative">
                          {/* Valeur à l'infini en haut à droite */}
                          <div className="absolute top-1 right-1">
                            <span className="text-xs font-bold text-gray-700">+∞</span>
                          </div>
                          {/* Flèche de variation */}
                          <div className="flex justify-center items-center h-16">
                            <div className="text-center">
                              <div className="text-2xl text-green-500 font-bold">↗</div>
                              <div className="text-xs text-green-600 mt-1">croît</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* Légende explicative */}
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-500 text-xl">↗</span>
                    <span className="text-green-700 font-medium">Croissante</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg border border-red-200">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <span className="text-red-700 font-medium">Maximum en α</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-red-500 text-xl">↘</span>
                    <span className="text-red-700 font-medium">Décroissante</span>
                  </div>
                </div>
              </div>

              {/* Exemple concret négatif amélioré */}
              {/* SUPPRIMÉ : Tableau d'exemple concret négatif */}
            </div>
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('tableau-negatif', 30)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('tableau-negatif')
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {completedSections.includes('tableau-negatif') ? '✓ Maîtrisé ! +30 XP' : 'J\'ai compris ! +30 XP'}
            </button>
          </div>
        </section>

        {/* Section 4: Exercices */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Entraînement</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exercices sur les Variations 🎯
            </h2>
          </div>

          <div className="space-y-5">
            {variationExercises.map((exercise, index) => {
              const exerciseId = `variation-${index}`;
              const isValidated = exerciseValidated[exerciseId];
              const isCorrect = exerciseCorrect[exerciseId];
              
              return (
                <div key={index} className="bg-gradient-to-r from-orange-50 to-yellow-50 p-5 rounded-2xl border-2 border-orange-200">
                  <div className="text-center mb-4">
                    <div className="text-xl font-mono font-bold text-gray-800 mb-2">
                      {exercise.equation}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Étape 1 :</strong> Identifier les coordonnées de l'extremum
                    </div>
                  </div>

                  {/* Interface pour les coordonnées de l'extremum */}
                  <div className="max-w-2xl mx-auto space-y-6">
                    
                    {/* Identification du type d'extremum */}
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-300">
                      <div className="text-center mb-3">
                        <div className="text-lg font-bold text-gray-800">
                          Type d'extremum
                        </div>
                        <div className="text-sm text-gray-500 mb-3">
                          Selon le signe de a = {exercise.a}
                        </div>
                      </div>
                      
                      <div className="flex justify-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`extremum-type-${exerciseId}`}
                            value="minimum"
                            disabled={isValidated}
                            className="mr-2"
                            onChange={(e) => {
                              setExerciseAnswers(prev => ({
                                ...prev,
                                [exerciseId]: { 
                                  ...prev[exerciseId], 
                                  extremumType: e.target.value 
                                }
                              }));
                            }}
                          />
                          <span className={`px-3 py-1 rounded-lg ${exercise.a > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                            Minimum
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`extremum-type-${exerciseId}`}
                            value="maximum"
                            disabled={isValidated}
                            className="mr-2"
                            onChange={(e) => {
                              setExerciseAnswers(prev => ({
                                ...prev,
                                [exerciseId]: { 
                                  ...prev[exerciseId], 
                                  extremumType: e.target.value 
                                }
                              }));
                            }}
                          />
                          <span className={`px-3 py-1 rounded-lg ${exercise.a < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                            Maximum
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Coordonnées de l'extremum */}
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-300">
                      <div className="text-center mb-3">
                        <div className="text-lg font-bold text-gray-800">
                          Coordonnées de l'extremum
                        </div>
                        <div className="text-sm text-gray-500">
                          Mettre d'abord sous forme canonique f(x) = a(x - α)² + β
                        </div>
                      </div>
                      
                      <div className="flex justify-center space-x-6">
                        <div className="text-center">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            α (abscisse)
                          </label>
                          <input
                            type="number"
                            step="any"
                            placeholder="α = ?"
                            disabled={isValidated}
                            className="w-20 px-3 py-2 text-center text-lg font-bold border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none disabled:bg-gray-100"
                            style={{
                              backgroundColor: isValidated ? '#f3f4f6' : '#ffffff',
                              color: '#000000'
                            }}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value)) {
                                setExerciseAnswers(prev => ({
                                  ...prev,
                                  [exerciseId]: { 
                                    ...prev[exerciseId], 
                                    alpha: value 
                                  }
                                }));
                              }
                            }}
                          />
                        </div>
                        
                        <div className="text-center">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            β (ordonnée)
                          </label>
                          <input
                            type="number"
                            step="any"
                            placeholder="β = ?"
                            disabled={isValidated}
                            className="w-20 px-3 py-2 text-center text-lg font-bold border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none disabled:bg-gray-100"
                            style={{
                              backgroundColor: isValidated ? '#f3f4f6' : '#ffffff',
                              color: '#000000'
                            }}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value)) {
                                setExerciseAnswers(prev => ({
                                  ...prev,
                                  [exerciseId]: { 
                                    ...prev[exerciseId], 
                                    beta: value 
                                  }
                                }));
                              }
                            }}
                          />
                        </div>
                      </div>
                      
                      {isValidated && isCorrect && (
                        <div className="text-center mt-3">
                          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                            <span className="mr-2">✓</span>
                            Extremum : ({exercise.alpha}, {exercise.beta})
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tableau de variations à compléter */}
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-300">
                      <div className="text-center mb-3">
                        <div className="text-lg font-bold text-gray-800">
                          Tableau de variations
                        </div>
                        <div className="text-sm text-gray-500">
                          Indiquer le sens de variation
                        </div>
                      </div>
                      
                      <div className="max-w-md mx-auto">
                        <div className="bg-gray-50 rounded-lg border-2 border-gray-300 overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-800 text-white">
                                <th className="p-2 border-r border-gray-600">x</th>
                                <th className="p-2 border-r border-gray-600">-∞</th>
                                <th className="p-2 border-r border-gray-600 bg-yellow-600">α</th>
                                <th className="p-2">+∞</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="p-2 font-bold bg-gray-800 text-white border-r border-gray-600">f(x)</td>
                                <td className="p-3 text-center border-r border-gray-300">
                                  <div className="space-y-1">
                                    <select
                                      disabled={isValidated}
                                      className="w-full p-1 border rounded text-xs"
                                      onChange={(e) => {
                                        setExerciseAnswers(prev => ({
                                          ...prev,
                                          [exerciseId]: { 
                                            ...prev[exerciseId], 
                                            leftVariation: e.target.value 
                                          }
                                        }));
                                      }}
                                    >
                                      <option value="">?</option>
                                      <option value="croissante">Croissante ↗</option>
                                      <option value="decroissante">Décroissante ↘</option>
                                    </select>
                                    {/* Affichage de la flèche sélectionnée */}
                                    <div className="text-lg">
                                      {exerciseAnswers[exerciseId]?.leftVariation === 'croissante' && '↗'}
                                      {exerciseAnswers[exerciseId]?.leftVariation === 'decroissante' && '↘'}
                                      {!exerciseAnswers[exerciseId]?.leftVariation && '?'}
                                    </div>
                                  </div>
                                </td>
                                <td className="p-2 text-center border-r border-gray-300 bg-yellow-100">
                                  <div className="text-xs font-bold">
                                    {isValidated && isCorrect ? 
                                      (exercise.a > 0 ? 'MIN' : 'MAX') : 
                                      '?'
                                    }
                                  </div>
                                  <div className="text-sm font-bold">
                                    {isValidated && isCorrect ? exercise.beta : 'β'}
                                  </div>
                                </td>
                                <td className="p-3 text-center">
                                  <div className="space-y-1">
                                    <select
                                      disabled={isValidated}
                                      className="w-full p-1 border rounded text-xs"
                                      onChange={(e) => {
                                        setExerciseAnswers(prev => ({
                                          ...prev,
                                          [exerciseId]: { 
                                            ...prev[exerciseId], 
                                            rightVariation: e.target.value 
                                          }
                                        }));
                                      }}
                                    >
                                      <option value="">?</option>
                                      <option value="croissante">Croissante ↗</option>
                                      <option value="decroissante">Décroissante ↘</option>
                                    </select>
                                    {/* Affichage de la flèche sélectionnée */}
                                    <div className="text-lg">
                                      {exerciseAnswers[exerciseId]?.rightVariation === 'croissante' && '↗'}
                                      {exerciseAnswers[exerciseId]?.rightVariation === 'decroissante' && '↘'}
                                      {!exerciseAnswers[exerciseId]?.rightVariation && '?'}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Boutons de validation */}
                  <div className="text-center mt-6 space-y-3">
                    {!isValidated ? (
                      <button
                        onClick={() => validateExercise(exerciseId, { 
                          extremumType: exercise.a > 0 ? 'minimum' : 'maximum',
                          alpha: exercise.alpha,
                          beta: exercise.beta,
                          leftVariation: exercise.a > 0 ? 'decroissante' : 'croissante',
                          rightVariation: exercise.a > 0 ? 'croissante' : 'decroissante'
                        })}
                        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-lg"
                      >
                        Vérifier mes réponses
                      </button>
                    ) : (
                      <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                        <div className={`font-bold text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                          {isCorrect ? '🎉 Parfait ! +15 XP' : '❌ Des erreurs à corriger'}
                        </div>
                        
                        {/* Correction détaillée */}
                        <div className="mt-4 p-4 bg-white rounded-lg border-2 border-gray-300">
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                            📝 <span className="ml-2">Correction détaillée :</span>
                          </h4>
                          
                          {/* Étape 1: Forme canonique */}
                          <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-300">
                              <div className="font-bold text-blue-800 mb-2">
                                Étape 1 : Mettre sous forme canonique
                              </div>
                              <div className="text-sm text-blue-700">
                                <div className="font-mono text-base mb-2">{exercise.equation}</div>
                                {exercise.equation === "f(x) = 2x² - 4x + 1" && (
                                  <div className="space-y-1">
                                    <div>• f(x) = 2x² - 4x + 1</div>
                                    <div>• f(x) = 2(x² - 2x) + 1</div>
                                    <div>• f(x) = 2(x² - 2x + 1 - 1) + 1</div>
                                    <div>• f(x) = 2((x - 1)² - 1) + 1</div>
                                    <div>• f(x) = 2(x - 1)² - 2 + 1</div>
                                    <div className="font-bold">• f(x) = 2(x - 1)² - 1</div>
                                  </div>
                                )}
                                {exercise.equation === "g(x) = -x² + 6x - 5" && (
                                  <div className="space-y-1">
                                    <div>• g(x) = -x² + 6x - 5</div>
                                    <div>• g(x) = -(x² - 6x) - 5</div>
                                    <div>• g(x) = -(x² - 6x + 9 - 9) - 5</div>
                                    <div>• g(x) = -((x - 3)² - 9) - 5</div>
                                    <div>• g(x) = -(x - 3)² + 9 - 5</div>
                                    <div className="font-bold">• g(x) = -(x - 3)² + 4</div>
                                  </div>
                                )}
                                {exercise.equation === "h(x) = 0.5x² + 2x + 3" && (
                                  <div className="space-y-1">
                                    <div>• h(x) = 0.5x² + 2x + 3</div>
                                    <div>• h(x) = 0.5(x² + 4x) + 3</div>
                                    <div>• h(x) = 0.5(x² + 4x + 4 - 4) + 3</div>
                                    <div>• h(x) = 0.5((x + 2)² - 4) + 3</div>
                                    <div>• h(x) = 0.5(x + 2)² - 2 + 3</div>
                                    <div className="font-bold">• h(x) = 0.5(x + 2)² + 1</div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Étape 2: Identification du sommet */}
                            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-300">
                              <div className="font-bold text-yellow-800 mb-2">
                                Étape 2 : Identifier le sommet
                              </div>
                              <div className="text-sm text-yellow-700">
                                <div>De la forme canonique f(x) = a(x - α)² + β :</div>
                                <div className="mt-1">
                                  <span className="font-bold">• α = {exercise.alpha}</span> (abscisse du sommet)
                                </div>
                                <div>
                                  <span className="font-bold">• β = {exercise.beta}</span> (ordonnée du sommet)
                                </div>
                                <div className="mt-2 font-bold">
                                  → Sommet : ({exercise.alpha}, {exercise.beta})
                                </div>
                              </div>
                            </div>

                            {/* Étape 3: Type d'extremum */}
                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-300">
                              <div className="font-bold text-purple-800 mb-2">
                                Étape 3 : Déterminer le type d'extremum
                              </div>
                              <div className="text-sm text-purple-700">
                                <div>Coefficient a = {exercise.a}</div>
                                <div className="mt-1">
                                  {exercise.a > 0 ? (
                                    <div>
                                      <span className="font-bold">a &gt; 0</span> → la parabole "sourit" 😊
                                      <br />→ La fonction possède un <span className="font-bold">minimum</span>
                                    </div>
                                  ) : (
                                    <div>
                                      <span className="font-bold">a &lt; 0</span> → la parabole "boude" ☹️
                                      <br />→ La fonction possède un <span className="font-bold">maximum</span>
                                    </div>
                                  )}
                                </div>
                                <div className="mt-2 font-bold">
                                  → {exercise.a > 0 ? 'Minimum' : 'Maximum'} en ({exercise.alpha}, {exercise.beta})
                                </div>
                              </div>
                            </div>

                            {/* Étape 4: Tableau de variations */}
                            <div className="p-3 bg-green-50 rounded-lg border border-green-300">
                              <div className="font-bold text-green-800 mb-2">
                                Étape 4 : Construire le tableau de variations
                              </div>
                              <div className="text-sm text-green-700 space-y-2">
                                <div>
                                  {exercise.a > 0 ? (
                                    <div>
                                      • À gauche de α = {exercise.alpha} : <span className="font-bold">décroissante</span> ↘
                                      <br />• En α = {exercise.alpha} : <span className="font-bold">minimum</span> = {exercise.beta}
                                      <br />• À droite de α = {exercise.alpha} : <span className="font-bold">croissante</span> ↗
                                    </div>
                                  ) : (
                                    <div>
                                      • À gauche de α = {exercise.alpha} : <span className="font-bold">croissante</span> ↗
                                      <br />• En α = {exercise.alpha} : <span className="font-bold">maximum</span> = {exercise.beta}
                                      <br />• À droite de α = {exercise.alpha} : <span className="font-bold">décroissante</span> ↘
                                    </div>
                                  )}
                                </div>
                                
                                {/* Tableau de variations correct */}
                                <div className="mt-3">
                                  <div className="text-center mb-2 font-bold">Tableau de variations correct :</div>
                                  <div className="max-w-xs mx-auto bg-white rounded border-2 border-gray-400 overflow-hidden">
                                    <table className="w-full text-xs">
                                      <thead>
                                        <tr className="bg-gray-700 text-white">
                                          <th className="p-1 border-r border-gray-500">x</th>
                                          <th className="p-1 border-r border-gray-500">-∞</th>
                                          <th className="p-1 border-r border-gray-500 bg-yellow-600">{exercise.alpha}</th>
                                          <th className="p-1">+∞</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td className="p-1 font-bold bg-gray-700 text-white border-r border-gray-500">f(x)</td>
                                          <td className="p-2 text-center border-r border-gray-300">
                                            <div className="text-lg">
                                              {exercise.a > 0 ? '↘' : '↗'}
                                            </div>
                                          </td>
                                          <td className="p-1 text-center border-r border-gray-300 bg-yellow-100">
                                            <div className="text-xs font-bold">
                                              {exercise.a > 0 ? 'MIN' : 'MAX'}
                                            </div>
                                            <div className="text-sm font-bold">
                                              {exercise.beta}
                                            </div>
                                          </td>
                                          <td className="p-2 text-center">
                                            <div className="text-lg">
                                              {exercise.a > 0 ? '↗' : '↘'}
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('exercices-variations', 45)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('exercices-variations')
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {completedSections.includes('exercices-variations') ? '✓ Terminé ! +45 XP' : 'Exercices terminés ! +45 XP'}
            </button>
          </div>
        </section>

        {/* Section récapitulatif final */}
        {completedSections.length >= 4 && (
          <section className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-3xl p-7 shadow-xl text-center">
            <div className="text-6xl mb-4">🎊</div>
            <h2 className="text-3xl font-bold mb-4">Bravo ! Tu maîtrises les variations !</h2>
            <p className="text-xl mb-6">Tu sais maintenant analyser le comportement d'une parabole !</p>
            
            {chapterCompleted && (
              <div className="bg-yellow-400/20 border-2 border-yellow-300 p-4 rounded-2xl mb-6">
                <div className="text-2xl font-bold text-yellow-200 mb-2">🏆 Chapitre Terminé !</div>
                <div className="text-lg text-yellow-100">Bonus : +50 XP</div>
              </div>
            )}
            
            <div className="bg-white/20 p-6 rounded-2xl inline-block">
              <div className="text-4xl font-bold">{xpEarned} XP</div>
              <div className="text-lg">Total gagné</div>
              <div className="text-sm mt-2 text-white/80">
                Sections: {25 + 30 + 30 + 45} XP + Exercices + Bonus: 50 XP
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/chapitre/equations-second-degre"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                <span>Retour au chapitre principal</span>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 