'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DroiteAnimation from './components/DroiteAnimation';

import ExerciceSection from './components/ExerciceSection';

import { FractionMath } from './components/FractionMath';

export default function CE2DroiteGradueePage() {
  const [showExercises, setShowExercises] = useState(false);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [characterSizeExpanded, setCharacterSizeExpanded] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentFraction, setCurrentFraction] = useState({ numerator: 3, denominator: 4 });

  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    setIsPlayingVocal(false);
    setIsAnimating(false);
    setHighlightedElement(null);
    
    if (currentAudioRef.current) {
      window.speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
  };

  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      currentAudioRef.current = utterance;
      
      utterance.onend = () => {
        if (!stopSignalRef.current) {
          setIsPlayingVocal(false);
        }
        resolve();
      };
      
      utterance.onerror = () => {
        if (!stopSignalRef.current) {
          setIsPlayingVocal(false);
        }
        resolve();
      };
      
      setIsPlayingVocal(true);
      window.speechSynthesis.speak(utterance);
    });
  };

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const highlightElement = (elementId: string) => {
    setHighlightedElement(elementId);
    setTimeout(() => {
      if (!stopSignalRef.current) {
        setHighlightedElement(null);
      }
    }, 3000);
  };

  const explainChapter = async () => {
    stopSignalRef.current = false;
    setIsAnimating(true);

    if (!showExercises) {
      // Mode COURS
      await playAudio("Bienvenue ! Choisis une fraction parmi celles-ci.");
      if (stopSignalRef.current) return;

      scrollToElement('fraction-buttons');
      highlightElement('fraction-buttons');
      await playAudio("Clique sur une fraction pour voir comment elle se place.");
      if (stopSignalRef.current) return;

      scrollToElement('animation-buttons');
      highlightElement('animation-buttons');
      await playAudio("Utilise les boutons suivant et précédent pour voir chaque étape.");
      if (stopSignalRef.current) return;

      scrollToElement('tab-navigation');
      highlightElement('tab-navigation');
      await playAudio("Quand tu es prêt, passe aux exercices !");

    } else {
      // Mode EXERCICES
      await playAudio("C'est parti pour les exercices !");
      if (stopSignalRef.current) return;

      scrollToElement('progress-bar');
      highlightElement('progress-bar');
      await playAudio("La barre verte montre ta progression.");
      if (stopSignalRef.current) return;

      scrollToElement('question-zone');
      highlightElement('question-zone');
      await playAudio("Divise la droite en parts égales, puis place le point rouge au bon endroit. Tu peux utiliser les boutons ou glisser le point !");
    }

    setIsAnimating(false);
  };

  useEffect(() => {
    return () => {
      stopAllVocalsAndAnimations();
    };
  }, [showExercises]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <Link href="/chapitre/ce2-fractions-mesures" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-2 sm:mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour aux fractions et mesures</span>
          </Link>
          
          <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg text-center">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              📏 Droite graduée
            </h1>
          </div>
        </div>

        {/* Personnage Minecraft avec bouton DÉMARRER */}
        <div className="flex items-center justify-center gap-6 flex-wrap mb-4 sm:mb-8">
          <div id="minecraft-character" className={`relative transition-all duration-500 border-4 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg ${
            isPlayingVocal
              ? 'w-20 sm:w-24 h-20 sm:h-24' // Quand il parle - plus gros
              : characterSizeExpanded
                ? 'w-16 sm:w-20 h-16 sm:h-20' // Après DÉMARRER - normal
                : 'w-12 sm:w-16 h-12 sm:h-16' // Initial - plus petit
          }`}>
            <img
              src="/image/Minecraftstyle.png"
              alt="Personnage Minecraft"
              className="w-full h-full rounded-full object-cover"
            />
            {/* Mégaphone quand il parle */}
            {isPlayingVocal && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          <button
            id="start-button"
            onClick={() => {
              setHasStarted(true);
              setCharacterSizeExpanded(true);
              explainChapter();
            }}
            disabled={isPlayingVocal}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-xl shadow-lg transition-all pulse-interactive-yellow disabled:opacity-50 flex items-center justify-center"
          >
            🚀 DÉMARRER
          </button>
        </div>

        {/* Bouton STOP flottant global */}
        {(isPlayingVocal || isAnimating) && (
          <button
            onClick={stopAllVocalsAndAnimations}
            className="fixed top-4 right-4 z-[60] bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all flex items-center gap-2 pulse-interactive-gray"
          >
            <div className="w-8 h-8 relative">
              <img
                src="/image/Minecraftstyle.png"
                alt="Stop"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="font-bold text-sm">Stop</span>
            <div className="w-3 h-3 bg-white rounded animate-pulse"></div>
          </button>
        )}

        {/* Onglets Cours/Exercices */}
        <div id="tab-navigation" className={`flex justify-center mb-3 sm:mb-6 ${highlightedElement === 'tab-navigation' ? 'animate-pulse bg-yellow-200 rounded-xl p-2' : ''}`}>
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              id="tab-cours"
              onClick={() => setShowExercises(false)}
              disabled={isPlayingVocal}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all pulse-interactive text-sm sm:text-base ${
                !showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              } disabled:opacity-50 ${highlightedElement === 'tab-cours' ? 'animate-pulse bg-yellow-200' : ''}`}
            >
              📖 Cours
            </button>
            <button
              id="tab-exercices"
              onClick={() => setShowExercises(true)}
              disabled={isPlayingVocal}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all pulse-interactive text-sm sm:text-base ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              } disabled:opacity-50 ${highlightedElement === 'tab-exercices' ? 'animate-pulse bg-yellow-200' : ''}`}
            >
              ✏️ Exercices
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="space-y-4 sm:space-y-8">
          {!showExercises ? (
            <div className="space-y-8">
              {/* Introduction */}
              <div id="intro-section" className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'intro-section' ? 'animate-pulse bg-yellow-100' : ''
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">🎯</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Découvrons la droite graduée !</h2>
                    <p className="text-gray-600">Comme une règle magique qui nous aide à placer les fractions !</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800">
                    Imagine une règle où chaque petit trait représente une fraction. C'est comme ça qu'on va pouvoir voir où se placent les fractions entre les nombres entiers !
                  </p>
                </div>
              </div>

              {/* Box d'exemples */}
              <div className="bg-purple-50 rounded-xl p-6 shadow-lg mb-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-purple-800 flex items-center justify-center gap-2">
                    <span>👀</span> Regarde avec des exemples
                  </h3>
                  <p className="text-purple-600 mt-2">Clique sur une fraction pour voir comment elle se place sur la droite graduée</p>
                </div>
                <div id="fraction-buttons" className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
                  {[
                    { num: 2, den: 3 },
                    { num: 3, den: 4 },
                    { num: 6, den: 4 },
                    { num: 7, den: 3 },
                    { num: 3, den: 8 },
                    { num: 5, den: 3 }
                  ].map(({ num, den }) => (
                    <button
                      key={`${num}-${den}`}
                      onClick={() => {
                        setCurrentFraction({ numerator: num, denominator: den });
                        // Scroll vers l'animation avec un petit délai pour laisser le temps au state de se mettre à jour
                        setTimeout(() => {
                          const animationElement = document.getElementById('animation-section');
                          if (animationElement) {
                            const offset = window.innerHeight * 0.1; // 10% de la hauteur de l'écran
                            const elementPosition = animationElement.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - offset;
                            
                            window.scrollTo({
                              top: offsetPosition,
                              behavior: 'smooth'
                            });
                          }
                        }, 100);
                      }}
                      className={`p-2 sm:px-6 sm:py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 ${
                        currentFraction.numerator === num && currentFraction.denominator === den 
                          ? 'bg-purple-500 text-white shadow-lg' 
                          : 'bg-white hover:bg-purple-50 shadow-md hover:shadow-lg border-2 border-purple-300'
                      }`}
                    >
                      <FractionMath a={num} b={den} size="text-base sm:text-lg" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Animation de la fraction sur la droite */}
              <div id="animation-section" className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'rules-section' ? 'animate-pulse bg-yellow-100' : ''
              }`}>
                <div className="text-center mb-6">
                  <div className="bg-purple-100 rounded-lg p-3 mb-6 inline-block shadow-sm">
                    <h2 className="text-lg font-bold text-purple-800 border-b-2 border-purple-300 pb-1">
                      Plaçons <FractionMath a={currentFraction.numerator} b={currentFraction.denominator} /> sur la droite graduée
                    </h2>
                  </div>
                </div>
                
                <DroiteAnimation numerator={currentFraction.numerator} denominator={currentFraction.denominator} />

                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">💡</div>
                    <h4 className="font-bold text-blue-800">Comment trouver 3/4 ?</h4>
                  </div>
                  <ul className="space-y-2 text-blue-700">
                    <li>1. Le 4 (dénominateur) nous dit de diviser l'unité en 4 parts égales</li>
                    <li>2. Le 3 (numérateur) nous dit de compter 3 parts depuis 0</li>
                    <li>3. 3/4 se trouve donc après la troisième graduation !</li>
                  </ul>
                </div>
              </div>

              {/* Comment ça marche */}
              <div id="examples-section" className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'examples-section' ? 'animate-pulse bg-yellow-100' : ''
              }`}>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-blue-800">Comment ça marche ?</h3>
                  <p className="text-blue-600">C'est comme découper une tablette de chocolat !</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                  <div className="bg-yellow-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <div className="text-xl sm:text-2xl">1️⃣</div>
                      <h4 className="font-bold text-yellow-800 text-sm sm:text-base">On divise en parts égales</h4>
                    </div>
                    <p className="text-yellow-700 text-sm sm:text-base">
                      Comme quand on partage une tablette de chocolat, on divise l'espace entre 0 et 1 en parts égales !
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <div className="text-xl sm:text-2xl">2️⃣</div>
                      <h4 className="font-bold text-green-800 text-sm sm:text-base">On compte les parts</h4>
                    </div>
                    <p className="text-green-700 text-sm sm:text-base">
                      Ensuite, on compte le nombre de parts qu'on veut prendre. C'est facile !
                    </p>
                  </div>
                </div>
              </div>


            </div>
          ) : (
            <ExerciceSection />
          )}
        </div>
      </div>
    </div>
  );
}