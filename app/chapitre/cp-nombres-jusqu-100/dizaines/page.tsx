'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, CheckCircle, XCircle, RotateCcw, Volume2, Pause } from 'lucide-react';

export default function DizainesCP() {
  const router = useRouter();
  
  // Styles CSS pour les animations
  const animationStyles = `
    @keyframes slideInFromLeft {
      0% { transform: translateX(-100px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes bounceIn {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.2); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); }
      50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6); }
    }
    
    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-3deg); }
      75% { transform: rotate(3deg); }
    }
    
    @keyframes fadeInUp {
      0% { transform: translateY(30px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    
    .animate-slide-in { animation: slideInFromLeft 0.8s ease-out; }
    .animate-bounce-in { animation: bounceIn 0.6s ease-out; }
    .animate-glow { animation: glow 2s ease-in-out infinite; }
    .animate-wiggle { animation: wiggle 1s ease-in-out infinite; }
    .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
    
    @keyframes subtle-glow {
      0%, 100% {
        opacity: 0.8;
        transform: scale(1);
        filter: brightness(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
        filter: brightness(1.1);
      }
    }
  `;

  // Ajouter les styles au document
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = animationStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [selectedNumber, setSelectedNumber] = useState<string | null>('30');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // States pour l'animation de décomposition dizaines/unités (nettoyés)
  const [animatingNumber, setAnimatingNumber] = useState<string>('');

  // States pour audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>('examples-section');
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // États pour Sam le Pirate
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [highlightNextButton, setHighlightNextButton] = useState(false);
  const [isExplainingError, setIsExplainingError] = useState(false);
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);
  const [highlightDigit, setHighlightDigit] = useState<'left' | 'right' | null>(null);
  
  // États pour l'animation automatique du cours
  const [autoAnimationStep, setAutoAnimationStep] = useState(0);
  const [isAutoAnimating, setIsAutoAnimating] = useState(false);
  const [highlightLeftDigit, setHighlightLeftDigit] = useState(true); // Par défaut : chiffre de gauche mis en évidence
  
  // États pour les animations individuelles déclenchées par les boutons
  const [manualAnimationStep, setManualAnimationStep] = useState(3); // Afficher l'état final par défaut
  
  // États pour l'affichage progressif des sections finales
  const [showFinalSection, setShowFinalSection] = useState(false);

  const [showTipsSection, setShowTipsSection] = useState(false);
  const [highlightObjects, setHighlightObjects] = useState(false);
  const [highlightBox, setHighlightBox] = useState(false);
  
  // États pour les animations interactives progressives
  const [highlightVisual, setHighlightVisual] = useState(false);
  const [highlightBoxes, setHighlightBoxes] = useState(false);
  const [highlightUnits, setHighlightUnits] = useState(false);
  const [highlightTotal, setHighlightTotal] = useState(false);
  const [showStep, setShowStep] = useState(3); // 0: rien, 1: nombre, 2: décomposition, 3: total (afficher le résultat complet par défaut)

  // Refs pour contrôler les vocaux et animations
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Expressions de pirate personnalisées pour chaque exercice incorrect - adaptées aux dizaines
  const pirateExpressions = [
    "Par ma barbe de pirate", // exercice 1 - groupes de 10 dans 40
    "Humm ça n'est pas vraiment ça", // exercice 2 - 3 groupes de 10  
    "Nom d'un perroquet", // exercice 3 - dizaines dans 70
    "Saperlipopette", // exercice 4 - 2 dizaines
    "Mille sabords", // exercice 5 - groupes de 10 dans 60
    "Morbleu", // exercice 6 - 5 groupes de 10
    "Tonnerre de Brest", // exercice 7 - 8 dizaines
    "Par tous les diables des mers", // exercice 8 - dizaines dans 90
    "Nom d'une jambe en bois", // exercice 9 - 1 groupe de 10
    "Fichtre et refichtre" // exercice 10 - groupes de 10 dans 100
  ];

  // Compliments variés pour les bonnes réponses
  const correctAnswerCompliments = [
    "Bravo",
    "Magnifique", 
    "Parfait",
    "Époustouflant",
    "Formidable",
    "Incroyable",
    "Fantastique",
    "Génial",
    "Excellent",
    "Superbe"
  ];

  // Plus besoin de mélanger les choix pour la saisie libre

  // Réinitialiser l'animation quand on change de dizaine
  useEffect(() => {
    setAnimatingNumber('');
  }, [selectedNumber]);

  // Effet pour client-side et initialisation des voix
  useEffect(() => {
    setIsClient(true);
    
    // Vérifier le support de l'API Web Speech
    if (!('speechSynthesis' in window)) {
      console.error('❌ L\'API Web Speech n\'est pas supportée par ce navigateur');
      return;
    }
    
    // Initialiser les voix pour le speech synthesis
    const initVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log('🎤 Voix initialisées:', voices.length);
      if (voices.length > 0) {
        const frenchVoices = voices.filter(voice => voice.lang.startsWith('fr'));
        console.log('🇫🇷 Voix françaises:', frenchVoices.map(v => v.name));
      } else {
        console.warn('⚠️ Aucune voix disponible pour le moment');
      }
    };
    
    // Essayer d'initialiser immédiatement
    initVoices();
    
    // Écouter l'événement de chargement des voix
    speechSynthesis.addEventListener('voiceschanged', initVoices);
    
    // Cleanup
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', initVoices);
    };
  }, []);

  // Effet pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    stopAllVocalsAndAnimations();
    if (!showExercises) {
      // Quand on revient au cours, réinitialiser les états Sam
      setPirateIntroStarted(false);
      setShowExercisesList(false);
      setSamSizeExpanded(false);
      setExerciseStarted(false);
    }
  }, [showExercises]);

  // Effet pour reset les états d'erreur lors d'un nouvel exercice
  useEffect(() => {
    setUserAnswer('');
    setIsCorrect(null);
    setIsExplainingError(false);
    setHighlightDigit(null);
  }, [currentExercise]);

  // Effet pour détecter la navigation et stopper les vocaux
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      // Différer l'appel pour éviter les conflits avec useInsertionEffect
      setTimeout(() => stopAllVocalsAndAnimations(), 0);
    };

    // Intercepter les changements de route Next.js
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(state, title, url) {
      // Différer l'appel pour éviter les conflits avec useInsertionEffect
      setTimeout(() => stopAllVocalsAndAnimations(), 0);
      return originalPushState.call(history, state, title, url);
    };

    history.replaceState = function(state, title, url) {
      // Différer l'appel pour éviter les conflits avec useInsertionEffect
      setTimeout(() => stopAllVocalsAndAnimations(), 0);
      return originalReplaceState.call(history, state, title, url);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      
      // Restaurer les fonctions originales
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);



  // Fonctions pour l'animation de décomposition simplifiées
  // Les fonctions manuelles ont été supprimées, tout est automatique maintenant

  // Fonction pour expliquer la décomposition d'un exercice
  const speakDecomposition = async (exercise: any) => {
    if (stopSignalRef.current) return;
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    
    try {
      const questionText = exercise.question.toLowerCase();
      const match = exercise.question.match(/(\d+)/);
      const number = match ? match[1] : "";
      
      // PRIORITÉ 1: Questions qui demandent la VALEUR de X dizaines
      // Patterns: "Que vaut X dizaines ?", "X dizaines = ?", ou toute question avec "dizaines" où la réponse est un multiple de 10
      if ((questionText.includes('que vaut') && questionText.includes('dizaines')) || 
          questionText.includes('dizaines =') ||
          (questionText.includes('dizaines') && parseInt(exercise.correctAnswer) % 10 === 0 && parseInt(exercise.correctAnswer) > 0)) {
        
        const dizainesCount = parseInt(exercise.correctAnswer) / 10;
        await playAudio(`${dizainesCount} dizaine${dizainesCount > 1 ? 's' : ''} égale ${dizainesCount} fois 10, soit ${exercise.correctAnswer} !`);
        if (stopSignalRef.current) return;
        
      // PRIORITÉ 2: Questions qui demandent le NOMBRE de dizaines dans un nombre donné  
      } else if (questionText.includes('combien de dizaines')) {
        if (number) {
          if (number.length === 2) {
            const dizaines = number[0];
            await playAudio(`Pour trouver combien de dizaines dans ${number}, je décompose le nombre !`);
            if (stopSignalRef.current) return;
            
            await playAudio(`${number} se décompose en ${dizaines} dizaines et ${number[1]} unités`);
            if (stopSignalRef.current) return;
            
            await playAudio(`Le chiffre des dizaines est ${dizaines}, donc il y a ${dizaines} dizaines !`);
            if (stopSignalRef.current) return;
          } else if (number === '100') {
            await playAudio(`Pour 100, c'est spécial ! 100 égale 10 dizaines !`);
            if (stopSignalRef.current) return;
          }
        }
      }
    } catch (error) {
      console.error('Erreur dans speakDecomposition:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour convertir les nombres en mots français
  const numberToWords = (num: string): string => {
    const numbers: { [key: string]: string } = {
      '1': 'un', '2': 'deux', '3': 'trois', '4': 'quatre', '5': 'cinq',
      '6': 'six', '7': 'sept', '8': 'huit', '9': 'neuf', '10': 'dix',
      '20': 'vingt', '30': 'trente', '40': 'quarante', '50': 'cinquante',
      '60': 'soixante', '70': 'soixante-dix', '80': 'quatre-vingts', '90': 'quatre-vingt-dix', '100': 'cent'
    };
    return numbers[num] || num;
  };



  // L'animation est maintenant entièrement déclenchée par le bouton DÉMARRER

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'dizaines',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('cp-nombres-100-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'dizaines');
      
      if (existingIndex >= 0) {
        if (score > allProgress[existingIndex].score) {
          allProgress[existingIndex] = {
            ...progress,
            attempts: allProgress[existingIndex].attempts + 1
          };
        } else {
          allProgress[existingIndex].attempts += 1;
        }
      } else {
        allProgress.push(progress);
      }
    } else {
      allProgress = [progress];
    }

    localStorage.setItem('cp-nombres-100-progress', JSON.stringify(allProgress));
  };

  // Nombres dizaines pour le cours - incluant des nombres ne finissant pas par 0
  const dizaines = [
    { value: '20', label: '20', reading: 'vingt', visual: '📦📦', groups: 2, units: 0 },
    { value: '23', label: '23', reading: 'vingt-trois', visual: '📦📦🔵🔵🔵', groups: 2, units: 3 },
    { value: '30', label: '30', reading: 'trente', visual: '📦📦📦', groups: 3, units: 0 },
    { value: '45', label: '45', reading: 'quarante-cinq', visual: '📦📦📦📦🔵🔵🔵🔵🔵', groups: 4, units: 5 },
    { value: '50', label: '50', reading: 'cinquante', visual: '📦📦📦📦📦', groups: 5, units: 0 },
    { value: '67', label: '67', reading: 'soixante-sept', visual: '📦📦📦📦📦📦🔵🔵🔵🔵🔵🔵🔵', groups: 6, units: 7 },
    { value: '80', label: '80', reading: 'quatre-vingts', visual: '📦📦📦📦📦📦📦📦', groups: 8, units: 0 },
    { value: '89', label: '89', reading: 'quatre-vingt-neuf', visual: '📦📦📦📦📦📦📦📦🔵🔵🔵🔵🔵🔵🔵🔵🔵', groups: 8, units: 9 }
  ];

  // Exercices sur les dizaines - avec saisie libre
  const exercises = [
    { question: 'Combien de dizaines dans 40 ?', visual: '', correctAnswer: '4' },
    { question: 'Que vaut 3 dizaines ?', visual: '', correctAnswer: '30' },
    { question: 'Combien de dizaines dans 70 ?', visual: '', correctAnswer: '7' },
    { question: '2 dizaines = ?', visual: '', correctAnswer: '20' },
    { question: 'Combien de dizaines dans 60 ?', visual: '', correctAnswer: '6' },
    { question: 'Que vaut 5 dizaines ?', visual: '', correctAnswer: '50' },
    { question: '8 dizaines = ?', visual: '', correctAnswer: '80' },
    { question: 'Combien de dizaines dans 90 ?', visual: '', correctAnswer: '9' },
    { question: 'Que vaut 1 dizaine ?', visual: '', correctAnswer: '10' },
    { question: 'Combien de dizaines dans 100 ?', visual: '', correctAnswer: '10' }
  ];

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt FORCÉ de tous les vocaux et animations (navigation détectée)');
    stopSignalRef.current = true;
    
    // Arrêt immédiat et multiple de la synthèse vocale
    try {
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() appelé (1er)');
      }
      speechSynthesis.cancel(); // Force même si pas actif
      console.log('🔇 speechSynthesis.cancel() forcé');
    } catch (error) {
      console.log('❌ Erreur lors de l\'arrêt speechSynthesis:', error);
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
      console.log('🗑️ currentAudioRef supprimé');
    }
    
    // Reset immédiat de tous les états
    setIsPlayingVocal(false);
    setHighlightedElement('examples-section'); // Garder la section examples mise en évidence
    setHasStarted(false);
    setExerciseStarted(false);
    setSamSizeExpanded(false);
    setShowNextButton(false);
    setHighlightNextButton(false);
    setIsExplainingError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
    setHighlightDigit(null);
    
    // Reset des nouveaux états d'animation automatique
    setIsAutoAnimating(false);
    setAutoAnimationStep(0);
    setHighlightLeftDigit(true); // Garder le highlight par défaut
    setManualAnimationStep(3); // Remettre à l'état final par défaut
    setSelectedNumber('30'); // Garder l'exemple par défaut
    
    // Reset des sections finales
    setShowFinalSection(false);

    setShowTipsSection(false);
    
    // Reset des nouveaux états d'animation interactive
    setHighlightVisual(false);
    setHighlightBoxes(false);
    setHighlightUnits(false);
    setHighlightTotal(false);
    setShowStep(3); // Garder l'état final par défaut
    
    // Double-cancel après un petit délai pour être vraiment sûr
    setTimeout(() => {
      try {
        speechSynthesis.cancel();
        console.log('🔇 Double-cancel différé');
      } catch (error) {
        console.log('❌ Erreur lors du double-cancel différé:', error);
      }
    }, 100);
  };

  // Fonction wait utilitaire
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Fonction pour jouer l'audio avec voix féminine française
  const playAudio = async (text: string, slowMode = false) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      // Vérifier le support de l'API Web Speech
      if (!('speechSynthesis' in window)) {
        console.error('❌ L\'API Web Speech n\'est pas supportée');
        resolve();
        return;
      }

      console.log('🎤 Tentative de lecture audio:', text.substring(0, 50) + '...');
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.7 : 0.85;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;

      // Fonction pour obtenir les voix avec retry
      const getVoicesWithRetry = () => {
        let voices = speechSynthesis.getVoices();
        
        if (voices.length === 0) {
          console.log('⚠️ Aucune voix disponible, tentative dans 100ms...');
          // Attendre que les voix se chargent
          setTimeout(() => {
            voices = speechSynthesis.getVoices();
            selectVoiceAndSpeak(voices);
          }, 100);
        } else {
          selectVoiceAndSpeak(voices);
        }
      };

      const selectVoiceAndSpeak = (voices: SpeechSynthesisVoice[]) => {
        console.log('🔊 Voix disponibles:', voices.length);

      // Préférer une voix féminine française
      let selectedVoice = voices.find(voice => 
        voice.lang === 'fr-FR' && voice.name.toLowerCase().includes('female')
      );
      
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang === 'fr-FR' && (voice.name.toLowerCase().includes('amelie') || voice.name.toLowerCase().includes('marie'))
        );
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === 'fr-FR');
      }

        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.startsWith('fr'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
          console.log('✅ Voix sélectionnée:', selectedVoice.name);
        } else {
          console.log('⚠️ Aucune voix française trouvée, utilisation de la voix par défaut');
      }
      
      utterance.onend = () => {
          console.log('✅ Audio terminé');
        currentAudioRef.current = null;
        resolve();
      };
      
        utterance.onerror = (event) => {
          console.error('❌ Erreur audio:', event);
        currentAudioRef.current = null;
        resolve();
      };
      
      currentAudioRef.current = utterance;
      speechSynthesis.speak(utterance);
        console.log('🎵 Audio démarré');
      };

      // Démarrer le processus
      getVoicesWithRetry();
    });
  };

  // Fonction pour l'introduction vocale de Sam le Pirate - DÉMARRAGE MANUEL PAR CLIC
  const startPirateIntro = async () => {
    if (pirateIntroStarted) return;
    
    // FORCER la remise à false pour le démarrage manuel
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setPirateIntroStarted(true);
    
    try {
      await playAudio("Bonjour, faisons quelques exercices sur les dizaines nom d'une jambe en bois !");
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      await playAudio("Pour lire l'énoncé appuie sur écouter l'énoncé");
      if (stopSignalRef.current) return;
      
      // Animation sur le bouton "Écouter l'énoncé"
      setHighlightedElement('listen-question-button');
      setShowExercisesList(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("Dès que tu as trouvé combien de dizaines, tu peux l'écrire dans la case");
      if (stopSignalRef.current) return;
      
      // Mettre beaucoup en évidence la zone de réponse
      setHighlightedElement('answer-input');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("et appuie ensuite sur valider");
      if (stopSignalRef.current) return;
      
      // Animation sur le bouton valider
      setHighlightedElement('validate-button');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("en cas de mauvaise réponse, je serai là pour t'aider. En avant toutes !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans startPirateIntro:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour lire l'énoncé de l'exercice
  const startExerciseExplanation = async () => {
    if (stopSignalRef.current || isExplainingError || !exercises[currentExercise]) return;
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setExerciseStarted(true);
    
    try {
      // Lire seulement l'énoncé de l'exercice
      await playAudio(exercises[currentExercise].question);
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans startExerciseExplanation:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour féliciter avec audio pour les bonnes réponses
  const celebrateCorrectAnswer = async () => {
    // Forcer la réactivation pour permettre les encouragements même après stopAll
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    
    try {
      const randomCompliment = correctAnswerCompliments[Math.floor(Math.random() * correctAnswerCompliments.length)];
      await playAudio(randomCompliment + " !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans celebrateCorrectAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour scroller vers un élément
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Fonctions pour les animations individuelles déclenchées par les boutons
  
  // Fonction pour animer n'importe quel nombre sélectionné avec interactions
  const explainSelectedNumber = async (nombreChoisi: string) => {
    if (isPlayingVocal || isAutoAnimating) return;
    
    // COPIE DES PARAMÈTRES DE SAM LE PIRATE
    stopAllVocalsAndAnimations();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Réinitialiser tous les états d'animation
    setHighlightVisual(false);
    setHighlightBoxes(false);
    setHighlightUnits(false);
    setHighlightTotal(false);
    // setShowStep reste inchangé au début, il sera modifié dans l'animation
    setHighlightLeftDigit(false);
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    
    try {
      setHighlightedElement('examples-section');
      scrollToElement('examples-section');
      await wait(500);
      
      // ÉTAPE 1: Présenter le nombre
      setSelectedNumber(nombreChoisi);
      setShowStep(1);
      await wait(800);
      
      const numberData = dizaines.find(d => d.value === nombreChoisi);
      if (numberData) {
        await playAudio(`Analysons le nombre ${nombreChoisi}`);
        if (stopSignalRef.current) return;
        await wait(1500);
        
        // ÉTAPE 2: Expliquer la méthode du chiffre de gauche
        setHighlightLeftDigit(true);
        await playAudio(`Pour trouver les dizaines, je regarde le chiffre de gauche`);
        if (stopSignalRef.current) return;
        await wait(2000);
        
        await playAudio(`Le chiffre de gauche est ${nombreChoisi[0]}`);
        if (stopSignalRef.current) return;
        await wait(1500);
        
        await playAudio(`Donc ${nombreChoisi} contient ${numberData.groups} dizaines !`);
        if (stopSignalRef.current) return;
        await wait(2000);
        
        // ÉTAPE 3: Montrer la représentation visuelle
        setShowStep(2);
        setHighlightVisual(true);
        await playAudio(`Regardons maintenant la représentation visuelle`);
        if (stopSignalRef.current) return;
        await wait(2000);
        
        // ÉTAPE 4: Expliquer les boîtes
        setHighlightVisual(false);
        setHighlightBoxes(true);
        await playAudio(`Nous avons ${numberData.groups} boîtes qui représentent ${numberData.groups * 10}`);
        if (stopSignalRef.current) return;
        await wait(2500);
        
        // ÉTAPE 5: Expliquer les unités (si présentes)
        if (numberData.units > 0) {
          setHighlightBoxes(false);
          setHighlightUnits(true);
          await playAudio(`Plus ${numberData.units} objets individuels`);
          if (stopSignalRef.current) return;
          await wait(2000);
        }
        
        // ÉTAPE 6: Faire le total
        setHighlightBoxes(false);
        setHighlightUnits(false);
        setHighlightTotal(true);
        setShowStep(3);
        await playAudio(`Le total est ${numberData.groups * 10} plus ${numberData.units} égale ${nombreChoisi}`);
        if (stopSignalRef.current) return;
        await wait(2000);
        
        // ÉTAPE 7: Conclusion
        await playAudio(`Parfait ! ${nombreChoisi} contient bien ${numberData.groups} dizaines !`);
        if (stopSignalRef.current) return;
        await wait(1000);
        
        // Garder tous les éléments visibles à la fin
        setHighlightTotal(false);
      }
      
    } catch (error) {
      console.error('Erreur dans explainSelectedNumber:', error);
    } finally {
      setIsPlayingVocal(false);
      // GARDER tous les éléments affichés
    }
  };

  // Forcer l'affichage par défaut au chargement
  useEffect(() => {
    // S'assurer que les bons états sont activés pour afficher la section par défaut
    setSelectedNumber('30');
    setHighlightLeftDigit(true);
    setHighlightedElement('examples-section');
    setShowStep(3); // Afficher le résultat complet par défaut
    setManualAnimationStep(3); // Afficher l'animation de transformation par défaut
  }, []); // Au chargement uniquement

  
  const explainTransformation = async () => {
    if (isPlayingVocal) return;

    stopAllVocalsAndAnimations();
    await wait(100);

    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setManualAnimationStep(0); // Remettre à 0 pour recommencer l'animation
    setHighlightObjects(false);
    setHighlightBox(false);

    try {
      setHighlightedElement('concept-section');
      scrollToElement('concept-section');
      await wait(500);

      // ÉTAPE 1: Afficher les 10 objets
      setManualAnimationStep(1);
      await playAudio("Voici 10 objets.");
      if (stopSignalRef.current) return;
      await wait(2000);

      // ÉTAPE 2: Afficher le signe égal
      setManualAnimationStep(2);
      await playAudio("égal");
      if (stopSignalRef.current) return;
      await wait(1500);

      // ÉTAPE 3: Afficher la boîte
      setManualAnimationStep(3);
      await playAudio("une dizaine.");
      if (stopSignalRef.current) return;
      await wait(2500);

      // ÉTAPE 4: Répétition et illumination
      setHighlightObjects(true);
      await playAudio("10 objets...");
      if (stopSignalRef.current) return;
      await wait(1500);

      setHighlightObjects(false);
      setHighlightBox(true);
      await playAudio("...c'est donc une dizaine.");
      if (stopSignalRef.current) return;
      await wait(2000);

      setHighlightBox(false);

    } catch (error) {
      console.error('Erreur dans explainTransformation:', error);
    } finally {
      setIsPlayingVocal(false);
      setManualAnimationStep(3); // Garder l'affichage final complet
    }
  };
  
  const explainExamples = async () => {
    // Réinitialiser et commencer l'animation depuis le début
    setShowStep(0); // Remettre à 0 pour recommencer l'animation
    setHighlightVisual(false);
    setHighlightBoxes(false);
    setHighlightUnits(false);
    setHighlightTotal(false);
    // Utiliser l'animation standard avec l'exemple 67
    await explainSelectedNumber('67');
  };

  // Fonction principale d'explication du chapitre avec animation automatique
  const explainChapter = async () => {
    if (isPlayingVocal || isAutoAnimating) return;
    
    // COPIE DES PARAMÈTRES DE SAM LE PIRATE
    stopAllVocalsAndAnimations();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);
    setIsAutoAnimating(true);
    setAutoAnimationStep(0);
    
    try {
      // Introduction
      await playAudio("Bonjour ! Je suis Sam le pirate et je vais vous montrer ce qu'est une dizaine !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      
      // ANIMATION 1: TRANSFORMATION
      setHighlightedElement('concept-section');
      scrollToElement('concept-section');
      await wait(800);
      
      await playAudio("Regarde d'abord cette transformation magique !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      // Déclencher l'animation de transformation (réinitialiser d'abord)
      setManualAnimationStep(0);
      setHighlightObjects(false);
      setHighlightBox(false);
      await wait(500);
      
      // ÉTAPE 1: Afficher les 10 objets
      setManualAnimationStep(1);
      await playAudio("Voici 10 objets.");
      if (stopSignalRef.current) return;
      await wait(2000);

      // ÉTAPE 2: Afficher le signe égal
      setManualAnimationStep(2);
      await playAudio("égal");
      if (stopSignalRef.current) return;
      await wait(1500);

      // ÉTAPE 3: Afficher la boîte
      setManualAnimationStep(3);
      await playAudio("une dizaine.");
      if (stopSignalRef.current) return;
      await wait(2500);

      // ÉTAPE 4: Répétition et illumination
      setHighlightObjects(true);
      await playAudio("10 objets...");
      if (stopSignalRef.current) return;
      await wait(1500);

      setHighlightObjects(false);
      setHighlightBox(true);
      await playAudio("...c'est donc une dizaine.");
      if (stopSignalRef.current) return;
      await wait(2000);

      setHighlightBox(false);
      await wait(1000);
      
      // ANIMATION 2: EXEMPLES
      setHighlightedElement('examples-section');
      scrollToElement('examples-section');
      await wait(800);
      
      await playAudio("Maintenant regardons des exemples !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      // Déclencher l'animation des exemples (réinitialiser d'abord)
      setShowStep(0);
      setHighlightVisual(false);
      setHighlightBoxes(false);
      setHighlightUnits(false);
      setHighlightTotal(false);
      setHighlightLeftDigit(false);
      await wait(500);
      
      const nombreChoisi = '67';
      
      // ÉTAPE 1: Présenter le nombre
      setSelectedNumber(nombreChoisi);
      setShowStep(1);
      await wait(800);

      const numberData = dizaines.find(d => d.value === nombreChoisi);
      if (numberData) {
        await playAudio(`Analysons le nombre ${nombreChoisi}`);
        if (stopSignalRef.current) return;
        await wait(1500);

        // ÉTAPE 2: Expliquer la méthode du chiffre de gauche
        setHighlightLeftDigit(true);
        await playAudio(`Pour trouver les dizaines, je regarde le chiffre de gauche`);
        if (stopSignalRef.current) return;
        await wait(2000);

        await playAudio(`Le chiffre de gauche est ${nombreChoisi[0]}`);
        if (stopSignalRef.current) return;
        await wait(1500);

        await playAudio(`Donc ${nombreChoisi} contient ${numberData.groups} dizaines !`);
        if (stopSignalRef.current) return;
        await wait(2000);

        // ÉTAPE 3: Montrer la représentation visuelle
        setShowStep(2);
        setHighlightVisual(true);
        await playAudio(`Regardons maintenant la représentation visuelle`);
        if (stopSignalRef.current) return;
        await wait(2000);

        // ÉTAPE 4: Expliquer les boîtes
        setHighlightVisual(false);
        setHighlightBoxes(true);
        await playAudio(`Nous avons ${numberData.groups} boîtes qui représentent ${numberData.groups * 10}`);
        if (stopSignalRef.current) return;
        await wait(2500);

        // ÉTAPE 5: Expliquer les unités (si présentes)
        if (numberData.units > 0) {
          setHighlightBoxes(false);
          setHighlightUnits(true);
          await playAudio(`Plus ${numberData.units} objets individuels`);
          if (stopSignalRef.current) return;
          await wait(2000);
        }

        // ÉTAPE 6: Faire le total
        setHighlightBoxes(false);
        setHighlightUnits(false);
        setHighlightTotal(true);
        setShowStep(3);
        await playAudio(`Le total est ${numberData.groups * 10} plus ${numberData.units} égale ${nombreChoisi}`);
        if (stopSignalRef.current) return;
        await wait(2000);

        // ÉTAPE 7: Conclusion
        await playAudio(`Parfait ! ${nombreChoisi} contient bien ${numberData.groups} dizaines !`);
        if (stopSignalRef.current) return;
      await wait(1000);
      
        // Garder tous les éléments visibles à la fin
        setHighlightTotal(false);
        setHighlightLeftDigit(false);
      }
      
      await wait(1000);
      
      // CONCLUSION ET ORIENTATION
      // Revenir en haut
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await wait(1500);
      
      await playAudio("Bravo ! Tu connais maintenant les dizaines !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      // Scroller vers les exemples et les illuminer
      setHighlightedElement('examples-section');
      scrollToElement('examples-section');
      await wait(1000);
      
      await playAudio("Tu peux regarder d'autres exemples en cliquant sur les nombres");
      if (stopSignalRef.current) return;
      await wait(3000);
      
      // Illuminer l'onglet exercices
      setHighlightedElement('navigation-tabs');
      scrollToElement('navigation-tabs');
      await wait(1000);
      
      await playAudio("ou faire les exercices pour t'entraîner !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      setHighlightedElement(null);
      
    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      setIsPlayingVocal(false);
      setIsAutoAnimating(false);
      // Garder les animations visibles
    }
  };

  // Fonction pour animer l'explication d'une mauvaise réponse
  const explainWrongAnswer = async () => {
    console.log('❌ Explication mauvaise réponse pour exercice', currentExercise + 1);
    
    // FORCER la remise à false pour permettre l'explication
    stopSignalRef.current = false;
    setIsExplainingError(true);
    setIsPlayingVocal(true);
    
    try {
      // Expression de pirate personnalisée
      const pirateExpression = pirateExpressions[currentExercise] || "Mille sabords";
      await playAudio(pirateExpression + " ! Ce n'est pas grave, je vais t'expliquer !");
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      // Extraire le nombre de la question
      const exercise = exercises[currentExercise];
      const match = exercise.question.match(/(\d+)/);
      const number = match ? match[1] : '';
      
      // Donner la bonne réponse
      const questionText = exercise.question.toLowerCase();
      const responseText = questionText.includes('combien de dizaines') 
        ? `La bonne réponse est ${exercise.correctAnswer} dizaines !`
        : `La bonne réponse est ${exercise.correctAnswer} !`;
      
      await playAudio(responseText); 
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      // Explication détaillée selon le type de nombre
      if (number && number.length >= 2) {
        // Pour les nombres à 2 chiffres ou plus
        await playAudio(`Regardons bien le nombre ${number}. Je vais te montrer comment le lire !`);
        if (stopSignalRef.current) return;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (stopSignalRef.current) return;
        
        // Mise en évidence du chiffre de gauche (dizaines)
        await playAudio("D'abord, regarde le chiffre de GAUCHE :");
        if (stopSignalRef.current) return;
        
        setHighlightDigit('left');
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (stopSignalRef.current) return;
        
        const dizaines = number[0];
        await playAudio(`C'est le chiffre ${dizaines}. Il indique le nombre de DIZAINES !`);
        if (stopSignalRef.current) return;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (stopSignalRef.current) return;
        
        await playAudio(`${dizaines} dizaines, cela veut dire ${dizaines} groupes de 10 !`);
        if (stopSignalRef.current) return;
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (stopSignalRef.current) return;
        
        // Mise en évidence du chiffre de droite (unités)
        await playAudio("Maintenant, regarde le chiffre de DROITE :");
        if (stopSignalRef.current) return;
        
        setHighlightDigit('right');
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (stopSignalRef.current) return;
        
        const unites = number[1] || '0';
        await playAudio(`C'est le chiffre ${unites}. Il indique le nombre d'UNITÉS !`);
        if (stopSignalRef.current) return;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (stopSignalRef.current) return;
        
        if (unites === '0') {
          await playAudio(`${unites} unité, cela veut dire qu'il n'y a pas d'objets en plus !`);
        } else {
          await playAudio(`${unites} unité${unites !== '1' ? 's' : ''}, cela veut dire ${unites} objet${unites !== '1' ? 's' : ''} en plus !`);
        }
        if (stopSignalRef.current) return;
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (stopSignalRef.current) return;
        
        // Synthèse finale
        setHighlightDigit(null);
        await playAudio(`Donc le nombre ${number} se décompose en ${dizaines} dizaines et ${unites} unité${unites !== '1' ? 's' : ''} !`);
        if (stopSignalRef.current) return;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (stopSignalRef.current) return;
        
        // Explication adaptée selon le type de question
        if (questionText.includes('combien de dizaines')) {
          await playAudio(`C'est pourquoi la réponse à "combien de dizaines" est ${dizaines} !`);
        } else if (questionText.includes('quel nombre')) {
          await playAudio(`C'est pourquoi le nombre représenté est ${number} !`);
        }
        if (stopSignalRef.current) return;
        
      } else if (number && number.length === 1) {
        // Pour les nombres à 1 chiffre - ATTENTION au contexte de la question
        
        // CAS SPÉCIAL: Si c'est une question "X dizaines" alors le chiffre représente des DIZAINES, pas des unités !
        if ((questionText.includes('que vaut') && questionText.includes('dizaines')) || 
            questionText.includes('dizaines =')) {
          
          await playAudio(`Le chiffre ${number} représente ${number} DIZAINES, pas ${number} unités !`);
          if (stopSignalRef.current) return;
          
          await new Promise(resolve => setTimeout(resolve, 800));
          if (stopSignalRef.current) return;
          
          await playAudio(`${number} dizaines égale ${number} fois 10, soit ${exercise.correctAnswer} !`);
          if (stopSignalRef.current) return;
          
        } else {
          // CAS NORMAL: Vraie décomposition positionnelle
          await playAudio(`Le nombre ${number} a seulement UN chiffre !`);
          if (stopSignalRef.current) return;
          
          await new Promise(resolve => setTimeout(resolve, 800));
          if (stopSignalRef.current) return;
          
          await playAudio(`Cela veut dire ${number} unité${number !== '1' ? 's' : ''} et ZÉRO dizaine !`);
          if (stopSignalRef.current) return;
          
          await new Promise(resolve => setTimeout(resolve, 800));
          if (stopSignalRef.current) return;
          
          if (questionText.includes('combien de dizaines')) {
            await playAudio(`C'est pourquoi la réponse à "combien de dizaines" est 0 !`);
          }
        }
        if (stopSignalRef.current) return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      await playAudio("Tu as compris ? Maintenant appuie sur suivant !");
      if (stopSignalRef.current) return;
      
      // Illuminer le bouton suivant
      setHighlightedElement('next-exercise-button');
      
      await new Promise(resolve => setTimeout(resolve, 300)); // Laisser l'animation se voir
      if (stopSignalRef.current) return;
      
      // Scroll automatique vers le bouton "Suivant" 
      setTimeout(() => {
        const nextButton = document.getElementById('next-exercise-button');
        if (nextButton) {
          nextButton.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 500); // Petit délai pour que l'highlight soit visible
      
    } catch (error) {
      console.error('Erreur dans explainWrongAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
      // Ne PAS remettre setIsExplainingError(false) ici - le bouton Suivant doit rester actif
      // L'état sera réinitialisé quand l'utilisateur clique sur "Suivant"
    }
  };

  // Fonction pour valider la réponse saisie
  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim()) return; // Ne pas valider si vide
    
    // Vérifier si la réponse est correcte (en acceptant différentes variantes)
    const userAnswerCleaned = userAnswer.trim().toLowerCase();
    const correctAnswer = exercises[currentExercise].correctAnswer;
    
    // Accepter la réponse numérique exacte
    let correct = userAnswerCleaned === correctAnswer.toLowerCase();
    
    // Pour certains nombres, accepter aussi la forme écrite
    const numberWords: { [key: string]: string[] } = {
      '1': ['1', 'un', 'une'],
      '2': ['2', 'deux'],
      '3': ['3', 'trois'],
      '4': ['4', 'quatre'],
      '5': ['5', 'cinq'],
      '6': ['6', 'six'],
      '7': ['7', 'sept'],
      '8': ['8', 'huit'],
      '9': ['9', 'neuf'],
      '10': ['10', 'dix'],
      '20': ['20', 'vingt'],
      '30': ['30', 'trente'],
      '40': ['40', 'quarante'],
      '50': ['50', 'cinquante'],
      '60': ['60', 'soixante'],
      '70': ['70', 'soixante-dix'],
      '80': ['80', 'quatre-vingts', 'quatre vingts'],
      '90': ['90', 'quatre-vingt-dix', 'quatre vingt dix'],
      '100': ['100', 'cent']
    };
    
    // Vérifier si une des variantes correspond
    if (numberWords[correctAnswer]) {
      correct = numberWords[correctAnswer].includes(userAnswerCleaned);
    }
    
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }

    // Si bonne réponse → passage automatique après 1.5s
    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          // Dernier exercice terminé
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
          saveProgress(finalScoreValue, exercises.length);
        }
      }, 1500);
      
      // Célébrer avec Sam le Pirate (mais sans bloquer le passage automatique)
      celebrateCorrectAnswer(); // Pas de await pour éviter les blocages
    } else {
      // Expliquer l'erreur avec Sam le Pirate
      await explainWrongAnswer();
    }
  };

  const nextExercise = () => {
    stopAllVocalsAndAnimations(); // Stop any ongoing audio before moving to next
    
    setIsExplainingError(false); // Reset Sam's error state
    setHighlightedElement(null);
    setShowNextButton(false);
    setHighlightNextButton(false);
    setHighlightDigit(null);
    
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
  };

  const resetAll = () => {
    stopAllVocalsAndAnimations(); // Arrêter tous les audios avant reset
    
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    
    // Reset des états Sam le Pirate
    setIsExplainingError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
    setExerciseStarted(false);
    setShowNextButton(false);
    setHighlightNextButton(false);
    setHighlightDigit(null);
  };

  // JSX pour l'introduction de Sam le Pirate dans les exercices
  const SamPirateIntroJSX = () => (
    <div className="flex justify-center p-1 mt-0 sm:mt-2">
      <div className="flex items-center gap-2">
        {/* Image de Sam le Pirate */}
        <div className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 shadow-md transition-all duration-300 ${
          isPlayingVocal
            ? 'w-20 sm:w-32 h-20 sm:h-32 scale-110 sm:scale-150' // When speaking - agrandi mobile
            : pirateIntroStarted
              ? 'w-16 sm:w-16 h-16 sm:h-16' // After "COMMENCER" clicked (reduced) - agrandi mobile
              : 'w-16 sm:w-20 h-16 sm:h-20' // Initial - agrandi mobile
        }`}>
          <img 
            src="/image/pirate-small.png" 
            alt="Sam le Pirate" 
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
        
        {/* Bouton Start Exercices - AVEC AUDIO */}
        <button
        onClick={startPirateIntro}
        disabled={isPlayingVocal || pirateIntroStarted}
        className={`relative px-6 sm:px-12 py-3 sm:py-5 rounded-xl font-black text-base sm:text-2xl transition-all duration-300 transform ${
          isPlayingVocal 
            ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed animate-pulse shadow-md' 
            : pirateIntroStarted
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white opacity-75 cursor-not-allowed shadow-lg'
              : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600 hover:scale-110 shadow-2xl hover:shadow-3xl animate-pulse border-4 border-yellow-300'
        } ${!isPlayingVocal && !pirateIntroStarted ? 'ring-4 ring-yellow-300 ring-opacity-75' : ''}`}
        style={{
          animationDuration: !isPlayingVocal && !pirateIntroStarted ? '1.5s' : '2s',
          animationIterationCount: isPlayingVocal || pirateIntroStarted ? 'none' : 'infinite',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          boxShadow: !isPlayingVocal && !pirateIntroStarted 
            ? '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' 
            : ''
        }}
      >
        {/* Effet de brillance */}
        {!isPlayingVocal && !pirateIntroStarted && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
        )}
        
        {/* Icônes et texte avec plus d'émojis */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isPlayingVocal 
            ? <>🎤 <span className="animate-bounce">Sam parle...</span></> 
            : pirateIntroStarted
              ? <>✅ <span>Intro terminée</span></>
              : <>🚀 <span className="animate-bounce">COMMENCER</span> ✨</>
          }
        </span>
        
        {/* Particules brillantes pour le bouton commencer */}
        {!isPlayingVocal && !pirateIntroStarted && (
          <>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          </>
        )}
      </button>
      </div>
    </div>
  );

  // Composant JSX pour le bouton "Écouter l'énoncé"
  const ListenQuestionButtonJSX = () => (
    <div className="mb-3 sm:mb-6">
      <button
        id="listen-question-button"
        onClick={startExerciseExplanation}
        disabled={isPlayingVocal || !pirateIntroStarted}
        className={`bg-blue-500 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-xs sm:text-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 sm:space-x-2 mx-auto shadow-lg ${
          highlightedElement === 'listen-question-button' ? 'ring-8 ring-yellow-400 bg-yellow-500 animate-bounce scale-125 shadow-2xl border-4 border-orange-500' : ''
        }`}
      >
        <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        <span>🎧 Écouter l'énoncé</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Bouton flottant de Sam - visible uniquement quand Sam parle */}
      {isPlayingVocal && (
        <div className="fixed top-4 right-4 z-[60]">
          <button
            onClick={stopAllVocalsAndAnimations}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
            title="Arrêter Sam"
          >
            {/* Image de Sam */}
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50">
              <img
                src="/image/pirate-small.png"
                alt="Sam le Pirate"
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
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className={showExercises ? 'mb-3 sm:mb-6' : 'mb-8'}>
          <Link href="/chapitre/cp-nombres-jusqu-100" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg text-center" style={{
            padding: showExercises ? 'clamp(0.5rem, 2vw, 1rem) clamp(0.5rem, 2vw, 1rem)' : '1.5rem'
          }}>
            <h1 className={`font-bold text-gray-900 ${
              showExercises 
                ? 'text-lg sm:text-2xl lg:text-3xl mb-1 sm:mb-2' 
                : 'text-4xl mb-4'
            }`}>
              📦 Les dizaines jusqu'à 100
            </h1>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className={`flex justify-center ${showExercises ? 'mb-3 sm:mb-6' : 'mb-8'}`}>
          <div 
            id="navigation-tabs"
            className={`bg-white rounded-lg p-1 shadow-md flex transition-all duration-1000 ${
              highlightedElement === 'navigation-tabs' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
            }`}
          >
            <button
              onClick={() => setShowExercises(false)}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                !showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-12 sm:space-y-16">

            {/* Image de Sam le Pirate avec bouton DÉMARRER */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-10 sm:mb-12">
              {/* Image de Sam le Pirate */}
              <div className={`relative transition-all duration-500 border-2 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 ${
                isPlayingVocal
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                  : samSizeExpanded
                      ? 'w-12 sm:w-32 h-12 sm:h-32' // Enlarged - plus petit sur mobile
                      : 'w-12 sm:w-20 h-12 sm:h-20' // Initial - plus petit sur mobile
                }`}>
                  <img 
                    src="/image/pirate-small.png" 
                    alt="Sam le Pirate" 
                    className="w-full h-full rounded-full object-cover"
                  />
                {/* Megaphone animé quand il parle */}
                  {isPlayingVocal && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    </div>
                  )}
                </div>
                
              {/* Boutons */}
              <div className="text-center space-y-3">
                <button
                onClick={explainChapter}
                  disabled={isPlayingVocal}
                  className={`bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 sm:px-12 py-2 sm:py-6 rounded-xl font-bold text-sm sm:text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-emerald-600'
                }`}
              >
                  <Play className="inline w-4 h-4 sm:w-8 sm:h-8 mr-1 sm:mr-4" />
                  {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                </button>

                </div>
              </div>

            {/* Section unifiée : Concept et visualisation avec animation automatique */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-4 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'concept-section' || autoAnimationStep >= 1 ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-xl font-bold text-gray-900">
                  🧠 Qu'est-ce qu'une dizaine ?
                </h2>
                
                {/* Bouton d'animation individuel */}
                <div className="flex gap-2">
                  {/* Bouton pour la transformation magique */}
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-blue-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-blue-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                       title="✨ Animation de transformation ! Cliquez pour voir 10 points devenir 1 boîte."
                    onClick={explainTransformation}
                  >
                    ✨
                  </div>
                </div>
              </div>
              
              {/* Animation de la transformation - VERSION UNIFIÉE */}
              <div className={`bg-gradient-to-br from-green-50 to-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all duration-1000 ${
                (autoAnimationStep >= 11 || manualAnimationStep >= 1) ? 'ring-2 sm:ring-4 ring-green-400 bg-green-100 scale-105' : ''
              }`}>
                <div className="text-center mb-3 sm:mb-4">
                  <p className="text-sm sm:text-lg text-gray-800 mb-2">
                    Une dizaine = <strong>groupe de 10 objets</strong>
                  </p>
                  <p className="text-xs sm:text-base text-blue-700 font-semibold">
                    🔄 Regardons la transformation magique !
                  </p>
                </div>
                
                <div className="relative min-h-[120px] sm:min-h-[150px] py-4 sm:py-6 flex items-center justify-center">
                  
                  <div className="flex items-center justify-center space-x-3 sm:space-x-6">
                    
                    {/* 10 objets */}
                    {(manualAnimationStep >= 1) && (
                                            <div className={`text-center p-2 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-500 ${highlightObjects ? 'bg-yellow-200 ring-2 sm:ring-4 ring-yellow-400' : ''}`}>
                        <div className="grid grid-cols-5 gap-1 sm:gap-2">
                          {[...Array(10)].map((_, i) => (
                            <span key={i} className="text-lg sm:text-2xl">🔵</span>
                          ))}
                        </div>
                        <div className="font-bold text-xs sm:text-lg text-blue-700 mt-2 sm:mt-3">10 objets</div>
                      </div>
                    )}
                    
                    {/* Signe égal */}
                    {(manualAnimationStep >= 2) && (
                      <div className="text-2xl sm:text-4xl font-bold text-gray-500 animate-bounce">=</div>
                    )}
                    
                    {/* 1 dizaine */}
                    {(manualAnimationStep >= 3) && (
                      <div className={`text-center p-2 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-500 ${highlightBox ? 'bg-yellow-200 ring-2 sm:ring-4 ring-yellow-400' : ''}`}>
                        <div className="text-4xl sm:text-6xl">📦</div>
                        <div className="font-bold text-xs sm:text-lg text-black mt-1 sm:mt-2">1 dizaine</div>
                  </div>
                    )}
                    
                </div>

                  </div>
              
              {/* Message explicatif progressif */}
              <div className="text-center mt-4">
                <div className="bg-blue-100 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-blue-800 font-semibold text-base sm:text-lg">
                    ✨ Les 10 objets se regroupent pour former 1 dizaine !
                  </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section exemples avec animation automatique */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl p-4 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'examples-section' || autoAnimationStep >= 2 ? 'ring-4 ring-purple-400 bg-purple-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-xl font-bold text-gray-900">
                  🎯 Exemples de nombres avec leurs dizaines
                </h2>
                
                {/* Bouton d'animation individuel */}
                <div className="flex gap-2">
                  {/* Bouton pour parcourir les exemples */}
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-orange-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-orange-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                       title="🎯 Voir un exemple détaillé ! Cliquez pour une démonstration complète."
                    onClick={explainExamples}
                >
                  🎯
                </div>
              </div>
              </div>
              
              {/* Grille des dizaines avec animations */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {dizaines.map((diz, index) => {
                  const isCurrentlyAnimated = selectedNumber === diz.value;
                  return (
                  <button
                    key={diz.value}
                      onClick={() => !isAutoAnimating && !isPlayingVocal && explainSelectedNumber(diz.value)}
                      className={`p-3 sm:p-4 rounded-lg font-bold text-sm sm:text-base transition-all duration-1000 ${
                      selectedNumber === diz.value
                          ? 'bg-yellow-500 text-black shadow-lg ring-4 ring-yellow-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${isAutoAnimating || isPlayingVocal ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      disabled={isAutoAnimating || isPlayingVocal}
                  >
                    {diz.label}
                  </button>
                  );
                })}
            </div>

              {/* Affichage détaillé du nombre sélectionné */}
              {selectedNumber && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-8 border-2 border-blue-200 mt-4">
                  {(() => {
                    const numberData = dizaines.find(d => d.value === selectedNumber);
                    const isAnimated = (autoAnimationStep >= 3 && autoAnimationStep <= 10) || selectedNumber;
                    return numberData && (
                      <div className="text-center">
                        {/* Affichage du nombre avec mise en évidence du chiffre de gauche */}
                                                {highlightLeftDigit && numberData.value.length >= 2 ? (
                          <div className="flex justify-center items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
                            {/* Chiffre de gauche (dizaines) mis en évidence */}
                            <div className="text-2xl sm:text-6xl font-bold bg-yellow-300 text-yellow-800 px-2 sm:px-4 py-1 sm:py-2 rounded-lg border-2 sm:border-4 border-yellow-500 shadow-lg">
                              {numberData.value[0]}
                </div>
                            {/* Chiffre de droite (unités) normal */}
                            <div className="text-2xl sm:text-6xl font-bold text-gray-400 opacity-60">
                              {numberData.value[1] || '0'}
              </div>
                          </div>
                        ) : (
                          <div className={`text-3xl sm:text-6xl font-bold mb-3 sm:mb-4 transition-all duration-1000 ${
                            isAnimated ? 'text-yellow-600' : 'text-purple-600'
                          }`}>
                            {numberData.value}
                          </div>
                        )}
                        
                        {/* Étiquette explicative quand le chiffre est mis en évidence */}
                        {highlightLeftDigit && (
                          <div className="mb-3 sm:mb-4">
                            <div className="bg-yellow-100 border-2 sm:border-4 border-yellow-400 rounded-lg p-3 sm:p-3">
                              <div className="text-yellow-800 font-bold text-sm sm:text-lg">
                                📍 CHIFFRE DE GAUCHE
                              </div>
                              <div className="text-yellow-700 font-bold text-sm sm:text-base">
                                = {numberData.value[0]} dizaines
                              </div>
                            </div>
                          </div>
                        )}
                        
                                                <div className={`text-base sm:text-2xl font-bold mb-2 transition-all duration-1000 ${
                          isAnimated ? 'text-purple-700' : 'text-blue-700'
                        }`}>
                          {numberData.reading}
                  </div>

                                                {/* Représentation visuelle avec mise en surbrillance */}
                        {(showStep >= 2 || selectedNumber) && (
                          <div className={`text-2xl sm:text-4xl mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl transition-all duration-1000 ${
                            highlightVisual ? 'bg-purple-100 ring-4 ring-purple-400 scale-110' : 'bg-gray-50'
                          }`}>
                            <div className="text-center font-bold text-purple-700 mb-1 sm:mb-2 text-xs sm:text-sm">
                              REPRÉSENTATION VISUELLE
                            </div>
                    <div className="text-center">
                              {numberData.visual}
                      </div>
                    </div>
                  )}

                        {/* Décomposition progressive et interactive */}
                        {(showStep >= 2 || selectedNumber) && (
                          <div className="space-y-3 sm:space-y-4">
                            
                            {/* Section boîtes */}
                            <div className={`bg-white rounded-xl p-3 sm:p-4 shadow-md transition-all duration-1000 ${
                              highlightBoxes ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
                            }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  <div className="text-lg sm:text-2xl">📦</div>
                                  <div>
                                    <div className="font-bold text-blue-700 text-sm sm:text-lg">
                                      {numberData.groups} boîtes de 10
                            </div>
                                    <div className="text-blue-600 text-xs sm:text-sm">
                                      Chaque boîte = 10 objets
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg sm:text-2xl font-bold text-blue-700">
                                    = {numberData.groups * 10}
                                  </div>
                                </div>
                            </div>
                          </div>

                            {/* Section unités (si présentes) */}
                            {numberData.units > 0 && (
                              <div className={`bg-white rounded-xl p-3 sm:p-4 shadow-md transition-all duration-1000 ${
                                highlightUnits ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="text-lg sm:text-2xl">🔵</div>
                                    <div>
                                      <div className="font-bold text-green-700 text-sm sm:text-lg">
                                        {numberData.units} objets individuels
                            </div>
                                      <div className="text-green-600 text-xs sm:text-sm">
                                        Objets en plus
                            </div>
                          </div>
                        </div>
                                  <div className="text-right">
                                    <div className="text-lg sm:text-2xl font-bold text-green-700">
                                      = {numberData.units}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                            {/* Total */}
                            {(showStep >= 3 || selectedNumber) && (
                              <div className={`bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3 sm:p-4 shadow-lg transition-all duration-1000 ${
                                highlightTotal ? 'ring-4 ring-purple-500 scale-110' : ''
                              }`}>
                                <div className="text-center">
                                  <div className="text-purple-700 font-bold text-sm sm:text-lg mb-1 sm:mb-2">
                                    🔢 CALCUL TOTAL
                      </div>
                                  <div className="text-lg sm:text-2xl font-bold text-purple-800">
                                    {numberData.groups * 10} + {numberData.units} = {numberData.value}
                                  </div>
                                  <div className="text-purple-600 text-xs sm:text-sm mt-1 sm:mt-2">
                                    {numberData.groups} dizaines + {numberData.units} unités
                                  </div>
                                </div>
                              </div>
                            )}
                    </div>
                  )}

                        {isAnimated && (
                          <div className="mt-4 text-lg font-bold text-purple-700 animate-bounce">
                            ✨ {numberData.value} contient {numberData.groups} dizaines ! ✨
                    </div>
                  )}

                        {/* Animation spéciale pour la décomposition (étape 14) */}
                        {autoAnimationStep === 14 && numberData.value === '67' && (
                          <div className="mt-6 space-y-4">
                            <div className="bg-orange-100 border-4 border-orange-400 rounded-xl p-4">
                              <h4 className="text-lg font-bold text-orange-800 mb-3">
                                🔍 Décomposition détaillée :
                              </h4>
                              
                                                            {/* Affichage du nombre avec séparation visuelle */}
                              <div className="flex justify-center items-center gap-4 mb-4">
                                <div className="text-6xl font-bold text-blue-600 bg-blue-100 px-4 py-2 rounded-lg border-4 border-blue-500">
                                  6
                                </div>
                                <div className="text-6xl font-bold text-green-600 bg-green-100 px-4 py-2 rounded-lg border-4 border-green-500">
                                  7
                                </div>
                              </div>
                              
                              {/* Étiquettes explicatives */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                  <div className="bg-blue-200 p-3 rounded-lg border-2 border-blue-400">
                                    <div className="text-blue-800 font-bold">CHIFFRE DE GAUCHE</div>
                                    <div className="text-blue-700">= Dizaines</div>
                                    <div className="text-blue-600">6 boîtes de 10</div>
                        </div>
                      </div>
                                <div className="text-center">
                                  <div className="bg-green-200 p-3 rounded-lg border-2 border-green-400">
                                    <div className="text-green-800 font-bold">CHIFFRE DE DROITE</div>
                                    <div className="text-green-700">= Unités</div>
                                    <div className="text-green-600">7 objets seuls</div>
                    </div>
                                </div>
                              </div>
                              
                              {/* Calcul final */}
                              <div className="mt-4 bg-white p-3 rounded-lg border-2 border-gray-300">
                                <div className="text-center text-lg font-bold text-gray-800">
                                  6 × 10 + 7 = 60 + 7 = 67 ✅
                                </div>
                        </div>
                      </div>
                    </div>
                  )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Section finale : Récapitulatif */}
            {showFinalSection && (
                              <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-4 sm:p-8 shadow-lg border-2 border-orange-200">
                <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                  🎯 Bravo ! Tu maîtrises les dizaines !
              </h2>
              
                <div className="text-center">
                  <p className="text-sm sm:text-lg text-gray-700 mb-4">
                    Tu as appris comment compter les dizaines dans un nombre !
                  </p>
                  
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 sm:p-6 border-2 border-green-300">
                    <p className="text-base sm:text-xl font-bold text-gray-800 mb-2">
                      💡 Rappel important :
                    </p>
                    <p className="text-sm sm:text-lg text-gray-700">
                      Pour compter les dizaines, je regarde le <strong className="text-blue-600">chiffre de gauche</strong> !
                    </p>
                  </div>
                </div>
              </div>
            )}



            {/* Mini-jeu : Trouve les dizaines et unités ! */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-5 sm:p-4 text-white shadow-md mt-12 mb-8">
              <h3 className="text-sm sm:text-base font-bold text-center mb-3 flex items-center justify-center gap-2">
                🎮 Mini-jeu : Trouve les dizaines !
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-3 mb-5 sm:mb-4">
                {[
                  { number: '34', dizaines: 3, unites: 4 },
                  { number: '57', dizaines: 5, unites: 7 },
                  { number: '82', dizaines: 8, unites: 2 },
                  { number: '46', dizaines: 4, unites: 6 }
                ].map((item, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur rounded-md p-3 sm:p-2 text-center hover:bg-white/30 transition-all duration-300">
                    <div className="text-base sm:text-lg font-bold text-white mb-1">
                      {item.number} = ?
                    </div>
                    <button 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-1 px-2 rounded text-xs hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
                      onClick={() => {
                        const button = document.getElementById(`minigame-${index}`);
                        if (button) {
                          button.innerHTML = `${item.dizaines} dizaines`;
                          button.className = "bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-1 px-2 rounded text-xs";
                        }
                      }}
                      id={`minigame-${index}`}
                    >
                      👁️ Voir
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <button 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-1 px-3 rounded text-sm hover:from-cyan-500 hover:to-blue-600 transition-all duration-300"
                  onClick={() => {
                    // Reset tous les boutons
                    for (let i = 0; i < 4; i++) {
                      const button = document.getElementById(`minigame-${i}`);
                      if (button) {
                        button.innerHTML = "👁️ Voir";
                        button.className = "bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-1 px-2 rounded text-xs hover:from-yellow-500 hover:to-orange-600 transition-all duration-300";
                      }
                    }
                  }}
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Conseils */}
            {showTipsSection && (
              <div id="tips-section" className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Trucs pour retenir les dizaines</h3>
              <ul className="space-y-2 text-lg">
                <li>• Une dizaine = 10 objets dans une boîte</li>
                <li>• 2 dizaines = 2 boîtes = 20</li>
                <li>• Compte les boîtes pour trouver les dizaines</li>
                <li>• 100 = 10 dizaines (une grande maison !)</li>
              </ul>
            </div>
            )}
          </div>
        ) : (
          /* EXERCICES - RESPONSIVE MOBILE OPTIMISÉ (HISTORIQUE) */
          <div className="space-y-3 sm:space-y-6">
            {/* Introduction de Sam le Pirate - toujours visible */}
            {SamPirateIntroJSX()}

            {/* Header exercices - caché sur mobile */}
            <div className="bg-white rounded-xl p-2 shadow-lg mt-4 sm:mt-8 hidden sm:block">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-bold text-gray-900">
                  Exercice {currentExercise + 1}
                </h2>
                
                <div className="flex items-center gap-2">
                  <div className="text-sm font-bold text-green-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button
                    onClick={resetAll}
                    className="bg-gray-500 text-white px-3 py-1 rounded-lg font-bold hover:bg-gray-600 transition-colors text-xs"
                  >
                    <RotateCcw className="inline w-3 h-3 mr-1" />
                    Reset
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
            </div>

            {/* Indicateur de progression mobile - sticky sur la page */}
            <div className="sticky top-0 bg-white z-10 px-3 py-2 border-b border-gray-200 sm:hidden mb-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-700">Exercice {currentExercise + 1}/{exercises.length}</span>
                <span className="font-bold text-green-600">Score : {score}/{exercises.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question - LAYOUT NORMAL AVEC SCROLL DE PAGE */}
            <div className="bg-white rounded-xl shadow-lg text-center p-4 sm:p-6 md:p-8 mt-2 sm:mt-8">
              <div className="space-y-3 sm:space-y-6 md:space-y-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 sm:mb-6 md:mb-8 gap-3 sm:gap-4">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 flex-1">
                  {exercises[currentExercise]?.question || "Combien de dizaines ?"}
                </h3>
                {ListenQuestionButtonJSX()}
              </div>
              
              {/* Affichage du nombre avec explication si erreur */}
              <div className={`bg-white border-2 rounded-lg p-3 sm:p-6 md:p-8 mb-3 sm:mb-6 transition-all duration-500 ${
                isExplainingError ? 'border-yellow-400 bg-yellow-50 ring-4 ring-yellow-300' : 'border-green-200'
              }`}>
                <div className="py-3 sm:py-8 md:py-10">
                  {/* Affichage du nombre avec animation positionnelle */}
                  <div className="mb-4">
                    {(() => {
                      const currentQuestion = exercises[currentExercise]?.question || "";
                      // Extraire le nombre de la question
                      const match = currentQuestion.match(/(\d+)/);
                      const numberStr = match ? match[1] : "";
                      
                      // Cas spécial pour "Que vaut X dizaines ?" - afficher "X dizaines" en vert
                      if (currentQuestion.toLowerCase().includes('que vaut') && currentQuestion.toLowerCase().includes('dizaines')) {
                        return (
                          <div className="flex justify-center items-center gap-2 sm:gap-4">
                            <div className="text-4xl sm:text-8xl font-bold text-green-600 bg-green-100 px-4 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-xl border-2 sm:border-4 border-green-400">
                              {numberStr}
                            </div>
                            <div className="text-2xl sm:text-4xl font-bold text-green-600">
                              dizaines
                            </div>
                          </div>
                        );
                      }
                      
                      // Cas spécial pour "X dizaines = ?" - afficher "X dizaines" en vert
                      if (currentQuestion.includes('dizaines =')) {
                        return (
                          <div className="flex justify-center items-center gap-2 sm:gap-4">
                            <div className="text-4xl sm:text-8xl font-bold text-green-600 bg-green-100 px-4 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-xl border-2 sm:border-4 border-green-400">
                              {numberStr}
                            </div>
                            <div className="text-2xl sm:text-4xl font-bold text-green-600">
                              dizaines
                            </div>
                          </div>
                        );
                      }
                      
                      // Cas normal pour les autres questions
                      if (numberStr && numberStr.length >= 2) {
                        return (
                          <div className="flex justify-center items-center gap-1 sm:gap-2">
                            {/* Chiffre de gauche (dizaines) - MOBILE OPTIMISÉ */}
                            <div className={`text-4xl sm:text-8xl font-bold transition-all duration-700 ${
                              highlightDigit === 'left' 
                                ? 'text-blue-700 bg-blue-200 ring-3 sm:ring-6 ring-blue-500 rounded-lg sm:rounded-xl px-3 sm:px-6 py-2 sm:py-4 scale-110 sm:scale-125 shadow-xl sm:shadow-2xl animate-pulse border-2 sm:border-4 border-blue-600' 
                                : highlightDigit === 'right'
                                ? 'text-gray-400 opacity-50 scale-95'
                                : 'text-green-600'
                            }`}>
                              {numberStr[0]}
                            </div>
                            {/* Chiffre de droite (unités) - MOBILE OPTIMISÉ */}
                            <div className={`text-4xl sm:text-8xl font-bold transition-all duration-700 ${
                              highlightDigit === 'right' 
                                ? 'text-red-700 bg-red-200 ring-3 sm:ring-6 ring-red-500 rounded-lg sm:rounded-xl px-3 sm:px-6 py-2 sm:py-4 scale-110 sm:scale-125 shadow-xl sm:shadow-2xl animate-pulse border-2 sm:border-4 border-red-600' 
                                : highlightDigit === 'left'
                                ? 'text-gray-400 opacity-50 scale-95'
                                : 'text-green-600'
                            }`}>
                              {numberStr[1] || '0'}
                            </div>
                          </div>
                        );
                      } else if (numberStr) {
                        return (
                          <div className="text-4xl sm:text-8xl font-bold text-green-600">
                            {numberStr}
                          </div>
                        );
                      }
                      return null;
                    })()}
                    
                    {/* Étiquettes d'explication pendant l'animation - MOBILE OPTIMISÉ */}
                    {highlightDigit && (
                      <div className="flex justify-center mt-3 sm:mt-6">
                        <div className="grid grid-cols-2 gap-2 sm:gap-8 max-w-sm sm:max-w-lg">
                          <div className={`text-center transition-all duration-700 p-2 sm:p-4 rounded-lg sm:rounded-xl ${
                            highlightDigit === 'left' 
                              ? 'opacity-100 bg-blue-100 border-2 sm:border-4 border-blue-500 shadow-lg sm:shadow-xl scale-105 sm:scale-110 animate-pulse' 
                              : 'opacity-30 scale-95'
                          }`}>
                            <div className="text-blue-800 font-bold text-xs sm:text-xl mb-1">⬆️ GAUCHE</div>
                            <div className="text-blue-700 font-bold text-xs sm:text-lg bg-blue-200 px-1 sm:px-3 py-1 rounded-md sm:rounded-lg">DIZAINES</div>
                            <div className="text-blue-600 text-xs sm:text-sm mt-1 hidden sm:block">(groupes de 10)</div>
                          </div>
                          <div className={`text-center transition-all duration-700 p-2 sm:p-4 rounded-lg sm:rounded-xl ${
                            highlightDigit === 'right' 
                              ? 'opacity-100 bg-red-100 border-2 sm:border-4 border-red-500 shadow-lg sm:shadow-xl scale-105 sm:scale-110 animate-pulse' 
                              : 'opacity-30 scale-95'
                          }`}>
                            <div className="text-red-800 font-bold text-xs sm:text-xl mb-1">⬆️ DROITE</div>
                            <div className="text-red-700 font-bold text-xs sm:text-lg bg-red-200 px-1 sm:px-3 py-1 rounded-md sm:rounded-lg">UNITÉS</div>
                            <div className="text-red-600 text-xs sm:text-sm mt-1 hidden sm:block">(objets seuls)</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm sm:text-lg text-gray-700 font-semibold mb-6 hidden sm:block">
                    Trouve le nombre de dizaines !
                  </p>
                  
                  {/* Message d'explication avec la bonne réponse - MOBILE OPTIMISÉ */}
                  {isExplainingError && (
                    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 sm:p-4 mb-4 shadow-lg">
                      <div className="text-sm sm:text-lg font-bold text-red-800 mb-2 text-center">
                        🏴‍☠️ Explication de Sam le Pirate
                      </div>
                      <div className="text-center">
                        <div className="text-red-700 text-base sm:text-lg font-semibold mb-2">
                          La bonne réponse est <span className="font-bold text-lg sm:text-xl text-red-800 bg-red-200 px-2 py-1 rounded">{exercises[currentExercise]?.correctAnswer}{(() => {
                            const questionText = exercises[currentExercise]?.question.toLowerCase() || "";
                            return questionText.includes('combien de dizaines') ? ' dizaines' : '';
                          })()}</span> !
                        </div>
                        
                        {/* Explication détaillée seulement pour les nombres à 2+ chiffres */}
                        {(() => {
                          const match = exercises[currentExercise]?.question.match(/(\d+)/);
                          const number = match ? match[1] : "";
                          if (number && number.length >= 2) {
                            return (
                              <div className="text-xs sm:text-sm text-red-600 bg-red-100 p-2 rounded-lg">
                                💡 Le nombre <span className="font-bold">{number}</span> a <span className="font-bold text-blue-600">{number[0]} dizaines</span> et <span className="font-bold text-purple-600">{number[1] || '0'} unités</span>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Champ de réponse - MOBILE OPTIMISÉ */}
              <div className="mb-4 sm:mb-12">
                <div className="max-w-xs sm:max-w-sm mx-auto px-2 sm:px-0">
                  <div className={`transition-all duration-500 ${
                    highlightedElement === 'answer-input' ? 'ring-4 sm:ring-8 ring-yellow-400 bg-yellow-100 rounded-lg p-2 sm:p-4 scale-105 sm:scale-110 shadow-xl sm:shadow-2xl animate-pulse' : ''
                  }`}>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2 text-center">Ta réponse :</label>
                    <input
                      id="dizaines-input"
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && userAnswer.trim() && isCorrect === null) {
                          handleAnswerSubmit();
                        }
                      }}
                      onClick={() => stopAllVocalsAndAnimations()}
                      disabled={isCorrect !== null || isPlayingVocal}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-lg sm:text-xl font-bold text-center border-2 sm:border-4 border-gray-300 rounded-lg sm:rounded-xl focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="?"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                    <p className="text-xs sm:text-xs text-gray-500 mt-1 text-center">
                      Chiffres (4) ou lettres (quatre)
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Boutons Valider et Suivant */}
              <div className="flex gap-4 justify-center mt-6">
                <button
                  id="validate-button"
                  onClick={handleAnswerSubmit}
                  disabled={!userAnswer.trim() || isCorrect !== null || isPlayingVocal}
                  className={`bg-green-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-lg sm:text-xl hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    highlightedElement === 'validate-button' ? 'ring-8 ring-yellow-400 bg-yellow-500 animate-bounce scale-125 shadow-2xl border-4 border-orange-500' : ''
                  }`}
                >
                  Valider
                </button>

                <button
                  id="next-exercise-button"
                  onClick={nextExercise}
                  disabled={(!isExplainingError && isCorrect !== false) || isPlayingVocal}
                  className={`bg-blue-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-lg sm:text-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    highlightedElement === 'next-exercise-button' || highlightNextButton ? 'ring-8 ring-yellow-400 bg-yellow-500 animate-bounce scale-125 shadow-2xl border-4 border-orange-500' : ''
                  } ${
                    isExplainingError || isCorrect === false ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  Suivant →
                </button>
              </div>

              {/* Résultat - Simplifié */}
              {isCorrect !== null && isCorrect && (
                <div className="p-4 sm:p-6 rounded-lg mt-6 bg-green-100 text-green-800">
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                    <span className="font-bold text-lg sm:text-xl">
                      Bravo ! La réponse est bien {exercises[currentExercise].correctAnswer} !
                    </span>
                  </div>
                </div>
              )}
              
              </div>
            </div>
          </div>
        )}

        {/* Modale de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Expert des dizaines !", message: "Tu maîtrises parfaitement les dizaines jusqu'à 100 !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu comprends bien les dizaines ! Continue comme ça !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu progresses ! Les dizaines sont importantes !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux comprendre les dizaines !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-green-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Les dizaines t'aident à compter jusqu'à 100 !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
                      >
                        Recommencer
                      </button>
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                      >
                        Fermer
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 