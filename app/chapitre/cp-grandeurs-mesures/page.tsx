'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Eye, Edit, Grid, Target, Trophy, Clock, Play, Volume2 } from 'lucide-react'

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
    id: 'longueurs',
    title: 'Comparer des longueurs',
    description: 'Plus long, plus court, même longueur... Utiliser la règle',
    icon: '📏',
    duration: '10 min',
    xp: 12,
    color: 'from-green-500 to-emerald-500',
    verified: true
  },
  {
    id: 'masses',
    title: 'Comparer des masses',
    description: 'Plus lourd, plus léger... Découvrir kilogramme et gramme',
    icon: '⚖️',
    duration: '8 min',
    xp: 10,
    color: 'from-blue-500 to-cyan-500',
    verified: true
  },
  {
    id: 'contenances',
    title: 'Comparer des contenances',
    description: 'Plus, moins, autant... Découvrir le litre',
    icon: '🥤',
    duration: '8 min',
    xp: 10,
    color: 'from-purple-500 to-violet-500',
    verified: true
  },
  {
    id: 'temps',
    title: 'Se repérer dans le temps',
    description: 'Hier, aujourd\'hui, demain. L\'heure, les jours, mois',
    icon: '🕐',
    duration: '12 min',
    xp: 15,
    color: 'from-orange-500 to-red-500',
    verified: true
  },
  {
    id: 'monnaie',
    title: 'La monnaie',
    description: 'Reconnaître les pièces et billets. Rendre la monnaie',
    icon: '💰',
    duration: '10 min',
    xp: 12,
    color: 'from-yellow-500 to-amber-500',
    verified: true
  }
]

export default function CPGrandeursMesuresPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [sectionsProgress, setSectionsProgress] = useState<SectionProgress[]>([]);
  const [showContent, setShowContent] = useState('cours'); // 'cours' ou 'sections'
  
  // États pour le système audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

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
    console.log('📖 explainChapter - Début explication grandeurs mesures');
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);

    try {
      await playAudio("Bonjour ! Bienvenue dans le chapitre sur les grandeurs et mesures !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("Les grandeurs et mesures, c'est apprendre à comparer et mesurer tout ce qui t'entoure !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      setHighlightedElement('pourquoi-section');
      await playAudio("Mais pourquoi c'est important ? Tu utilises les mesures tous les jours !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Quand tu dis 'je mesure 1 mètre 20' ou 'ce livre pèse lourd', tu parles de mesures !");
      if (stopSignalRef.current) return;
      await wait(2200);
      
      await playAudio("Et quand maman dose la farine ou que papa met de l'essence, ce sont aussi des mesures !");
      if (stopSignalRef.current) return;
      await wait(2500);
      
      setHighlightedElement('mesures-section');
      await playAudio("Regarde ces outils magiques ! Une règle pour mesurer, une balance pour peser !");
      if (stopSignalRef.current) return;
      await wait(2200);
      
      await playAudio("Et aussi un verre doseur pour les liquides, et une horloge pour le temps !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      setHighlightedElement('trucs-section');
      await playAudio("J'ai plein d'astuces pour t'aider à devenir un expert des mesures !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Par exemple, tu peux utiliser ton corps : un pas, une main, un doigt pour mesurer !");
      if (stopSignalRef.current) return;
      await wait(2200);
      
      setHighlightedElement('sections-list');
      await playAudio("Maintenant, tu peux choisir par quel type de mesure commencer !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Je te conseille de commencer par les longueurs, c'est le plus facile à voir !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      setHighlightedElement(null);
      await playAudio("Es-tu prêt à devenir un petit scientifique des mesures ?");
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

  // Charger les progrès au démarrage
  useEffect(() => {
    const savedProgress = localStorage.getItem('cp-grandeurs-progress');
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
      const savedProgress = localStorage.getItem('cp-grandeurs-progress');
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
    return `/chapitre/cp-grandeurs-mesures/${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
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
              📏 Grandeurs et Mesures
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à mesurer, comparer et utiliser les unités !
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
                  ? 'bg-green-500 text-white shadow-md' 
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
                  ? 'bg-green-500 text-white shadow-md' 
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
                className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-12 py-6 rounded-2xl font-bold text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed animate-pulse' : 'hover:from-green-600 hover:to-blue-600 animate-bounce'
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
                    : "Clique ici pour commencer ton aventure avec les mesures !")}
              </p>
            </div>

            {/* Indicateur audio global */}
            {hasStarted && isPlayingVocal && (
              <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
                <Volume2 className="inline w-5 h-5 mr-2 animate-spin" />
                🎤 Audio en cours...
              </div>
            )}

            {/* Pourquoi apprendre les grandeurs et mesures */}
            <div 
              id="pourquoi-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'pourquoi-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🤔 Pourquoi apprendre les mesures ?
              </h2>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-green-800 font-semibold mb-4">
                  Les mesures sont partout dans ta vie !
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">👕</div>
                    <div className="font-bold text-green-600 mb-1">Tes vêtements</div>
                    <div className="text-sm text-gray-600">Taille, longueur des manches...</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🍰</div>
                    <div className="font-bold text-green-600 mb-1">En cuisine</div>
                    <div className="text-sm text-gray-600">Peser les ingrédients !</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">⏰</div>
                    <div className="font-bold text-green-600 mb-1">Le temps</div>
                    <div className="text-sm text-gray-600">L'heure, les rendez-vous...</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Les outils de mesure */}
            <div 
              id="mesures-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'mesures-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Les outils de mesure magiques
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-5xl mb-3">📏</div>
                    <div className="font-bold text-blue-600 mb-2">Règle</div>
                    <div className="text-sm text-gray-600 mb-2">Pour mesurer la longueur</div>
                    <div className="bg-white rounded p-2 text-xs">
                      Plus long ↔ Plus court
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-5xl mb-3">⚖️</div>
                    <div className="font-bold text-green-600 mb-2">Balance</div>
                    <div className="text-sm text-gray-600 mb-2">Pour peser les objets</div>
                    <div className="bg-white rounded p-2 text-xs">
                      Plus lourd ↕ Plus léger
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-5xl mb-3">🥤</div>
                    <div className="font-bold text-purple-600 mb-2">Verre doseur</div>
                    <div className="text-sm text-gray-600 mb-2">Pour les liquides</div>
                    <div className="bg-white rounded p-2 text-xs">
                      Plus ↕ Moins
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-5xl mb-3">🕐</div>
                    <div className="font-bold text-orange-600 mb-2">Horloge</div>
                    <div className="text-sm text-gray-600 mb-2">Pour le temps</div>
                    <div className="bg-white rounded p-2 text-xs">
                      Avant ↔ Après
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-white rounded-lg p-4 border-2 border-blue-300">
                  <p className="text-lg font-bold text-blue-800 text-center">
                    ✨ Chaque outil a son super-pouvoir pour mesurer !
                  </p>
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
                💡 Astuces de petit scientifique
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">
                    🎯 Utilise ton corps !
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li>👣 Un pas = environ 50 cm</li>
                    <li>✋ Une main = environ 15 cm</li>
                    <li>👆 Un doigt = environ 2 cm</li>
                    <li>🤲 Tes bras écartés = ta taille</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">
                    🧠 Trucs pour retenir
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>📏 1 mètre = 100 centimètres</li>
                    <li>⚖️ 1 kilogramme = 1000 grammes</li>
                    <li>🥤 1 litre = 1000 millilitres</li>
                    <li>🕐 1 heure = 60 minutes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mini-jeu */}
            <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3 text-center">🎮 Mini-jeu : Devine les mesures !</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { tool: '📏', measure: 'Longueur', unit: 'centimètres', example: 'crayon = 10 cm' },
                  { tool: '⚖️', measure: 'Masse', unit: 'grammes', example: 'pomme = 150 g' },
                  { tool: '🥤', measure: 'Contenance', unit: 'litres', example: 'bouteille = 1 L' },
                  { tool: '🕐', measure: 'Temps', unit: 'minutes', example: 'récré = 15 min' }
                ].map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                    <div className="text-3xl mb-1">{item.tool}</div>
                    <div className="font-bold mb-1">{item.measure}</div>
                    <div className="text-xs opacity-90 mb-1">{item.unit}</div>
                    <div className="text-xs opacity-75">{item.example}</div>
                  </div>
                ))}
              </div>
              <p className="text-center mt-4 text-lg font-semibold">
                🌟 Maintenant, explore toutes les mesures pour devenir un expert !
              </p>
            </div>
          </div>
        ) : (
          /* SECTIONS */
          <div className="space-y-8">
            {/* XP et progression */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-lg sm:text-xl mb-4 sm:mb-6">
                <span className="bg-green-200 px-3 sm:px-4 py-2 rounded-full font-bold text-gray-800 text-sm sm:text-base">
                  {xpEarned} XP gagné !
                </span>
              </div>
              
              <div 
                id="sections-list"
                className={`transition-all duration-500 ${
                  highlightedElement === 'sections-list' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105 rounded-lg p-4' : ''
                }`}
              >
                <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white">
                  <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="text-4xl sm:text-6xl">📏</div>
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold mb-2">Programme français CP - Grandeurs et Mesures</h2>
                      <p className="text-sm sm:text-lg">
                        Comparer, mesurer, utiliser les unités et les instruments de mesure !
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
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
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
              <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-xl p-4 sm:p-6 text-white">
                <div className="text-3xl sm:text-4xl mb-3">🌟</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Tu es un petit scientifique des mesures !</h3>
                <p className="text-sm sm:text-base lg:text-lg px-2">
                  {completedSections.length === 0 && "Prêt à explorer le monde des mesures ?"}
                  {completedSections.length > 0 && completedSections.length < sections.length && "Continue, tu deviens un expert des mesures !"}
                  {completedSections.length === sections.length && "Félicitations ! Tu maîtrises toutes les mesures !"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 