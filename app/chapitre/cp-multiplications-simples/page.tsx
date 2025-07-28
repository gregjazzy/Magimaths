'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Star, CheckCircle, Play, Volume2 } from 'lucide-react'

export default function CPMultiplicationsSimples() {
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
      id: 'sens-multiplication',
      title: 'Le sens de la multiplication',
      description: 'Comprendre ce que veut dire multiplier avec des objets',
      icon: '🤔',
      duration: '8 min',
      xp: 15,
      color: 'from-pink-500 to-rose-500',
      verified: true
    },
    {
      id: 'groupes-egaux',
      title: 'Groupes égaux',
      description: 'Faire des groupes qui ont le même nombre d\'objets',
      icon: '👥',
      duration: '10 min',
      xp: 18,
      color: 'from-blue-500 to-cyan-500',
      verified: true
    },
    {
      id: 'addition-repetee',
      title: 'Addition répétée',
      description: 'Additionner le même nombre plusieurs fois',
      icon: '🔄',
      duration: '12 min',
      xp: 20,
      color: 'from-purple-500 to-violet-500',
      verified: true
    },
    {
      id: 'table-2',
      title: 'Table de 2',
      description: 'Apprendre à compter de 2 en 2',
      icon: '2️⃣',
      duration: '15 min',
      xp: 25,
      color: 'from-green-500 to-emerald-500',
      verified: true
    },
    {
      id: 'table-5',
      title: 'Table de 5',
      description: 'Apprendre à compter de 5 en 5',
      icon: '5️⃣',
      duration: '15 min',
      xp: 25,
      color: 'from-yellow-500 to-orange-500',
      verified: true
    },
    {
      id: 'table-10',
      title: 'Table de 10',
      description: 'Apprendre à compter de 10 en 10',
      icon: '🔟',
      duration: '12 min',
      xp: 22,
      color: 'from-indigo-500 to-blue-500',
      verified: true
    },
    {
      id: 'problemes-simples',
      title: 'Problèmes simples',
      description: 'Résoudre des petits problèmes de multiplication',
      icon: '🧩',
      duration: '18 min',
      xp: 30,
      color: 'from-red-500 to-pink-500',
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
    console.log('📖 explainChapter - Début explication multiplications simples');
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);

    try {
      await playAudio("Bonjour ! Bienvenue dans le chapitre sur les multiplications simples !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("La multiplication, c'est une façon magique de compter plus vite !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      setHighlightedElement('pourquoi-section');
      await playAudio("Mais pourquoi apprendre les multiplications ? Elles sont partout !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Imagine que tu veux compter tes jouets. Tu as 3 boîtes avec 4 voitures chacune !");
      if (stopSignalRef.current) return;
      await wait(2200);
      
      await playAudio("Au lieu de compter 4 plus 4 plus 4, tu peux dire : 3 fois 4 égale 12 ! C'est magique !");
      if (stopSignalRef.current) return;
      await wait(2500);
      
      setHighlightedElement('groupes-section');
      await playAudio("Regarde ces groupes ! 3 groupes de 4 objets, ça fait 12 en tout !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      await playAudio("C'est ça la multiplication : compter des groupes égaux !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      setHighlightedElement('trucs-section');
      await playAudio("J'ai plein d'astuces pour t'aider à devenir un champion des multiplications !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("Par exemple, la table de 2, c'est comme compter tes chaussettes par paires !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      setHighlightedElement('sections-list');
      await playAudio("Maintenant, tu peux choisir par où commencer ton aventure !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Je te conseille de commencer par comprendre le sens de la multiplication !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      setHighlightedElement(null);
      await playAudio("Es-tu prêt à devenir un super multiplicateur ?");
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
    return `/chapitre/cp-multiplications-simples/${sectionId}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
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
              ✖️ Multiplications Simples
            </h1>
            <p className="text-lg text-gray-600">
              Découvre la magie de multiplier pour compter plus vite !
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
                  ? 'bg-pink-500 text-white shadow-md' 
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
                  ? 'bg-pink-500 text-white shadow-md' 
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
                className={`bg-gradient-to-r from-pink-500 to-purple-500 text-white px-12 py-6 rounded-2xl font-bold text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed animate-pulse' : 'hover:from-pink-600 hover:to-purple-600 animate-bounce'
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
                    : "Clique ici pour découvrir la magie des multiplications !")}
              </p>
            </div>

            {/* Indicateur audio global */}
            {hasStarted && isPlayingVocal && (
              <div className="fixed top-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
                <Volume2 className="inline w-5 h-5 mr-2 animate-spin" />
                🎤 Audio en cours...
              </div>
            )}

            {/* Pourquoi apprendre les multiplications */}
            <div 
              id="pourquoi-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'pourquoi-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🤔 Pourquoi apprendre les multiplications ?
              </h2>
              
              <div className="bg-pink-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-pink-800 font-semibold mb-4">
                  Les multiplications, c'est compter super vite !
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🧸</div>
                    <div className="font-bold text-pink-600 mb-1">Tes jouets</div>
                    <div className="text-sm text-gray-600">3 boîtes de 4 voitures !</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🍪</div>
                    <div className="font-bold text-pink-600 mb-1">Les gâteaux</div>
                    <div className="text-sm text-gray-600">2 plateaux de 6 cookies !</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">👥</div>
                    <div className="font-bold text-pink-600 mb-1">Tes amis</div>
                    <div className="text-sm text-gray-600">5 groupes de 3 enfants !</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exemple concret : 3 × 4 = 12 */}
            <div 
              id="groupes-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'groupes-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Exemple : 3 × 4 = 12
              </h2>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="text-center space-y-6">
                  <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
                    <h4 className="text-lg font-bold text-purple-800 mb-4">🚗 3 groupes de 4 voitures</h4>
                    
                    <div className="space-y-4">
                      <div className="flex justify-center items-center space-x-8">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 mb-2">Groupe 1</div>
                          <div className="flex gap-1">
                            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs">🚗</div>
                            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs">🚗</div>
                            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs">🚗</div>
                            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs">🚗</div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600 mb-2">Groupe 2</div>
                          <div className="flex gap-1">
                            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs">🚗</div>
                            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs">🚗</div>
                            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs">🚗</div>
                            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs">🚗</div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 mb-2">Groupe 3</div>
                          <div className="flex gap-1">
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs">🚗</div>
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs">🚗</div>
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs">🚗</div>
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs">🚗</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-2">
                          3 × 4 = 12 voitures
                        </div>
                        <div className="text-sm text-gray-600">
                          Plus rapide que : 4 + 4 + 4 = 12
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                    <p className="text-lg font-bold text-green-800 text-center">
                      ✨ 3 fois 4, c'est 3 groupes de 4 objets !
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
                💡 Trucs de super multiplicateur
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">
                    🎯 Tables faciles à retenir
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li>2️⃣ Table de 2 : comme tes chaussettes !</li>
                    <li>5️⃣ Table de 5 : compte sur tes doigts !</li>
                    <li>🔟 Table de 10 : ajoute juste un 0 !</li>
                    <li>👥 Fais des groupes avec tes objets</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-purple-800">
                    🧠 Astuces magiques
                  </h3>
                  <ul className="space-y-2 text-purple-700">
                    <li>🔄 3 × 4 = 4 × 3 (c'est pareil !)</li>
                    <li>➕ 3 × 4 = 4 + 4 + 4</li>
                    <li>🎨 Dessine tes groupes</li>
                    <li>🎵 Chante les tables en rythme</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mini-jeu */}
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3 text-center">🎮 Mini-jeu : Tables magiques !</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { calc: '2 × 3', answer: '6', table: 'Table de 2' },
                  { calc: '5 × 2', answer: '10', table: 'Table de 5' },
                  { calc: '10 × 3', answer: '30', table: 'Table de 10' },
                  { calc: '3 × 4', answer: '12', table: 'Groupes égaux' }
                ].map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                    <div className="font-bold mb-1">{item.calc}</div>
                    <div className="text-2xl font-bold mb-1">= {item.answer}</div>
                    <div className="text-xs opacity-90">{item.table}</div>
                  </div>
                ))}
              </div>
              <p className="text-center mt-4 text-lg font-semibold">
                🌟 Maintenant, explore toutes les tables pour devenir un champion !
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
              <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white">
                <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="text-4xl sm:text-6xl">✖️</div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold mb-2">Programme français CP - Multiplications</h2>
                    <p className="text-sm sm:text-lg">
                      Découvrir le sens de la multiplication, les premières tables !
                    </p>
                  </div>
                </div>
              </div>

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
                  Quelques astuces pour devenir un champion des multiplications
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <div className="text-2xl sm:text-3xl mb-2">👀</div>
                  <div className="font-bold text-sm sm:text-base mb-1">Visualise</div>
                  <div className="text-xs sm:text-sm opacity-90">Fais des groupes d'objets</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl mb-2">🎵</div>
                  <div className="font-bold text-sm sm:text-base mb-1">Chante</div>
                  <div className="text-xs sm:text-sm opacity-90">Les tables en rythme</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl mb-2">🔄</div>
                  <div className="font-bold text-sm sm:text-base mb-1">Répète</div>
                  <div className="text-xs sm:text-sm opacity-90">Un peu chaque jour</div>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <div className="text-2xl sm:text-3xl mb-2">🎮</div>
                  <div className="font-bold text-sm sm:text-base mb-1">Joue</div>
                  <div className="text-xs sm:text-sm opacity-90">C'est plus amusant !</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 