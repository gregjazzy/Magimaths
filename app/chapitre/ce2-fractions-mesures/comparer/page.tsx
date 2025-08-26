'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';

// Composant pour afficher une fraction mathématique
function FractionMath({a, b, size = 'text-xl'}: {a: string|number, b: string|number, size?: string}) {
  return (
    <span className={`inline-block align-middle ${size} text-gray-900 font-bold`} style={{ minWidth: 24 }}>
      <span className="flex flex-col items-center" style={{lineHeight:1}}>
        <span className="px-2 pb-1 text-gray-900">{a}</span>
        <div className="w-full h-0.5 bg-gray-800 my-1"></div>
        <span className="px-2 pt-1 text-gray-900">{b}</span>
      </span>
    </span>
  );
}

// Animation interactive pour expliquer les parties d'une fraction
function PartiesFractionAnimation({ 
  highlightedElement,
  animatingRef,
  audioRef,
  updateAudioState
}: {
  highlightedElement?: string | null;
  animatingRef?: React.MutableRefObject<boolean>;
  audioRef?: React.MutableRefObject<boolean>;
  updateAudioState?: (isPlaying: boolean) => void;
}) {
  const [currentStep, setCurrentStep] = useState(6); // Afficher tous les éléments par défaut
  const [isPlayingVocal, setIsPlayingAudio] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedPart, setHighlightedPart] = useState<'numerator' | 'denominator' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Mettre à jour les refs quand l'animation change
  useEffect(() => {
    if (animatingRef) {
      animatingRef.current = isAnimating || isPlayingVocal;
    }
    if (audioRef) {
      audioRef.current = isPlayingVocal;
      console.log('🔊 PartiesFractionAnimation audioRef updated:', isPlayingVocal);
    }
    if (updateAudioState) {
      updateAudioState(isPlayingVocal);
    }
  }, [isAnimating, isPlayingVocal, animatingRef, audioRef, updateAudioState]);
  const [hasStarted, setHasStarted] = useState(false);
  
    // Refs locales pour ce composant
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

    

  // Fonction pour jouer l'audio (locale) - PAS UTILISÉ CAR ANIMATION VISUELLE SEULEMENT
  const playAudio = async (text: string) => {
    return new Promise<void>((resolve) => {
      console.log('🎤 PartiesFraction playAudio called, stopSignal:', stopSignalRef.current);
      if (stopSignalRef.current) {
        console.log('❌ Audio cancelled (PartiesFraction) before start due to stopSignal');
        resolve();
        return;
      }

      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      
      utterance.onend = () => {
        console.log('✅ Audio ended (PartiesFraction):', text.substring(0, 30) + '...');
        setIsPlayingAudio(false);
        currentAudioRef.current = null;
        resolve();
      };
      
      utterance.onerror = () => {
        console.log('❌ Audio error (PartiesFraction):', text.substring(0, 30) + '...');
        setIsPlayingAudio(false);
        currentAudioRef.current = null;
        resolve();
      };
      
      console.log('🎵 Starting audio (PartiesFraction):', text.substring(0, 50) + '...');
      currentAudioRef.current = utterance;
      speechSynthesis.speak(utterance);
    });
  };

  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt FORCÉ (PartiesFraction) de tous les vocaux et animations');
    
    stopSignalRef.current = true;
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      console.log('🔇 speechSynthesis.cancel() forcé (PartiesFraction)');
    }
    
    setTimeout(() => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() 2e tentative (PartiesFraction)');
      }
    }, 100);
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    setIsPlayingAudio(false);
    setIsAnimating(false);
    setCurrentStep(6); // Garder tous les éléments visibles après l'arrêt
    setHighlightedPart(null); // Enlever les surbrillances
    setShowExplanation(false);
    setHasStarted(false); // Permettre de relancer l'animation
  };

  // Effect pour gérer les changements d'onglet et navigation dans PartiesFractionAnimation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handlePageHide = () => {
      stopAllVocalsAndAnimations();
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      stopAllVocalsAndAnimations();
    };

    const handleGlobalStop = () => {
      stopAllVocalsAndAnimations();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('stopAllAnimations', handleGlobalStop);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('stopAllAnimations', handleGlobalStop);
      stopAllVocalsAndAnimations();
    };
  }, []);

  const startAnimation = async () => {
    if (isAnimating) return;
    
    // Arrêter toute animation en cours dans d'autres composants
    window.dispatchEvent(new CustomEvent('stopAllAnimations'));
    
    // Scroller vers la section parties-fraction
    const element = document.getElementById('parties-fraction');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
    
    console.log('🚀 Démarrage animation visuelle PartiesFraction (SANS AUDIO)');
    stopSignalRef.current = false;
    setIsAnimating(true);
    setIsPlayingAudio(false); // PAS D'AUDIO
    setHasStarted(true);
    setCurrentStep(0); // Commencer à 0

    try {
      // Étape 1: Introduction - montrer la fraction (SANS AUDIO)
      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (stopSignalRef.current) return;

      // Étape 2: Montrer la fraction 3/5 (SANS AUDIO)
      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (stopSignalRef.current) return;

      // Étape 3: Expliquer le numérateur - ANIMATION VISUELLE SEULEMENT
      setCurrentStep(3);
      setHighlightedPart('numerator');
      await new Promise(resolve => setTimeout(resolve, 2500));
      if (stopSignalRef.current) return;

      // Étape 4: Expliquer le dénominateur - ANIMATION VISUELLE SEULEMENT
      setCurrentStep(4);
      setHighlightedPart('denominator');
      await new Promise(resolve => setTimeout(resolve, 2500));
      if (stopSignalRef.current) return;

      // Étape 5: Récapitulatif - ANIMATION VISUELLE SEULEMENT
      setCurrentStep(5);
      setHighlightedPart(null);
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (stopSignalRef.current) return;

      // Étape 6: Fin - tout reste visible
      setCurrentStep(6);

    } catch (error) {
      console.error('Erreur animation parties fraction:', error);
    } finally {
      setIsPlayingAudio(false);
      setIsAnimating(false);
      setHasStarted(false); // Permet de relancer l'animation
      stopSignalRef.current = false;
    }
  };



  return (
    <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg border-2 border-orange-200">
      <h3 className="text-lg sm:text-2xl font-bold text-center text-gray-900 mb-3 sm:mb-4">
        🔍 Les parties d'une fraction
      </h3>
      
      {/* Texte explicatif */}
      <div className="text-center mb-4 sm:mb-6">
        <p className="text-sm sm:text-base text-gray-700 bg-orange-50 p-3 sm:p-4 rounded-lg border border-orange-200">
          📖 Une fraction se compose de <strong>deux parties essentielles</strong> : 
          le <span className="text-blue-600 font-bold">numérateur</span> (en haut) qui indique combien de parts on prend, 
          et le <span className="text-green-600 font-bold">dénominateur</span> (en bas) qui indique en combien de parts on divise le tout.
        </p>
      </div>
      
      {/* Contrôles d'animation */}
      <div className="text-center mb-3 sm:mb-6">
          {/* Bouton principal */}
            <button
          id="start-parties-animation"
              onClick={startAnimation}
              disabled={isPlayingVocal || isAnimating}
          className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-lg text-sm sm:text-lg shadow-lg transition-all pulse-interactive-yellow disabled:opacity-50 ${
            highlightedElement === 'start-parties-animation' ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-110' : ''
          }`}
        >
          🎬 Lancer l'animation
              </button>
      </div>

      {/* Zone d'animation principale - Animation progressive */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 sm:p-8 border-2 border-orange-200 min-h-[300px] sm:min-h-[500px]">
        
        {currentStep === 0 && (
          <div className="text-center py-10 sm:py-20">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-6 animate-bounce">🔍</div>
            <p className="text-sm sm:text-2xl text-gray-700 font-bold">Clique sur "Lancer l'animation" pour commencer</p>
                  </div>
                )}
                
                {currentStep >= 1 && (
          <div className="animate-fade-in">
            {/* Layout responsive avec fraction au centre et explications autour */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 px-2 sm:px-4">
              
              {/* Explication du numérateur - Apparaît à l'étape 3 */}
              {currentStep >= 3 ? (
                <div className="animate-fade-in order-1 sm:order-none">
                  <div className={`w-full sm:w-52 p-2 sm:p-3 rounded-lg border-2 bg-red-100 border-red-300 shadow-md transition-all duration-1000 ${
                    highlightedPart === 'numerator' ? 'scale-105 shadow-lg border-red-500' : ''
                  }`}>
                    <div className="text-sm sm:text-base font-bold text-red-700 text-center mb-1">NUMÉRATEUR</div>
                    <p className="text-red-600 font-medium text-center text-xs sm:text-sm mb-1">Combien je PRENDS</p>
                    <div className="text-red-800 text-center text-xs sm:text-sm">
                      3 parts
                    </div>
                    {/* Flèche pointant vers la droite - cachée sur mobile */}
                    <div className="hidden sm:flex justify-end mt-2">
                      <div className="w-0 h-0 border-l-5 border-r-0 border-t-3 border-b-3 border-transparent border-l-red-400"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:block sm:w-52"></div> // Espace réservé desktop seulement
              )}

              {/* Fraction 3/5 - AU CENTRE */}
              <div className="flex justify-center order-0">
                <div className={`text-4xl sm:text-6xl font-bold text-gray-900 bg-white rounded-lg p-3 sm:p-4 shadow-lg border-2 transition-all duration-1000 ${
                  currentStep >= 2 ? 'border-orange-400' : 'border-gray-200'
                }`}>
                  <div className="flex flex-col items-center" style={{lineHeight: '1'}}>
                    <div className={`px-2 pb-1 rounded-t transition-all duration-1000 ${
                      highlightedPart === 'numerator' ? 'bg-red-200' : 'bg-red-50'
                    }`}>3</div>
                    <div className="w-full h-1 bg-gray-800 my-1"></div>
                    <div className={`px-2 pt-1 rounded-b transition-all duration-1000 ${
                      highlightedPart === 'denominator' ? 'bg-blue-200' : 'bg-blue-50'
                    }`}>5</div>
                </div>
              </div>
            </div>
            
              {/* Explication du dénominateur - Apparaît à l'étape 4 */}
              {currentStep >= 4 ? (
                <div className="animate-fade-in order-2">
                  <div className={`w-full sm:w-52 p-2 sm:p-3 rounded-lg border-2 bg-blue-100 border-blue-300 shadow-md transition-all duration-1000 ${
                    highlightedPart === 'denominator' ? 'scale-105 shadow-lg border-blue-500' : ''
                  }`}>
                    {/* Flèche pointant vers la gauche - cachée sur mobile */}
                    <div className="hidden sm:flex justify-start mb-2">
                      <div className="w-0 h-0 border-r-5 border-l-0 border-t-3 border-b-3 border-transparent border-r-blue-400"></div>
              </div>
                    <div className="text-sm sm:text-base font-bold text-blue-700 text-center mb-1">DÉNOMINATEUR</div>
                    <p className="text-blue-600 font-medium text-center text-xs sm:text-sm mb-1">Combien je COUPE</p>
                    <div className="text-blue-800 text-center text-xs sm:text-sm">
                      5 parts
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:block sm:w-52"></div> // Espace réservé desktop seulement
            )}
          </div>
          </div>
        )}

                {/* Récapitulatif - Apparaît à l'étape 5 */}
        {currentStep >= 5 && (
          <div className="bg-green-50 rounded-lg p-2 sm:p-4 border-2 border-green-300 mt-3 sm:mt-6 animate-fade-in">
            <div className="text-sm sm:text-lg mb-2 sm:mb-3 text-gray-900">🎉 <strong>Récapitulatif :</strong></div>
            <div className="text-xs sm:text-sm text-green-800">
              Dans la fraction <strong className="text-sm sm:text-lg text-gray-900">3/5</strong> :
                <br />
                • <strong className="text-red-700">3</strong> = numérateur = combien je PRENDS
                <br />
                • <strong className="text-blue-700">5</strong> = dénominateur = en combien je COUPE
              </div>
            </div>
          )}

                {/* Section d'exemples supplémentaires - Réduite */}
        <div className="mt-3 sm:mt-6">
          <h4 className="text-sm sm:text-lg font-bold text-center text-gray-900 mb-2 sm:mb-4">📝 Autres exemples :</h4>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* Exemple 1/2 */}
            <div className="bg-white rounded-lg p-1 sm:p-3 shadow-sm text-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                <div className="flex flex-col items-center" style={{lineHeight: '1'}}>
                  <div className="border-b-2 border-gray-800 px-1">1</div>
                  <div className="px-1">2</div>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                <strong className="text-red-600">1</strong> part sur <strong className="text-blue-600">2</strong>
              </div>
        </div>

            {/* Exemple 2/3 */}
            <div className="bg-white rounded-lg p-1 sm:p-3 shadow-sm text-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                <div className="flex flex-col items-center" style={{lineHeight: '1'}}>
                  <div className="border-b-2 border-gray-800 px-1">2</div>
                  <div className="px-1">3</div>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                <strong className="text-red-600">2</strong> parts sur <strong className="text-blue-600">3</strong>
              </div>
            </div>

            {/* Exemple 4/7 */}
            <div className="bg-white rounded-lg p-1 sm:p-3 shadow-sm text-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                <div className="flex flex-col items-center" style={{lineHeight: '1'}}>
                  <div className="border-b-2 border-gray-800 px-1">4</div>
                  <div className="px-1">7</div>
      </div>
              </div>
              <div className="text-xs text-gray-600">
                <strong className="text-red-600">4</strong> parts sur <strong className="text-blue-600">7</strong>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

// Animation interactive pour l'introduction aux fractions
function FractionIntroAnimation({ 
  highlightedElement,
  animatingRef,
  audioRef,
  updateAudioState
}: {
  highlightedElement?: string | null;
  animatingRef?: React.MutableRefObject<boolean>;
  audioRef?: React.MutableRefObject<boolean>;
  updateAudioState?: (isPlaying: boolean) => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlayingVocal, setIsPlayingAudio] = useState(false);
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Mettre à jour les refs quand l'animation change
  useEffect(() => {
    if (animatingRef) {
      animatingRef.current = isAnimating || isPlayingVocal;
    }
    if (audioRef) {
      audioRef.current = isPlayingVocal;
      console.log('🔊 FractionIntroAnimation audioRef updated:', isPlayingVocal);
    }
    if (updateAudioState) {
      updateAudioState(isPlayingVocal);
    }
  }, [isAnimating, isPlayingVocal, animatingRef, audioRef, updateAudioState]);
  
  // Refs locales pour ce composant
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);



  // Fonction pour jouer l'audio (locale) - version robuste
  function localPlayAudio(text: string) {
    return new Promise<void>((resolve) => {
      console.log('🎤 FractionIntro playAudio called, stopSignal:', stopSignalRef.current);
      if (stopSignalRef.current) {
        console.log('❌ Audio cancelled (FractionIntro) before start due to stopSignal');
        resolve();
        return;
      }

      setIsPlayingAudio(true);
      
      // Arrêter tout audio précédent
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      
      currentAudioRef.current = utterance;

      utterance.onend = () => {
        console.log('Audio ended (FractionIntro):', text.substring(0, 30) + '...');
        setIsPlayingAudio(false);
        currentAudioRef.current = null;
        resolve();
      };

      utterance.onerror = () => {
        console.log('Audio error (FractionIntro):', text.substring(0, 30) + '...');
        setIsPlayingAudio(false);
        currentAudioRef.current = null;
        resolve();
      };

      // Vérifier encore une fois avant de parler
      if (stopSignalRef.current) {
        console.log('Audio cancelled (FractionIntro) before speak due to stopSignal');
        setIsPlayingAudio(false);
        resolve();
        return;
      }
      
      console.log('Starting audio (FractionIntro):', text.substring(0, 50) + '...');
      speechSynthesis.speak(utterance);
    });
  }

  // Fonction pour attendre
  const wait = (ms: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  };

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt FORCÉ (FractionIntro) de tous les vocaux et animations');
    
    stopSignalRef.current = true;
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      console.log('🔇 speechSynthesis.cancel() forcé (FractionIntro)');
    }
    
    setTimeout(() => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() 2e tentative (FractionIntro)');
      }
    }, 100);
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    setIsPlayingAudio(false);
    setIsAnimating(false);
    setSamSizeExpanded(false);
    setHasStarted(false);
  };

  // Effect pour gérer les changements d'onglet et navigation dans FractionIntroAnimation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handlePageHide = () => {
      stopAllVocalsAndAnimations();
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      stopAllVocalsAndAnimations();
    };

    const handleGlobalStop = () => {
      stopAllVocalsAndAnimations();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('stopAllAnimations', handleGlobalStop);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('stopAllAnimations', handleGlobalStop);
      stopAllVocalsAndAnimations();
    };
  }, []);

  // Animation complète avec étapes
  const startAnimation = async () => {
    if (isPlayingVocal || isAnimating) {
      // Arrêter l'animation
      console.log('🛑 Arrêt FractionIntro en cours');
      stopSignalRef.current = true;
      speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsAnimating(false);
      setSamSizeExpanded(false);
      setCurrentStep(0);
      return;
    }

    // Arrêter toute animation en cours dans d'autres composants
    window.dispatchEvent(new CustomEvent('stopAllAnimations'));

    // Scroller vers la section fraction-intro
    const element = document.getElementById('fraction-intro');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }

    console.log('🚀 Démarrage animation FractionIntro - Reset stopSignal');
    setIsPlayingAudio(true);
    setIsAnimating(true);
    setHasStarted(true);
    setSamSizeExpanded(true);
    stopSignalRef.current = false;
    setCurrentStep(0);
    
    // Attendre un petit délai pour s'assurer que le reset est pris en compte
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // Étape 1: Introduction
      await localPlayAudio("Salut petit pâtissier ! Aujourd'hui on va apprendre ce qu'est une fraction avec un délicieux gâteau !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      setCurrentStep(1);
      await localPlayAudio("Regarde ! J'ai un beau gâteau entier. C'est 1 gâteau complet !");
      if (stopSignalRef.current) return;
      await wait(2000);

      // Étape 2: Couper le gâteau
      setCurrentStep(2);
      await localPlayAudio("Maintenant, attention ! Je vais couper mon gâteau en 4 parts égales !");
      if (stopSignalRef.current) return;
      await wait(1500);

      // Étape 3: Montrer une part
      setCurrentStep(3);
      await localPlayAudio("Super ! Maintenant j'ai 4 parts égales. Si je prends 1 part sur les 4, j'ai un quart !");
      if (stopSignalRef.current) return;
      await wait(2000);

      // Étape 4: Expliquer la fraction
      setCurrentStep(4);
      await localPlayAudio("1 part sur 4, ça s'écrit 1 sur 4, ou 1/4 ! C'est ça une fraction !");
      if (stopSignalRef.current) return;
      await wait(2000);

      // Étape 5: Récapitulatif
      setCurrentStep(5);
      await localPlayAudio("Retiens bien : une fraction, c'est quand on coupe quelque chose en parts égales et qu'on en prend une ou plusieurs !");
      if (stopSignalRef.current) return;
      await wait(2000);

      await localPlayAudio("Clique sur les boutons pour revoir chaque étape quand tu veux !");
      
    } catch (error) {
      console.error('Erreur lors de l\'animation:', error);
    } finally {
      setIsPlayingAudio(false);
      setIsAnimating(false);
      setSamSizeExpanded(false);
      stopSignalRef.current = false;
    }
  };

  // Nettoyer l'audio au démontage
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const renderCakeStep = () => {
    switch (currentStep) {
      case 0:
      case 1:
        // Gâteau entier avec animation de rebond
        return (
          <div className="text-center transform transition-all duration-1000">
            <div className="mb-3 animate-bounce">
              <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto drop-shadow-lg">
                <defs>
                  <radialGradient id="cakeGradient" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </radialGradient>
                </defs>
                <circle cx="60" cy="60" r="50" fill="url(#cakeGradient)" stroke="#92400e" strokeWidth="4" className="animate-pulse"/>
                <text x="60" y="70" textAnchor="middle" fontSize="24" fill="#92400e" fontWeight="bold">🍰</text>
                {/* Petites étoiles qui scintillent */}
                <circle cx="30" cy="30" r="2" fill="#fbbf24" className="animate-ping" />
                <circle cx="90" cy="40" r="1.5" fill="#f59e0b" className="animate-ping" style={{animationDelay: '0.5s'}} />
                <circle cx="85" cy="85" r="1" fill="#fbbf24" className="animate-ping" style={{animationDelay: '1s'}} />
              </svg>
            </div>
            <div className="text-xl font-bold text-gray-800 animate-pulse">🎂 Gâteau entier magique !</div>
            <div className="text-lg text-gray-600 mt-2">= 1 gâteau complet</div>
          </div>
        );

      case 2:
        // Gâteau avec lignes de coupe qui apparaissent
        return (
          <div className="text-center">
            <div className="mb-3 relative">
              <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
                <defs>
                  <radialGradient id="cakeGradient2" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </radialGradient>
                </defs>
                <circle cx="60" cy="60" r="50" fill="url(#cakeGradient2)" stroke="#92400e" strokeWidth="4"/>
                
                {/* Lignes de coupe animées */}
                <line x1="60" y1="10" x2="60" y2="110" stroke="#dc2626" strokeWidth="3" className="animate-pulse" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" values="10;0" dur="1s" repeatCount="indefinite"/>
                </line>
                <line x1="10" y1="60" x2="110" y2="60" stroke="#dc2626" strokeWidth="3" className="animate-pulse" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" values="10;0" dur="1s" repeatCount="indefinite" begin="0.5s"/>
                </line>
                
                <text x="60" y="70" textAnchor="middle" fontSize="20" fill="#92400e" fontWeight="bold">🍰</text>
                
                {/* Effet de coupe avec des étincelles */}
                <circle cx="60" cy="20" r="3" fill="#ef4444" className="animate-ping" />
                <circle cx="60" cy="100" r="3" fill="#ef4444" className="animate-ping" style={{animationDelay: '0.3s'}} />
                <circle cx="20" cy="60" r="3" fill="#ef4444" className="animate-ping" style={{animationDelay: '0.6s'}} />
                <circle cx="100" cy="60" r="3" fill="#ef4444" className="animate-ping" style={{animationDelay: '0.9s'}} />
              </svg>
              
              {/* Couteau animé */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 animate-bounce">
                <span className="text-2xl">🔪</span>
              </div>
            </div>
            <div className="text-xl font-bold text-red-600 animate-pulse">✂️ Je coupe en 4 parts égales !</div>
          </div>
        );

      case 3:
      case 4:
      case 5:
        // Gâteau divisé avec une part mise en évidence
        return (
          <div className="text-center">
            <div className="mb-3">
              <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
                <defs>
                  <radialGradient id="selectedPart" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </radialGradient>
                  <radialGradient id="normalPart" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </radialGradient>
                </defs>
                
                {/* 4 parts de gâteau */}
                {Array.from({ length: 4 }, (_, i) => {
                  const angle = (360 / 4) * i - 90;
                  const nextAngle = (360 / 4) * (i + 1) - 90;
                  const angleRad = (angle * Math.PI) / 180;
                  const nextAngleRad = (nextAngle * Math.PI) / 180;
                  
                  const x1 = 60 + 50 * Math.cos(angleRad);
                  const y1 = 60 + 50 * Math.sin(angleRad);
                  const x2 = 60 + 50 * Math.cos(nextAngleRad);
                  const y2 = 60 + 50 * Math.sin(nextAngleRad);
                  
                  const pathData = `M 60 60 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
                  
                  return (
                    <path
                      key={i}
                      d={pathData}
                      fill={i === 0 ? 'url(#selectedPart)' : 'url(#normalPart)'}
                      stroke="#92400e"
                      strokeWidth="3"
                      className={i === 0 ? 'animate-pulse' : ''}
                    />
                  );
                })}
                
                {/* Étincelles sur la part sélectionnée */}
                {currentStep >= 3 && (
                  <>
                    <circle cx="60" cy="35" r="2" fill="#22d3ee" className="animate-ping" />
                    <circle cx="75" cy="45" r="1.5" fill="#06b6d4" className="animate-ping" style={{animationDelay: '0.5s'}} />
                    <circle cx="65" cy="25" r="1" fill="#22d3ee" className="animate-ping" style={{animationDelay: '1s'}} />
                  </>
                )}
                
                <text x="60" y="70" textAnchor="middle" fontSize="16" fill="#92400e" fontWeight="bold">🍰</text>
              </svg>
            </div>
            <div className="text-xl font-bold text-green-600">✨ 1 part sur 4 = 1/4 !</div>
            <div className="text-lg text-gray-600 mt-2">Une délicieuse fraction !</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg border-2 border-pink-200">
      <h3 className="text-lg sm:text-2xl font-bold text-center text-gray-900 mb-3 sm:mb-6">
        🍰 Qu'est-ce qu'une fraction ?
      </h3>
      
      {/* Explication textuelle simple */}
      <div className="bg-pink-50 rounded-lg p-2 sm:p-4 mb-3 sm:mb-6 border-2 border-pink-200">
        <p className="text-center text-sm sm:text-lg font-bold text-pink-800 mb-1 sm:mb-3">
          Une fraction, c'est comme partager un gâteau ! 🍰
        </p>
        <p className="text-center text-xs sm:text-base text-gray-700">
          Quand on divise quelque chose en plusieurs parts égales, on utilise les fractions pour dire combien de parts on prend.
        </p>
      </div>
      
      {/* Zone d'animation principale - Toutes les étapes affichées avec surbrillance progressive */}
      <div className="bg-gradient-to-br from-pink-50 to-yellow-50 rounded-lg p-3 sm:p-6 mb-3 sm:mb-6 border-2 border-pink-200">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Étape 1: Gâteau entier */}
          <div className={`text-center rounded-lg p-2 sm:p-4 shadow-md transition-all duration-1000 ${
            currentStep >= 1 
              ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-400 scale-105' 
              : 'bg-white'
          }`}>
            <h4 className="font-bold text-pink-800 mb-1 sm:mb-3 text-sm sm:text-sm">1. Gâteau entier</h4>
            <div className="mb-1 sm:mb-3">
              <svg width="70" height="70" viewBox="0 0 120 120" className="mx-auto drop-shadow-lg sm:w-[100px] sm:h-[100px]">
                <defs>
                  <radialGradient id="cakeGradient1" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </radialGradient>
                </defs>
                <circle cx="60" cy="60" r="50" fill="url(#cakeGradient1)" stroke="#92400e" strokeWidth="4"/>
                <text x="60" y="70" textAnchor="middle" fontSize="20" fill="#92400e" fontWeight="bold">🍰</text>
              </svg>
            </div>
            <div className="text-sm sm:text-lg font-bold text-gray-800">🎂 1 gâteau complet</div>
          </div>

          {/* Étape 2: Couper le gâteau */}
          <div className={`text-center rounded-lg p-2 sm:p-4 shadow-md transition-all duration-1000 ${
            currentStep >= 2 
              ? 'bg-gradient-to-br from-red-100 to-pink-100 border-4 border-red-400 scale-105' 
              : 'bg-white'
          }`}>
            <h4 className="font-bold text-pink-800 mb-1 sm:mb-3 text-sm sm:text-sm">2. Je coupe</h4>
            <div className="mb-1 sm:mb-3">
              <svg width="70" height="70" viewBox="0 0 120 120" className="mx-auto sm:w-[100px] sm:h-[100px]">
                <defs>
                  <radialGradient id="cakeGradient2" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </radialGradient>
                </defs>
                <circle cx="60" cy="60" r="50" fill="url(#cakeGradient2)" stroke="#92400e" strokeWidth="4"/>
                <line x1="60" y1="10" x2="60" y2="110" stroke="#dc2626" strokeWidth="3"/>
                <line x1="10" y1="60" x2="110" y2="60" stroke="#dc2626" strokeWidth="3"/>
                <text x="60" y="70" textAnchor="middle" fontSize="16" fill="#92400e" fontWeight="bold">🍰</text>
              </svg>
            </div>
            <div className="text-sm sm:text-lg font-bold text-red-600">✂️ En 4 parts égales</div>
          </div>

          {/* Étape 3: Gâteau divisé */}
          <div className={`text-center rounded-lg p-2 sm:p-4 shadow-md transition-all duration-1000 ${
            currentStep >= 3 
              ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-green-400 scale-105' 
              : 'bg-white'
          }`}>
            <h4 className="font-bold text-pink-800 mb-1 sm:mb-3 text-sm sm:text-sm">3. J'ai 4 parts</h4>
            <div className="mb-1 sm:mb-3">
              <svg width="70" height="70" viewBox="0 0 120 120" className="mx-auto sm:w-[100px] sm:h-[100px]">
                <defs>
                  <radialGradient id="selectedPart2" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </radialGradient>
                  <radialGradient id="normalPart2" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </radialGradient>
                </defs>
                
                {Array.from({ length: 4 }, (_, i) => {
                  const angle = (360 / 4) * i - 90;
                  const nextAngle = (360 / 4) * (i + 1) - 90;
                  const angleRad = (angle * Math.PI) / 180;
                  const nextAngleRad = (nextAngle * Math.PI) / 180;
                  
                  const x1 = 60 + 50 * Math.cos(angleRad);
                  const y1 = 60 + 50 * Math.sin(angleRad);
                  const x2 = 60 + 50 * Math.cos(nextAngleRad);
                  const y2 = 60 + 50 * Math.sin(nextAngleRad);
                  
                  const pathData = `M 60 60 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
                  
                  return (
                    <path
                      key={i}
                      d={pathData}
                      fill={i === 0 ? 'url(#selectedPart2)' : 'url(#normalPart2)'}
                      stroke="#92400e"
                      strokeWidth="3"
                    />
                  );
                })}
                
                <text x="60" y="70" textAnchor="middle" fontSize="14" fill="#92400e" fontWeight="bold">🍰</text>
              </svg>
            </div>
            <div className="text-sm sm:text-lg font-bold text-green-600">✨ 1 part sur 4</div>
          </div>

          {/* Étape 4: Fraction */}
          <div className={`text-center rounded-lg p-2 sm:p-4 shadow-md transition-all duration-1000 ${
            currentStep >= 4 
              ? 'bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-blue-400 scale-105' 
              : 'bg-white'
          }`}>
            <h4 className="font-bold text-pink-800 mb-1 sm:mb-3 text-sm sm:text-sm">4. C'est une fraction !</h4>
            <div className="mb-1 sm:mb-3 flex justify-center items-center">
              <div className="text-2xl sm:text-4xl font-bold text-gray-900">
                <div className="flex flex-col items-center" style={{lineHeight: '1'}}>
                  <div className="border-b-2 border-gray-800 px-1">1</div>
                  <div className="px-1">4</div>
                </div>
              </div>
            </div>
            <div className="text-sm sm:text-lg font-bold text-blue-600">📝 1/4 = un quart</div>
          </div>
        </div>

        {/* Message pédagogique selon l'étape */}
        {currentStep > 0 && (
          <div className="bg-blue-50 rounded-lg p-2 sm:p-4 border-2 border-blue-200 mt-3 sm:mt-6 animate-fade-in">
            <div className="text-center">
              {currentStep === 1 && (
                <p className="text-sm sm:text-lg font-bold text-blue-800">🎂 Voici un magnifique gâteau entier !</p>
              )}
              {currentStep === 2 && (
                <p className="text-sm sm:text-lg font-bold text-blue-800">✂️ On coupe le gâteau en parts égales !</p>
              )}
              {currentStep === 3 && (
                <p className="text-sm sm:text-lg font-bold text-blue-800">🍰 Maintenant on a 4 parts identiques !</p>
              )}
              {currentStep === 4 && (
                <p className="text-sm sm:text-lg font-bold text-blue-800">📝 1 part sur 4 = 1/4 (un quart) !</p>
              )}
              {currentStep === 5 && (
                <div>
                  <p className="text-sm sm:text-lg font-bold text-blue-800 mb-2 sm:mb-3">🎯 Une fraction, c'est :</p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                    <div className="bg-white rounded-lg p-2 sm:p-3 border-2 border-yellow-300">
                      <div className="text-lg sm:text-2xl mb-1 sm:mb-2">✂️</div>
                      <div className="font-bold text-gray-800 text-xs sm:text-base">Je COUPE</div>
                      <div className="text-xs sm:text-sm text-gray-600">en parts égales</div>
                    </div>
                    <div className="bg-white rounded-lg p-2 sm:p-3 border-2 border-green-300">
                      <div className="text-lg sm:text-2xl mb-1 sm:mb-2">✋</div>
                      <div className="font-bold text-gray-800 text-xs sm:text-base">Je PRENDS</div>
                      <div className="text-xs sm:text-sm text-gray-600">une ou plusieurs parts</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Boutons de contrôle */}
      <div className="flex justify-center mb-3 sm:mb-6">
        <button
          id="start-intro-animation"
          onClick={startAnimation}
          disabled={false}
          className={`relative px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 transform ${
            isPlayingVocal || isAnimating
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white hover:scale-105 shadow-lg'
          } ${highlightedElement === 'start-intro-animation' ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-110' : ''}`}
        >
          {isPlayingVocal || isAnimating ? (
            <>🛑 Arrêter l'animation</>
          ) : (
            <>🎬 Commencer l'animation magique !</>
          )}
        </button>
      </div>

      {/* Navigation des étapes */}
      {hasStarted && (
        <div className="flex justify-center space-x-2 mb-3 sm:mb-6">
          {['🎂', '✂️', '🍰', '📝', '🎯'].map((emoji, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index + 1)}
              className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full font-bold text-sm sm:text-lg transition-all duration-300 ${
                currentStep === index + 1
                  ? 'bg-pink-500 text-white scale-110 shadow-lg'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:scale-105'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Messages pédagogiques selon l'étape */}
      {currentStep > 0 && (
        <div className="bg-blue-50 rounded-lg p-2 sm:p-4 border-2 border-blue-200">
          <div className="text-center">
            {currentStep === 1 && (
              <p className="text-sm sm:text-lg font-bold text-blue-800">🎂 Voici un magnifique gâteau entier !</p>
            )}
            {currentStep === 2 && (
              <p className="text-sm sm:text-lg font-bold text-blue-800">✂️ On coupe le gâteau en parts égales !</p>
            )}
            {currentStep === 3 && (
              <p className="text-sm sm:text-lg font-bold text-blue-800">🍰 Maintenant on a 4 parts identiques !</p>
            )}
            {currentStep === 4 && (
              <p className="text-sm sm:text-lg font-bold text-blue-800">📝 1 part sur 4 = 1/4 (un quart) !</p>
            )}
            {currentStep === 5 && (
              <div>
                <p className="text-sm sm:text-lg font-bold text-blue-800 mb-2 sm:mb-3">🎯 Une fraction, c'est :</p>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                  <div className="bg-white rounded-lg p-2 sm:p-3 border-2 border-yellow-300">
                    <div className="text-lg sm:text-2xl mb-1 sm:mb-2">✂️</div>
                    <div className="font-bold text-gray-800 text-xs sm:text-base">Je COUPE</div>
                    <div className="text-xs sm:text-sm text-gray-600">en parts égales</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 sm:p-3 border-2 border-green-300">
                    <div className="text-lg sm:text-2xl mb-1 sm:mb-2">✋</div>
                    <div className="font-bold text-gray-800 text-xs sm:text-base">Je PRENDS</div>
                    <div className="text-xs sm:text-sm text-gray-600">une ou plusieurs parts</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


    </div>
  );
}

// Animation interactive pour le vocabulaire
function VocabulaireAnimation({ 
  highlightedElement,
  audioRef,
  updateAudioState
}: {
  highlightedElement?: string | null;
  audioRef?: React.MutableRefObject<boolean>;
  updateAudioState?: (isPlaying: boolean) => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlayingVocal, setIsPlayingAudio] = useState(false);
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Mettre à jour l'audioRef quand l'audio change
  useEffect(() => {
    if (audioRef) {
      audioRef.current = isPlayingVocal;
      console.log('🔊 VocabulaireAnimation audioRef updated:', isPlayingVocal);
    }
    if (updateAudioState) {
      updateAudioState(isPlayingVocal);
    }
  }, [isPlayingVocal, audioRef, updateAudioState]);
  
  // Refs locales pour ce composant
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);



  // Fonction pour jouer l'audio (locale) - version robuste
  function localPlayAudio(text: string) {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        console.log('🔇 Audio Vocabulaire annulé (stopSignal actif)');
        resolve();
        return;
      }

      setIsPlayingAudio(true);
      
      // Arrêter tout audio précédent
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      
      currentAudioRef.current = utterance;

      utterance.onend = () => {
        console.log('Audio ended (Vocabulaire):', text.substring(0, 30) + '...');
        setIsPlayingAudio(false);
        currentAudioRef.current = null;
        resolve();
      };

      utterance.onerror = () => {
        console.log('Audio error (Vocabulaire):', text.substring(0, 30) + '...');
        setIsPlayingAudio(false);
        currentAudioRef.current = null;
        resolve();
      };

      // Vérifier encore une fois avant de parler
      if (stopSignalRef.current) {
        console.log('Audio cancelled (Vocabulaire) before speak due to stopSignal');
        setIsPlayingAudio(false);
        resolve();
        return;
      }
      
      console.log('Starting audio (Vocabulaire):', text.substring(0, 50) + '...');
      speechSynthesis.speak(utterance);
    });
  }

  // Fonction pour attendre
  const wait = (ms: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  };

  // Fonction pour convertir une fraction en son nom correct
  const getFractionName = (numerator: string, denominator: string) => {
    const num = parseInt(numerator);
    const den = parseInt(denominator);
    
    // Cas spéciaux pour les fractions simples
    if (num === 1) {
      switch (den) {
        case 2: return "un demi";
        case 3: return "un tiers";
        case 4: return "un quart";
        case 5: return "un cinquième";
        case 6: return "un sixième";
        case 7: return "un septième";
        case 8: return "un huitième";
        case 9: return "un neuvième";
        case 10: return "un dixième";
        default: return `un sur ${den}`;
      }
    }
    
    // Pour les autres cas, utiliser le nom de la fraction
    if (num === 2 && den === 3) return "deux tiers";
    if (num === 3 && den === 4) return "trois quarts";
    if (num === 2 && den === 5) return "deux cinquièmes";
    if (num === 3 && den === 5) return "trois cinquièmes";
    if (num === 4 && den === 5) return "quatre cinquièmes";
    
    // Cas général (fallback)
    return `${numerator} sur ${denominator}`;
  };

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt FORCÉ (Vocabulaire) de tous les vocaux et animations');
    
    stopSignalRef.current = true;
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      console.log('🔇 speechSynthesis.cancel() forcé (Vocabulaire)');
    }
    
    setTimeout(() => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() 2e tentative (Vocabulaire)');
      }
    }, 100);
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    setIsPlayingAudio(false);
    setSamSizeExpanded(false);
    setHasStarted(false);
  };

  // Effect pour gérer les changements d'onglet et navigation dans VocabulaireAnimation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handlePageHide = () => {
      stopAllVocalsAndAnimations();
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      stopAllVocalsAndAnimations();
    };

    const handleGlobalStop = () => {
      stopAllVocalsAndAnimations();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('stopAllAnimations', handleGlobalStop);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('stopAllAnimations', handleGlobalStop);
      stopAllVocalsAndAnimations();
    };
  }, []);

  // Animation de lecture automatique
  const startReadAnimation = async () => {
    if (isPlayingVocal) {
      // Arrêter l'audio
      stopSignalRef.current = true;
      speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setSamSizeExpanded(false);
      return;
    }

    setIsPlayingAudio(true);
    setHasStarted(true);
    setSamSizeExpanded(true);
    stopSignalRef.current = false;

    try {
      await localPlayAudio("Salut ! Je vais t'expliquer le vocabulaire des fractions avec des exemples visuels !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      
      // Parcourir tous les exemples
      for (let i = 0; i < examples.length; i++) {
        if (stopSignalRef.current) return;
        
        setCurrentStep(i);
        await wait(500);
        
        const example = examples[i];
        const [numerator, denominator] = example.fraction.split('/');
        
        await localPlayAudio(`Regardons ${example.fraction}. J'ai coupé en ${denominator} parts et j'en colorie ${numerator}. Cela se dit : ${example.name}.`);
        if (stopSignalRef.current) return;
        
        await wait(1500);
      }
      
      await localPlayAudio("Voilà ! Tu connais maintenant le vocabulaire des principales fractions. Tu peux naviguer avec les boutons pour revoir chaque exemple !");
      
    } catch (error) {
      console.error('Erreur lors de la lecture:', error);
    } finally {
      setIsPlayingAudio(false);
      setSamSizeExpanded(false);
      stopSignalRef.current = false;
    }
  };

  // Nettoyer l'audio au démontage
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);
  
  const examples = [
    { fraction: '1/2', name: 'une moitié', color: '#f97316' },
    { fraction: '1/3', name: 'un tiers', color: '#10b981' },
    { fraction: '1/4', name: 'un quart', color: '#3b82f6' },
    { fraction: '1/5', name: 'un cinquième', color: '#8b5cf6' },
    { fraction: '1/6', name: 'un sixième', color: '#ec4899' },
    { fraction: '1/7', name: 'un septième', color: '#06b6d4' },
    { fraction: '1/8', name: 'un huitième', color: '#84cc16' },
    { fraction: '1/9', name: 'un neuvième', color: '#f59e0b' },
    { fraction: '1/10', name: 'un dixième', color: '#ef4444' }
  ];

  const currentExample = examples[currentStep];

  const renderPieChart = (parts: number, color: string) => {
    const radius = 40;
    const anglePerPart = 360 / parts;
    
    return (
      <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto">
        {Array.from({ length: parts }, (_, i) => {
          const startAngle = i * anglePerPart - 90;
          const endAngle = (i + 1) * anglePerPart - 90;
          
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          
          const x1 = 50 + radius * Math.cos(startRad);
          const y1 = 50 + radius * Math.sin(startRad);
          const x2 = 50 + radius * Math.cos(endRad);
          const y2 = 50 + radius * Math.sin(endRad);
          
          const largeArcFlag = anglePerPart > 180 ? 1 : 0;
          
          const pathData = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');
          
          return (
            <path
              key={i}
              d={pathData}
              fill={i === 0 ? color : '#f3f4f6'}
              stroke="#6b7280"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg border-2 border-blue-200" data-vocab-animation>
      <h3 className="text-lg sm:text-2xl font-bold text-center text-gray-900 mb-3 sm:mb-6">
        📚 Apprendre le vocabulaire
      </h3>
      
      <div className="bg-blue-50 rounded-lg p-2 sm:p-4 mb-3 sm:mb-6">
        <p className="text-center text-sm sm:text-lg font-bold text-blue-800">
          Découvre comment nommer les fractions !
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-8 items-center">
        <div className="text-center">
          <div className="mb-2 sm:mb-4">
            {renderPieChart(parseInt(currentExample.fraction.split('/')[1]), currentExample.color)}
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-2">
            <FractionMath a={currentExample.fraction.split('/')[0]} b={currentExample.fraction.split('/')[1]} size="text-lg sm:text-2xl" />
          </div>
          
          {/* Explication pédagogique */}
          <div className="bg-yellow-50 rounded-lg p-2 sm:p-3 mt-2 sm:mt-3 border-2 border-yellow-200">
            <div className="text-xs sm:text-sm font-bold text-gray-700 mb-1">
              📍 Explication :
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              <div className="mb-1">
                🔺 <strong>En haut :</strong> J'en colorie <strong>{currentExample.fraction.split('/')[0]}</strong>
              </div>
              <div>
                🔻 <strong>En bas :</strong> J'ai coupé en <strong>{currentExample.fraction.split('/')[1]}</strong> parts
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => {
              console.log('🔊 Clic sur bouton écouter - Reset stopSignal');
              // Arrêter toute animation en cours
              window.dispatchEvent(new CustomEvent('stopAllAnimations'));
              
              // Scroller vers la section apprendre-vocabulaire
              const element = document.getElementById('apprendre-vocabulaire');
              if (element) {
                element.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center',
                  inline: 'nearest'
                });
              }
              
              stopSignalRef.current = false; // Réinitialiser pour permettre l'audio
              const numerator = currentExample.fraction.split('/')[0];
              const denominator = currentExample.fraction.split('/')[1];
              const fractionName = getFractionName(numerator, denominator);
              localPlayAudio(fractionName);
            }}
            className="text-3xl sm:text-4xl mb-2 sm:mb-3 p-3 sm:p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer border-3 border-white"
            title="🎵 Cliquer pour entendre la fraction"
          >
            <span className="drop-shadow-lg filter">🔊</span>
          </button>
          <div className="text-lg sm:text-2xl font-bold text-blue-600 bg-blue-100 p-2 sm:p-4 rounded-lg">
            {currentExample.name}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-2 sm:space-x-4 mt-3 sm:mt-6">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="bg-gray-500 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors disabled:opacity-50 text-sm sm:text-base min-h-[2.5rem] sm:min-h-[3rem]"
        >
          ← Précédent
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(examples.length - 1, currentStep + 1))}
          disabled={currentStep === examples.length - 1}
          className="bg-blue-500 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm sm:text-base min-h-[2.5rem] sm:min-h-[3rem]"
        >
          Suivant →
        </button>
      </div>

      <div className="text-center mt-4 text-sm text-gray-600">
        {currentStep + 1} / {examples.length}
      </div>


    </div>
  );
}

// Exercice de coloriage individuel (question par question)
function ExerciceColorageIndividuel() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coloredParts, setColoredParts] = useState(new Set());
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Fonction pour sauvegarder le progrès et calculer les XP
  const saveProgress = (finalScore: number) => {
    const sectionId = 'vocabulaire-coloriage';
    const maxScore = exercises.length;
    const percentage = finalScore / maxScore;
    const baseXP = 20; // XP de base pour cette section
    const earnedXP = Math.round(baseXP * percentage);
    
    const progressData = {
      sectionId,
      score: finalScore,
      maxScore,
      attempts: 1,
      completed: true,
      completionDate: new Date().toISOString(),
      xpEarned: earnedXP
    };

    // Sauvegarder dans localStorage
    const savedProgress = localStorage.getItem('ce1-fractions-simples-progress');
    let allProgress = [];
    
    if (savedProgress) {
      allProgress = JSON.parse(savedProgress);
    }
    
    // Mettre à jour ou ajouter le progrès de cette section
    const existingIndex = allProgress.findIndex((p: any) => p.sectionId === sectionId);
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progressData;
    } else {
      allProgress.push(progressData);
    }
    
    localStorage.setItem('ce1-fractions-simples-progress', JSON.stringify(allProgress));
    
    // Déclencher un événement pour notifier les autres composants
    window.dispatchEvent(new Event('storage'));
    
    return earnedXP;
  };

  const exercises = [
    { id: 1, fraction: '4/7', shape: 'rectangle', totalParts: 7, targetParts: 4 },
    { id: 2, fraction: '2/8', shape: 'circle', totalParts: 8, targetParts: 2 },
    { id: 3, fraction: '1/3', shape: 'rectangle', totalParts: 3, targetParts: 1 },
    { id: 4, fraction: '5/8', shape: 'circle', totalParts: 8, targetParts: 5 },
    { id: 5, fraction: '1/4', shape: 'circle', totalParts: 4, targetParts: 1 },
    { id: 6, fraction: '1/3', shape: 'triangle', totalParts: 3, targetParts: 1 },
    { id: 7, fraction: '6/9', shape: 'rectangle', totalParts: 9, targetParts: 6 },
    { id: 8, fraction: '2/3', shape: 'triangle', totalParts: 3, targetParts: 2 },
    { id: 9, fraction: '1/2', shape: 'rectangle', totalParts: 2, targetParts: 1 },
    { id: 10, fraction: '3/5', shape: 'rectangle', totalParts: 5, targetParts: 3 }
  ];

  const currentExercise = exercises[currentQuestion];

  const togglePart = (partIndex: number) => {
    if (isAnswered) return;
    
    const newSet = new Set(coloredParts);
    if (newSet.has(partIndex)) {
      newSet.delete(partIndex);
    } else {
      newSet.add(partIndex);
    }
    setColoredParts(newSet);
  };

  const checkAnswer = () => {
    setIsAnswered(true);
    
    const correct = isCorrect();
    if (correct && !answeredCorrectly.has(currentQuestion)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentQuestion);
        return newSet;
      });
    }

    if (correct) {
      setTimeout(() => {
        if (currentQuestion < exercises.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setColoredParts(new Set());
          setIsAnswered(false);
        } else {
          const newFinalScore = score + (!answeredCorrectly.has(currentQuestion) ? 1 : 0);
          const xpGained = saveProgress(newFinalScore);
          setEarnedXP(xpGained);
          setShowCompletionModal(true);
        }
      }, 1500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < exercises.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setColoredParts(new Set());
      setIsAnswered(false);
    } else {
      // Fin de l'exercice - afficher la modal
      setShowCompletionModal(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setColoredParts(new Set());
      setIsAnswered(false);
    }
  };

  const resetQuestion = () => {
    setColoredParts(new Set());
    setIsAnswered(false);
  };

  const resetAll = () => {
    setCurrentQuestion(0);
    setColoredParts(new Set());
    setIsAnswered(false);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
  };

  const isCorrect = () => {
    return coloredParts.size === currentExercise.targetParts;
  };

  const renderShape = (exercise: any) => {
    if (exercise.shape === 'rectangle') {
      const cols = exercise.totalParts <= 4 ? exercise.totalParts : Math.ceil(Math.sqrt(exercise.totalParts));
      const rows = Math.ceil(exercise.totalParts / cols);
      const cellWidth = 200 / cols;
      const cellHeight = 150 / rows;
      
      return (
        <svg width="220" height="170" viewBox="0 0 220 170" className="mx-auto cursor-pointer">
          {Array.from({ length: exercise.totalParts }, (_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = 10 + col * cellWidth;
            const y = 10 + row * cellHeight;
                         const isColored = coloredParts.has(i);
             
             return (
               <rect
                 key={i}
                 x={x}
                 y={y}
                 width={cellWidth - 2}
                 height={cellHeight - 2}
                 fill={isColored ? '#10b981' : '#f3f4f6'}
                 stroke="#6b7280"
                 strokeWidth="2"
                 onClick={() => togglePart(i)}
                 className="hover:opacity-75 transition-all"
               />
             );
          })}
        </svg>
      );
    }
    
    if (exercise.shape === 'circle') {
      const radius = 60;
      const centerX = 70;
      const centerY = 70;
      const anglePerPart = 360 / exercise.totalParts;
      
      return (
        <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto cursor-pointer">
          {Array.from({ length: exercise.totalParts }, (_, i) => {
            const startAngle = i * anglePerPart - 90;
            const endAngle = (i + 1) * anglePerPart - 90;
            
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            
            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);
            
            const largeArcFlag = anglePerPart > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            const isColored = coloredParts.has(i);
            
            return (
              <path
                key={i}
                d={pathData}
                fill={isColored ? '#10b981' : '#f3f4f6'}
                stroke="#6b7280"
                strokeWidth="2"
                onClick={() => togglePart(i)}
                className="hover:opacity-75 transition-all"
              />
            );
          })}
        </svg>
      );
    }
    
    if (exercise.shape === 'triangle') {
      if (exercise.totalParts === 2) {
        return (
          <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto cursor-pointer">
            <path
              d="M 70 20 L 20 120 L 120 120 Z"
              fill={coloredParts.has(0) ? '#10b981' : '#f3f4f6'}
              stroke="#6b7280"
              strokeWidth="3"
              onClick={() => togglePart(0)}
              className="hover:opacity-75 transition-all"
            />
            <line
              x1="70"
              y1="20"
              x2="70"
              y2="120"
              stroke="#6b7280"
              strokeWidth="3"
            />
            <path
              d="M 70 20 L 70 120 L 120 120 Z"
              fill={coloredParts.has(1) ? '#10b981' : '#f3f4f6'}
              stroke="#6b7280"
              strokeWidth="3"
              onClick={() => togglePart(1)}
              className="hover:opacity-75 transition-all"
            />
          </svg>
        );
      } else {
        return (
          <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto cursor-pointer">
            {Array.from({ length: exercise.totalParts }, (_, i) => {
              const anglePerPart = 360 / exercise.totalParts;
              const startAngle = i * anglePerPart - 90;
              const endAngle = (i + 1) * anglePerPart - 90;
              
              const centerX = 70, centerY = 90, radius = 50;
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const x1 = centerX + radius * Math.cos(startAngleRad);
              const y1 = centerY + radius * Math.sin(startAngleRad);
              const x2 = centerX + radius * Math.cos(endAngleRad);
              const y2 = centerY + radius * Math.sin(endAngleRad);
              
              const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} L ${x2} ${y2} Z`;
              
                             const isColored = coloredParts.has(i);
               
               return (
                 <path
                   key={i}
                   d={pathData}
                   fill={isColored ? '#10b981' : '#f3f4f6'}
                   stroke="#6b7280"
                   strokeWidth="2"
                   onClick={() => togglePart(i)}
                   className="hover:opacity-75 transition-all"
                 />
               );
            })}
          </svg>
        );
      }
    }
    
    if (exercise.shape === 'diamond') {
      return (
        <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto cursor-pointer">
          <path
            d="M 70 20 L 20 70 L 70 120 L 70 70 Z"
            fill={coloredParts.has(0) ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
            onClick={() => togglePart(0)}
            className="hover:opacity-75 transition-all"
          />
          <path
            d="M 70 20 L 120 70 L 70 120 L 70 70 Z"
            fill={coloredParts.has(1) ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
            onClick={() => togglePart(1)}
            className="hover:opacity-75 transition-all"
          />
          <path
            d="M 70 70 L 20 70 L 70 120 Z"
            fill={coloredParts.has(2) ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
            onClick={() => togglePart(2)}
            className="hover:opacity-75 transition-all"
          />
          <path
            d="M 70 70 L 120 70 L 70 120 Z"
            fill={coloredParts.has(3) ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
            onClick={() => togglePart(3)}
            className="hover:opacity-75 transition-all"
          />
        </svg>
      );
    }
    
    return <div></div>;
  };

  const renderCorrectionShape = (exercise: any) => {
    if (exercise.shape === 'rectangle') {
      const cols = exercise.totalParts <= 4 ? exercise.totalParts : Math.ceil(Math.sqrt(exercise.totalParts));
      const rows = Math.ceil(exercise.totalParts / cols);
      const cellWidth = 200 / cols;
      const cellHeight = 150 / rows;
      
      return (
        <svg width="220" height="170" viewBox="0 0 220 170" className="mx-auto">
          {Array.from({ length: exercise.totalParts }, (_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = 10 + col * cellWidth;
            const y = 10 + row * cellHeight;
            const shouldBeColored = i < exercise.targetParts;
            
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={cellWidth - 2}
                height={cellHeight - 2}
                fill={shouldBeColored ? '#10b981' : '#f3f4f6'}
                stroke="#6b7280"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      );
    }
    
    if (exercise.shape === 'circle') {
      const radius = 60;
      const centerX = 70;
      const centerY = 70;
      const anglePerPart = 360 / exercise.totalParts;
      
      return (
        <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
          {Array.from({ length: exercise.totalParts }, (_, i) => {
            const startAngle = i * anglePerPart - 90;
            const endAngle = (i + 1) * anglePerPart - 90;
            
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            
            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);
            
            const largeArcFlag = anglePerPart > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            const shouldBeColored = i < exercise.targetParts;
            
            return (
              <path
                key={i}
                d={pathData}
                fill={shouldBeColored ? '#10b981' : '#f3f4f6'}
                stroke="#6b7280"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      );
    }
    
    if (exercise.shape === 'triangle') {
      if (exercise.totalParts === 2) {
        return (
          <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
            <path
              d="M 70 20 L 20 120 L 120 120 Z"
              fill={0 < exercise.targetParts ? '#10b981' : '#f3f4f6'}
              stroke="#6b7280"
              strokeWidth="3"
            />
            <line
              x1="70"
              y1="20"
              x2="70"
              y2="120"
              stroke="#6b7280"
              strokeWidth="3"
            />
            <path
              d="M 70 20 L 70 120 L 120 120 Z"
              fill={1 < exercise.targetParts ? '#10b981' : '#f3f4f6'}
              stroke="#6b7280"
              strokeWidth="3"
            />
          </svg>
        );
      } else {
        return (
          <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
            {Array.from({ length: exercise.totalParts }, (_, i) => {
              const anglePerPart = 360 / exercise.totalParts;
              const startAngle = i * anglePerPart - 90;
              const endAngle = (i + 1) * anglePerPart - 90;
              
              const centerX = 70, centerY = 90, radius = 50;
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const x1 = centerX + radius * Math.cos(startAngleRad);
              const y1 = centerY + radius * Math.sin(startAngleRad);
              const x2 = centerX + radius * Math.cos(endAngleRad);
              const y2 = centerY + radius * Math.sin(endAngleRad);
              
              const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} L ${x2} ${y2} Z`;
              
              const shouldBeColored = i < exercise.targetParts;
              
              return (
                <path
                  key={i}
                  d={pathData}
                  fill={shouldBeColored ? '#10b981' : '#f3f4f6'}
                  stroke="#6b7280"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        );
      }
    }
    
    if (exercise.shape === 'diamond') {
      return (
        <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
          <path
            d="M 70 20 L 20 70 L 70 120 L 70 70 Z"
            fill={0 < exercise.targetParts ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
          />
          <path
            d="M 70 20 L 120 70 L 70 120 L 70 70 Z"
            fill={1 < exercise.targetParts ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
          />
          <path
            d="M 70 70 L 20 70 L 70 120 Z"
            fill={2 < exercise.targetParts ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
          />
          <path
            d="M 70 70 L 120 70 L 70 120 Z"
            fill={3 < exercise.targetParts ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
          />
        </svg>
      );
    }
    
    return <div></div>;
  };

  return (
    <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg border-2 border-purple-200">
      <div className="text-center mb-3 sm:mb-6">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
          🎨 Exercice de coloriage
        </h3>
        <div className="text-sm sm:text-lg text-gray-600">
          Question {currentQuestion + 1} sur {exercises.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div 
            className="bg-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm sm:text-lg font-bold text-purple-600 mt-2">
          Score : {score}/{exercises.length}
        </div>
      </div>
      
      <div className="bg-purple-50 rounded-lg p-2 sm:p-4 mb-3 sm:mb-6">
        <p className="text-center text-sm sm:text-lg font-bold text-purple-800">
          ✏️ Clique pour colorier <strong>{currentExercise.targetParts}</strong> parts sur <strong>{currentExercise.totalParts}</strong>
        </p>
        <p className="text-center text-lg sm:text-xl font-bold text-purple-900 mt-2">
          <FractionMath a={currentExercise.targetParts.toString()} b={currentExercise.totalParts.toString()} size="text-lg sm:text-2xl" />
        </p>
      </div>

      <div className="text-center mb-3 sm:mb-6">
        {renderShape(currentExercise)}
      </div>

      {isAnswered && !isCorrect() && (
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-green-600 mb-4">✅ Correction</h4>
          <div className="bg-green-50 rounded-lg p-4 max-w-sm mx-auto">
            {renderCorrectionShape(currentExercise)}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Il fallait colorier <strong>{currentExercise.targetParts}</strong> parts sur <strong>{currentExercise.totalParts}</strong>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {!isAnswered ? (
          <button
            onClick={checkAnswer}
            className="bg-purple-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors touch-manipulation min-h-[44px]"
          >
            🔍 Vérifier
          </button>
        ) : isCorrect() ? (
          <div className="p-4 rounded-lg bg-green-600 text-white col-span-2">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base">🎉 Bravo ! C'est la bonne réponse !</span>
            </div>
          </div>
        ) : (
          <button
            onClick={nextQuestion}
            className="bg-purple-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors touch-manipulation min-h-[44px]"
          >
            Suivant →
          </button>
        )}
        <button
          onClick={resetQuestion}
          className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors touch-manipulation min-h-[44px]"
        >
          🔄 Effacer
        </button>
      </div>

      {/* Modal de fin d'exercice */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 scale-100">
            {(() => {
              const percentage = score / exercises.length;
              if (percentage === 1) {
                return (
                  <>
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-green-600 mb-4">Parfait !</h3>
                    <p className="text-gray-700 mb-4">Tu maîtrises parfaitement le coloriage de fractions ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else if (percentage >= 0.7) {
                return (
                  <>
                    <div className="text-6xl mb-4">👍</div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">Très bien !</h3>
                    <p className="text-gray-700 mb-4">Tu sais bien colorier les fractions ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div className="text-6xl mb-4">💪</div>
                    <h3 className="text-2xl font-bold text-orange-600 mb-4">Continue !</h3>
                    <p className="text-gray-700 mb-4">Tu progresses ! Continue à t'entraîner. Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              }
            })()}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={resetAll}
                className="flex-1 bg-purple-500 text-white py-3 px-4 sm:px-6 rounded-xl font-bold hover:bg-purple-600 transition-colors touch-manipulation min-h-[44px]"
              >
                Recommencer
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 bg-gray-500 text-white py-3 px-4 sm:px-6 rounded-xl font-bold hover:bg-gray-600 transition-colors touch-manipulation min-h-[44px]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Exercice d'écriture individuel (question par question)
function ExerciceEcritureIndividuel() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Fonction pour sauvegarder le progrès et calculer les XP
  const saveProgress = (finalScore: number) => {
    const sectionId = 'vocabulaire-ecriture';
    const maxScore = exercises.length;
    const percentage = finalScore / maxScore;
    const baseXP = 15; // XP de base pour cette section
    const earnedXP = Math.round(baseXP * percentage);
    
    const progressData = {
      sectionId,
      score: finalScore,
      maxScore,
      attempts: 1,
      completed: true,
      completionDate: new Date().toISOString(),
      xpEarned: earnedXP
    };

    // Sauvegarder dans localStorage
    const savedProgress = localStorage.getItem('ce1-fractions-simples-progress');
    let allProgress = [];
    
    if (savedProgress) {
      allProgress = JSON.parse(savedProgress);
    }
    
    // Mettre à jour ou ajouter le progrès de cette section
    const existingIndex = allProgress.findIndex((p: any) => p.sectionId === sectionId);
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progressData;
    } else {
      allProgress.push(progressData);
    }
    
    localStorage.setItem('ce1-fractions-simples-progress', JSON.stringify(allProgress));
    
    // Déclencher un événement pour notifier les autres composants
    window.dispatchEvent(new Event('storage'));
    
    return earnedXP;
  };

  const exercises = [
    { id: 1, fraction: '5/8', correct: 'cinq huitièmes' },
    { id: 2, fraction: '8/15', correct: 'huit quinzièmes' },
    { id: 3, fraction: '3/12', correct: 'trois douzièmes' },
    { id: 4, fraction: '2/7', correct: 'deux septièmes' },
    { id: 5, fraction: '4/9', correct: 'quatre neuvièmes' },
    { id: 6, fraction: '1/6', correct: 'un sixième' },
    { id: 7, fraction: '7/10', correct: 'sept dixièmes' },
    { id: 8, fraction: '3/5', correct: 'trois cinquièmes' },
    { id: 9, fraction: '9/11', correct: 'neuf onzièmes' },
    { id: 10, fraction: '6/13', correct: 'six treizièmes' }
  ];

  const currentExercise = exercises[currentQuestion];

  const checkAnswer = () => {
    setIsAnswered(true);
    
    const correct = isCorrect();
    if (correct && !answeredCorrectly.has(currentQuestion)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentQuestion);
        return newSet;
      });
    }

    if (correct) {
      setTimeout(() => {
        if (currentQuestion < exercises.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setAnswer('');
          setIsAnswered(false);
        } else {
          const newFinalScore = score + (!answeredCorrectly.has(currentQuestion) ? 1 : 0);
          const xpGained = saveProgress(newFinalScore);
          setEarnedXP(xpGained);
          setShowCompletionModal(true);
        }
      }, 1500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < exercises.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer('');
      setIsAnswered(false);
    } else {
      // Fin de l'exercice - afficher la modal
      setShowCompletionModal(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswer('');
      setIsAnswered(false);
    }
  };

  const resetQuestion = () => {
    setAnswer('');
    setIsAnswered(false);
  };

  const resetAll = () => {
    setCurrentQuestion(0);
    setAnswer('');
    setIsAnswered(false);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
  };

  const isCorrect = () => {
    return answer.toLowerCase().trim() === currentExercise.correct.toLowerCase();
  };

  return (
    <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg border-2 border-blue-200">
      <div className="text-center mb-3 sm:mb-6">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
          ✍️ Écris en lettres
        </h3>
        <div className="text-sm sm:text-sm sm:text-lg text-gray-600">
          Question {currentQuestion + 1} sur {exercises.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mt-2">
          <div 
            className="bg-blue-500 h-2 sm:h-2 sm:h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm sm:text-lg font-bold text-blue-600 mt-2">
          Score : {score}/{exercises.length}
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-2 sm:p-4 mb-3 sm:mb-6">
        <p className="text-center text-sm sm:text-lg font-bold text-blue-800">
          📝 Écris cette fraction en toutes lettres :
        </p>
      </div>

      <div className="text-center mb-3 sm:mb-6">
        <div className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">
          <FractionMath a={currentExercise.fraction.split('/')[0]} b={currentExercise.fraction.split('/')[1]} size="text-2xl sm:text-4xl" />
        </div>
        <div className="text-2xl font-bold text-gray-600 mb-4">=</div>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Écris en lettres..."
          disabled={isAnswered}
          className={`w-full max-w-md mx-auto p-4 rounded-lg border-2 text-xl text-center font-bold ${
            isAnswered
              ? isCorrect() 
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-red-500 bg-red-50 text-red-800'
              : 'border-gray-300 focus:border-blue-500'
          } disabled:opacity-70`}
        />
      </div>

      {isAnswered && !isCorrect() && (
        <div className="text-center p-4 rounded-lg mb-4 bg-red-100 text-red-800">
          <div className="text-xl font-bold">
            ❌ Ce n'est pas ça !
          </div>
          <div className="text-lg mt-2">
            ✅ Réponse : <strong>{currentExercise.correct}</strong>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {!isAnswered ? (
          <button
            onClick={checkAnswer}
            disabled={!answer.trim()}
            className="bg-blue-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 touch-manipulation min-h-[44px]"
          >
            🔍 Vérifier
          </button>
        ) : isCorrect() ? (
          <div className="p-4 rounded-lg bg-green-600 text-white col-span-2">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base">🎉 Bravo ! C'est la bonne réponse !</span>
            </div>
          </div>
        ) : (
          <button
            onClick={nextQuestion}
            className="bg-blue-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors touch-manipulation min-h-[44px]"
          >
            Suivant →
          </button>
        )}
        <button
          onClick={resetQuestion}
          className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors touch-manipulation min-h-[44px]"
        >
          🔄 Effacer
        </button>
      </div>

      {/* Modal de fin d'exercice */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 scale-100">
            {(() => {
              const percentage = score / exercises.length;
              if (percentage === 1) {
                return (
                  <>
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-green-600 mb-4">Parfait !</h3>
                    <p className="text-gray-700 mb-4">Tu écris parfaitement les fractions en lettres ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else if (percentage >= 0.7) {
                return (
                  <>
                    <div className="text-6xl mb-4">👍</div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">Très bien !</h3>
                    <p className="text-gray-700 mb-4">Tu sais bien écrire les fractions ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div className="text-6xl mb-4">💪</div>
                    <h3 className="text-2xl font-bold text-orange-600 mb-4">Continue !</h3>
                    <p className="text-gray-700 mb-4">Tu progresses ! Continue à t'entraîner. Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              }
            })()}
            <div className="flex space-x-4">
              <button
                onClick={resetAll}
                className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-600 transition-colors"
              >
                Recommencer
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Exercice d'identification individuel (question par question)
function ExerciceIdentificationIndividuel() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedFractions, setSelectedFractions] = useState(new Set());
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Fonction pour sauvegarder le progrès et calculer les XP
  const saveProgress = (finalScore: number) => {
    const sectionId = 'vocabulaire-identification';
    const maxScore = exercises.length;
    const percentage = finalScore / maxScore;
    const baseXP = 18; // XP de base pour cette section
    const earnedXP = Math.round(baseXP * percentage);
    
    const progressData = {
      sectionId,
      score: finalScore,
      maxScore,
      attempts: 1,
      completed: true,
      completionDate: new Date().toISOString(),
      xpEarned: earnedXP
    };

    // Sauvegarder dans localStorage
    const savedProgress = localStorage.getItem('ce1-fractions-simples-progress');
    let allProgress = [];
    
    if (savedProgress) {
      allProgress = JSON.parse(savedProgress);
    }
    
    // Mettre à jour ou ajouter le progrès de cette section
    const existingIndex = allProgress.findIndex((p: any) => p.sectionId === sectionId);
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progressData;
    } else {
      allProgress.push(progressData);
    }
    
    localStorage.setItem('ce1-fractions-simples-progress', JSON.stringify(allProgress));
    
    // Déclencher un événement pour notifier les autres composants
    window.dispatchEvent(new Event('storage'));
    
    return earnedXP;
  };

  const exercises = [
    { 
       id: 1,
       instruction: 'Clique sur les fractions dont le numérateur est 3',
       checkCondition: (frac: any) => frac.numerator === 3,
      fractions: [
        { id: 1, numerator: 3, denominator: 4, color: 'bg-yellow-400' },
        { id: 2, numerator: 5, denominator: 6, color: 'bg-green-400' },
        { id: 3, numerator: 3, denominator: 8, color: 'bg-blue-400' },
        { id: 4, numerator: 2, denominator: 5, color: 'bg-red-400' },
        { id: 5, numerator: 3, denominator: 7, color: 'bg-purple-400' }
      ]
    },
    {
       id: 2,
       instruction: 'Clique sur les fractions dont le dénominateur est 8',
       checkCondition: (frac: any) => frac.denominator === 8,
      fractions: [
        { id: 1, numerator: 3, denominator: 8, color: 'bg-yellow-400' },
        { id: 2, numerator: 5, denominator: 6, color: 'bg-green-400' },
        { id: 3, numerator: 7, denominator: 8, color: 'bg-blue-400' },
        { id: 4, numerator: 2, denominator: 5, color: 'bg-red-400' },
        { id: 5, numerator: 1, denominator: 8, color: 'bg-purple-400' }
      ]
    },
    {
       id: 3,
       instruction: 'Clique sur les fractions dont le numérateur est 1',
       checkCondition: (frac: any) => frac.numerator === 1,
      fractions: [
        { id: 1, numerator: 1, denominator: 4, color: 'bg-yellow-400' },
        { id: 2, numerator: 3, denominator: 6, color: 'bg-green-400' },
        { id: 3, numerator: 1, denominator: 5, color: 'bg-blue-400' },
        { id: 4, numerator: 2, denominator: 3, color: 'bg-red-400' },
        { id: 5, numerator: 1, denominator: 2, color: 'bg-purple-400' }
      ]
    },
    {
       id: 4,
       instruction: 'Clique sur les fractions dont le dénominateur est 5',
       checkCondition: (frac: any) => frac.denominator === 5,
      fractions: [
        { id: 1, numerator: 2, denominator: 5, color: 'bg-yellow-400' },
        { id: 2, numerator: 3, denominator: 7, color: 'bg-green-400' },
        { id: 3, numerator: 4, denominator: 5, color: 'bg-blue-400' },
        { id: 4, numerator: 1, denominator: 6, color: 'bg-red-400' },
        { id: 5, numerator: 3, denominator: 5, color: 'bg-purple-400' }
      ]
    },
    {
       id: 5,
       instruction: 'Clique sur les fractions dont le numérateur est 2',
       checkCondition: (frac: any) => frac.numerator === 2,
      fractions: [
        { id: 1, numerator: 2, denominator: 3, color: 'bg-yellow-400' },
        { id: 2, numerator: 5, denominator: 8, color: 'bg-green-400' },
        { id: 3, numerator: 2, denominator: 7, color: 'bg-blue-400' },
        { id: 4, numerator: 4, denominator: 9, color: 'bg-red-400' },
        { id: 5, numerator: 2, denominator: 5, color: 'bg-purple-400' }
      ]
    },
    {
       id: 6,
       instruction: 'Clique sur les fractions dont le dénominateur est 6',
       checkCondition: (frac: any) => frac.denominator === 6,
      fractions: [
        { id: 1, numerator: 1, denominator: 6, color: 'bg-yellow-400' },
        { id: 2, numerator: 3, denominator: 4, color: 'bg-green-400' },
        { id: 3, numerator: 5, denominator: 6, color: 'bg-blue-400' },
        { id: 4, numerator: 2, denominator: 7, color: 'bg-red-400' },
        { id: 5, numerator: 2, denominator: 6, color: 'bg-purple-400' }
      ]
    },
    {
       id: 7,
       instruction: 'Clique sur les fractions dont le numérateur est 4',
       checkCondition: (frac: any) => frac.numerator === 4,
      fractions: [
        { id: 1, numerator: 4, denominator: 5, color: 'bg-yellow-400' },
        { id: 2, numerator: 3, denominator: 8, color: 'bg-green-400' },
        { id: 3, numerator: 4, denominator: 9, color: 'bg-blue-400' },
        { id: 4, numerator: 1, denominator: 3, color: 'bg-red-400' },
        { id: 5, numerator: 4, denominator: 7, color: 'bg-purple-400' }
      ]
    },
    {
       id: 8,
       instruction: 'Clique sur les fractions dont le dénominateur est 9',
       checkCondition: (frac: any) => frac.denominator === 9,
      fractions: [
        { id: 1, numerator: 2, denominator: 9, color: 'bg-yellow-400' },
        { id: 2, numerator: 5, denominator: 6, color: 'bg-green-400' },
        { id: 3, numerator: 7, denominator: 9, color: 'bg-blue-400' },
        { id: 4, numerator: 3, denominator: 4, color: 'bg-red-400' },
        { id: 5, numerator: 1, denominator: 9, color: 'bg-purple-400' }
      ]
    },
    {
       id: 9,
       instruction: 'Clique sur les fractions dont le numérateur est 5',
       checkCondition: (frac: any) => frac.numerator === 5,
      fractions: [
        { id: 1, numerator: 5, denominator: 6, color: 'bg-yellow-400' },
        { id: 2, numerator: 2, denominator: 7, color: 'bg-green-400' },
        { id: 3, numerator: 5, denominator: 8, color: 'bg-blue-400' },
        { id: 4, numerator: 3, denominator: 4, color: 'bg-red-400' },
        { id: 5, numerator: 5, denominator: 9, color: 'bg-purple-400' }
      ]
    },
    {
       id: 10,
       instruction: 'Clique sur les fractions dont le dénominateur est 7',
       checkCondition: (frac: any) => frac.denominator === 7,
      fractions: [
        { id: 1, numerator: 3, denominator: 7, color: 'bg-yellow-400' },
        { id: 2, numerator: 4, denominator: 5, color: 'bg-green-400' },
        { id: 3, numerator: 2, denominator: 7, color: 'bg-blue-400' },
        { id: 4, numerator: 1, denominator: 8, color: 'bg-red-400' },
        { id: 5, numerator: 6, denominator: 7, color: 'bg-purple-400' }
      ]
    }
  ];

  const currentExercise = exercises[currentQuestion];

  const toggleFraction = (fractionId: number) => {
    if (isAnswered) return;
    
    const newSet = new Set(selectedFractions);
    if (newSet.has(fractionId)) {
      newSet.delete(fractionId);
    } else {
      newSet.add(fractionId);
    }
    setSelectedFractions(newSet);
  };

  const checkAnswer = () => {
    setIsAnswered(true);
    
    const correct = isCorrect();
    if (correct && !answeredCorrectly.has(currentQuestion)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentQuestion);
        return newSet;
      });
    }

    if (correct) {
      setTimeout(() => {
        if (currentQuestion < exercises.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedFractions(new Set());
          setIsAnswered(false);
        } else {
          const newFinalScore = score + (!answeredCorrectly.has(currentQuestion) ? 1 : 0);
          const xpGained = saveProgress(newFinalScore);
          setEarnedXP(xpGained);
          setShowCompletionModal(true);
        }
      }, 1500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < exercises.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedFractions(new Set());
      setIsAnswered(false);
    } else {
      // Fin de l'exercice - afficher la modal
      const newFinalScore = score + (!answeredCorrectly.has(currentQuestion) ? 1 : 0);
      const xpGained = saveProgress(newFinalScore);
      setEarnedXP(xpGained);
      setShowCompletionModal(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedFractions(new Set());
      setIsAnswered(false);
    }
  };

  const resetQuestion = () => {
    setSelectedFractions(new Set());
    setIsAnswered(false);
  };

  const resetAll = () => {
    setCurrentQuestion(0);
    setSelectedFractions(new Set());
    setIsAnswered(false);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setEarnedXP(0);
  };

  const getCorrectAnswers = () => {
    return currentExercise.fractions.filter(f => currentExercise.checkCondition(f)).map(f => f.id);
  };

  const isCorrect = () => {
    const correctIds = new Set(getCorrectAnswers());
    return correctIds.size === selectedFractions.size && 
           Array.from(correctIds).every(id => selectedFractions.has(id));
  };

  return (
    <div className="bg-white rounded-xl p-2 sm:p-4 shadow-lg border-2 border-green-200">
      <div className="text-center mb-2 sm:mb-4">
        <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
          🎯 Identification
        </h3>
        <div className="text-xs sm:text-sm text-gray-600">
          Question {currentQuestion + 1} sur {exercises.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm sm:text-base font-bold text-green-600 mt-1">
          Score : {score}/{exercises.length}
        </div>
      </div>
      
      <div className="bg-green-50 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
        <p className="text-center text-sm sm:text-base font-bold text-green-800">
          🔴 {currentExercise.instruction}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-4">
        {currentExercise.fractions.map((fraction) => (
          <div key={fraction.id} className="text-center">
            <div 
              className={`
                ${fraction.color} text-white rounded-lg p-2 sm:p-4 cursor-pointer min-h-[44px] touch-manipulation
                transform transition-all duration-200 hover:scale-105 active:scale-95
                ${selectedFractions.has(fraction.id) ? 'ring-2 sm:ring-4 ring-red-500 ring-offset-1 sm:ring-offset-2' : ''}
                ${isAnswered && currentExercise.checkCondition(fraction) ? 'ring-2 sm:ring-4 ring-yellow-400 ring-offset-1' : ''}
              `}
              onClick={() => toggleFraction(fraction.id)}
            >
              <div className="text-white">
                <FractionMath 
                  a={fraction.numerator.toString()} 
                  b={fraction.denominator.toString()} 
                  size="text-base sm:text-xl"
                />
              </div>
            </div>
            {isAnswered && (
              <div className="mt-1 text-xs">
                {currentExercise.checkCondition(fraction) && (
                  <div className={`${selectedFractions.has(fraction.id) ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedFractions.has(fraction.id) ? '✅' : '❌'}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isAnswered && !isCorrect() && (
        <div className="text-center p-4 rounded-lg mb-4 bg-red-100 text-red-800">
          <div className="text-xl font-bold">
            ❌ Ce n'est pas ça !
          </div>
          <div className="text-lg mt-2">
            ✅ Bonnes réponses : {getCorrectAnswers().length} fractions à entourer
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {!isAnswered ? (
          <button
            onClick={checkAnswer}
            className="bg-green-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-green-600 transition-colors touch-manipulation min-h-[44px]"
          >
            🔍 Vérifier
          </button>
        ) : isCorrect() ? (
          <div className="p-4 rounded-lg bg-green-600 text-white col-span-2">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base">🎉 Bravo ! C'est la bonne réponse !</span>
            </div>
          </div>
        ) : (
          <button
            onClick={nextQuestion}
            className="bg-green-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-green-600 transition-colors touch-manipulation min-h-[44px]"
          >
            Suivant →
          </button>
        )}
        <button
          onClick={resetQuestion}
          className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors touch-manipulation min-h-[44px]"
        >
          🔄 Effacer
        </button>
      </div>

      {/* Modal de fin d'exercice */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 scale-100">
            {(() => {
              const percentage = score / exercises.length;
              if (percentage === 1) {
                return (
                  <>
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-green-600 mb-4">Parfait !</h3>
                    <p className="text-gray-700 mb-4">Tu identifies parfaitement les fractions ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else if (percentage >= 0.7) {
                return (
                  <>
                    <div className="text-6xl mb-4">👍</div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">Très bien !</h3>
                    <p className="text-gray-700 mb-4">Tu sais bien identifier les fractions ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div className="text-6xl mb-4">💪</div>
                    <h3 className="text-2xl font-bold text-orange-600 mb-4">Continue !</h3>
                    <p className="text-gray-700 mb-4">Tu progresses ! Continue à t'entraîner. Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              }
            })()}
            <div className="flex space-x-4">
              <button
                onClick={resetAll}
                className="flex-1 bg-green-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-green-600 transition-colors"
              >
                Recommencer
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Exercice de reconnaissance individuel (question par question)
function ExerciceTrouverFractionIndividuel() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Fonction pour sauvegarder le progrès et calculer les XP
  const saveProgress = (finalScore: number) => {
    const sectionId = 'vocabulaire-reconnaissance';
    const maxScore = exercises.length;
    const percentage = finalScore / maxScore;
    const baseXP = 22; // XP de base pour cette section
    const earnedXP = Math.round(baseXP * percentage);
    
    const progressData = {
      sectionId,
      score: finalScore,
      maxScore,
      attempts: 1,
      completed: true,
      completionDate: new Date().toISOString(),
      xpEarned: earnedXP
    };

    // Sauvegarder dans localStorage
    const savedProgress = localStorage.getItem('ce1-fractions-simples-progress');
    let allProgress = [];
    
    if (savedProgress) {
      allProgress = JSON.parse(savedProgress);
    }
    
    // Mettre à jour ou ajouter le progrès de cette section
    const existingIndex = allProgress.findIndex((p: any) => p.sectionId === sectionId);
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progressData;
    } else {
      allProgress.push(progressData);
    }
    
    localStorage.setItem('ce1-fractions-simples-progress', JSON.stringify(allProgress));
    
    // Déclencher un événement pour notifier les autres composants
    window.dispatchEvent(new Event('storage'));
    
    return earnedXP;
  };

  const exercises = [
    { 
      id: 'a', 
      correctFraction: '1/3',
      shape: 'triangle'
    },
    { 
      id: 'b', 
      correctFraction: '3/7',
      shape: 'rectangleLines'
    },
    { 
      id: 'c', 
      correctFraction: '2/5',
      shape: 'rectangleVertical'
    },
    { 
      id: 'd', 
      correctFraction: '3/8',
      shape: 'circle'
    },
    { 
      id: 'e', 
      correctFraction: '2/4',
      shape: 'rectangleBlocks'
    },
    { 
      id: 'f', 
      correctFraction: '1/4',
      shape: 'rectangleVertical'
    },
    { 
      id: 'g', 
      correctFraction: '2/6',
      shape: 'rectangleLines'
    },
    { 
      id: 'h', 
      correctFraction: '5/8',
      shape: 'circle'
    },
    { 
      id: 'i', 
      correctFraction: '1/2',
      shape: 'triangle'
    },
    { 
      id: 'j', 
      correctFraction: '3/5',
      shape: 'rectangleBlocks'
    }
  ];

  const currentExercise = exercises[currentQuestion];

  const checkAnswer = () => {
    setIsAnswered(true);
    
    const correct = isCorrect();
    if (correct && !answeredCorrectly.has(currentQuestion)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentQuestion);
        return newSet;
      });
    }

    if (correct) {
      setTimeout(() => {
        if (currentQuestion < exercises.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setAnswer('');
          setIsAnswered(false);
        } else {
          const newFinalScore = score + (!answeredCorrectly.has(currentQuestion) ? 1 : 0);
          const xpGained = saveProgress(newFinalScore);
          setEarnedXP(xpGained);
          setShowCompletionModal(true);
        }
      }, 1500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < exercises.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer('');
      setIsAnswered(false);
    } else {
      // Fin de l'exercice - afficher la modal
      const newFinalScore = score + (!answeredCorrectly.has(currentQuestion) ? 1 : 0);
      const xpGained = saveProgress(newFinalScore);
      setEarnedXP(xpGained);
      setShowCompletionModal(true);
    }
  };

  const resetQuestion = () => {
    setAnswer('');
    setIsAnswered(false);
  };

  const resetAll = () => {
    setCurrentQuestion(0);
    setAnswer('');
    setIsAnswered(false);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setEarnedXP(0);
  };

  const isCorrect = () => {
    return answer.trim() === currentExercise.correctFraction;
  };

  const renderShape = (exercise: {shape: string, [key: string]: any}) => {
    switch (exercise.shape) {
      case 'triangle':
        return (
          <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto">
            <path d="M 80 20 L 20 140 L 140 140 Z" fill="#f3f4f6" stroke="#6b7280" strokeWidth="3"/>
            <path d="M 80 20 L 20 140 L 50 140 Z" fill="#ec4899" stroke="#6b7280" strokeWidth="3"/>
            <line x1="80" y1="20" x2="50" y2="140" stroke="#6b7280" strokeWidth="3"/>
            <line x1="80" y1="20" x2="110" y2="140" stroke="#6b7280" strokeWidth="3"/>
          </svg>
        );
      
      case 'rectangleLines':
        return (
          <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto">
            {Array.from({ length: 7 }, (_, i) => (
              <rect
                key={i}
                x="40"
                y={30 + i * 16}
                width="80"
                height="14"
                fill={i < 3 ? '#22d3ee' : '#f3f4f6'}
                stroke="#6b7280"
                strokeWidth="2"
              />
            ))}
          </svg>
        );
      
      case 'rectangleVertical':
        return (
          <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto">
            {Array.from({ length: 5 }, (_, i) => (
              <rect
                key={i}
                x="60"
                y={20 + i * 24}
                width="40"
                height="22"
                fill={i < 2 ? '#f97316' : '#f3f4f6'}
                stroke="#6b7280"
                strokeWidth="2"
              />
            ))}
          </svg>
        );
      
      case 'circle':
        return (
          <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto">
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (360 / 8) * i - 90;
              const nextAngle = (360 / 8) * (i + 1) - 90;
              const angleRad = (angle * Math.PI) / 180;
              const nextAngleRad = (nextAngle * Math.PI) / 180;
              
              const x1 = 80 + 50 * Math.cos(angleRad);
              const y1 = 80 + 50 * Math.sin(angleRad);
              const x2 = 80 + 50 * Math.cos(nextAngleRad);
              const y2 = 80 + 50 * Math.sin(nextAngleRad);
              
              const pathData = `M 80 80 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
              
              return (
        <path
          key={i}
          d={pathData}
                  fill={i < 3 ? '#fbbf24' : '#f3f4f6'}
                  stroke="#6b7280"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        );
      
      case 'rectangleBlocks':
    return (
          <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto">
            {Array.from({ length: 4 }, (_, i) => (
              <rect
                key={i}
                x="70"
                y={40 + i * 20}
                width="20"
                height="18"
                fill={i < 2 ? '#a855f7' : '#f3f4f6'}
                stroke="#6b7280"
                strokeWidth="2"
              />
            ))}
      </svg>
    );
      
      default:
        return <div></div>;
    }
  };

  return (
    <div className="bg-white rounded-xl p-2 sm:p-4 shadow-lg border-2 border-indigo-200">
      <div className="text-center mb-2 sm:mb-4">
        <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
          🔍 Reconnaissance
        </h3>
        <div className="text-xs sm:text-sm text-gray-600">
          Question {currentQuestion + 1} sur {exercises.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm sm:text-base font-bold text-indigo-600 mt-1">
          Score : {score}/{exercises.length}
        </div>
      </div>
      
      <div className="bg-indigo-50 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
        <p className="text-center text-sm sm:text-base font-bold text-indigo-800">
          👀 Quelle fraction correspond à la partie coloriée ?
        </p>
        <p className="text-center text-xs sm:text-sm text-indigo-700 mt-1">
          Exemple : si 2 parts sur 3 sont coloriées → 2/3
        </p>
      </div>

      <div className="text-center mb-2 sm:mb-4">
        <div className="text-sm sm:text-base font-bold text-gray-700 mb-2 sm:mb-3">
          {currentExercise.id}.
        </div>
        
        <div className="mb-3 sm:mb-4">
          {renderShape(currentExercise)}
        </div>
        
        {/* Instruction pour la saisie */}
        <div className="text-center mb-2 sm:mb-3">
          <p className="text-xs sm:text-sm text-gray-600">
            👆 Observe bien la figure et complète la fraction correspondante
          </p>
        </div>
        
        {/* Saisie de fraction simple */}
        <div className={`flex items-center justify-center space-x-1 p-2 sm:p-3 rounded-lg border-2 max-w-xs mx-auto ${
          isAnswered
            ? isCorrect() 
              ? 'border-green-500 bg-green-50'
              : 'border-red-500 bg-red-50'
            : 'border-indigo-300 bg-indigo-50'
        }`}>
          <input
            type="text"
            value={answer.split('/')[0] || ''}
            onChange={(e) => {
              const numerator = e.target.value;
              const denominator = answer.split('/')[1] || '';
              setAnswer(numerator + '/' + denominator);
            }}
            placeholder="?"
            disabled={isAnswered}
            className="w-10 sm:w-12 h-10 sm:h-12 text-center text-lg sm:text-2xl font-bold border-2 border-gray-300 rounded focus:border-indigo-500 bg-white touch-manipulation"
            maxLength={2}
          />
          <div className="text-2xl sm:text-3xl font-bold text-gray-600">/</div>
          <input
            type="text"
            value={answer.split('/')[1] || ''}
            onChange={(e) => {
              const numerator = answer.split('/')[0] || '';
              const denominator = e.target.value;
              setAnswer(numerator + '/' + denominator);
            }}
            placeholder="?"
            disabled={isAnswered}
            className="w-10 sm:w-12 h-10 sm:h-12 text-center text-lg sm:text-2xl font-bold border-2 border-gray-300 rounded focus:border-indigo-500 bg-white touch-manipulation"
            maxLength={2}
          />
        </div>
      </div>

      {isAnswered && !isCorrect() && (
        <div className="text-center p-2 sm:p-3 rounded-lg mb-2 sm:mb-3 bg-red-100 text-red-800">
          <div className="text-base sm:text-lg font-bold">
            ❌ Ce n'est pas ça !
          </div>
          <div className="text-sm sm:text-base mt-1">
            ✅ Réponse : <strong>{currentExercise.correctFraction}</strong>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {!isAnswered ? (
          <button
            onClick={checkAnswer}
            disabled={!answer.trim()}
            className="bg-indigo-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-indigo-600 transition-colors disabled:opacity-50 touch-manipulation min-h-[44px]"
          >
            🔍 Vérifier
          </button>
        ) : isCorrect() ? (
          <div className="p-4 rounded-lg bg-green-600 text-white col-span-2">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base">🎉 Bravo ! C'est la bonne réponse !</span>
            </div>
          </div>
        ) : (
          <button
            onClick={nextQuestion}
            className="bg-indigo-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-indigo-600 transition-colors touch-manipulation min-h-[44px]"
          >
            Suivant →
          </button>
        )}
        <button
          onClick={resetQuestion}
          className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors touch-manipulation min-h-[44px]"
        >
          🔄 Effacer
        </button>
      </div>

      {/* Modal de fin d'exercice */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 scale-100">
            {(() => {
              const percentage = score / exercises.length;
              if (percentage === 1) {
                return (
                  <>
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-green-600 mb-4">Parfait !</h3>
                    <p className="text-gray-700 mb-4">Tu reconnais parfaitement les fractions ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else if (percentage >= 0.7) {
                return (
                  <>
                    <div className="text-6xl mb-4">👍</div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">Très bien !</h3>
                    <p className="text-gray-700 mb-4">Tu sais bien reconnaître les fractions ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div className="text-6xl mb-4">💪</div>
                    <h3 className="text-2xl font-bold text-orange-600 mb-4">Continue !</h3>
                    <p className="text-gray-700 mb-4">Tu progresses ! Continue à t'entraîner. Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              }
            })()}
            <div className="flex space-x-4">
              <button
                onClick={resetAll}
                className="flex-1 bg-indigo-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-indigo-600 transition-colors"
              >
                Recommencer
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VocabulaireFractionsPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedExerciseType, setSelectedExerciseType] = useState('coloriage');
  
  // États pour l'animation de lecture (readmeanim)
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [characterSizeExpanded, setCharacterSizeExpanded] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  // Refs pour contrôler les vocaux
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Refs pour les états d'animation des composants enfants
  const partiesFractionAnimatingRef = useRef(false);
  const fractionIntroAnimatingRef = useRef(false);

  // Refs pour les états d'animation audio des composants enfants
  const partiesFractionAudioRef = useRef(false);
  const fractionIntroAudioRef = useRef(false);
  const vocabulaireAudioRef = useRef(false);
  
  // État réactif pour déclencher le re-render quand les refs changent
  const [childrenAudioStates, setChildrenAudioStates] = useState({
    partiesFraction: false,
    fractionIntro: false,
    vocabulaire: false
  });
  
  // Fonction pour mettre à jour l'état réactif quand les refs changent
  const updateChildAudioState = (component: 'partiesFraction' | 'fractionIntro' | 'vocabulaire', isPlaying: boolean) => {
    setChildrenAudioStates(prev => ({
      ...prev,
      [component]: isPlaying
    }));
  };

  // Fonction pour vérifier si une animation est en cours
  const isAnyAnimationRunning = () => {
    return isPlayingVocal || partiesFractionAnimatingRef.current || fractionIntroAnimatingRef.current;
  };

  // Fonction pour vérifier si un audio est en cours dans l'un des composants
  const isAnyAudioPlaying = () => {
    const result = isPlayingVocal || childrenAudioStates.partiesFraction || childrenAudioStates.fractionIntro || childrenAudioStates.vocabulaire;
    console.log('🔍 isAnyAudioPlaying check:', {
      isPlayingVocal,
      partiesFractionAudio: childrenAudioStates.partiesFraction,
      fractionIntroAudio: childrenAudioStates.fractionIntro,
      vocabulaireAudio: childrenAudioStates.vocabulaire,
      result
    });
    return result;
  };


  // Fonction pour scroller vers une section spécifique
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
      console.log(`📍 Scroll vers la section: ${sectionId}`);
    }
  };

    // Fonction modifiée pour arrêter tous les vocaux et animations (copiée de CP)
  const stopAllVocalsAndAnimations = (preserveTabState = false) => {
    console.log('🛑 Arrêt FORCÉ de tous les vocaux et animations (navigation détectée)');
    
    stopSignalRef.current = true;
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      console.log('🔇 speechSynthesis.cancel() forcé');
    }
    
    setTimeout(() => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() appelé (2e tentative)');
      }
    }, 100);
    
    setTimeout(() => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() appelé (3e tentative)');
      }
    }, 200);
    
    setIsPlayingVocal(false);
    setCharacterSizeExpanded(false);
    setHighlightedElement(null);
    
    // Arrêter les animations des composants enfants
    partiesFractionAnimatingRef.current = false;
    fractionIntroAnimatingRef.current = false;
    
    // Arrêter les audios des composants enfants
    partiesFractionAudioRef.current = false;
    fractionIntroAudioRef.current = false;
    vocabulaireAudioRef.current = false;
    
    // Réinitialiser l'état réactif
    setChildrenAudioStates({
      partiesFraction: false,
      fractionIntro: false,
      vocabulaire: false
    });
    
    // Déclencher un événement personnalisé pour arrêter tous les composants enfants
    window.dispatchEvent(new CustomEvent('stopAllAnimations'));
    
    // Ne remettre à zéro hasStarted et showExercises que lors de la navigation
    // Pas quand on arrête juste une animation
    if (!preserveTabState) {
      setHasStarted(false);
      // Ne plus remettre showExercises à false automatiquement
      // pour éviter de revenir au cours quand on arrête une animation
    }
  };

  // Effet pour gérer les changements de visibilité de la page et navigation (copié de CP)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page cachée - arrêt du vocal');
        stopAllVocalsAndAnimations(true); // Préserver l'état de l'onglet
      }
    };

    const handleBeforeUnload = () => {
      console.log('Avant déchargement - arrêt du vocal');
      stopAllVocalsAndAnimations(true); // Préserver l'état de l'onglet
    };

    const handlePopState = () => {
      console.log('Navigation back/forward - arrêt du vocal');
      stopAllVocalsAndAnimations(true); // Préserver l'état de l'onglet
    };

    const handlePageHide = () => {
      console.log('Page masquée - arrêt du vocal');
      stopAllVocalsAndAnimations(true); // Préserver l'état de l'onglet
    };

    const handleUnload = () => {
      console.log('Déchargement - arrêt du vocal');
      stopAllVocalsAndAnimations(true); // Préserver l'état de l'onglet
    };

    const handleHashChange = () => {
      console.log('Changement de hash - arrêt du vocal');
      stopAllVocalsAndAnimations(true); // Préserver l'état de l'onglet
    };

    const handleBlur = () => {
      console.log('Perte de focus fenêtre - arrêt du vocal');
      stopAllVocalsAndAnimations(true); // Préserver l'état de l'onglet
    };

    // Event listeners standard
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('blur', handleBlur);

    // Override des méthodes history pour détecter navigation programmatique
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      console.log('Navigation programmatique pushState - arrêt du vocal');
      stopAllVocalsAndAnimations();
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      console.log('Navigation programmatique replaceState - arrêt du vocal');
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(this, args);
    };

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('blur', handleBlur);
      
      // Restaurer les méthodes originales
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      
      // Arrêter toutes les animations au démontage du composant
      stopAllVocalsAndAnimations();
    };
  }, []);

  // Effet pour gérer les changements d'onglet interne (cours ↔ exercices) (copié de CP)
  useEffect(() => {
    // Arrêter toutes les animations en cours mais préserver l'état des onglets
    stopAllVocalsAndAnimations(true);
    
    // Remettre à zéro l'état hasStarted quand on change d'onglet
    // pour que le bouton COMMENCER redevienne dans son état initial
    setHasStarted(false);
  }, [showExercises]);

  // Effet pour arrêter l'audio lors de la navigation (bouton back) (copié de CP)
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        stopAllVocalsAndAnimations();
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

    // Fonction pour jouer un audio (copiée de CP avec améliorations)
  const playAudio = async (text: string, slowMode = false): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        console.log('Audio cancelled before start due to stopSignal');
        resolve();
        return;
      }
      
      setIsPlayingVocal(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.6 : 0.9; // Légèrement plus lent que CP
      utterance.pitch = 1.1; // Légèrement plus aigu pour Minecraft
      utterance.volume = 1.0;

      const voices = speechSynthesis.getVoices();
      const femaleVoiceNames = ['Amélie', 'Audrey', 'Marie', 'Julie', 'Céline', 'Virginie'];
      
      let selectedVoice = voices.find(voice => 
        voice.lang === 'fr-FR' && 
        femaleVoiceNames.some(name => voice.name.includes(name))
      );

      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang === 'fr-FR' && 
          (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman'))
        );
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === 'fr-FR' && voice.localService);
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === 'fr-FR');
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.onend = () => {
        console.log('Audio ended normally');
        setIsPlayingVocal(false);
          currentAudioRef.current = null;
        resolve();
      };
      
      utterance.onerror = () => {
        console.log('Audio error occurred');
        setIsPlayingVocal(false);
          currentAudioRef.current = null;
        resolve();
      };
      
      // Vérifier encore une fois avant de parler
      if (stopSignalRef.current) {
        console.log('Audio cancelled before speak due to stopSignal');
        setIsPlayingVocal(false);
        resolve();
        return;
      }
      
      console.log('Starting audio:', text.substring(0, 50) + '...');
      currentAudioRef.current = utterance;
      speechSynthesis.speak(utterance);
    });
  };

  // Fonction pour scroller vers un élément
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Fonction pour mettre en évidence un élément
  const highlightElement = (elementId: string, duration: number = 2000) => {
    setHighlightedElement(elementId);
    setTimeout(() => {
      if (!stopSignalRef.current) {
        setHighlightedElement(null);
      }
    }, duration);
  };

  // Fonction pour expliquer les exercices (guidée)
  const explainExercises = async () => {
    if (isPlayingVocal) {
      console.log('🛑 Arrêt explainExercises en cours');
      stopAllVocalsAndAnimations(true); // Préserver l'état des exercices
      return;
    }

    console.log('🚀 Démarrage explainExercises');
    setIsPlayingVocal(true);
    stopSignalRef.current = false;
    setHasStarted(true);

    try {
      // Introduction aux exercices
      await playAudio("Salut petit aventurier ! Bienvenue dans l'arène d'entraînement des fractions !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 1000));

      await playAudio("Ici, tu vas pouvoir t'entraîner avec 4 types d'exercices différents pour maîtriser le vocabulaire des fractions !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Exercice 1: Coloriage
      scrollToElement('exercice-coloriage');
      highlightElement('exercice-coloriage', 4000);
      await playAudio("Le premier exercice, c'est le coloriage ! Tu vas devoir colorier la fraction demandée. Par exemple, si on te demande de colorier 2/3, tu dois colorier 2 parts sur 3 !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Exercice 2: Écriture
      scrollToElement('exercice-ecriture');
      highlightElement('exercice-ecriture', 4000);
      await playAudio("Le deuxième exercice, c'est l'écriture ! Tu regarderas un dessin et tu devras écrire la fraction qui correspond. Compte bien les parts coloriées et le nombre total de parts !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Exercice 3: Identification
      scrollToElement('exercice-identification');
      highlightElement('exercice-identification', 4000);
      await playAudio("Le troisième exercice, c'est l'identification ! On te donne plusieurs dessins et tu dois choisir celui qui correspond à la fraction demandée !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Exercice 4: Reconnaissance
      scrollToElement('exercice-reconnaissance');
      highlightElement('exercice-reconnaissance', 4000);
      await playAudio("Le quatrième exercice, c'est la reconnaissance ! Tu verras un dessin et tu devras choisir parmi plusieurs fractions celle qui correspond !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 2000));



      // Comment valider les réponses
      await playAudio("Pour tous les exercices, c'est très simple : lis bien l'énoncé, réfléchis, puis clique sur ta réponse ou utilise les outils de coloriage !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 1500));

      await playAudio("Quand tu es sûr de ta réponse, clique sur le bouton 'Valider' pour voir si c'est correct ! Si tu te trompes, pas de panique, on te donnera la bonne réponse !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 2000));

      await playAudio("Alors, choisis ton exercice préféré et lance-toi dans l'aventure ! Bonne chance, petit mathématicien !");

    } catch (error) {
      console.error('❌ Erreur dans explainExercises:', error);
    } finally {
      setIsPlayingVocal(false);
      setHighlightedElement(null);
      console.log('✅ explainExercises terminé');
    }
  };

  // Fonction principale d'explication avec vocal (readmeanim)
  const explainChapter = async () => {
    // Si une animation est déjà en cours, l'arrêter d'abord
    if (isPlayingVocal) {
      console.log('🛑 Arrêt animation précédente avant explainChapter');
      stopAllVocalsAndAnimations(true);
      // Petit délai pour s'assurer que l'arrêt est effectif
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);
    setCharacterSizeExpanded(true);

    try {
      if (showExercises) {
        // TUTORIEL EXERCICES
        await playAudio("Salut petit mineur ! Bienvenue dans l'arène d'entraînement du vocabulaire des fractions !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await playAudio("Objectif de ta quête : maîtriser parfaitement le nom de toutes les fractions !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));

        // Parcourir les types d'exercices
        scrollToElement('exercise-types');
        await playAudio("Voici tes différents types d'entraînement ! Coloriage, écriture, identification, reconnaissance et quiz !");
        highlightElement('exercise-types', 3000);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 2000));

        await playAudio("Choisis ton type d'exercice préféré et commence ton entraînement ! Bonne chance, petit mineur !");
        
      } else {
        // INTRODUCTION GUIDÉE NATURELLE
        await playAudio("Salut petit architecte ! Aujourd'hui tu vas découvrir un monde super important : celui des fractions !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Scroller et illuminer "Qu'est-ce qu'une fraction"
        scrollToElement('fraction-intro');
        highlightElement('fraction-intro', 4000);
        await playAudio("D'abord, tu verras ce que c'est exactement qu'une fraction avec une animation magique !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Scroller vers le bouton "Commencer l'animation magique" et l'illuminer
        scrollToElement('start-intro-animation');
        highlightElement('start-intro-animation', 3000);
        await playAudio("Tu peux cliquer ici pour lancer cette super animation avec un gâteau !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Scroller vers "Les parties d'une fraction" et illuminer le bouton
        scrollToElement('parties-fraction');
        highlightElement('parties-fraction', 4000);
        await playAudio("Ensuite, tu découvriras comment s'appellent les différentes parties d'une fraction !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Scroller vers le bouton "Lancer l'animation" des parties
        scrollToElement('start-parties-animation');
        highlightElement('start-parties-animation', 3000);
        await playAudio("Ici aussi, tu pourras lancer une animation pour bien comprendre !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Scroller vers "Apprendre le vocabulaire" et l'illuminer
        scrollToElement('apprendre-vocabulaire');
        highlightElement('apprendre-vocabulaire', 4000);
        await playAudio("Et puis tu pourras apprendre le nom de toutes les fractions importantes de ton niveau !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Scroller vers l'onglet Exercices et l'illuminer pendant qu'il parle
        scrollToElement('exercices-tab');
        // Démarrer l'audio d'abord
        const exercicesAudioPromise = playAudio("Quand tu te sentiras prêt, tu pourras tester tes connaissances avec les exercices !");
        // Puis illuminer le bouton pendant qu'il parle
        setTimeout(() => {
          highlightElement('exercices-tab', 4000);
        }, 500); // Petite pause puis illumination
        await exercicesAudioPromise;
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 2000));

        await playAudio("Alors, prends ta pioche et c'est parti pour l'aventure des fractions !");
        if (stopSignalRef.current) return;
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'explication:', error);
    } finally {
      setIsPlayingVocal(false);
      setCharacterSizeExpanded(false);
      stopSignalRef.current = false;
    }
  };

  // Fonction pour sauvegarder le progrès et calculer les XP
  const saveProgress = (finalScore: number) => {
    const sectionId = 'vocabulaire';
    const maxScore = exercises.length;
    const percentage = finalScore / maxScore;
    const baseXP = 12; // XP de base pour cette section
    const earnedXP = Math.round(baseXP * percentage);
    
    const progressData = {
      sectionId,
      completed: true,
      score: finalScore,
      maxScore,
      percentage,
      earnedXP,
      completedAt: new Date().toISOString()
    };
    
    const existingProgress = JSON.parse(localStorage.getItem('mathProgress') || '{}');
    const chapterProgress = existingProgress['ce1-fractions-simples'] || {};
    chapterProgress[sectionId] = progressData;
    existingProgress['ce1-fractions-simples'] = chapterProgress;
    localStorage.setItem('mathProgress', JSON.stringify(existingProgress));
  };

  // Données des exercices traditionnels
  const exercises = [
    { 
      question: 'Comment dit-on 1/2 en français ?',
      options: ['un demi', 'une moitié', 'un sur deux', 'une demie'],
      correctAnswer: 'une moitié',
      hint: 'Une fraction avec 2 au dénominateur s\'appelle une moitié'
    },
    { 
      question: 'Comment dit-on 1/3 en français ?',
      options: ['un tiers', 'une moitié', 'un quart', 'un troisième'],
      correctAnswer: 'un tiers',
      hint: 'Une fraction avec 3 au dénominateur s\'appelle un tiers'
    },
    { 
      question: 'Comment dit-on 1/4 en français ?',
      options: ['un demi', 'un tiers', 'un quart', 'un quatrième'],
      correctAnswer: 'un quart',
      hint: 'Une fraction avec 4 au dénominateur s\'appelle un quart'
    },
    { 
      question: 'Comment dit-on 1/5 en français ?',
      options: ['un cinquième', 'un quart', 'un sixième', 'un cinq'],
      correctAnswer: 'un cinquième',
      hint: 'Le nombre 5 donne "un cinquième"'
    },
    { 
      question: 'Comment dit-on 1/6 en français ?',
      options: ['un cinquième', 'un sixième', 'un septième', 'un six'],
      correctAnswer: 'un sixième',
      hint: 'Le nombre 6 donne "un sixième"'
    },
    { 
      question: 'Comment dit-on 1/10 en français ?',
      options: ['un dixième', 'un neuvième', 'un onzième', 'un dix'],
      correctAnswer: 'un dixième',
      hint: 'Le nombre 10 donne "un dixième"'
    }
  ];

  const handleNext = () => {
    if (isCorrect === null) {
      const correct = userAnswer === exercises[currentExercise].correctAnswer;
      setIsCorrect(correct);
      
      if (correct && !answeredCorrectly.has(currentExercise)) {
        setScore(prevScore => prevScore + 1);
        setAnsweredCorrectly(prev => {
          const newSet = new Set(prev);
          newSet.add(currentExercise);
          return newSet;
        });
      }

      if (correct) {
        setTimeout(() => {
          if (currentExercise + 1 < exercises.length) {
            setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
            setUserAnswer('');
            setIsCorrect(null);
            setShowHint(false);
          } else {
            const newFinalScore = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
            setFinalScore(newFinalScore);
            saveProgress(newFinalScore);
            setShowCompletionModal(true);
          }
        }, 1500);
      }
    } else {
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
        setUserAnswer('');
        setIsCorrect(null);
        setShowHint(false);
      } else {
        setFinalScore(score);
        saveProgress(score);
        setShowCompletionModal(true);
      }
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setIsCorrect(null);
    setShowHint(false);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setShowHint(false);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce2-fractions-mesures" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              💬 Vocabulaire des fractions
            </h1>
            <p className="text-sm sm:text-sm sm:text-lg text-gray-600 hidden sm:block">
              Apprends les mots importants : moitié, tiers, quart...
            </p>
              </div>
              </div>

        {/* Onglets Cours/Exercices */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          <div className="flex">
            <button
              onClick={() => setShowExercises(false)}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 font-bold text-sm sm:text-base transition-colors ${
                !showExercises
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📖 Cours
            </button>
            <button
              id="exercices-tab"
              onClick={() => {
                console.log('Clic sur onglet exercices, showExercises avant:', showExercises);
                setShowExercises(true);
                explainExercises();
                console.log('setShowExercises(true) et explainExercises() appelés');
              }}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 font-bold text-sm sm:text-base transition-colors ${
                showExercises
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${highlightedElement === 'exercices-tab' ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105' : ''}`}
            >
              ✏️ Exercices
            </button>
          </div>
        </div>



        {!showExercises ? (
          /* COURS */
          <div className="space-y-4 sm:space-y-8">
            {/* Personnage Minecraft avec bouton DÉMARRER - Section séparée */}
            <div className="flex justify-center p-1 mt-1 sm:mt-2">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Image du personnage Minecraft */}
                <div className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 shadow-md transition-all duration-300 ${
                  isPlayingVocal
                    ? 'w-20 sm:w-32 h-20 sm:h-32 scale-110 sm:scale-150' // When speaking - agrandi mobile
                    : hasStarted
                      ? 'w-16 sm:w-16 h-16 sm:h-16' // After "COMMENCER" clicked (reduced) - agrandi mobile
                      : 'w-16 sm:w-20 h-16 sm:h-20' // Initial - agrandi mobile
                }`}>
                  <img 
                    src="/image/Minecraftstyle.png" 
                    alt="Personnage Minecraft" 
                    className="w-full h-full rounded-full object-cover"
                  />
                  {/* Haut-parleur animé quand il parle */}
                  {isPlayingVocal && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white p-2 rounded-full animate-bounce shadow-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                                 {/* Bouton DÉMARRER */}
                 <button
                   onClick={explainChapter}
                   disabled={false}
                   className={`relative px-4 sm:px-12 py-2 sm:py-5 rounded-xl font-black text-sm sm:text-2xl transition-all duration-300 transform min-h-[3rem] sm:min-h-[4rem] ${
                    isPlayingVocal 
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed animate-pulse shadow-md' 
                      : hasStarted || showExercises
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white opacity-75 cursor-not-allowed shadow-lg'
                        : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600 hover:scale-110 shadow-2xl hover:shadow-3xl animate-pulse border-4 border-yellow-300'
                  } ${!isPlayingVocal && !hasStarted && !showExercises ? 'ring-4 ring-yellow-300 ring-opacity-75' : ''}`}
                  style={{
                    animationDuration: !isPlayingVocal && !hasStarted && !showExercises ? '1.2s' : '2s',
                    animationIterationCount: isPlayingVocal || hasStarted || showExercises ? 'none' : 'infinite',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    boxShadow: !isPlayingVocal && !hasStarted && !showExercises
                      ? '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' 
                      : ''
                  }}
                >
                  {/* Effet de brillance */}
                  {!isPlayingVocal && !hasStarted && !showExercises && (
                    <div 
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                      style={{
                        animation: 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                      }}
                    ></div>
                  )}
                  
                  {/* Icônes et texte avec plus d'émojis */}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isPlayingVocal 
                      ? <>🎤 <span className="animate-bounce">J'explique...</span></> 
                      : hasStarted
                        ? <>🔄 <span>Recommencer</span></>
                        : <>🚀 <span className="animate-bounce">COMMENCER</span> ✨</>
                    }
                  </span>
                  
                  {/* Particules brillantes pour le bouton commencer */}
                  {!isPlayingVocal && !hasStarted && !showExercises && (
                    <>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Animation Introduction : Qu'est-ce qu'une fraction ? */}
            <div id="fraction-intro" className={`transition-all duration-500 ${
              highlightedElement === 'fraction-intro' ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105' : ''
            }`}>
            <FractionIntroAnimation 
                highlightedElement={highlightedElement}
                animatingRef={fractionIntroAnimatingRef}
                audioRef={fractionIntroAudioRef}
                updateAudioState={(isPlaying) => updateChildAudioState('fractionIntro', isPlaying)}
            />
            </div>

            {/* Animation interactive pour les parties d'une fraction */}
            <div id="parties-fraction" className={`transition-all duration-500 ${
              highlightedElement === 'parties-fraction' ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105' : ''
            }`}>
            <PartiesFractionAnimation 
                highlightedElement={highlightedElement}
                animatingRef={partiesFractionAnimatingRef}
                audioRef={partiesFractionAudioRef}
                updateAudioState={(isPlaying) => updateChildAudioState('partiesFraction', isPlaying)}
            />
            </div>

            {/* Animation interactive du vocabulaire - APRÈS les parties */}
            <div id="apprendre-vocabulaire" className={`transition-all duration-500 ${
              highlightedElement === 'apprendre-vocabulaire' ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105' : ''
            }`}>
            <VocabulaireAnimation 
                highlightedElement={highlightedElement}
                audioRef={vocabulaireAudioRef}
                updateAudioState={(isPlaying) => updateChildAudioState('vocabulaire', isPlaying)}
            />
            </div>

            {/* Exemples avec visualisations */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                🎯 Exemples de fractions
              </h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { fraction: '1/2', name: 'une moitié', color: '#f97316' },
                  { fraction: '1/3', name: 'un tiers', color: '#10b981' },
                  { fraction: '1/4', name: 'un quart', color: '#3b82f6' },
                  { fraction: '1/5', name: 'un cinquième', color: '#8b5cf6' },
                  { fraction: '1/6', name: 'un sixième', color: '#ec4899' },
                  { fraction: '1/7', name: 'un septième', color: '#06b6d4' },
                  { fraction: '1/8', name: 'un huitième', color: '#84cc16' },
                  { fraction: '1/9', name: 'un neuvième', color: '#f59e0b' },
                  { fraction: '1/10', name: 'un dixième', color: '#ef4444' }
                ].map((example, index) => {
                  const numerator = parseInt(example.fraction.split('/')[0]);
                  const denominator = parseInt(example.fraction.split('/')[1]);
                  
                  return (
                    <div key={index} className="text-center bg-gray-50 rounded-lg p-4">
                      {/* Petit camembert */}
                      <div className="flex justify-center mb-3">
                        <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto">
                          {Array.from({ length: denominator }, (_, i) => {
                            const anglePerPart = 360 / denominator;
                            const startAngle = i * anglePerPart - 90;
                            const endAngle = (i + 1) * anglePerPart - 90;
                            
                            const startRad = (startAngle * Math.PI) / 180;
                            const endRad = (endAngle * Math.PI) / 180;
                            
                            const radius = 25;
                            const centerX = 30;
                            const centerY = 30;
                            
                            const x1 = centerX + radius * Math.cos(startRad);
                            const y1 = centerY + radius * Math.sin(startRad);
                            const x2 = centerX + radius * Math.cos(endRad);
                            const y2 = centerY + radius * Math.sin(endRad);
                            
                            const largeArcFlag = anglePerPart > 180 ? 1 : 0;
                            
                            const pathData = [
                              `M ${centerX} ${centerY}`,
                              `L ${x1} ${y1}`,
                              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                              'Z'
                            ].join(' ');
                            
                            return (
                              <path
                                key={i}
                                d={pathData}
                                fill={i < numerator ? example.color : '#f3f4f6'}
                                stroke="#6b7280"
                                strokeWidth="1"
                              />
                            );
                          })}
                        </svg>
                      </div>
                      
                      <div className="text-2xl font-bold mb-2">
                        <FractionMath 
                          a={example.fraction.split('/')[0]} 
                          b={example.fraction.split('/')[1]} 
                          size="text-xl" 
                        />
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {example.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg border-2 border-green-200">
              <h3 className="text-lg sm:text-2xl font-bold text-center text-gray-900 mb-4 sm:mb-6">
                💡 Conseils pour réussir
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-2">🔤 Pour bien nommer :</h4>
                  <ul className="text-green-700 space-y-1">
                    <li>• 1/2 = une moitié</li>
                    <li>• 1/3 = un tiers</li>
                    <li>• 1/4 = un quart</li>
                    <li>• À partir de 5 : un + nombre + ième</li>
                    <li>• Exemple : 1/10 = un dixième</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2">🎯 Pour bien comprendre :</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Le nombre du bas = en combien je divise</li>
                    <li>• Le nombre du haut = combien je prends</li>
                    <li>• Plus le dénominateur est grand, plus les parts sont petites</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Personnage Minecraft avec bouton COMMENCER pour les exercices */}
            <div className="flex justify-center p-1 mt-1 sm:mt-2">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Image du personnage Minecraft */}
                <div className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200 shadow-md transition-all duration-300 ${
                  isPlayingVocal
                    ? 'w-16 sm:w-20 md:w-32 h-16 sm:h-20 md:h-32 scale-110 sm:scale-150'
                    : 'w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20'
                }`}>
                  <img 
                    src="/image/Minecraftstyle.png" 
                    alt="Personnage Minecraft - Exercices" 
                    className="w-full h-full rounded-full object-cover"
                  />
                  {/* Haut-parleur animé quand il parle */}
                  {isPlayingVocal && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white p-2 rounded-full animate-bounce shadow-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Bouton COMMENCER LES EXERCICES */}
                <button
                  onClick={() => {
                    console.log('Bouton COMMENCER exercices cliqué');
                    explainExercises();
                  }}
                  disabled={false}
                  className={`relative px-3 sm:px-6 md:px-12 py-3 sm:py-4 md:py-5 rounded-xl font-black text-xs sm:text-lg md:text-2xl transition-all duration-300 transform min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[4rem] ${
                   isPlayingVocal 
                     ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed animate-pulse shadow-md' 
                     : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 hover:scale-110 shadow-2xl hover:shadow-3xl animate-pulse border-4 border-yellow-300'
                 } ring-4 ring-yellow-300 ring-opacity-75`}
                 style={{
                   animationDuration: isPlayingVocal ? '2s' : '1.2s',
                   animationIterationCount: isPlayingVocal ? 'none' : 'infinite',
                   textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                   boxShadow: !isPlayingVocal 
                     ? '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' 
                     : ''
                 }}
                >
                  {/* Effet de brillance */}
                  {!isPlayingVocal && (
                    <div 
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                      style={{
                        animation: 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                      }}
                    ></div>
                  )}
                  
                  {/* Icônes et texte */}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isPlayingVocal 
                      ? <>🎤 <span className="animate-bounce">J'explique...</span></> 
                      : <>🎯 <span className="animate-bounce">COMMENCER LES EXERCICES</span> ⚡</>
                    }
                  </span>
                  
                  {/* Particules brillantes */}
                  {!isPlayingVocal && (
                    <>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute top-1/2 -left-2 w-1 h-1 bg-teal-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Header avec choix d'exercices */}
            <div className="bg-white rounded-xl p-1 sm:p-3 shadow-lg">
              <h2 className="text-base sm:text-2xl font-bold text-center mb-0.5 sm:mb-2">Exercices sur le vocabulaire des fractions</h2>
              <p className="text-center text-gray-700 mb-1 sm:mb-3 text-sm sm:text-lg font-bold">Choisis ton type d'exercice :</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-1 sm:gap-0">
                <button
                  id="exercice-coloriage"
                  onClick={() => setSelectedExerciseType('coloriage')}
                  className={`py-2 sm:py-3 px-2 sm:px-4 font-bold text-xs sm:text-sm transition-colors rounded-lg sm:rounded-none ${
                    selectedExerciseType === 'coloriage'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } ${highlightedElement === 'exercice-coloriage' ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105' : ''}`}
                >
                  🎨 Coloriage
                </button>
                <button
                  id="exercice-ecriture"
                  onClick={() => setSelectedExerciseType('ecriture')}
                  className={`py-2 sm:py-3 px-2 sm:px-4 font-bold text-xs sm:text-sm transition-colors rounded-lg sm:rounded-none ${
                    selectedExerciseType === 'ecriture'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } ${highlightedElement === 'exercice-ecriture' ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105' : ''}`}
                >
                  ✍️ Écriture
                </button>
                <button
                  id="exercice-identification"
                  onClick={() => setSelectedExerciseType('identification')}
                  className={`py-2 sm:py-3 px-2 sm:px-4 font-bold text-xs sm:text-sm transition-colors rounded-lg sm:rounded-none ${
                    selectedExerciseType === 'identification'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } ${highlightedElement === 'exercice-identification' ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105' : ''}`}
                >
                  🎯 Identification
                </button>
                <button
                  id="exercice-reconnaissance"
                  onClick={() => setSelectedExerciseType('reconnaissance')}
                  className={`py-2 sm:py-3 px-2 sm:px-4 font-bold text-xs sm:text-sm transition-colors rounded-lg sm:rounded-none ${
                    selectedExerciseType === 'reconnaissance'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } ${highlightedElement === 'exercice-reconnaissance' ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105' : ''}`}
                >
                  🔍 Reconnaissance
                </button>

              </div>
            </div>

            {/* Exercices selon le type sélectionné */}
            {selectedExerciseType === 'coloriage' && <ExerciceColorageIndividuel />}
            {selectedExerciseType === 'ecriture' && <ExerciceEcritureIndividuel />}
            {selectedExerciseType === 'identification' && <ExerciceIdentificationIndividuel />}
            {selectedExerciseType === 'reconnaissance' && <ExerciceTrouverFractionIndividuel />}
          </div>
        )}

      {isAnyAudioPlaying() && (
        <div className="fixed top-4 right-4 z-[60]">
          <button
            onClick={() => stopAllVocalsAndAnimations(true)}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
            title="Arrêter l'animation"
          >
            {/* Image du personnage */}
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50">
              <img
                src="/image/Minecraftstyle.png"
                alt="Personnage Minecraft"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Texte et icône */}
            <>
              <span className="text-sm font-bold hidden sm:block">Stop</span>
              <div className="w-3 h-3 bg-white rounded-sm animate-pulse"></div>
            </>
          </button>
        </div>
      )}
      </div>
    </div>
  );
} 
