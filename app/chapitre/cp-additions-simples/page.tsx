'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Eye, Edit, Grid, Target, Trophy, Clock, Play, Volume2, Pause } from 'lucide-react'

interface SectionProgress {
  sectionId: string;
  completed: boolean;
  score: number;
  maxScore: number;
  completedAt: string;
  attempts: number;
}

const sections = [
  {
    id: 'sens-addition',
    title: 'Le sens de l\'addition',
    description: 'Comprendre ce que veut dire "ajouter" avec des objets concrets',
    icon: '🧮',
    duration: '10 min',
    xp: 12,
    color: 'from-purple-500 to-violet-500',
    verified: true
  },
  {
    id: 'decompositions',
    title: 'Décompositions additives',
    description: 'Savoir que 5 = 2+3 = 1+4... Toutes les façons de faire un nombre',
    icon: '🧩',
    duration: '10 min',
    xp: 12,
    color: 'from-orange-500 to-red-500',
    verified: true
  },
  {
    id: 'complements-10',
    title: 'Compléments à 10',
    description: 'Connaître par cœur les compléments à 10 (7+3=10, 6+4=10...)',
    icon: '🎯',
    duration: '8 min',
    xp: 10,
    color: 'from-pink-500 to-rose-500',
    verified: true
  },
  {
    id: 'additions-jusqu-20',
    title: 'Additions jusqu\'à 20',
    description: 'Maîtrise toutes les additions jusqu\'à 20 avec des stratégies magiques !',
    icon: '🧮',
    duration: '20 min',
    xp: 25,
    color: 'from-purple-500 to-pink-500',
    verified: true
  },
  {
    id: 'problemes',
    title: 'Problèmes d\'addition',
    description: 'Résoudre des petits problèmes de la vie quotidienne',
    icon: '🧩',
    duration: '10 min',
    xp: 12,
    color: 'from-red-500 to-pink-500',
    verified: true
  },
  {
    id: 'additions-jusqu-100',
    title: 'Additions jusqu\'à 100',
    description: 'Maîtriser les additions avec des nombres plus grands et découvrir de nouvelles stratégies',
    icon: '💯',
    duration: '15 min',
    xp: 18,
    color: 'from-blue-500 to-indigo-500',
    verified: false
  },
  {
    id: 'poser-addition',
    title: 'Poser une addition',
    description: 'Apprendre à poser une addition en colonnes comme les grands !',
    icon: '📝',
    duration: '12 min',
    xp: 15,
    color: 'from-green-500 to-teal-500',
    verified: true
  }
]

export default function CPAdditionsSimplesPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [sectionsProgress, setSectionsProgress] = useState<SectionProgress[]>([]);
  const [showContent, setShowContent] = useState('cours'); // 'cours' ou 'sections'
  
  // États pour le système audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Refs pour contrôler les vocaux et animations
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

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
    console.log('📖 explainChapter - Début explication additions');
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);

    try {
      await playAudio("Bonjour ! Bienvenue dans le chapitre sur les additions simples !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("L'addition, c'est l'une des choses les plus importantes en mathématiques !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      setHighlightedElement('pourquoi-section');
      await playAudio("Mais pourquoi apprendre les additions ? Laisse-moi t'expliquer !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Imagine que tu as 3 bonbons, et que ton ami t'en donne 2 de plus !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("Combien de bonbons auras-tu en tout ? C'est exactement ce que l'addition t'aide à trouver !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      setHighlightedElement('exemple-section');
      await playAudio("Regarde cet exemple : 3 plus 2 égale 5 !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("L'addition, c'est comme rassembler des groupes d'objets pour voir combien ça fait en tout !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      setHighlightedElement('trucs-section');
      await playAudio("J'ai plein de trucs et astuces pour t'aider à devenir un champion des additions !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("Par exemple, tu peux compter sur tes doigts, ou utiliser des objets, ou même dessiner !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      setHighlightedElement('sections-list');
      await playAudio("Maintenant, tu peux choisir par quelle partie commencer !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("Je te conseille de commencer par 'Le sens de l'addition' pour bien comprendre la base !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("Ensuite, tu peux explorer toutes les autres sections dans l'ordre que tu veux !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      setHighlightedElement(null);
      await playAudio("Alors, es-tu prêt à devenir un as de l'addition ?");
      if (stopSignalRef.current) return;
      await wait(2000);

    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      setIsPlayingVocal(false);
      setHighlightedElement(null);
    }
  };

  // Initialisation côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Charger les progrès au démarrage
  useEffect(() => {
    const savedProgress = localStorage.getItem('cp-additions-progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setSectionsProgress(progress);
      
      const completed = progress.filter((p: SectionProgress) => p.completed).map((p: SectionProgress) => p.sectionId);
      setCompletedSections(completed);
      
      const totalXP = progress.reduce((total: number, p: SectionProgress) => {
        if (p.completed && p.maxScore > 0) {
          const section = sections.find(s => s.id === p.sectionId);
          if (section) {
            const percentage = p.score / p.maxScore;
            return total + Math.round(section.xp * percentage);
          }
        }
        return total;
      }, 0);
      setXpEarned(totalXP);
    }
  }, []);

  // Écouter les changements dans localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProgress = localStorage.getItem('cp-additions-progress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setSectionsProgress(progress);
        
        const completed = progress.filter((p: SectionProgress) => p.completed).map((p: SectionProgress) => p.sectionId);
        setCompletedSections(completed);
        
        const totalXP = progress.reduce((total: number, p: SectionProgress) => {
          if (p.completed && p.maxScore > 0) {
            const section = sections.find(s => s.id === p.sectionId);
            if (section) {
              const percentage = p.score / p.maxScore;
              return total + Math.round(section.xp * percentage);
            }
          }
          return total;
        }, 0);
        setXpEarned(totalXP);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getSectionPath = (sectionId: string) => {
    return `/chapitre/cp-additions-simples/${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
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
              ➕ Additions Simples
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à additionner ! Découvre comment ajouter des nombres pour en faire de plus grands.
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
                  ? 'bg-orange-500 text-white shadow-md' 
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
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🎯 Sections ({completedSections.length}/{sections.length})
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
                className={`bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-6 rounded-2xl font-bold text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed animate-pulse' : 'hover:from-orange-600 hover:to-red-600 animate-bounce'
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
                    : "Clique ici pour commencer ton aventure avec les additions !")}
              </p>
            </div>

            {/* Indicateur audio global */}
            {hasStarted && isPlayingVocal && (
              <div className="fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
                <Volume2 className="inline w-5 h-5 mr-2 animate-spin" />
                🎤 Audio en cours...
              </div>
            )}

            {/* Pourquoi apprendre les additions */}
            <div 
              id="pourquoi-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'pourquoi-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🤔 Pourquoi apprendre les additions ?
              </h2>
              
              <div className="bg-orange-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-orange-800 font-semibold mb-4">
                  Les additions sont partout dans ta vie !
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🍭</div>
                    <div className="font-bold text-orange-600 mb-1">Tes bonbons</div>
                    <div className="text-sm text-gray-600">3 + 2 = 5 bonbons !</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🎈</div>
                    <div className="font-bold text-orange-600 mb-1">Tes ballons</div>
                    <div className="text-sm text-gray-600">4 + 3 = 7 ballons !</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">⭐</div>
                    <div className="font-bold text-orange-600 mb-1">Tes points</div>
                    <div className="text-sm text-gray-600">10 + 5 = 15 points !</div>
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
                🎯 Exemple : 3 + 2 = 5
              </h2>
              
              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="text-center space-y-6">
                  <div className="flex justify-center items-center space-x-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">3 pommes</div>
                      <div className="flex gap-2">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">🍎</div>
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">🍎</div>
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">🍎</div>
                      </div>
                    </div>
                    
                    <div className="text-4xl font-bold text-orange-600">+</div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">2 pommes</div>
                      <div className="flex gap-2">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">🍎</div>
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">🍎</div>
                      </div>
                    </div>
                    
                    <div className="text-4xl font-bold text-purple-600">=</div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">5 pommes</div>
                      <div className="flex gap-2">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">🍎</div>
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">🍎</div>
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">🍎</div>
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">🍎</div>
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">🍎</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
                    <p className="text-lg font-bold text-purple-800 text-center">
                      ✨ Tu rassembles les groupes pour compter le total !
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
                💡 Trucs pour réussir les additions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">
                    🎯 Méthodes pratiques
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li>✋ Compte sur tes doigts</li>
                    <li>🧮 Utilise des objets (bonbons, jouets)</li>
                    <li>✏️ Dessine des points ou des traits</li>
                    <li>🔢 Commence par le plus grand nombre</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-purple-800">
                    🧠 Astuces de champion
                  </h3>
                  <ul className="space-y-2 text-purple-700">
                    <li>🚀 5 + 3 = commence par 5, puis +1, +1, +1</li>
                    <li>🎯 Pour +1, c'est le nombre suivant</li>
                    <li>💝 Les doubles : 3+3, 4+4, 5+5...</li>
                    <li>⭐ Complements à 10 : 7+3, 6+4, 8+2</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mini-jeu */}
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3 text-center">🎮 Mini-jeu : Calcule rapidement !</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { calc: '2 + 3', answer: '5' },
                  { calc: '4 + 1', answer: '5' },
                  { calc: '3 + 4', answer: '7' },
                  { calc: '5 + 2', answer: '7' }
                ].map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                    <div className="font-bold mb-2">{item.calc}</div>
                    <div className="text-2xl font-bold">= {item.answer}</div>
                  </div>
                ))}
              </div>
              <p className="text-center mt-4 text-lg font-semibold">
                🌟 Maintenant, explore les sections pour devenir un expert !
              </p>
            </div>
          </div>
        ) : (
          /* SECTIONS */
          <div className="space-y-8">
            {/* XP et progression */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-lg sm:text-xl mb-4 sm:mb-6">
                <span className="bg-purple-200 px-3 sm:px-4 py-2 rounded-full font-bold text-gray-800 text-sm sm:text-base">
                  {xpEarned} XP gagné !
                </span>
              </div>
              
              <div 
                id="sections-list"
                className={`transition-all duration-500 ${
                  highlightedElement === 'sections-list' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105 rounded-lg p-4' : ''
                }`}
              >
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white">
                  <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="text-4xl sm:text-6xl">🎯</div>
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold mb-2">Programme français CP - Additions</h2>
                      <p className="text-sm sm:text-lg">
                        Comprendre l'addition, calculer dans la limite de 20, résoudre des problèmes !
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections - grille */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {sections.map((section) => (
                <div key={section.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 relative">
                  {section.verified && (
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      ✓ Vérifié
                    </div>
                  )}
                  
                  <div className="text-center mb-3 sm:mb-4">
                    <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{section.icon}</div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 px-2">{section.title}</h3>
                  </div>
                  
                  <div className="text-center mb-4 sm:mb-6">
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-2">{section.description}</p>
                    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-3 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{section.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{section.xp} XP</span>
                      </div>
                      {completedSections.includes(section.id) && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <span className="text-xs font-medium">✅ Terminé</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Link 
                    href={getSectionPath(section.id)}
                    className={`block w-full bg-gradient-to-r ${section.color} text-white text-center py-3 px-4 sm:px-6 rounded-lg font-bold text-base sm:text-lg hover:opacity-90 transition-opacity`}
                  >
                    <Play className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {completedSections.includes(section.id) ? 'Refaire' : 'Commencer !'}
                  </Link>
                </div>
              ))}
            </div>

            {/* Progression */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 text-center">
                📊 Ta progression
              </h3>
              <div className="flex justify-center gap-4 sm:gap-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">{completedSections.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Sections<br className="sm:hidden" /> terminées</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">{sections.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Sections<br className="sm:hidden" /> au total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{xpEarned}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Points<br className="sm:hidden" /> d'expérience</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(completedSections.length / sections.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  {Math.round((completedSections.length / sections.length) * 100)}% terminé
                </p>
              </div>
            </div>

            {/* Encouragements */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl p-4 sm:p-6 text-white">
                <div className="text-3xl sm:text-4xl mb-3">🌟</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Tu es un champion des maths !</h3>
                <p className="text-sm sm:text-base lg:text-lg px-2">
                  {completedSections.length === 0 && "Prêt à découvrir l'addition ?"}
                  {completedSections.length > 0 && completedSections.length < sections.length && "Continue, tu progresses super bien !"}
                  {completedSections.length === sections.length && "Félicitations ! Tu maîtrises l'addition !"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 