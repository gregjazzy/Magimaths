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
    id: 'sens-soustraction',
    title: 'Le sens de la soustraction',
    description: 'Comprendre ce que veut dire "retirer", "enlever" avec des objets',
    icon: '🪣',
    duration: '10 min',
    xp: 12,
    color: 'from-red-500 to-rose-500',
    verified: true
  },
  {
    id: 'soustractions-10',
    title: 'Soustractions jusqu\'à 10',
    description: 'Mes premières soustractions avec des petits nombres',
    icon: '🔢',
    duration: '12 min',
    xp: 15,
    color: 'from-orange-500 to-red-500',
    verified: true
  },
  {
    id: 'soustractions-20',
    title: 'Soustractions jusqu\'à 20',
    description: 'Soustractions plus grandes en comptant à rebours',
    icon: '⬇️',
    duration: '15 min',
    xp: 18,
    color: 'from-yellow-500 to-orange-500',
    verified: true
  },
  {
    id: 'techniques',
    title: 'Techniques de calcul',
    description: 'Apprendre des astuces pour soustraire plus facilement',
    icon: '🎯',
    duration: '12 min',
    xp: 15,
    color: 'from-purple-500 to-pink-500',
    verified: true
  },
  {
    id: 'problemes',
    title: 'Problèmes de soustraction',
    description: 'Résoudre des petits problèmes de la vie quotidienne',
    icon: '🧩',
    duration: '10 min',
    xp: 12,
    color: 'from-blue-500 to-purple-500',
    verified: true
  }
]

export default function CPSoustractionsSimplesPage() {
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
    console.log('📖 explainChapter - Début explication soustractions simples');
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);

    try {
      await playAudio("Bonjour ! Bienvenue dans le chapitre sur les soustractions simples !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("La soustraction, c'est l'art d'enlever, de retirer des objets !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      setHighlightedElement('pourquoi-section');
      await playAudio("Mais pourquoi apprendre les soustractions ? Elles sont partout !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Imagine que tu as 8 bonbons et que tu en manges 3 !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("Combien t'en reste-t-il ? C'est exactement ce que la soustraction t'aide à trouver !");
      if (stopSignalRef.current) return;
      await wait(2200);
      
      setHighlightedElement('exemple-section');
      await playAudio("Regarde cet exemple : 8 moins 3 égale 5 !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("On part de 8 objets, on en retire 3, et il en reste 5 ! Magique, non ?");
      if (stopSignalRef.current) return;
      await wait(2200);
      
      setHighlightedElement('trucs-section');
      await playAudio("J'ai plein d'astuces pour t'aider à devenir un champion des soustractions !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("Par exemple, tu peux compter à rebours, ou utiliser tes doigts !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      setHighlightedElement('sections-list');
      await playAudio("Maintenant, tu peux choisir par où commencer ton aventure !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Je te conseille de commencer par comprendre le sens de la soustraction !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      setHighlightedElement(null);
      await playAudio("Es-tu prêt à devenir un maître des soustractions ?");
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
    const savedProgress = localStorage.getItem('cp-soustractions-progress');
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
      const savedProgress = localStorage.getItem('cp-soustractions-progress');
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
    return `/chapitre/cp-soustractions-simples/${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
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
              ➖ Soustractions Simples
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à retirer et enlever pour compter ce qui reste !
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
                  ? 'bg-red-500 text-white shadow-md' 
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
                  ? 'bg-red-500 text-white shadow-md' 
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
                className={`bg-gradient-to-r from-red-500 to-orange-500 text-white px-12 py-6 rounded-2xl font-bold text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed animate-pulse' : 'hover:from-red-600 hover:to-orange-600 animate-bounce'
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
                    : "Clique ici pour découvrir l'art de soustraire !")}
              </p>
            </div>

            {/* Indicateur audio global */}
            {hasStarted && isPlayingVocal && (
              <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
                <Volume2 className="inline w-5 h-5 mr-2 animate-spin" />
                🎤 Audio en cours...
              </div>
            )}

            {/* Pourquoi apprendre les soustractions */}
            <div 
              id="pourquoi-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'pourquoi-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🤔 Pourquoi apprendre les soustractions ?
              </h2>
              
              <div className="bg-red-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-red-800 font-semibold mb-4">
                  Les soustractions sont partout quand tu enlèves des choses !
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🍪</div>
                    <div className="font-bold text-red-600 mb-1">Tes biscuits</div>
                    <div className="text-sm text-gray-600">8 biscuits, j'en mange 3 !</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🎈</div>
                    <div className="font-bold text-red-600 mb-1">Tes ballons</div>
                    <div className="text-sm text-gray-600">5 ballons, 2 s'envolent !</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">💰</div>
                    <div className="font-bold text-red-600 mb-1">Ton argent</div>
                    <div className="text-sm text-gray-600">10 euros, j'achète à 4 euros !</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exemple concret : 8 - 3 = 5 */}
            <div 
              id="exemple-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'exemple-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Exemple : 8 - 3 = 5
              </h2>
              
              <div className="bg-orange-50 rounded-lg p-6">
                <div className="text-center space-y-6">
                  <div className="bg-white rounded-lg p-6 border-2 border-orange-300">
                    <h4 className="text-lg font-bold text-orange-800 mb-4">🍎 J'ai 8 pommes, j'en mange 3</h4>
                    
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600 mb-3">Au début : 8 pommes</div>
                        <div className="flex justify-center gap-2 mb-4">
                          {[1,2,3,4,5,6,7,8].map(i => (
                            <div key={i} className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">🍎</div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-4xl font-bold text-red-600">↓ J'enlève 3 pommes</div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-500 mb-3">Je retire ces 3 pommes</div>
                        <div className="flex justify-center gap-2 mb-4">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold opacity-50 line-through">🍎</div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-4xl font-bold text-green-600">↓ Il me reste</div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-3">5 pommes</div>
                        <div className="flex justify-center gap-2">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">🍎</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                    <p className="text-lg font-bold text-green-800 text-center">
                      ✨ 8 - 3 = 5 ! Soustraire, c'est compter ce qui reste !
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
                💡 Trucs de maître soustraction
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">
                    🎯 Méthodes pratiques
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li>👆 Compte à rebours sur tes doigts</li>
                    <li>🧸 Utilise des objets réels</li>
                    <li>✏️ Dessine et raye ce que tu enlèves</li>
                    <li>📏 Utilise la file numérique</li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-800">
                    🧠 Astuces de champion
                  </h3>
                  <ul className="space-y-2 text-red-700">
                    <li>🔢 Pour soustraire 1 : nombre précédent</li>
                    <li>🎯 8 - 3 : pars de 8, recule de 3</li>
                    <li>🔄 Vérifie avec l'addition : 5 + 3 = 8 ✓</li>
                    <li>⭐ Compléments à 10 : 10 - 3 = 7</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mini-jeu */}
            <div className="bg-gradient-to-r from-red-400 to-orange-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3 text-center">🎮 Mini-jeu : Soustractions magiques !</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { calc: '7 - 2', answer: '5', method: 'Compte à rebours' },
                  { calc: '10 - 4', answer: '6', method: 'Complément' },
                  { calc: '8 - 3', answer: '5', method: 'Retire des objets' },
                  { calc: '9 - 1', answer: '8', method: 'Nombre précédent' }
                ].map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                    <div className="font-bold mb-1">{item.calc}</div>
                    <div className="text-2xl font-bold mb-1">= {item.answer}</div>
                    <div className="text-xs opacity-90">{item.method}</div>
                  </div>
                ))}
              </div>
              <p className="text-center mt-4 text-lg font-semibold">
                🌟 Maintenant, maîtrise toutes les techniques de soustraction !
              </p>
            </div>
          </div>
        ) : (
          /* SECTIONS */
          <div className="space-y-8">
            {/* XP et progression */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-lg sm:text-xl mb-4 sm:mb-6">
                <span className="bg-red-200 px-3 sm:px-4 py-2 rounded-full font-bold text-gray-800 text-sm sm:text-base">
                  {xpEarned} XP gagné !
                </span>
              </div>
              
              <div 
                id="sections-list"
                className={`transition-all duration-500 ${
                  highlightedElement === 'sections-list' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105 rounded-lg p-4' : ''
                }`}
              >
                <div className="bg-gradient-to-r from-red-400 to-orange-500 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white">
                  <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="text-4xl sm:text-6xl">➖</div>
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold mb-2">Programme français CP - Soustractions</h2>
                      <p className="text-sm sm:text-lg">
                        Comprendre la soustraction, calculer dans la limite de 20, résoudre des problèmes !
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
                    className="bg-gradient-to-r from-red-400 to-orange-500 h-3 rounded-full transition-all duration-500"
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
              <div className="bg-gradient-to-r from-red-400 to-orange-400 rounded-xl p-4 sm:p-6 text-white">
                <div className="text-3xl sm:text-4xl mb-3">🌟</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Tu es un champion des soustractions !</h3>
                <p className="text-sm sm:text-base lg:text-lg px-2">
                  {completedSections.length === 0 && "Prêt à maîtriser l'art de soustraire ?"}
                  {completedSections.length > 0 && completedSections.length < sections.length && "Continue, tu progresses très bien !"}
                  {completedSections.length === sections.length && "Félicitations ! Tu maîtrises les soustractions !"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 