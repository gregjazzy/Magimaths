'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Target, BookOpen, Calculator, TrendingUp, Zap, Gauge } from 'lucide-react';
import Link from 'next/link';
import CollapsibleNavigation from '@/app/components/CollapsibleNavigation';

export default function NombresDerivesPage() {
  const [xpEarned, setXpEarned] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [chapterCompleted, setChapterCompleted] = useState(false);
  
  // États pour l'animation de la balle
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 128 });
  const [speed, setSpeed] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [positionHistory, setPositionHistory] = useState<Array<{x: number, y: number, timestamp: number}>>([]);

  const handleSectionComplete = (sectionName: string, xp: number) => {
    if (!completedSections.includes(sectionName)) {
      setCompletedSections(prev => [...prev, sectionName]);
      setXpEarned(prev => prev + xp);
    }
  };

  // Bonus XP quand le chapitre est terminé
  useEffect(() => {
    if (completedSections.length >= 4 && !chapterCompleted) {
      setChapterCompleted(true);
      setXpEarned(prev => prev + 50);
    }
  }, [completedSections.length, chapterCompleted]);

  // Calcul de la vitesse moyenne sur 500ms
  useEffect(() => {
    const now = Date.now();
    
    // Ajouter la position actuelle à l'historique
    setPositionHistory(prev => {
      const newHistory = [...prev, { x: ballPosition.x, y: ballPosition.y, timestamp: now }];
      
      // Garder seulement les positions des 500 dernières millisecondes
      const filtered = newHistory.filter(pos => now - pos.timestamp <= 500);
      
      // Calculer la vitesse moyenne si on a assez de données
      if (filtered.length >= 2 && isDragging) {
        const oldest = filtered[0];
        const newest = filtered[filtered.length - 1];
        
        const deltaX = newest.x - oldest.x;
        const deltaY = newest.y - oldest.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const deltaTime = (newest.timestamp - oldest.timestamp) / 1000; // en secondes
        
        if (deltaTime > 0) {
          const avgSpeed = (distance / deltaTime) * 2; // Facteur d'échelle pour visibilité
          setSpeed(avgSpeed);
        }
      } else if (!isDragging) {
        // Décélération progressive quand on ne bouge plus
        setSpeed(prev => Math.max(0, prev * 0.85));
      }
      
      return filtered;
    });
  }, [ballPosition, isDragging]);

  // Gestionnaires pour le drag de la balle
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newX = Math.max(16, Math.min(rect.width - 16, e.clientX - rect.left));
      const newY = Math.max(16, Math.min(rect.height - 16, e.clientY - rect.top));
      
      setBallPosition({ x: newX, y: newY });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Particules de fond pour l'effet magique */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-40 right-40 w-32 h-32 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header simple avec bouton retour */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <Link href="/chapitre/nombres-derives-overview" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Retour</span>
        </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-10 relative z-10">
        
        {/* Section d'introduction avec animation interactive */}
        <section className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Concept Fondamental</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎯 Une dérivée, c'est une variation !
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Bougez la balle et observez comment la vitesse change selon votre mouvement
            </p>
          </div>

          {/* Animation interactive avec la balle */}
          <div className="relative bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Interaction : Bougez la balle ! 🎮
              </h3>
              <p className="text-gray-600 text-sm">
                Cliquez et faites glisser pour voir comment la vitesse change
              </p>
                 </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-300 h-64 overflow-hidden cursor-move">
                <div className="absolute top-4 right-4 bg-blue-500 text-white rounded-lg p-4 shadow-lg">
                  <div className="text-sm font-semibold mb-1">⚡ Vitesse</div>
                  <div className="text-2xl font-bold">Interactive</div>
                  <div className="text-xs opacity-80">Bougez la souris !</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full shadow-lg"></div>
                </div>
                <div className="absolute bottom-4 left-4 text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-2">
                  🖱️ Zone interactive pour visualiser la dérivée
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800 text-center">
                💡 <strong>Observation :</strong> Plus vous bougez rapidement la balle, plus la vitesse (dérivée) est grande !
              </p>
            </div>
                  </div>
                  
          {/* Explication conceptuelle */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Que venez-vous de découvrir ?
            </h3>
            <div className="space-y-3 text-green-700">
              <p className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">📈</span>
                <span>La <strong>dérivée</strong> mesure la rapidité de variation d'une fonction</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">⚡</span>
                <span>Plus la variation est rapide, plus la dérivée est <strong>grande</strong></span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">🎯</span>
                <span>La dérivée en un point = la <strong>pente de la tangente</strong> en ce point</span>
              </p>
            </div>
          </div>
        </section>

        {/* Section sur la vitesse */}
        <section className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <Gauge className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Vitesse et Position</span>
                        </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🏃‍♂️ La vitesse : première dérivée de la position
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Découvrez le lien fondamental entre position et vitesse
            </p>
                        </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Graphique de position */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📍 Position en fonction du temps</h3>
              <div className="h-64 bg-white rounded-xl p-4 flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-lg font-bold text-gray-800">Graphique de position</div>
                  <div className="text-sm text-gray-600">x(t) = t² + 2t + 1</div>
                      </div>
                    </div>
              <p className="text-sm text-gray-600 mt-3 text-center">
                Courbe de position : x(t) = t² + 2t + 1
              </p>
                  </div>

            {/* Graphique de vitesse */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Vitesse (dérivée de la position)</h3>
              <div className="h-64 bg-white rounded-xl p-4 flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <div className="text-4xl mb-2">📈</div>
                  <div className="text-lg font-bold text-gray-800">Graphique de vitesse</div>
                  <div className="text-sm text-gray-600">v(t) = 2t + 2</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center">
                Courbe de vitesse : v(t) = 2t + 2
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4">
              🔗 Relation position-vitesse
            </h3>
            <div className="space-y-3 text-purple-700">
              <p className="flex items-start space-x-2">
                <span className="text-purple-600 mt-1">🎯</span>
                <span>La vitesse est la <strong>dérivée de la position</strong> : v(t) = x'(t)</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-purple-600 mt-1">📊</span>
                <span>Graphiquement : la vitesse = <strong>pente de la tangente</strong> à la courbe de position</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-purple-600 mt-1">⚡</span>
                <span>Plus la position change rapidement, plus la vitesse est <strong>élevée</strong></span>
              </p>
            </div>
          </div>
        </section>

        {/* Section sur la pente de la tangente */}
        <section className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-800">Interprétation Géométrique</span>
              </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📐 La dérivée = pente de la tangente
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Visualisez comment la dérivée correspond à la pente de la tangente
            </p>
              </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              🎮 Déplacez le point pour voir la tangente et sa pente
            </h3>
            <div className="h-80 bg-white rounded-xl p-4 flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <div className="text-5xl mb-4">📐</div>
                <div className="text-lg font-bold text-gray-800">Tangente interactive</div>
                <div className="text-sm text-gray-600">Visualisation de la pente</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center">
              La pente de la tangente = valeur de la dérivée au point choisi
            </p>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="text-lg font-bold text-blue-800 mb-3">📈 Pente positive</h4>
              <p className="text-blue-700 text-sm">
                Fonction <strong>croissante</strong><br/>
                Dérivée &gt; 0<br/>
                Tangente monte vers la droite
                  </p>
                </div>

            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-3">➡️ Pente nulle</h4>
              <p className="text-gray-700 text-sm">
                Fonction <strong>stationnaire</strong><br/>
                Dérivée = 0<br/>
                Tangente horizontale
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
              <h4 className="text-lg font-bold text-red-800 mb-3">📉 Pente négative</h4>
              <p className="text-red-700 text-sm">
                Fonction <strong>décroissante</strong><br/>
                Dérivée &lt; 0<br/>
                Tangente descend vers la droite
              </p>
              </div>
            </div>
        </section>

        {/* Section récapitulative */}
        <section className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Récapitulatif</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎯 Ce que vous avez appris
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📚 Concepts clés</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <div>
                    <p className="font-semibold text-blue-800">Dérivée = Variation</p>
                    <p className="text-sm text-blue-700">Mesure la rapidité de changement</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div>
                    <p className="font-semibold text-orange-800">Vitesse = Dérivée de la position</p>
                    <p className="text-sm text-orange-700">Relation physique fondamentale</p>
                  </div>
            </div>
            
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <div>
                    <p className="font-semibold text-purple-800">Dérivée = Pente de la tangente</p>
                    <p className="text-sm text-purple-700">Interprétation géométrique</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Applications</h3>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">🏃‍♂️</span>
                  <span><strong>Physique :</strong> Vitesse, accélération, forces</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">📊</span>
                  <span><strong>Économie :</strong> Taux de croissance, optimisation</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">🔬</span>
                  <span><strong>Sciences :</strong> Réactions chimiques, populations</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="text-orange-600 mt-1">🏗️</span>
                  <span><strong>Ingénierie :</strong> Optimisation, modélisation</span>
                </p>
              </div>
            </div>
            </div>
          </section>
      </div>
    </div>
  );
} 