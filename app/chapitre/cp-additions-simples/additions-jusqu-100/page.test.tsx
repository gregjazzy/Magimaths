'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, VolumeX } from 'lucide-react';

export default function AdditionsJusqua100Test() {
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fonction audio simplifiée
  const playAudio = async (text: string) => {
    return new Promise<void>((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        resolve();
        return;
      }

      if (stopSignalRef.current) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => voice.lang.startsWith('fr'));
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }

      utterance.onstart = () => setIsPlayingVocal(true);
      utterance.onend = () => {
        setIsPlayingVocal(false);
        currentAudioRef.current = null;
        resolve();
      };
      utterance.onerror = () => {
        setIsPlayingVocal(false);
        currentAudioRef.current = null;
        resolve();
      };

      currentAudioRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    });
  };

  // Fonction de scroll simplifiée mais efficace
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Scroll immédiat
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest' 
      });
      
      // Animation de surbrillance directe
      element.style.cssText = `
        ${element.style.cssText}
        box-shadow: 0 0 0 4px #FCD34D, 0 0 20px #FCD34D !important;
        transform: scale(1.05) !important;
        transition: all 0.5s ease !important;
        border-radius: 12px !important;
        background: linear-gradient(45deg, rgba(252, 211, 77, 0.2), rgba(59, 130, 246, 0.2)) !important;
        z-index: 1000 !important;
        position: relative !important;
      `;
      
      // Nettoyer après 3 secondes
      setTimeout(() => {
        element.style.cssText = '';
      }, 3000);
    }
  };

  // Fonction d'animation de bouton simplifiée
  const animateButton = (buttonId: string) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.style.cssText = `
        ${button.style.cssText}
        animation: pulse 1s infinite !important;
        box-shadow: 0 0 0 4px #3B82F6 !important;
        transform: scale(1.1) !important;
        transition: all 0.3s ease !important;
        border: 3px solid #3B82F6 !important;
        z-index: 1000 !important;
        position: relative !important;
      `;
      
      setTimeout(() => {
        button.style.cssText = '';
      }, 3000);
    }
  };

  // Fonction d'attente
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Présentation vocale simplifiée
  const startVocalPresentation = async () => {
    if (isAnimationRunning) return;
    
    stopSignalRef.current = false;
    setIsAnimationRunning(true);

    try {
      // Test 1: Introduction
      setCurrentStep('intro');
      scrollToElement('intro-section');
      await playAudio("Bonjour ! Je vais tester les animations avec toi !");
      await wait(1000);

      if (stopSignalRef.current) return;

      // Test 2: Techniques
      setCurrentStep('techniques');
      scrollToElement('techniques-section');
      await playAudio("Regarde, je vais illuminer les techniques une par une !");
      await wait(1000);

      if (stopSignalRef.current) return;

      // Test 3: Animation des boutons
      const techniques = ['technique-1', 'technique-2', 'technique-3', 'technique-4'];
      for (let i = 0; i < techniques.length; i++) {
        if (stopSignalRef.current) return;
        
        animateButton(techniques[i]);
        await playAudio(`Technique ${i + 1} s'illumine maintenant !`);
        await wait(1500);
      }

      if (stopSignalRef.current) return;

      // Test 4: Exercices
      setCurrentStep('exercises');
      scrollToElement('exercises-section');
      animateButton('start-exercises-btn');
      await playAudio("Maintenant clique sur le bouton exercices qui clignote !");
      await wait(2000);

    } catch (error) {
      console.error('Erreur dans la présentation:', error);
    } finally {
      setIsAnimationRunning(false);
      setCurrentStep(null);
    }
  };

  // Arrêter toutes les animations
  const stopAllAnimations = () => {
    stopSignalRef.current = true;
    
    if (currentAudioRef.current) {
      window.speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
    
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setCurrentStep(null);

    // Nettoyer tous les styles
    const elements = document.querySelectorAll('[id]');
    elements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.cssText = '';
      }
    });
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/chapitre/cp-additions-simples" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </Link>
            
            <h1 className="text-2xl font-bold text-gray-900">
              Test Animations Vocales
            </h1>
            
            <div className="flex items-center space-x-2">
              {!isAnimationRunning ? (
                <button
                  onClick={startVocalPresentation}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Tester</span>
                </button>
              ) : (
                <button
                  onClick={stopAllAnimations}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <VolumeX className="w-4 h-4" />
                  <span>Stop</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        
        {/* Section Introduction */}
        <section 
          id="intro-section"
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎯 Introduction
          </h2>
          <p className="text-gray-600">
            Cette page teste les animations de scroll et de surbrillance pendant les explications vocales.
          </p>
          <div className={`mt-4 p-4 rounded-lg ${
            currentStep === 'intro' ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100'
          }`}>
            <p className="font-medium">
              État actuel : {currentStep === 'intro' ? '✨ En cours de présentation' : '⏸️ En attente'}
            </p>
          </div>
        </section>

        {/* Section Techniques */}
        <section 
          id="techniques-section"
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🧠 Techniques d'Addition
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div 
              id="technique-1"
              className="p-4 bg-green-100 rounded-lg text-center border-2 border-green-200"
            >
              <div className="text-2xl mb-2">✨</div>
              <h3 className="font-bold text-green-800">Sans retenue</h3>
              <p className="text-sm text-green-600">La plus simple</p>
            </div>
            
            <div 
              id="technique-2"
              className="p-4 bg-orange-100 rounded-lg text-center border-2 border-orange-200"
            >
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="font-bold text-orange-800">Avec retenue</h3>
              <p className="text-sm text-orange-600">Plus complexe</p>
            </div>
            
            <div 
              id="technique-3"
              className="p-4 bg-purple-100 rounded-lg text-center border-2 border-purple-200"
            >
              <div className="text-2xl mb-2">🧠</div>
              <h3 className="font-bold text-purple-800">Calcul mental</h3>
              <p className="text-sm text-purple-600">La rapide</p>
            </div>
            
            <div 
              id="technique-4"
              className="p-4 bg-blue-100 rounded-lg text-center border-2 border-blue-200"
            >
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-bold text-blue-800">Complément</h3>
              <p className="text-sm text-blue-600">L'astucieuse</p>
            </div>
          </div>
        </section>

        {/* Section Exercices */}
        <section 
          id="exercises-section"
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🎯 Exercices d'Entraînement
          </h2>
          
          <div className="text-center">
            <button
              id="start-exercises-btn"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg"
            >
              🚀 Commencer les exercices
            </button>
          </div>
          
          <div className={`mt-6 p-4 rounded-lg ${
            currentStep === 'exercises' ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-100'
          }`}>
            <p className="text-center font-medium">
              {currentStep === 'exercises' ? '🎯 Section active' : '⏳ En attente'}
            </p>
          </div>
        </section>

        {/* Informations de debug */}
        <section className="bg-gray-100 rounded-xl p-6 border border-gray-300">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔧 Informations de Debug</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Audio en cours :</strong> {isPlayingVocal ? '🎤 Oui' : '🔇 Non'}</p>
            <p><strong>Animation en cours :</strong> {isAnimationRunning ? '✨ Oui' : '⏸️ Non'}</p>
            <p><strong>Étape actuelle :</strong> {currentStep || 'Aucune'}</p>
            <p><strong>Support vocal :</strong> {'speechSynthesis' in window ? '✅ Supporté' : '❌ Non supporté'}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
