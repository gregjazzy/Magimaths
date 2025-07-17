'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Target, BookOpen, Calculator, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header simple avec bouton retour */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <Link href="/chapitre/nombres-derives-overview" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Retour</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-10">
        
        {/* Section d'introduction avec animation interactive */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
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
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800">🎮 Expérience Interactive</h3>
              <div 
                className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-300 h-64 overflow-hidden cursor-move"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                                 {/* Indicateur de vitesse dans le coin */}
                 <div className={`absolute top-4 right-4 rounded-lg p-4 shadow-lg border-2 transition-all duration-200 ${
                   speed > 50 ? 'bg-red-500 border-red-600 text-white' : 
                   speed > 20 ? 'bg-orange-500 border-orange-600 text-white' : 
                   speed > 5 ? 'bg-green-500 border-green-600 text-white' : 
                   'bg-blue-500 border-blue-600 text-white'
                 }`}>
                   <div className="text-sm font-semibold mb-1">⚡ Vitesse</div>
                   <div className="text-3xl font-bold">
                     {speed.toFixed(0)}
                   </div>
                   <div className="text-xs opacity-80">unités/s</div>
                 </div>

                                 {/* Balle draggable */}
                 <div 
                   className={`absolute rounded-full cursor-move shadow-lg transition-all duration-150 ${
                     speed > 50 ? 'bg-red-500 w-12 h-12' : 
                     speed > 20 ? 'bg-orange-500 w-10 h-10' : 
                     speed > 5 ? 'bg-green-500 w-9 h-9' : 
                     'bg-blue-500 w-8 h-8'
                   }`}
                   style={{
                     left: `${ballPosition.x}px`,
                     top: `${ballPosition.y}px`,
                     transform: 'translate(-50%, -50%)',
                     boxShadow: speed > 20 ? '0 0 20px rgba(255, 255, 255, 0.8)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
                   }}
                   onMouseDown={handleMouseDown}
                 />
                
                {/* Instructions */}
                <div className="absolute bottom-4 left-4 text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-2">
                  🖱️ Cliquez et faites glisser la balle
                </div>
              </div>
            </div>

                        <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800">💡 Concept Clé</h3>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <p className="text-lg font-semibold text-gray-800">
                      Une dérivée = une variation
                    </p>
                  </div>
                  
                  <div className="pl-6 space-y-3">
                    <p className="text-gray-700">
                      <strong>Exemple concret :</strong> La vitesse c'est la variation de la position, c'est donc sa dérivée !
                    </p>
                    
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">Position → Vitesse</div>
                        <div className="text-lg font-bold text-green-600">
                          v(t) = x'(t)
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          La vitesse est la dérivée de la position
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section "Observez bien" sur toute la largeur */}
          <div className="bg-gradient-to-r from-red-100 to-orange-100 p-6 rounded-xl border-4 border-red-400 shadow-lg">
            <h4 className="font-bold text-red-800 mb-4 text-lg text-center flex items-center justify-center">
              🔍 <span className="ml-2">Observez bien :</span>
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center bg-white/70 p-6 rounded-lg text-purple-800 font-semibold">
                <span className="text-4xl mb-3">⚡</span>
                <span className="text-base leading-relaxed">Plus vous bougez vite → plus la vitesse augmente</span>
              </div>
              <div className="flex flex-col items-center text-center bg-white/70 p-6 rounded-lg text-purple-800 font-semibold">
                <span className="text-4xl mb-3">🐌</span>
                <span className="text-base leading-relaxed">Mouvement lent → vitesse faible</span>
              </div>
              <div className="flex flex-col items-center text-center bg-white/70 p-6 rounded-lg text-purple-800 font-semibold">
                <span className="text-4xl mb-3">⏸️</span>
                <span className="text-base leading-relaxed">Balle immobile → vitesse = 0</span>
              </div>
            </div>
          </div>

          <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-200 to-orange-200 p-6 rounded-xl border-4 border-yellow-500 shadow-xl">
                <h4 className="font-bold text-orange-900 mb-4 text-xl flex items-center justify-center">
                  🎯 <span className="ml-2">CONCEPT FONDAMENTAL</span>
                </h4>
                <div className="bg-white/80 p-4 rounded-lg border-2 border-orange-400">
                  <p className="text-orange-900 font-bold text-lg leading-relaxed">
                    Il faut comprendre que la <span className="bg-yellow-300 px-2 py-1 rounded font-black">dérivée c'est une variation</span> (modélisée par le coefficient directeur de la tangente à une courbe - ici la courbe de la position) sur une <span className="bg-red-300 px-2 py-1 rounded font-black">très petite durée</span> ou un <span className="bg-red-300 px-2 py-1 rounded font-black">très petit intervalle proche de 0</span>.
                  </p>
                </div>
              </div>
            </div>
        </section>



        {/* Section récapitulatif final */}
        {chapterCompleted && (
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 shadow-xl text-center">
            <div className="text-6xl mb-4">🎊</div>
            <h2 className="text-3xl font-bold mb-4 text-white">Bravo ! Maîtrise des Nombres Dérivés !</h2>
            <p className="text-xl mb-6 text-white">Tu comprends maintenant la notion fondamentale de dérivée !</p>
            
            <div className="bg-yellow-500 border-2 border-yellow-400 p-4 rounded-2xl mb-6 inline-block">
              <div className="text-2xl font-bold text-yellow-900 mb-2">🏆 Chapitre Maîtrisé !</div>
              <div className="text-lg text-yellow-800">Bonus final : +50 XP</div>
            </div>
            
            <div className="bg-blue-800 p-6 rounded-2xl inline-block border-2 border-blue-400 mx-4">
              <div className="text-4xl font-bold text-white">{xpEarned} XP</div>
              <div className="text-lg text-blue-200">Total gagné</div>
              <div className="text-sm mt-2 text-blue-300">
                Sections: {30 + 35 + 60 + 45} XP + Bonus: 50 XP
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                <span>Retour au sommaire</span>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 