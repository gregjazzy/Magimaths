'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Star, CheckCircle, Play, Volume2 } from 'lucide-react'

export default function CPCalculMental() {
  const [mounted, setMounted] = useState(false)
  const [showContent, setShowContent] = useState('cours') // 'cours' ou 'sections'
  
  // États pour le système audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Refs pour contrôler les vocaux et animations
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setMounted(true)
  }, [])

  const sections = [
    {
      id: 'additions-simples',
      title: 'Additions simples',
      description: 'Apprendre à calculer rapidement des additions jusqu\'à 20',
      icon: '➕',
      duration: '12 min',
      xp: 20,
      color: 'from-green-500 to-emerald-500',
      verified: true
    },
    {
      id: 'soustractions-simples',
      title: 'Soustractions simples',
      description: 'Calculer des soustractions rapidement jusqu\'à 20',
      icon: '➖',
      duration: '12 min',
      xp: 20,
      color: 'from-red-500 to-pink-500',
      verified: true
    },
    {
      id: 'complements-10',
      title: 'Compléments à 10',
      description: 'Trouver rapidement ce qui manque pour faire 10',
      icon: '🔟',
      duration: '10 min',
      xp: 15,
      color: 'from-blue-500 to-cyan-500',
      verified: true
    },
    {
      id: 'doubles-moities',
      title: 'Doubles et moitiés',
      description: 'Maîtriser les doubles et leurs moitiés',
      icon: '🔄',
      duration: '8 min',
      xp: 15,
      color: 'from-purple-500 to-violet-500',
      verified: true
    },
    {
      id: 'multiplications-2-5-10',
      title: 'Tables de 2, 5 et 10',
      description: 'Premières tables de multiplication simples',
      icon: '✖️',  
      duration: '15 min',
      xp: 25,
      color: 'from-orange-500 to-red-500',
      verified: true
    }
  ]

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    setIsPlayingVocal(false);
    setHighlightedElement(null);
  };

  // Fonction pour jouer un audio avec gestion d'interruption
  const playAudio = async (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (stopSignalRef.current) {
          resolve();
          return;
        }

        if (speechSynthesis.speaking || speechSynthesis.pending) {
          speechSynthesis.cancel();
        }
        
        if (!('speechSynthesis' in window)) {
          console.warn('Speech synthesis not supported');
          resolve();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        const voices = speechSynthesis.getVoices();
        const bestFrenchVoice = voices.find(voice => 
          (voice.lang === 'fr-FR' || voice.lang === 'fr') && 
          voice.name.toLowerCase().includes('audrey')
        ) || voices.find(voice => 
          voice.lang === 'fr-FR'
        );
        
        if (bestFrenchVoice) {
          utterance.voice = bestFrenchVoice;
        }
        
        currentAudioRef.current = utterance;

        utterance.onend = () => {
          currentAudioRef.current = null;
          if (!stopSignalRef.current) {
            resolve();
          }
        };

        utterance.onerror = (event) => {
          console.error('Erreur speech synthesis:', event);
          currentAudioRef.current = null;
          reject(event);
        };

        if (voices.length === 0) {
          speechSynthesis.addEventListener('voiceschanged', () => {
            if (!stopSignalRef.current) {
              speechSynthesis.speak(utterance);
            }
          }, { once: true });
        } else {
          speechSynthesis.speak(utterance);
        }

      } catch (error) {
        console.error('Erreur playAudio:', error);
        currentAudioRef.current = null;
        reject(error);
      }
    });
  };

  // Fonction d'attente avec vérification d'interruption
  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      setTimeout(() => {
        if (!stopSignalRef.current) {
          resolve();
        }
      }, ms);
    });
  };

  // Fonction pour expliquer le chapitre au démarrage
  const explainChapter = async () => {
    console.log('📖 explainChapter - Début explication calcul mental');
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);

    try {
      await playAudio("Bonjour ! Bienvenue dans le chapitre sur le calcul mental !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("Le calcul mental, c'est comme un super-pouvoir pour ton cerveau !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      setHighlightedElement('pourquoi-section');
      await playAudio("Mais pourquoi apprendre le calcul mental ? C'est très important !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Imagine que tu es au magasin avec tes parents. Tu veux acheter 2 bonbons à 3 euros chacun !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      await playAudio("Avec le calcul mental, tu peux tout de suite dire : 3 plus 3 égale 6 euros !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      setHighlightedElement('exemple-section');
      await playAudio("Regarde cet exemple : pour calculer 7 plus 4, tu peux faire 7 plus 3 égale 10, puis 10 plus 1 égale 11 !");
      if (stopSignalRef.current) return;
      await wait(2500);
      
      await playAudio("C'est ça la magie du calcul mental : trouver des astuces pour calculer plus vite !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      setHighlightedElement('trucs-section');
      await playAudio("J'ai plein de trucs géniaux pour t'aider !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("Par exemple, les doubles comme 5 plus 5, ou les compléments à 10 comme 7 plus 3 !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      setHighlightedElement('sections-list');
      await playAudio("Tu peux maintenant choisir par quelle technique commencer !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("Je te conseille de commencer par les additions simples, puis d'explorer toutes les autres !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      setHighlightedElement(null);
      await playAudio("Alors, es-tu prêt à développer ton super-pouvoir mathématique ?");
      if (stopSignalRef.current) return;
      await wait(2000);

    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      setIsPlayingVocal(false);
      setHighlightedElement(null);
    }
  };

  // EFFET pour arrêter les audios lors du changement de page/onglet
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopAllVocalsAndAnimations();
    };
  }, []);

  const getSectionPath = (sectionId: string) => {
    return `/chapitre/cp-calcul-mental/${sectionId}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/cp" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au CP</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🧠 Calcul Mental CP
            </h1>
            <p className="text-lg text-gray-600">
              Développe tes réflexes mathématiques !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et sections */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowContent('cours');
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showContent === 'cours'
                  ? 'bg-cyan-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowContent('sections');
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showContent === 'sections'
                  ? 'bg-cyan-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🎯 Sections ({sections.length})
            </button>
          </div>
        </div>

        {showContent === 'cours' ? (
          /* COURS */
          <div className="space-y-8">
            {/* Bouton Démarrer */}
            <div className="text-center mb-8">
              <button
                onClick={explainChapter}
                disabled={isPlayingVocal}
                className={`bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-12 py-6 rounded-2xl font-bold text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed animate-pulse' : 'hover:from-cyan-600 hover:to-blue-600 animate-bounce'
                }`}
                style={{
                  animationDuration: isPlayingVocal ? '1s' : '2s',
                  animationIterationCount: 'infinite'
                }}
              >
                <Volume2 className={`inline w-8 h-8 mr-4 ${isPlayingVocal ? 'animate-spin' : ''}`} />
                {isPlayingVocal ? '🎤 JE PARLE...' : (hasStarted ? '🔄 RECOMMENCER !' : '🎉 DÉMARRER !')}
              </button>
              <p className="text-lg text-gray-600 mt-4 font-semibold">
                {isPlayingVocal 
                  ? "🔊 Écoute bien l'explication..." 
                  : (hasStarted 
                    ? "Clique pour réécouter l'explication !" 
                    : "Clique ici pour commencer ton aventure avec le calcul mental !")}
              </p>
            </div>

            {/* Indicateur audio global */}
            {hasStarted && isPlayingVocal && (
              <div className="fixed top-4 right-4 bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
                <Volume2 className="inline w-5 h-5 mr-2 animate-spin" />
                🎤 Audio en cours...
              </div>
            )}

            {/* Pourquoi apprendre le calcul mental */}
            <div 
              id="pourquoi-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'pourquoi-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🤔 Pourquoi apprendre le calcul mental ?
              </h2>
              
              <div className="bg-cyan-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-cyan-800 font-semibold mb-4">
                  Le calcul mental, c'est comme un super-pouvoir !
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🛒</div>
                    <div className="font-bold text-cyan-600 mb-1">Au magasin</div>
                    <div className="text-sm text-gray-600">Calculer le prix rapidement !</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🎮</div>
                    <div className="font-bold text-cyan-600 mb-1">Dans les jeux</div>
                    <div className="text-sm text-gray-600">Compter tes points !</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">⏰</div>
                    <div className="font-bold text-cyan-600 mb-1">Plus rapide</div>
                    <div className="text-sm text-gray-600">Pas besoin de papier !</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exemple concret */}
            <div 
              id="exemple-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'exemple-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Exemple : 7 + 4 = ?
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-center space-y-6">
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                    <h4 className="text-lg font-bold text-blue-800 mb-4">🧠 Technique du complément à 10</h4>
                    
                    <div className="space-y-4">
                      <div className="flex justify-center items-center space-x-4">
                        <div className="bg-blue-100 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">7 + 4</div>
                        </div>
                        <div className="text-2xl">→</div>
                        <div className="bg-green-100 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-green-600">7 + 3 + 1</div>
                          <div className="text-sm text-gray-600">Sépare 4 en 3+1</div>
                        </div>
                      </div>
                      
                      <div className="text-2xl">↓</div>
                      
                      <div className="flex justify-center items-center space-x-4">
                        <div className="bg-yellow-100 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-yellow-600">10 + 1</div>
                          <div className="text-sm text-gray-600">7 + 3 = 10</div>
                        </div>
                        <div className="text-2xl">=</div>
                        <div className="bg-purple-100 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-purple-600">11</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                    <p className="text-lg font-bold text-green-800 text-center">
                      ✨ Tu arrives au résultat plus facilement en passant par 10 !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trucs et astuces */}
            <div 
              id="trucs-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'trucs-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                💡 Astuces de calcul mental
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">
                    🎯 Techniques de base
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li>🔟 Compléments à 10 : 7+3, 6+4, 8+2</li>
                    <li>👥 Doubles : 5+5=10, 6+6=12</li>
                    <li>🚀 Commencer par le plus grand : 3+8 = 8+3</li>
                    <li>📏 Décomposer : 7+5 = 7+3+2 = 10+2</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-purple-800">
                    🧠 Trucs de pro
                  </h3>
                  <ul className="space-y-2 text-purple-700">
                    <li>⚡ Pour +9 : +10 puis -1</li>
                    <li>🎯 Pour +1 : le nombre suivant</li>
                    <li>🔄 Les suites : 2, 4, 6, 8, 10...</li>
                    <li>⭐ Visualiser avec tes doigts</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mini-jeu */}
            <div className="bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3 text-center">🎮 Mini-jeu : Calcul rapide !</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { calc: '5 + 5', answer: '10', technique: 'Double' },
                  { calc: '7 + 3', answer: '10', technique: 'Complément' },
                  { calc: '6 + 4', answer: '10', technique: 'Complément' },
                  { calc: '8 + 2', answer: '10', technique: 'Complément' }
                ].map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                    <div className="font-bold mb-1">{item.calc}</div>
                    <div className="text-2xl font-bold mb-1">= {item.answer}</div>
                    <div className="text-xs opacity-90">{item.technique}</div>
                  </div>
                ))}
              </div>
              <p className="text-center mt-4 text-lg font-semibold">
                🌟 Maintenant, maîtrise toutes les techniques !
              </p>
            </div>
          </div>
        ) : (
          /* SECTIONS */
          <div className="space-y-8">
            {/* Badge niveau */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-yellow-700">Niveau CP</span>
              </div>
            </div>

            {/* Sections Grid */}
            <div 
              id="sections-list"
              className={`transition-all duration-500 ${
                highlightedElement === 'sections-list' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105 rounded-lg p-4' : ''
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    onClick={() => window.location.href = getSectionPath(section.id)}
                  >
                    {/* Header de la section */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        {section.icon}
                      </div>
                      <div className="flex items-center space-x-2">
                        {section.verified && (
                          <CheckCircle className="w-5 h-5 text-green-500 fill-current" />
                        )}
                        <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{section.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-lg sm:text-xl text-gray-800 group-hover:text-gray-900 transition-colors leading-tight">
                          {section.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mt-1 leading-relaxed">
                          {section.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 bg-amber-100 px-2 py-1 rounded-full">
                            <Star className="w-3 h-3 text-amber-500 fill-current" />
                            <span className="text-xs font-medium text-amber-700">+{section.xp} XP</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-blue-600 group-hover:text-blue-700 transition-colors">
                          <Play className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">Commencer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section conseils */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                  💡 Conseils pour réussir
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Quelques astuces pour développer tes compétences en calcul mental
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <div className="text-2xl sm:text-3xl mb-2">🎯</div>
                  <div className="font-bold text-sm sm:text-base mb-1">Concentre-toi</div>
                  <div className="text-xs sm:text-sm opacity-90">Évite les distractions pendant les exercices</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl mb-2">🚀</div>
                  <div className="font-bold text-sm sm:text-base mb-1">Progresse</div>
                  <div className="text-xs sm:text-sm opacity-90">Commence facile, puis augmente la difficulté</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl mb-2">🔄</div>
                  <div className="font-bold text-sm sm:text-base mb-1">Entraîne-toi</div>
                  <div className="text-xs sm:text-sm opacity-90">Quelques minutes chaque jour</div>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <div className="text-2xl sm:text-3xl mb-2">😊</div>
                  <div className="font-bold text-sm sm:text-base mb-1">Amuse-toi</div>
                  <div className="text-xs sm:text-sm opacity-90">Les maths, c'est un jeu !</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 