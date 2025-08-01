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
  const [selectedNumber, setSelectedNumber] = useState('30');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  const [animationStep, setAnimationStep] = useState(0);
  
  // States pour l'animation de décomposition dizaines/unités
  const [showDecomposition, setShowDecomposition] = useState(false);
  const [decompositionStep, setDecompositionStep] = useState(0);
  const [animatingNumber, setAnimatingNumber] = useState<string>('');
  const [highlightDizaines, setHighlightDizaines] = useState(false);
  const [highlightUnites, setHighlightUnites] = useState(false);

  // States pour audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
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

  // Fonction pour mélanger un tableau
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialiser les choix mélangés pour l'exercice actuel
  const initializeShuffledChoices = () => {
    const currentChoices = exercises[currentExercise].choices;
    const shuffled = shuffleArray(currentChoices);
    setShuffledChoices(shuffled);
  };

  // Effet pour mélanger les choix quand on change d'exercice
  useEffect(() => {
    if (exercises.length > 0) {
      initializeShuffledChoices();
    }
  }, [currentExercise]);

  // Réinitialiser l'animation quand on change de dizaine
  useEffect(() => {
    setAnimationStep(0);
    setShowDecomposition(false);
    setDecompositionStep(0);
    setAnimatingNumber('');
    setHighlightDizaines(false);
    setHighlightUnites(false);
  }, [selectedNumber]);

  // Effet pour client-side uniquement
  useEffect(() => {
    setIsClient(true);
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

  // Effet pour réinitialiser les états sur changement d'exercice
  useEffect(() => {
    setUserAnswer('');
    setIsCorrect(null);
    setIsExplainingError(false);
    setShowNextButton(false);
    setHighlightNextButton(false);
  }, [currentExercise]);

  // Effet pour détecter la navigation et stopper les vocaux
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      stopAllVocalsAndAnimations();
    };

    // Intercepter les changements de route Next.js
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(state, title, url) {
      stopAllVocalsAndAnimations();
      return originalPushState.call(history, state, title, url);
    };

    history.replaceState = function(state, title, url) {
      stopAllVocalsAndAnimations();
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

  // Fonctions de contrôle de l'animation
  const nextStep = () => {
    if (animationStep < 3) {
      setAnimationStep(animationStep + 1);
    }
  };
  
  const restartAnimation = () => {
    setAnimationStep(0);
  };

  // Fonctions pour l'animation de décomposition dizaines/unités
  const startDecomposition = (number: string) => {
    setAnimatingNumber(number);
    setShowDecomposition(true);
    setDecompositionStep(0);
    setHighlightDizaines(false);
    setHighlightUnites(false);
  };

  const nextDecompositionStep = () => {
    if (decompositionStep < 4) {
      setDecompositionStep(decompositionStep + 1);
      
      // Animer les highlights selon l'étape
      switch (decompositionStep + 1) {
        case 2:
          setHighlightDizaines(true);
          break;
        case 3:
          setHighlightUnites(true);
          break;
        case 4:
          setHighlightDizaines(false);
          setHighlightUnites(false);
          break;
      }
    }
  };

  const restartDecomposition = () => {
    setDecompositionStep(0);
    setHighlightDizaines(false);
    setHighlightUnites(false);
  };

  // Fonction pour expliquer la décomposition d'un exercice
  const speakDecomposition = async (exercise: any) => {
    if (stopSignalRef.current) return;
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    
    try {
      const questionText = exercise.question.toLowerCase();
      if (questionText.includes('combien de groupes de 10') || questionText.includes('combien de dizaines')) {
        const match = exercise.question.match(/(\d+)/);
        if (match) {
          const number = match[1];
          if (number.length === 2) {
            const dizaines = number[0];
            await playAudio(`Pour trouver combien de boîtes de 10 dans ${number}, je décompose le nombre !`);
            if (stopSignalRef.current) return;
            
            await playAudio(`${number} se décompose en ${dizaines} dizaines et ${number[1]} unités`);
            if (stopSignalRef.current) return;
            
            await playAudio(`Le chiffre des dizaines est ${dizaines}, donc il y a ${dizaines} boîtes de 10 !`);
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



  // Déclencher l'animation au chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      // Déclencher l'animation pour la dizaine par défaut
      const initialAnimation = () => {
        const steps = [
          () => {}, // placeholder pour étape 0
          () => {}, // étape 1
          () => {}, // étape 2  
          () => {}, // étape 3
        ];
        // L'animation sera gérée dans le composant
      };
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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

  // Nombres dizaines pour le cours - 4 exemples essentiels
  const dizaines = [
    { value: '20', label: '20', reading: 'vingt', visual: '📦📦', groups: 2 },
    { value: '30', label: '30', reading: 'trente', visual: '📦📦📦', groups: 3 },
    { value: '50', label: '50', reading: 'cinquante', visual: '📦📦📦📦📦', groups: 5 },
    { value: '80', label: '80', reading: 'quatre-vingts', visual: '📦📦📦📦📦📦📦📦', groups: 8 }
  ];

  // Exercices sur les dizaines - positions des bonnes réponses variées
  const exercises = [
    { question: 'Combien de groupes de 10 dans 40 ?', visual: '📦📦📦📦', correctAnswer: '4', choices: ['4', '3', '5'] },
    { question: 'Que vaut 3 groupes de 10 ?', visual: '📦📦📦', correctAnswer: '30', choices: ['40', '20', '30'] },
    { question: 'Combien de dizaines dans 70 ?', visual: '📦📦📦📦📦📦📦', correctAnswer: '7', choices: ['6', '8', '7'] },
    { question: '2 dizaines = ?', visual: '📦📦', correctAnswer: '20', choices: ['10', '30', '20'] },
    { question: 'Combien de groupes de 10 dans 60 ?', visual: '📦📦📦📦📦📦', correctAnswer: '6', choices: ['5', '6', '7'] },
    { question: 'Que vaut 5 groupes de 10 ?', visual: '📦📦📦📦📦', correctAnswer: '50', choices: ['50', '40', '60'] },
    { question: '8 dizaines = ?', visual: '📦📦📦📦📦📦📦📦', correctAnswer: '80', choices: ['70', '90', '80'] },
    { question: 'Combien de dizaines dans 90 ?', visual: '📦📦📦📦📦📦📦📦📦', correctAnswer: '9', choices: ['8', '9', '10'] },
    { question: 'Que vaut 1 groupe de 10 ?', visual: '📦', correctAnswer: '10', choices: ['10', '1', '20'] },
    { question: 'Combien de groupes de 10 dans 100 ?', visual: '📦📦📦📦📦📦📦📦📦📦', correctAnswer: '10', choices: ['9', '10', '11'] }
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
    setHighlightedElement(null);
    setHasStarted(false);
    setExerciseStarted(false);
    setSamSizeExpanded(false);
    setShowNextButton(false);
    setHighlightNextButton(false);
    setIsExplainingError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
    
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

  // Fonction pour jouer l'audio avec voix féminine française
  const playAudio = async (text: string, slowMode = false) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      setIsPlayingVocal(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.7 : 0.85;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;

      // Préférer une voix féminine française
      const voices = speechSynthesis.getVoices();
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

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
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
      speechSynthesis.speak(utterance);
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
      
      await playAudio("Dès que tu as la réponse, tu peux cliquer sur la bonne réponse");
      if (stopSignalRef.current) return;
      
      // Mettre en évidence la zone des réponses
      setHighlightedElement('answer-choices');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("Si tu te trompes, je t'expliquerai la bonne réponse !");
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      await playAudio("En avant toutes pour les dizaines !");
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
    if (stopSignalRef.current) return;
    
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
      await playAudio(pirateExpression + " !");
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 800));
      if (stopSignalRef.current) return;
      
      const exercise = exercises[currentExercise];
      await playAudio(`La bonne réponse était : ${exercise.correctAnswer} !`);
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      // Explication de la méthode de décomposition
      const questionText = exercise.question.toLowerCase();
      if (questionText.includes('combien de groupes de 10') || questionText.includes('combien de dizaines')) {
        const match = questionText.match(/(\d+)/);
        if (match) {
          const number = match[1];
          if (number.length === 2) {
            const dizaines = number[0];
            await playAudio(`Pour trouver combien de boîtes de 10 dans ${number}, je regarde le chiffre des dizaines : c'est ${dizaines} !`);
            if (stopSignalRef.current) return;
          }
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 800));
      if (stopSignalRef.current) return;
      
      await playAudio("Appuie sur le bouton Suivant pour continuer ton aventure !");
      if (stopSignalRef.current) return;
      
      // Scroll vers le bouton suivant après l'explication - optimisé pour mobile
      setTimeout(() => {
        const nextButton = document.getElementById('next-exercise-button');
        if (nextButton) {
          const isMobile = window.innerWidth < 768; // sm breakpoint
          
          if (isMobile) {
            // Pour mobile: scroll pour que le bouton apparaisse en bas de l'écran
            nextButton.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'end', // En bas de l'écran
              inline: 'nearest' 
            });
            
            // Petit délai supplémentaire puis second scroll pour s'assurer de la visibilité
            setTimeout(() => {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
              });
            }, 600);
          } else {
            // Pour desktop: scroll normal
            nextButton.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest' 
            });
          }
          
          // Animation d'attention sur le bouton
          setTimeout(() => {
            nextButton.classList.add('animate-bounce');
            setTimeout(() => {
              nextButton.classList.remove('animate-bounce');
            }, 2000);
          }, isMobile ? 1000 : 500);
        }
      }, 1000); // Plus de délai pour que tout l'audio se termine
      
    } catch (error) {
      console.error('Erreur dans explainWrongAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
      // Ne PAS remettre setIsExplainingError(false) ici - le bouton Suivant doit rester actif
      // L'état sera réinitialisé quand l'utilisateur clique sur "Suivant"
    }
  };

  const handleAnswerClick = async (answer: string) => {
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise].correctAnswer;
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
    
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
      // Réinitialiser les états Sam
      setIsExplainingError(false);
      setShowNextButton(false);
      setHighlightNextButton(false);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
  };

  const resetAll = () => {
    stopAllVocalsAndAnimations(); // Stop any ongoing audio before reset
    
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    
    // Réinitialiser les états Sam
    setSamSizeExpanded(false);
    setExerciseStarted(false);
    setShowNextButton(false);
    setHighlightNextButton(false);
    setIsExplainingError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
  };

  // JSX pour l'introduction de Sam le Pirate dans les exercices
  const SamPirateIntroJSX = () => (
    <div className="flex justify-center p-1 mt-1 sm:mt-2">
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-100" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📦 Les dizaines jusqu'à 100
            </h1>
            <p className="text-lg text-gray-600">
              Découvre les groupes de 10 : 10, 20, 30... jusqu'à 100 !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md flex">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
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
          <div className="space-y-8">
            {/* Explication des dizaines */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧠 Qu'est-ce qu'une dizaine ?
              </h2>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <p className="text-xl text-center text-gray-800 mb-4">
                  Une dizaine, c'est <strong>un groupe de 10 objets</strong> !
                </p>
                <div className="text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <div className="text-2xl font-bold text-green-600 mb-2">1 dizaine = 10</div>
                  <p className="text-lg text-gray-700">Cette boîte contient 10 objets !</p>
                </div>
              </div>

              {/* Visualisation 10 = 1 dizaine */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-800 text-center">
                  🔢 Regarde : 10 points = 1 boîte de 10
                </h3>
                <div className="flex justify-center items-center space-x-8">
                  <div className="text-center">
                    <div className="text-2xl mb-2 text-blue-600">● ● ● ● ●</div>
                    <div className="text-2xl mb-2 text-blue-600">● ● ● ● ●</div>
                    <div className="font-bold text-lg text-gray-800">10 points</div>
                  </div>
                  <div className="text-4xl font-bold text-green-600">=</div>
                  <div className="text-center">
                    <div className="text-6xl mb-2">📦</div>
                    <div className="font-bold text-lg text-gray-800">1 dizaine</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de dizaines */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis une dizaine à explorer
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {dizaines.map((diz) => (
                  <button
                    key={diz.value}
                    onClick={() => setSelectedNumber(diz.value)}
                    className={`p-4 rounded-lg font-bold text-lg transition-all ${
                      selectedNumber === diz.value
                        ? 'bg-green-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {diz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section décomposition dizaines/unités */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 shadow-lg border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧮 Comment compter les boîtes de 10 dans un nombre ?
              </h2>
              
              <div className="text-center mb-6">
                <p className="text-lg text-gray-700 mb-4">
                  Pour savoir combien de boîtes de 10 il y a dans un nombre, 
                  je regarde le <strong className="text-blue-600">chiffre des dizaines</strong> !
                </p>
                
                {/* Sélecteur de nombre pour la démo */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {['42', '67', '83', '95'].map((num) => (
                    <button
                      key={num}
                      onClick={() => startDecomposition(num)}
                      className="bg-purple-500 text-white px-6 py-3 rounded-lg font-bold text-xl hover:bg-purple-600 transition-all shadow-lg transform hover:scale-105"
                    >
                      Démontrer avec {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animation de décomposition */}
              {showDecomposition && (
                <div className="space-y-6">
                  {/* Contrôles */}
                  <div className="flex justify-center space-x-4">
                    {decompositionStep < 4 && (
                      <button
                        onClick={nextDecompositionStep}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-green-600 hover:to-blue-600 transition-all shadow-lg transform hover:scale-105 animate-pulse"
                      >
                        ▶️ Étape suivante
                      </button>
                    )}
                    {decompositionStep > 0 && (
                      <button
                        onClick={restartDecomposition}
                        className="bg-gray-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-600 transition-colors shadow-md"
                      >
                        🔄 Recommencer
                      </button>
                    )}
                  </div>

                  {/* Étape 0: Présentation du nombre */}
                  {decompositionStep >= 0 && (
                    <div className="text-center">
                      <div className="text-6xl font-bold text-purple-600 mb-4 animate-bounce-in">
                        {animatingNumber}
                      </div>
                      <p className="text-xl text-gray-700">
                        Prenons le nombre <strong>{animatingNumber}</strong>
                      </p>
                    </div>
                  )}

                  {/* Étape 1: Animation de glissement dans le tableau */}
                  {decompositionStep >= 1 && (
                    <div className="flex justify-center">
                      <div className="bg-white border-4 border-gray-300 rounded-xl p-6 shadow-lg">
                        <div className="grid grid-cols-2 gap-8 text-center">
                          {/* Colonne Dizaines */}
                          <div className="space-y-4">
                            <div className={`text-xl font-bold p-3 rounded-lg transition-all duration-1000 ${
                              highlightDizaines ? 'bg-yellow-300 text-yellow-800 animate-pulse scale-110' : 'bg-blue-100 text-blue-800'
                            }`}>
                              DIZAINES
                            </div>
                            <div className={`text-6xl font-bold border-4 border-dashed border-blue-300 rounded-lg p-4 transition-all duration-1000 ${
                              decompositionStep >= 1 ? 'animate-slide-in' : ''
                            } ${highlightDizaines ? 'bg-yellow-100 border-yellow-400 scale-110' : 'bg-blue-50'}`}>
                              {decompositionStep >= 1 ? animatingNumber[0] : ''}
                            </div>
                          </div>

                          {/* Colonne Unités */}
                          <div className="space-y-4">
                            <div className={`text-xl font-bold p-3 rounded-lg transition-all duration-1000 ${
                              highlightUnites ? 'bg-yellow-300 text-yellow-800 animate-pulse scale-110' : 'bg-green-100 text-green-800'
                            }`}>
                              UNITÉS
                            </div>
                            <div className={`text-6xl font-bold border-4 border-dashed border-green-300 rounded-lg p-4 transition-all duration-1000 ${
                              decompositionStep >= 1 ? 'animate-slide-in' : ''
                            } ${highlightUnites ? 'bg-yellow-100 border-yellow-400 scale-110' : 'bg-green-50'}`}>
                              {decompositionStep >= 1 ? animatingNumber[1] : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Étape 2: Explication dizaines */}
                  {decompositionStep >= 2 && (
                    <div className="text-center animate-fade-in-up">
                      <div className="bg-yellow-100 border-4 border-yellow-400 rounded-xl p-6 max-w-2xl mx-auto">
                        <p className="text-2xl font-bold text-yellow-800 mb-2">
                          Le chiffre des dizaines est <span className="text-4xl">{animatingNumber[0]}</span>
                        </p>
                        <p className="text-xl text-yellow-700">
                          Cela veut dire qu'il y a <strong>{animatingNumber[0]} boîtes de 10</strong> !
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Étape 3: Explication unités */}
                  {decompositionStep >= 3 && (
                    <div className="text-center animate-fade-in-up">
                      <div className="bg-green-100 border-4 border-green-400 rounded-xl p-6 max-w-2xl mx-auto">
                        <p className="text-2xl font-bold text-green-800 mb-2">
                          Le chiffre des unités est <span className="text-4xl">{animatingNumber[1]}</span>
                        </p>
                        <p className="text-xl text-green-700">
                          Cela veut dire qu'il y a <strong>{animatingNumber[1]} objets en plus</strong>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Étape 4: Résumé final */}
                  {decompositionStep >= 4 && (
                    <div className="text-center animate-bounce-in">
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-purple-400 rounded-xl p-8 max-w-3xl mx-auto">
                        <h3 className="text-3xl font-bold text-purple-800 mb-4">
                          🎉 Résultat final !
                        </h3>
                        <p className="text-2xl font-bold text-purple-700 mb-2">
                          Dans {animatingNumber}, il y a <span className="text-4xl text-red-600">{animatingNumber[0]}</span> boîtes de 10
                        </p>
                        <p className="text-xl text-purple-600">
                          + {animatingNumber[1]} objets supplémentaires
                        </p>
                        <div className="mt-4 text-lg text-purple-500">
                          💡 <strong>Astuce :</strong> Le nombre de boîtes de 10 = le chiffre des dizaines !
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Affichage détaillé de la dizaine sélectionnée */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                🔍 Découvrons {selectedNumber}
              </h3>
              
              {(() => {
                const selected = dizaines.find(d => d.value === selectedNumber);
                if (!selected) return null;
                
                return (
                  <div className="space-y-8">
                    {/* Boutons de contrôle - bien visibles en haut */}
                    <div className="flex justify-center space-x-4 mb-8">
                      {animationStep < 3 && (
                        <button
                          onClick={nextStep}
                          className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-blue-600 hover:to-green-600 transition-all shadow-lg transform hover:scale-105 animate-pulse"
                        >
                          ▶️ Suivant
                        </button>
                      )}
                      {animationStep > 0 && (
                        <button
                          onClick={restartAnimation}
                          className="bg-gray-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-600 transition-colors shadow-md"
                        >
                          🔄 Recommencer
                        </button>
                      )}
                    </div>
                    
                    {/* Message de démarrage */}
                    {animationStep === 0 && (
                      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-8 text-center">
                        <div className="text-6xl mb-4">🚀</div>
                        <h4 className="text-2xl font-bold mb-4 text-gray-800">
                          Prêt à explorer {selected.value} ?
                        </h4>
                        <p className="text-lg text-gray-700 mb-4">
                          Appuie sur "Suivant" pour commencer l'aventure !
                        </p>
                        <div className="text-4xl animate-bounce">⬆️</div>
                      </div>
                    )}
                    
                    {/* Étape 1: Le nombre */}
                    {animationStep >= 1 && (
                      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-8 text-center animate-slide-in">
                        <h4 className="text-xl font-bold mb-4 text-green-800">
                          📍 Étape 1 : Voici le nombre
                        </h4>
                        <div className="flex items-center justify-center space-x-4 mb-4">
                          <div className="text-9xl font-bold text-green-600 animate-bounce-in">
                            {selected.value}
                          </div>
                          <div className="text-2xl font-semibold text-gray-600">
                            {selected.reading}
                          </div>
                        </div>
                        <p className="text-xl text-gray-700">
                          Comment peut-on faire {selected.value} avec des groupes de 10 ?
                        </p>
                      </div>
                    )}
                    
                    {/* Étape 2: Les boîtes de 10 */}
                    {animationStep >= 2 && (
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-8 animate-slide-in">
                        <h4 className="text-xl font-bold mb-4 text-blue-800">
                          📦 Étape 2 : Comptons les boîtes de 10
                        </h4>
                        <div className="text-7xl mb-6 animate-bounce-in">
                          {selected.visual}
                        </div>
                        <p className="text-xl text-gray-700 font-semibold">
                          Je vois {selected.groups} boîte{selected.groups > 1 ? 's' : ''} de 10
                        </p>
                      </div>
                    )}
                    
                    {/* Étape 3: La décomposition */}
                    {animationStep >= 3 && (
                      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-8 animate-slide-in">
                        <h4 className="text-xl font-bold mb-4 text-orange-800">
                          ✨ Étape 3 : La décomposition magique
                        </h4>
                        <div className="text-4xl font-bold text-blue-600 mb-4 animate-glow">
                          {selected.groups} × 10 = {selected.value}
                        </div>
                        <p className="text-lg text-gray-700 mb-6">
                          {selected.groups} fois 10 égale {selected.value}
                        </p>
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => playAudio(`${selected.groups} fois 10 égale ${selected.value}`)}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
                          >
                            <Volume2 className="inline w-4 h-4 mr-2" />
                            Écouter la décomposition
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Indicateur de progression amélioré */}
                    <div className="text-center">
                      <div className="inline-flex space-x-3 bg-white rounded-full px-6 py-3 shadow-md">
                        {[0, 1, 2, 3].map((step) => (
                          <div
                            key={step}
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                              animationStep >= step 
                                ? 'bg-green-500 text-white shadow-lg' 
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            {step === 0 ? '🚀' : step}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2 font-semibold">
                        {animationStep === 0 && "Prêt à commencer"}
                        {animationStep === 1 && "Étape 1/3 : Le nombre"}
                        {animationStep === 2 && "Étape 2/3 : Les boîtes"}
                        {animationStep === 3 && "Étape 3/3 : La décomposition"}
                      </p>
                    </div>
                    
                    {/* Message de fin */}
                    {animationStep === 3 && (
                      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 text-center animate-fade-in-up">
                        <div className="text-4xl mb-3">🎉</div>
                        <p className="text-lg font-bold text-green-700">
                          Bravo ! Tu as découvert comment faire {selected.value} avec des dizaines !
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Choisis une autre dizaine ou recommence cette animation !
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Tableau récapitulatif avec animations */}
            <div className="bg-white rounded-xl p-8 shadow-lg animate-fade-in-up">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 animate-bounce">
                📊 Tableau magique des dizaines
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-green-600 bg-white rounded-lg overflow-hidden animate-glow">
                  <thead>
                    <tr className="bg-green-200">
                      <th className="border-2 border-green-600 p-4 text-green-800 font-bold animate-wiggle">Nombre de boîtes</th>
                      <th className="border-2 border-green-600 p-4 text-green-800 font-bold animate-wiggle">Dizaine</th>
                      <th className="border-2 border-green-600 p-4 text-green-800 font-bold animate-wiggle">Comment on dit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dizaines.map((diz, index) => (
                      <tr key={diz.value} className="hover:bg-green-50 animate-slide-in" style={{ animationDelay: `${index * 0.3}s`, animationFillMode: 'both' }}>
                        <td className="border-2 border-green-600 p-4 text-center text-3xl hover:animate-bounce cursor-pointer">
                          {diz.visual}
                        </td>
                        <td className="border-2 border-green-600 p-4 text-center text-2xl font-bold text-green-600 hover:animate-wiggle cursor-pointer">
                          {diz.value}
                        </td>
                        <td className="border-2 border-green-600 p-4 text-center text-xl font-semibold hover:animate-wiggle cursor-pointer">
                          {diz.reading}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Trucs pour retenir les dizaines</h3>
              <ul className="space-y-2 text-lg">
                <li>• Une dizaine = 10 objets dans une boîte</li>
                <li>• 2 dizaines = 2 boîtes = 20</li>
                <li>• Compte les boîtes pour trouver les dizaines</li>
                <li>• 100 = 10 dizaines (une grande maison !)</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Introduction de Sam le Pirate - toujours visible */}
            {SamPirateIntroJSX()}
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 sm:mb-6 md:mb-8 gap-2 sm:gap-4">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 flex-1">
                {exercises[currentExercise].question}
              </h3>
                {ListenQuestionButtonJSX()}
              </div>
              
              {/* Affichage visuel de la question */}
              <div className="bg-green-50 rounded-lg p-2 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 md:mb-6">
                  {exercises[currentExercise].visual}
                </div>
              </div>
              
              {/* Choix multiples avec gros boutons */}
              <div 
                id="answer-choices"
                className={`grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8 transition-all duration-500 ${
                  highlightedElement === 'answer-choices' ? 'ring-8 ring-yellow-400 bg-yellow-50 rounded-lg p-4 scale-105 shadow-2xl animate-pulse' : ''
                }`}
              >
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl transition-all ${
                      userAnswer === choice
                        ? isCorrect === true
                          ? 'bg-green-500 text-white'
                          : isCorrect === false
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                        : exercises[currentExercise].correctAnswer === choice && isCorrect === false
                          ? 'bg-green-200 text-green-800 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                    } disabled:cursor-not-allowed`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-6 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-3">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Parfait ! C'est bien {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Pas tout à fait... C'était {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Feedback détaillé pour les réponses incorrectes */}
              {!isCorrect && isCorrect !== null && (
                <div className="bg-white rounded-lg p-6 border-2 border-blue-300 mb-6">
                  <h4 className="text-lg font-bold mb-4 text-blue-800 text-center">
                    🎯 Explication avec la méthode !
                  </h4>
                  <div className="space-y-6">
                    {/* Explication visuelle avec décomposition pour les questions sur les groupes de 10 */}
                    {(() => {
                      const exercise = exercises[currentExercise];
                      const questionText = exercise.question.toLowerCase();
                      const hasNumberToDecompose = questionText.includes('combien de groupes de 10') || questionText.includes('combien de dizaines');
                      
                      if (hasNumberToDecompose) {
                        const match = exercise.question.match(/(\d+)/);
                        const number = match ? match[1] : '';
                        
                        if (number.length === 2) {
                          const dizaines = number[0];
                          const unites = number[1];
                          
                          return (
                            <div className="space-y-4">
                              {/* Titre de la méthode */}
                              <div className="text-center">
                                <p className="text-xl font-bold text-purple-800 mb-2">
                                  💡 Méthode : Je décompose {number} en dizaines et unités
                                </p>
                              </div>
                              
                              {/* Tableau de décomposition */}
                              <div className="flex justify-center">
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-4 border-purple-300 rounded-xl p-6 shadow-lg">
                                  <div className="grid grid-cols-2 gap-8 text-center">
                                    {/* Colonne Dizaines */}
                                    <div className="space-y-4">
                                      <div className="text-lg font-bold p-3 rounded-lg bg-blue-100 text-blue-800">
                                        DIZAINES
                                      </div>
                                      <div className="text-5xl font-bold border-4 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50 animate-pulse">
                                        {dizaines}
                                      </div>
                                    </div>

                                    {/* Colonne Unités */}
                                    <div className="space-y-4">
                                      <div className="text-lg font-bold p-3 rounded-lg bg-green-100 text-green-800">
                                        UNITÉS
                                      </div>
                                      <div className="text-5xl font-bold border-4 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
                                        {unites}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Explication */}
                              <div className="text-center">
                                <div className="bg-yellow-100 border-4 border-yellow-400 rounded-xl p-4 max-w-xl mx-auto">
                                  <p className="text-xl font-bold text-yellow-800 mb-2">
                                    Le chiffre des dizaines est <span className="text-3xl text-red-600">{dizaines}</span>
                                  </p>
                                  <p className="text-lg text-yellow-700">
                                    Donc il y a <strong className="text-2xl text-red-600">{dizaines}</strong> boîtes de 10 !
                                  </p>
                                </div>
                              </div>

                              {/* Vérification visuelle */}
                              <div className="text-center">
                                <div className="bg-blue-50 rounded-lg p-4">
                                  <div className="text-3xl mb-4">
                                    {exercise.visual}
                                  </div>
                                  <p className="text-lg text-blue-700 font-semibold">
                                    Compte les boîtes 📦 : il y en a bien {exercise.correctAnswer} !
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      }
                      
                      // Fallback pour les autres types d'exercices
                      return (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-3xl mb-4">
                              {exercise.visual}
                            </div>
                            <div className="text-2xl font-bold text-blue-600 mb-2">
                              {(() => {
                                if (exercise.question.includes('Que vaut') || exercise.question.includes('dizaines =')) {
                                  const groupCount = parseInt(exercise.correctAnswer) / 10;
                                  return `${groupCount} dizaines = ${exercise.correctAnswer}`;
                                }
                                return `Réponse : ${exercise.correctAnswer}`;
                              })()}
                            </div>
                            <p className="text-lg text-blue-700 font-semibold">
                              {(() => {
                                if (exercise.question.includes('Que vaut') || exercise.question.includes('dizaines =')) {
                                  const groupCount = parseInt(exercise.correctAnswer) / 10;
                                  return `${groupCount} × 10 = ${exercise.correctAnswer}`;
                                }
                                return `La réponse est ${exercise.correctAnswer} !`;
                              })()}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                    
                    <div className="text-center">
                      <button 
                        onClick={() => speakDecomposition(exercises[currentExercise])}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Écouter la décomposition</span>
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 text-center">
                      <p className="text-sm font-semibold text-purple-800">
                        Maintenant tu sais ! {(() => {
                          const exercise = exercises[currentExercise];
                          if (exercise.question.includes('Combien de groupes') || exercise.question.includes('Combien de dizaines')) {
                            const groupCount = exercise.visual.split('📦').length - 1;
                            return `${groupCount} groupes de 10 font ${groupCount * 10} !`;
                          } else {
                            const groupCount = parseInt(exercise.correctAnswer) / 10;
                            return `${groupCount} dizaines font ${exercise.correctAnswer} !`;
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              {isCorrect === false && (
                <div className="flex justify-center">
                  <button
                    id="next-exercise-button"
                    onClick={nextExercise}
                    className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors min-h-[50px] pb-4 sm:pb-0"
                  >
                    Suivant →
                  </button>
                </div>
              )}
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