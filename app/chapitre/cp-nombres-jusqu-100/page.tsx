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
    id: 'dizaines',
    title: 'Les dizaines',
    description: 'Comprendre les groupes de 10 : 10, 20, 30... Valeur positionnelle',
    icon: '📦',
    duration: '10 min',
    xp: 12,
    color: 'from-green-500 to-emerald-500',
    verified: true
  },
  {
    id: 'unites-dizaines',
    title: 'Unités et dizaines',
    description: 'Connaître la valeur des chiffres selon leur position',
    icon: '🔢',
    duration: '12 min',
    xp: 15,
    color: 'from-blue-500 to-cyan-500',
    verified: true
  },
  {
    id: 'lecture-ecriture',
    title: 'Lire et écrire jusqu\'à 100',
    description: 'Lire et écrire tous les nombres jusqu\'à 100',
    icon: '✏️',
    duration: '12 min',
    xp: 15,
    color: 'from-purple-500 to-violet-500',
    verified: true
  },
  {
    id: 'ordonner-comparer',
    title: 'Ordonner et comparer',
    description: 'Ranger dans l\'ordre et comparer avec < > =',
    icon: '📊',
    duration: '10 min',
    xp: 12,
    color: 'from-orange-500 to-red-500',
    verified: true
  }
]

export default function CPNombresJusqu100Page() {
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
    console.log('📖 explainChapter - Début explication nombres jusqu 100');
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);

    try {
      await playAudio("Bonjour ! Bienvenue dans le chapitre sur les nombres jusqu'à 100 !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("Les nombres jusqu'à 100, c'est un grand voyage dans le monde des chiffres !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      setHighlightedElement('pourquoi-section');
      await playAudio("Mais pourquoi apprendre les nombres jusqu'à 100 ? C'est super utile !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("Imagine que tu comptes tes cartes Pokémon, ou les pages de ton livre préféré !");
      if (stopSignalRef.current) return;
      await wait(2200);
      
      await playAudio("Ou quand tu veux savoir ton âge en mois, ou compter jusqu'à ton anniversaire !");
      if (stopSignalRef.current) return;
      await wait(2500);
      
      setHighlightedElement('valeur-section');
      await playAudio("Regarde ce nombre magique : 47 ! Il a 4 dizaines et 7 unités !");
      if (stopSignalRef.current) return;
      await wait(2200);
      
      await playAudio("Les dizaines, ce sont des paquets de 10. Et les unités, ce sont les chiffres tout seuls !");
      if (stopSignalRef.current) return;
      await wait(2500);
      
      setHighlightedElement('trucs-section');
      await playAudio("J'ai des astuces géniales pour t'aider à maîtriser tous ces nombres !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("Par exemple, pour se souvenir : 47, c'est 40 plus 7, ou 4 paquets de 10 plus 7 !");
      if (stopSignalRef.current) return;
      await wait(2500);
      
      setHighlightedElement('sections-list');
      await playAudio("Maintenant, tu peux choisir par où commencer cette grande aventure !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("Je te conseille de commencer par les dizaines, c'est la base de tout !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      setHighlightedElement(null);
      await playAudio("Es-tu prêt à devenir un expert des grands nombres ?");
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
    const savedProgress = localStorage.getItem('cp-nombres-100-progress');
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
      const savedProgress = localStorage.getItem('cp-nombres-100-progress');
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
    return `/chapitre/cp-nombres-jusqu-100/${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
              💯 Nombres jusqu'à 100
            </h1>
            <p className="text-lg text-gray-600">
              Découvre les grands nombres et deviens un as de la numération !
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
                  ? 'bg-blue-500 text-white shadow-md' 
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
                  ? 'bg-blue-500 text-white shadow-md' 
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
                className={`bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-12 py-6 rounded-2xl font-bold text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed animate-pulse' : 'hover:from-blue-600 hover:to-indigo-600 animate-bounce'
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
                    : "Clique ici pour explorer les grands nombres !")}
              </p>
            </div>

            {/* Indicateur audio global */}
            {hasStarted && isPlayingVocal && (
              <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
                <Volume2 className="inline w-5 h-5 mr-2 animate-spin" />
                🎤 Audio en cours...
              </div>
            )}

            {/* Pourquoi apprendre les nombres jusqu'à 100 */}
            <div 
              id="pourquoi-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'pourquoi-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🤔 Pourquoi apprendre les grands nombres ?
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-blue-800 font-semibold mb-4">
                  Les grands nombres sont partout !
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">📚</div>
                    <div className="font-bold text-blue-600 mb-1">Tes livres</div>
                    <div className="text-sm text-gray-600">Page 47 sur 85 pages !</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🎂</div>
                    <div className="font-bold text-blue-600 mb-1">Ton âge</div>
                    <div className="text-sm text-gray-600">7 ans = 84 mois !</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🏠</div>
                    <div className="font-bold text-blue-600 mb-1">Les adresses</div>
                    <div className="text-sm text-gray-600">J'habite au 73 !</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Valeur positionnelle : 47 */}
            <div 
              id="valeur-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'valeur-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Comprendre 47 : dizaines et unités
              </h2>
              
              <div className="bg-indigo-50 rounded-lg p-6">
                <div className="text-center space-y-6">
                  <div className="bg-white rounded-lg p-6 border-2 border-indigo-300">
                    <h4 className="text-xl font-bold text-indigo-800 mb-4">📦 47 = 4 dizaines + 7 unités</h4>
                    
                    <div className="flex justify-center items-center space-x-8 mb-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600 mb-3">4 dizaines</div>
                        <div className="grid grid-cols-2 gap-2">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="bg-green-500 rounded-lg p-2 text-white text-center">
                              <div className="text-xs font-bold">Paquet {i}</div>
                              <div className="text-xs">10 objets</div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">4 × 10 = 40</div>
                      </div>
                      
                      <div className="text-4xl font-bold text-indigo-600">+</div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600 mb-3">7 unités</div>
                        <div className="flex gap-1 justify-center">
                          {[1,2,3,4,5,6,7].map(i => (
                            <div key={i} className="w-6 h-6 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                              {i}
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">7 unités</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600 mb-2">47</div>
                      <div className="text-lg text-gray-600">quarante-sept</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                    <p className="text-lg font-bold text-green-800 text-center">
                      ✨ Le chiffre 4 vaut 40, le chiffre 7 vaut 7 !
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
                💡 Astuces pour les grands nombres
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">
                    🎯 Pour comprendre un nombre
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li>📦 Pense aux paquets de 10</li>
                    <li>👆 Compte les unités qui restent</li>
                    <li>🗣️ Dis-le à voix haute</li>
                    <li>✏️ Écris-le en chiffres et en lettres</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">
                    🧠 Trucs de champion
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>🔢 23 = vingt-trois = 20 + 3</li>
                    <li>📊 Pour comparer : regarde les dizaines d'abord</li>
                    <li>📏 Sur la file numérique : plus à droite = plus grand</li>
                    <li>🎵 Chante la comptine : 10, 20, 30, 40...</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mini-jeu */}
            <div className="bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3 text-center">🎮 Mini-jeu : Décompose les nombres !</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { number: '23', dizaines: '2', unites: '3', decomp: '20 + 3' },
                  { number: '56', dizaines: '5', unites: '6', decomp: '50 + 6' },
                  { number: '71', dizaines: '7', unites: '1', decomp: '70 + 1' },
                  { number: '89', dizaines: '8', unites: '9', decomp: '80 + 9' }
                ].map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold mb-1">{item.number}</div>
                    <div className="text-sm mb-1">{item.dizaines}d {item.unites}u</div>
                    <div className="text-xs opacity-90">{item.decomp}</div>
                  </div>
                ))}
              </div>
              <p className="text-center mt-4 text-lg font-semibold">
                🌟 Maintenant, maîtrise tous les nombres jusqu'à 100 !
              </p>
            </div>
          </div>
        ) : (
          /* SECTIONS */
          <div className="space-y-8">
            {/* XP et progression */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-lg sm:text-xl mb-4 sm:mb-6">
                <span className="bg-blue-200 px-3 sm:px-4 py-2 rounded-full font-bold text-gray-800 text-sm sm:text-base">
                  {xpEarned} XP gagné !
                </span>
              </div>
              
              <div 
                id="sections-list"
                className={`transition-all duration-500 ${
                  highlightedElement === 'sections-list' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105 rounded-lg p-4' : ''
                }`}
              >
                <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white">
                  <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="text-4xl sm:text-6xl">💯</div>
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold mb-2">Programme français CP - Nombres jusqu'à 100</h2>
                      <p className="text-sm sm:text-lg">
                        Comprendre la numération, lire, écrire, comparer les nombres !
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
                    className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full transition-all duration-500"
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
              <div className="bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl p-4 sm:p-6 text-white">
                <div className="text-3xl sm:text-4xl mb-3">🌟</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Tu es un génie des nombres !</h3>
                <p className="text-sm sm:text-base lg:text-lg px-2">
                  {completedSections.length === 0 && "Prêt à explorer les grands nombres ?"}
                  {completedSections.length > 0 && completedSections.length < sections.length && "Continue, tu maîtrises de mieux en mieux !"}
                  {completedSections.length === sections.length && "Bravo ! Tu connais tous les nombres jusqu'à 100 !"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 