'use client';

import { useRef, useCallback, useState } from 'react';

export interface VocalAnimationOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  highlightDuration?: number;
  scrollOffset?: number;
}

export interface AnimationStep {
  elementId: string;
  text: string;
  action?: 'highlight' | 'pulse' | 'glow' | 'scroll' | 'focus';
  duration?: number;
  options?: VocalAnimationOptions;
}

export const useVocalAnimationManager = () => {
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fonction pour jouer l'audio avec options
  const playAudio = useCallback(async (text: string, options: VocalAnimationOptions = {}) => {
    return new Promise<void>((resolve, reject) => {
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
      
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1.1;
      utterance.volume = options.volume || 1;
      
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => 
        voice.lang.startsWith('fr') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith('fr'));
      
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }

      utterance.onend = () => {
        currentAudioRef.current = null;
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        currentAudioRef.current = null;
        reject(new Error('Speech synthesis error'));
      };

      currentAudioRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  // Fonction pour scroller vers un élément avec animation
  const scrollToElement = useCallback(async (elementId: string, options: VocalAnimationOptions = {}) => {
    const element = document.getElementById(elementId);
    if (element) {
      const offset = options.scrollOffset || 0;
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle = absoluteElementTop - (window.innerHeight / 2) + offset;

      window.scrollTo({
        top: middle,
        behavior: 'smooth'
      });

      // Attendre que le scroll soit terminé
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }, []);

  // Fonction pour ajouter une classe d'animation à un élément
  const animateElement = useCallback((elementId: string, animationClass: string, duration: number = 2000) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add(animationClass);
      
      setTimeout(() => {
        element.classList.remove(animationClass);
      }, duration);
    }
  }, []);

  // Fonction pour exécuter une séquence d'animations vocales
  const executeAnimationSequence = useCallback(async (steps: AnimationStep[]) => {
    stopSignalRef.current = false;

    for (const step of steps) {
      if (stopSignalRef.current) break;

      const element = document.getElementById(step.elementId);
      
      // Action avant l'audio
      switch (step.action) {
        case 'scroll':
          await scrollToElement(step.elementId, step.options);
          break;
        case 'highlight':
          animateElement(step.elementId, 'ring-4 ring-blue-300 ring-opacity-75 scale-105', step.duration || 2000);
          break;
        case 'pulse':
          animateElement(step.elementId, 'animate-pulse', step.duration || 2000);
          break;
        case 'glow':
          animateElement(step.elementId, 'shadow-2xl shadow-blue-400/50', step.duration || 2000);
          break;
        case 'focus':
          if (element && element instanceof HTMLInputElement) {
            element.focus();
          }
          break;
      }

      // Jouer l'audio
      try {
        await playAudio(step.text, step.options);
      } catch (error) {
        console.error('Erreur audio:', error);
      }

      // Attendre si spécifié
      if (step.duration) {
        await new Promise(resolve => setTimeout(resolve, step.duration));
      }
    }
  }, [playAudio, scrollToElement, animateElement]);

  // Fonction pour arrêter toutes les animations
  const stopAllAnimations = useCallback(() => {
    stopSignalRef.current = true;
    
    if (currentAudioRef.current) {
      window.speechSynthesis.cancel();
      currentAudioRef.current = null;
    }

    // Nettoyer toutes les classes d'animation
    const elementsWithAnimations = document.querySelectorAll('.animate-pulse, .ring-4, .shadow-2xl');
    elementsWithAnimations.forEach(element => {
      element.classList.remove('animate-pulse', 'ring-4', 'ring-blue-300', 'ring-opacity-75', 'scale-105', 'shadow-2xl', 'shadow-blue-400/50');
    });
  }, []);

  // Fonction pour créer des séquences prédéfinies
  const createIntroSequence = useCallback((sectionIds: string[]): AnimationStep[] => {
    return [
      {
        elementId: sectionIds[0] || 'intro-section',
        text: "Bonjour ! Bienvenue dans cette leçon interactive !",
        action: 'scroll',
        options: { rate: 0.9, pitch: 1.1 }
      },
      {
        elementId: sectionIds[1] || 'content-section',
        text: "Je vais te guider étape par étape. Regarde bien les éléments qui s'illuminent !",
        action: 'highlight',
        duration: 3000
      }
    ];
  }, []);

  const createButtonGuidanceSequence = useCallback((buttonIds: string[], descriptions: string[]): AnimationStep[] => {
    return buttonIds.map((buttonId, index) => ({
      elementId: buttonId,
      text: descriptions[index] || `Clique sur ce bouton pour continuer.`,
      action: 'pulse',
      duration: 2000,
      options: { rate: 0.9 }
    }));
  }, []);

  const createFormGuidanceSequence = useCallback((formElements: { id: string; description: string }[]): AnimationStep[] => {
    return formElements.map(element => ({
      elementId: element.id,
      text: element.description,
      action: element.id.includes('input') ? 'focus' : 'highlight',
      duration: 2000
    }));
  }, []);

  return {
    playAudio,
    scrollToElement,
    animateElement,
    executeAnimationSequence,
    stopAllAnimations,
    createIntroSequence,
    createButtonGuidanceSequence,
    createFormGuidanceSequence,
    isPlaying: () => !!currentAudioRef.current
  };
};

// Composant wrapper pour les éléments animés
export const AnimatedElement: React.FC<{
  id: string;
  children: React.ReactNode;
  className?: string;
  animationType?: 'highlight' | 'pulse' | 'glow';
  isActive?: boolean;
}> = ({ id, children, className = '', animationType = 'highlight', isActive = false }) => {
  const getAnimationClasses = () => {
    if (!isActive) return '';
    
    switch (animationType) {
      case 'highlight':
        return 'ring-4 ring-blue-300 ring-opacity-75 scale-105 transition-all duration-500';
      case 'pulse':
        return 'animate-pulse';
      case 'glow':
        return 'shadow-2xl shadow-blue-400/50 transition-all duration-500';
      default:
        return '';
    }
  };

  return (
    <div id={id} className={`${className} ${getAnimationClasses()}`}>
      {children}
    </div>
  );
};

// Hook pour gérer les états d'animation
export const useAnimationStates = () => {
  const [highlightedElements, setHighlightedElements] = useState<Set<string>>(new Set());
  const [pulsingElements, setPulsingElements] = useState<Set<string>>(new Set());
  const [glowingElements, setGlowingElements] = useState<Set<string>>(new Set());

  const addHighlight = useCallback((elementId: string) => {
    setHighlightedElements(prev => new Set(prev).add(elementId));
  }, []);

  const removeHighlight = useCallback((elementId: string) => {
    setHighlightedElements(prev => {
      const newSet = new Set(prev);
      newSet.delete(elementId);
      return newSet;
    });
  }, []);

  const addPulse = useCallback((elementId: string) => {
    setPulsingElements(prev => new Set(prev).add(elementId));
  }, []);

  const removePulse = useCallback((elementId: string) => {
    setPulsingElements(prev => {
      const newSet = new Set(prev);
      newSet.delete(elementId);
      return newSet;
    });
  }, []);

  const addGlow = useCallback((elementId: string) => {
    setGlowingElements(prev => new Set(prev).add(elementId));
  }, []);

  const removeGlow = useCallback((elementId: string) => {
    setGlowingElements(prev => {
      const newSet = new Set(prev);
      newSet.delete(elementId);
      return newSet;
    });
  }, []);

  const clearAllAnimations = useCallback(() => {
    setHighlightedElements(new Set());
    setPulsingElements(new Set());
    setGlowingElements(new Set());
  }, []);

  return {
    highlightedElements,
    pulsingElements,
    glowingElements,
    addHighlight,
    removeHighlight,
    addPulse,
    removePulse,
    addGlow,
    removeGlow,
    clearAllAnimations
  };
};
