'use client';

// 🎙️ SYSTÈME AUDIO HYBRIDE AVEC ENREGISTREMENTS PERSONNALISÉS
// Ce chapitre utilise un système audio hybride qui :
// 1. Recherche d'abord des enregistrements personnalisés via manifest.json
// 2. Utilise la synthèse vocale (TTS) en fallback si pas d'enregistrement
// 3. Permet une expérience audio optimisée avec la voix de Sam le Pirate
//
// Structure des fichiers audio attendue :
// /public/audio/cp-nombres-jusqu-20/dizaines-unites/
// ├── manifest.json (contient le mapping texte -> fichier)
// ├── cours_1.mp3, cours_2.mp3, etc. (enregistrements du cours)
// └── exercices_1.mp3, exercices_2.mp3, etc. (enregistrements des exercices)

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Play, Pause } from 'lucide-react';

export default function DizainesUnitesCP() {
  const router = useRouter();
  const [selectedNumber, setSelectedNumber] = useState(7);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // States pour audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [animatingDecomposition, setAnimatingDecomposition] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingExample, setAnimatingExample] = useState(false);
  const [highlightDigit, setHighlightDigit] = useState<'left' | 'right' | null>(null);
  const [animatingCircles, setAnimatingCircles] = useState<'dizaines' | 'unites' | 'all' | null>(null);
  
  // États pour Sam le Pirate
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [highlightNextButton, setHighlightNextButton] = useState(false);
  const [isExplainingError, setIsExplainingError] = useState(false);
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);
  
  // États pour le mini-jeu
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());

  // Refs pour contrôler les vocaux et animations
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Expressions de pirate personnalisées pour chaque exercice incorrect
  const pirateExpressions = [
    "Par ma barbe de pirate", // exercice 1
    "Humm ça n'est pas vraiment ça", // exercice 2  
    "Nom d'un alligator", // exercice 3
    "Saperlipopette", // exercice 4
    "Mille sabords", // exercice 5
    "Morbleu", // exercice 6
    "Tonnerre de Brest", // exercice 7
    "Par tous les diables des mers", // exercice 8
    "Sacré mille tonnerres", // exercice 9
    "Bigre et bigre", // exercice 10
    "Nom d'une jambe en bois", // exercice 11
    "Sacrés mille tonnerres", // exercice 12
    "Par Neptune", // exercice 13
    "Bon sang de bonsoir", // exercice 14
    "Fichtre et refichtre" // exercice 15
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
    setAnimatingDecomposition(false);
    setAnimatingExample(false);
    setHighlightDigit(null);
    setAnimatingCircles(null);
    setIsExplainingError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
    
    // Arrêts supplémentaires en différé pour s'assurer
    setTimeout(() => {
      try {
        speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() appelé (2e tentative)');
      } catch (error) {
        console.log('❌ Erreur 2e tentative:', error);
      }
      stopSignalRef.current = false; // Reset pour permettre nouveaux audios
    }, 100);
    
    setTimeout(() => {
      try {
        speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() appelé (3e tentative)');
      } catch (error) {
        console.log('❌ Erreur 3e tentative:', error);
      }
    }, 300);
  };

  // Fonction pour scroller vers l'illustration
  const scrollToIllustration = () => {
    const element = document.getElementById('number-analysis');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Fonction pour scroller vers le sélecteur de nombre
  const scrollToNumberChoice = () => {
    const element = document.getElementById('number-choice');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Fonction d'attente
  const wait = (ms: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (stopSignalRef.current) {
        resolve();
        return;
      }
        resolve();
      }, ms);
    });
  };

  // Fonction pour jouer un audio avec gestion d'interruption et support des enregistrements personnalisés
  const playAudio = async (text: string, slowMode = false): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      setIsPlayingVocal(true);
      
      // 🎙️ RECHERCHE DANS LES ENREGISTREMENTS PERSONNALISÉS
      const audioFile = findAudioFileForText(text);
      
      if (audioFile) {
        // ✅ Utiliser l'enregistrement personnalisé
        console.log('🎵 Lecture enregistrement personnalisé:', audioFile);
        
        const audio = new Audio(`/audio/cp-nombres-jusqu-20/dizaines-unites/${audioFile}`);
        
        audio.onended = () => {
          setIsPlayingVocal(false);
          resolve();
        };
        
        audio.onerror = (error) => {
          console.error('❌ Erreur lecture audio:', error);
          // Fallback vers TTS
          fallbackToTTS(text, slowMode, resolve);
        };
        
        audio.play().catch((error) => {
          console.error('❌ Erreur play audio:', error);
          // Fallback vers TTS  
          fallbackToTTS(text, slowMode, resolve);
        });
        
      } else {
        // 🤖 Fallback vers TTS si pas d'enregistrement
        console.log('🤖 Fallback TTS pour:', text.substring(0, 50));
        fallbackToTTS(text, slowMode, resolve);
      }
    });
  };
  
  // État pour stocker le manifest des enregistrements audio
  const [audioManifest, setAudioManifest] = useState<any>(null);

  // Fonction pour charger le manifest des enregistrements audio
  const loadAudioManifest = async () => {
    try {
      const response = await fetch('/audio/cp-nombres-jusqu-20/dizaines-unites/manifest.json');
      if (response.ok) {
        const manifest = await response.json();
        setAudioManifest(manifest);
        console.log('📋 Manifest audio chargé:', manifest);
      } else {
        console.log('📋 Pas de manifest audio trouvé, utilisation TTS uniquement');
      }
    } catch (error) {
      console.log('📋 Erreur chargement manifest audio:', error);
    }
  };

  // Fonction pour trouver le fichier audio correspondant au texte
  const findAudioFileForText = (text: string): string | null => {
    if (!audioManifest || !audioManifest.segments) {
      return null; // Pas de manifest = pas d'enregistrements disponibles
    }
    
    // Rechercher dans tous les segments du manifest
    for (const [groupId, segments] of Object.entries(audioManifest.segments)) {
      for (const segment of segments as any[]) {
        if (segment.text && segment.file) {
          // Recherche par correspondance de texte (flexible)
          const cleanText = text.toLowerCase().trim();
          const segmentText = segment.text.toLowerCase().trim();
          
          // Plusieurs méthodes de correspondance
          if (cleanText === segmentText || // Correspondance exacte
              cleanText.includes(segmentText) || // Le texte contient le segment
              segmentText.includes(cleanText) || // Le segment contient le texte
              cleanText.includes(segmentText.substring(0, 20))) { // Correspondance partielle
            console.log(`🎯 Audio trouvé pour "${text}" -> ${segment.file}`);
            return segment.file;
          }
        }
      }
    }
    
    return null; // Aucun enregistrement trouvé
  };
  
  // Fonction fallback vers TTS (ancien système)
  const fallbackToTTS = (text: string, slowMode: boolean, resolve: () => void) => {
    try {
      if (stopSignalRef.current) {
        setIsPlayingVocal(false);
        resolve();
        return;
      }
      
      // S'assurer que la synthèse précédente est bien arrêtée
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
        console.log('🔇 Audio précédent annulé dans fallbackToTTS');
      }
      
      if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis API non disponible');
        setIsPlayingVocal(false);
        resolve();
        return;
      }
    
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.6 : 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = speechSynthesis.getVoices();
      const appleVoices = voices.filter(voice => 
        voice.localService === true && 
        (voice.lang === 'fr-FR' || voice.lang === 'fr')
      );
      
      const femaleVoiceNames = ['Amélie', 'Audrey', 'Marie', 'Julie', 'Céline'];
      let selectedVoice = appleVoices.find(voice => 
        femaleVoiceNames.some(name => voice.name.includes(name))
      ) || appleVoices[0];
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      currentAudioRef.current = utterance;
      
      utterance.onend = () => {
        currentAudioRef.current = null;
        setIsPlayingVocal(false);
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('Erreur synthèse vocale:', event);
        currentAudioRef.current = null;
        setIsPlayingVocal(false);
        resolve();
      };
      
      if (stopSignalRef.current) {
        setIsPlayingVocal(false);
        resolve();
        return;
      }

      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Erreur dans fallbackToTTS:', error);
      currentAudioRef.current = null;
      setIsPlayingVocal(false);
      resolve();
    }
  };

  // Fonction pour l'introduction vocale de Sam le Pirate - DÉMARRAGE MANUEL PAR CLIC
  const startPirateIntro = async () => {
    if (pirateIntroStarted) return;
    
    // FORCER la remise à false pour le démarrage manuel
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setPirateIntroStarted(true);
    
    try {
      await playAudio("Bonjour, faisons quelques exercices nom d'une jambe en bois !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await playAudio("Pour lire l'énoncé appuie sur écouter l'énoncé");
      if (stopSignalRef.current) return;
      
      // Animation sur le bouton "Écouter l'énoncé"
      setHighlightedElement('listen-question-button');
      setShowExercisesList(true);
      await wait(2000);
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("Dès que tu as la réponse, tu peux la saisir ici");
      if (stopSignalRef.current) return;
      
      // Mettre beaucoup en évidence la zone de réponse
      setHighlightedElement('answer-input');
      await wait(2000);
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("et appuie ensuite sur valider");
      if (stopSignalRef.current) return;
      
      // Animation sur le bouton valider
      setHighlightedElement('validate-button');
      await wait(2000);
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

  // Fonction pour lire l'énoncé de l'exercice - LECTURE SIMPLE DE LA QUESTION
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
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      const exercise = exercises[currentExercise];
      await playAudio(`La bonne réponse est ${exercise.correctDizaines} dizaines et ${exercise.correctUnites} unités !`);
      if (stopSignalRef.current) return;
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      await playAudio(`Le nombre ${exercise.number} se décompose en ${exercise.correctDizaines} dizaines et ${exercise.correctUnites} unités !`);
      if (stopSignalRef.current) return;
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      // Animation positionnelle : chiffre de gauche = dizaines
      await playAudio("Le chiffre de gauche indique les dizaines");
      if (stopSignalRef.current) return;
      
      setHighlightDigit('left');
      await wait(1500);
      if (stopSignalRef.current) return;
      
      // Animation positionnelle : chiffre de droite = unités  
      await playAudio("Le chiffre de droite indique les unités");
      if (stopSignalRef.current) return;
      
      setHighlightDigit('right');
      await wait(1500);
      setHighlightDigit(null);
      if (stopSignalRef.current) return;
      
      await wait(500);
      if (stopSignalRef.current) return;
      
      await playAudio("Maintenant appuie sur suivant !");
      if (stopSignalRef.current) return;
      
      // Illuminer le bouton suivant
      setHighlightedElement('next-exercise-button');
      
      await wait(300); // Laisser l'animation se voir
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
    
    // Passage automatique au prochain exercice après 1.5s (en dehors du try/catch)
    const currentScore = score;
    const nextExerciseIndex = currentExercise + 1;
    
    setTimeout(() => {
      if (nextExerciseIndex < exercises.length) {
        // Prochain exercice
        setCurrentExercise(nextExerciseIndex);
        setUserAnswer('');
        setIsCorrect(null);
      } else {
        // Dernier exercice terminé
        setFinalScore(currentScore + 1);
        setShowCompletionModal(true);
        saveProgress(currentScore + 1, exercises.length);
      }
    }, 1500);
  };

  // Fonction pour expliquer le chapitre au démarrage avec animations
  const explainChapter = async () => {
    console.log('📖 explainChapter - Début explication');
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);

    try {
      console.log('Début explainChapter - Dizaines et unités');
      
      await playAudio("Bonjour ! Bienvenue dans le chapitre sur les dizaines et unités !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("Aujourd'hui, tu vas apprendre un secret très important sur les nombres !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      // Animation directe avec l'exemple 15
      setHighlightedElement('example-section');
      setAnimatingExample(true);
      await playAudio("Regardons ensemble le nombre 15 !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      await playAudio("Quand tu vois un nombre à 2 chiffres, il y a une règle magique !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      // Animation du chiffre de gauche
      setHighlightDigit('left');
      await playAudio("Le chiffre de gauche, ici le 1, représente les dizaines !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      setAnimatingCircles('dizaines');
      await playAudio("1 dizaine, c'est 1 groupe de 10 objets ! Regarde les 10 cercles bleus !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      // Animation du chiffre de droite
      setHighlightDigit('right');
      setAnimatingCircles('unites');
      await playAudio("Le chiffre de droite, ici le 5, représente les unités !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("5 unités, ce sont 5 objets tout seuls ! Regarde les 5 cercles rouges !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      // Animation finale
      setHighlightDigit(null);
      setAnimatingCircles('all');
      await playAudio("Donc 15, c'est 1 groupe de 10 plus 5 unités ! 10 plus 5 égale 15 !");
      if (stopSignalRef.current) return;
      await wait(2500);
      
      await playAudio("C'est comme ça que fonctionnent TOUS les nombres à 2 chiffres !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("Gauche égale dizaines, droite égale unités ! C'est la règle !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      // Transition vers les choix
      setHighlightedElement(null);
      setAnimatingExample(false);
      setAnimatingCircles(null);
      await wait(1000);
      
      scrollToNumberChoice();
      setHighlightedElement('number-choice');
      await playAudio("Maintenant, choisis un nombre et je te montrerai sa décomposition !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("J'ai ajouté des exemples spéciaux : 7 et 8 qui n'ont pas de dizaines !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      await playAudio("Pour les nombres à 2 chiffres : gauche égale dizaines, droite égale unités !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      await playAudio("Pour les nombres à 1 chiffre : zéro dizaine, que des unités !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      setHighlightedElement(null);
      await playAudio("Alors, quel nombre veux-tu décomposer ?");
      if (stopSignalRef.current) return;
      await wait(1500);
      
    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      console.log('📖 explainChapter - Fin (normale ou interrompue)');
      setIsPlayingVocal(false);
      setHighlightedElement(null);
      setAnimatingExample(false);
      setHighlightDigit(null);
      setAnimatingCircles(null);
    }
  };

  // Fonction pour expliquer un nombre spécifique avec animations avancées
  const explainNumber = async (number: number) => {
    console.log(`🔢 explainNumber(${number}) - Début, arrêt des animations précédentes`);
    
    // Arrêter toute animation/vocal en cours
    stopAllVocalsAndAnimations();
    
    // Attendre un délai pour s'assurer que l'arrêt est effectif
    await wait(300);
    
    // Vérifier une dernière fois si quelque chose joue encore
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      await wait(100);
    }
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setAnimatingDecomposition(true);

    try {
      scrollToIllustration();
      
      const { dizaines, unites } = analyzeNumber(number);
      const numberStr = number.toString();
      
      await playAudio(`Le nombre ${number} !`);
      if (stopSignalRef.current) return;
      await wait(800);
      
      // Expliquer la position des chiffres
      if (numberStr.length === 2) {
        await playAudio(`Regardons les chiffres ! Le ${numberStr[0]} à gauche, et le ${numberStr[1]} à droite !`);
        if (stopSignalRef.current) return;
        await wait(1800);
        
        await playAudio(`Souviens-toi : gauche égale dizaines, droite égale unités !`);
        if (stopSignalRef.current) return;
        await wait(1500);
      } else if (numberStr.length === 1) {
        await playAudio(`Voici un cas spécial ! ${number} n'a qu'un seul chiffre !`);
        if (stopSignalRef.current) return;
        await wait(1800);
        
        await playAudio(`Quand il n'y a qu'un chiffre, il n'y a pas de dizaines, que des unités !`);
        if (stopSignalRef.current) return;
        await wait(2000);
      }
      
      setAnimatingCircles('dizaines');
      if (dizaines > 0) {
        await playAudio(`Le ${numberStr[0]} de gauche donne ${dizaines} dizaine${dizaines > 1 ? 's' : ''} !`);
        if (stopSignalRef.current) return;
        await wait(1500);
        
        await playAudio(`Regarde le${dizaines > 1 ? 's' : ''} groupe${dizaines > 1 ? 's' : ''} de 10 cercles bleus ! ${dizaines} fois 10 égale ${dizaines * 10} !`);
        if (stopSignalRef.current) return;
        await wait(1800);
      } else {
        await playAudio(`Il n'y a aucune dizaine ! Donc 0 groupe de 10 !`);
        if (stopSignalRef.current) return;
        await wait(1500);
      }
      
      setAnimatingCircles('unites');
      if (unites > 0) {
        if (numberStr.length === 1) {
          await playAudio(`Le ${numberStr[0]} représente ${unites} unité${unites > 1 ? 's' : ''} !`);
        } else {
          await playAudio(`Le ${numberStr[1] || '0'} de droite donne ${unites} unité${unites > 1 ? 's' : ''} !`);
        }
        if (stopSignalRef.current) return;
        await wait(1500);
        
        await playAudio(`Regarde le${unites > 1 ? 's' : ''} ${unites} cercle${unites > 1 ? 's' : ''} rouge${unites > 1 ? 's' : ''} ! Ce sont les unités !`);
        if (stopSignalRef.current) return;
        await wait(1800);
      }
      
      setAnimatingCircles('all');
      await playAudio(`Au total : ${dizaines * 10} plus ${unites} égale ${number} !`);
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio(`Formidable ! ${number} égale ${dizaines} dizaine${dizaines > 1 ? 's' : ''} plus ${unites} unité${unites > 1 ? 's' : ''} !`);
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Choisis un autre nombre pour continuer à t'exercer !");
      
    } catch (error) {
      console.error('Erreur dans explainNumber:', error);
    } finally {
      console.log('🔢 explainNumber - Fin (normale ou interrompue)');
      setIsPlayingVocal(false);
      setAnimatingDecomposition(false);
      setAnimatingCircles(null);
    }
  };





  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'dizaines-unites',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('cp-nombres-20-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'dizaines-unites');
      
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

    localStorage.setItem('cp-nombres-20-progress', JSON.stringify(allProgress));
  };

  // Fonction pour analyser un nombre en dizaines et unités
  const analyzeNumber = (num: number) => {
    const dizaines = Math.floor(num / 10);
    const unites = num % 10;
    return { dizaines, unites };
  };

  // Données des nombres avec leur décomposition
  const numbersData = Array.from({ length: 10 }, (_, i) => {
    const number = i + 11;
    const { dizaines, unites } = analyzeNumber(number);
    return {
      number,
      dizaines,
      unites,
      visual: `${'🔵'.repeat(dizaines)}${'🔴'.repeat(unites)}`,
      explanation: `${number} = ${dizaines} dizaine${dizaines > 1 ? 's' : ''} + ${unites} unité${unites > 1 ? 's' : ''}`
    };
  });

  // Fonction pour générer 9 exercices aléatoires uniques (nombres de 11 à 20)
  const generateRandomExercises = () => {
    const allNumbers = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // Tous les nombres possibles
    const shuffled = [...allNumbers].sort(() => Math.random() - 0.5); // Mélange aléatoire
    const selectedNumbers = shuffled.slice(0, 9); // Prendre 9 nombres uniques
    
    return selectedNumbers.map(number => ({
      question: 'Décompose ce nombre en dizaines et unités',
      number: number,
      correctDizaines: Math.floor(number / 10), // Calcul automatique des dizaines
      correctUnites: number % 10 // Calcul automatique des unités
    }));
  };

  // Exercices générés aléatoirement à chaque session
  const [exercises] = useState(() => generateRandomExercises());

  // Fonction pour rendre les cercles visuels - dizaines = groupes de 10
  const renderCircles = (dizaines: number, unites: number) => {
    const elements = [];
    
    // Dizaines (groupes de 10 cercles bleus)
    for (let d = 0; d < dizaines; d++) {
      const group = [];
      for (let i = 0; i < 10; i++) {
        group.push(
          <div
            key={`d${d}-${i}`}
            className={`w-4 h-4 rounded-full bg-blue-600 transition-all duration-700 ${
              animatingDecomposition && (animatingCircles === 'dizaines' || animatingCircles === 'all') ? 
              'scale-110 ring-2 ring-blue-300 animate-pulse' : ''
            }`}
          />
        );
      }
      
      elements.push(
        <div
          key={`dizaine-${d}`}
          className={`grid grid-cols-5 gap-1 p-2 rounded-lg border-2 border-blue-300 bg-blue-50 transition-all duration-700 ${
            animatingDecomposition && (animatingCircles === 'dizaines' || animatingCircles === 'all') ? 
            'scale-110 ring-4 ring-blue-400 bg-blue-100' : ''
          }`}
        >
          {group}

        </div>
      );
    }
    
    // Unités (cercles rouges individuels)
    for (let i = 0; i < unites; i++) {
      elements.push(
        <div
          key={`unite-${i}`}
          className={`w-6 h-6 rounded-full bg-red-600 transition-all duration-700 ${
            animatingDecomposition && (animatingCircles === 'unites' || animatingCircles === 'all') ? 
            'scale-125 ring-4 ring-red-300 animate-pulse' : 
            animatingDecomposition ? 'scale-110 ring-2 ring-red-300' : ''
          }`}
        />
      );
    }
    
    return elements;
  };



  // Effet pour gérer les changements cours ↔ exercices - reset pirate intro
  useEffect(() => {
    if (showExercises) {
      // Reset de l'intro pirate quand on passe aux exercices
      setPirateIntroStarted(false);
      setShowExercisesList(false);
    } else {
      // Arrêt audio si on repasse au cours
      stopAllVocalsAndAnimations();
      setIsExplainingError(false);
      setExerciseStarted(false);
      setShowNextButton(false);
      setHighlightNextButton(false);
      // Reset du mini-jeu quand on revient au cours
      setRevealedAnswers(new Set());
    }
  }, [showExercises]);

  // Effet pour reset les états d'erreur lors d'un nouvel exercice
  useEffect(() => {
    setUserAnswer('');
    setIsCorrect(null);
    setIsExplainingError(false);
  }, [currentExercise]);

  // Effet pour initialiser le client et charger le manifest audio
  useEffect(() => {
    setIsClient(true);
    console.log('✅ Composant DizainesUnites initialisé avec surveillance navigation renforcée');
    
    // Charger le manifest des enregistrements audio si disponible
    loadAudioManifest();
  }, []);

  // Effet pour gérer les changements de visibilité de la page et navigation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      console.log('Navigation détectée (popstate) - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    const handlePageHide = () => {
      console.log('Page cachée (pagehide) - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    const handleUnload = () => {
      console.log('Page déchargée (unload) - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    // Navigation via historique du navigateur
    const handleHashChange = () => {
      console.log('Changement de hash détecté - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    // Focus/blur de la fenêtre (indicateur de navigation)
    const handleBlur = () => {
      console.log('Fenêtre blur détecté - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    const handleFocus = () => {
      console.log('Fenêtre focus détecté');
      // Pas d'arrêt sur focus, juste log
    };

    // Détection de changement d'URL (pour Next.js)
    const handleLocationChange = () => {
      console.log('Location change détecté - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    
    // Surveiller les changements d'URL
    let currentUrl = window.location.href;
    const urlCheckInterval = setInterval(() => {
      if (window.location.href !== currentUrl) {
        console.log('🌐 Changement d\'URL détecté - arrêt audio');
        currentUrl = window.location.href;
        stopAllVocalsAndAnimations();
      }
    }, 100);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      clearInterval(urlCheckInterval);
      console.log('🧹 Nettoyage des event listeners de navigation');
      // Arrêt final au démontage du composant
      stopAllVocalsAndAnimations();
    };
  }, []);

  // Effet pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);



  // Effet pour arrêter l'audio lors de la navigation (bouton back)
  useEffect(() => {
    // Écouter les clics sur les liens de navigation
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        console.log('🔗 Clic sur lien détecté - arrêt audio');
        stopAllVocalsAndAnimations();
      }
    };

    // Écouter les changements d'URL via pushState/replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      console.log('📍 history.pushState détecté - arrêt audio');
      stopAllVocalsAndAnimations();
      return originalPushState.apply(history, args);
    };

    history.replaceState = function(...args) {
      console.log('📍 history.replaceState détecté - arrêt audio');
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(history, args);
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
      // Restaurer les méthodes originales
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Nouvelle fonction pour gérer la soumission de réponse - Dizaines/Unités
  const handleAnswerSubmit = async (answer: string) => {
    if (!answer.trim() || answer.split(',').length !== 2) return;
    
    stopAllVocalsAndAnimations(); // Stop any ongoing audio first
    
    const [dizainesStr, unitesStr] = answer.split(',');
    const dizaines = parseInt(dizainesStr.trim());
    const unites = parseInt(unitesStr.trim());
    
    const exercise = exercises[currentExercise];
    const correct = (dizaines === exercise.correctDizaines && unites === exercise.correctUnites);
    
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
      
      // Passage automatique direct sans attendre Sam (évite les conflits avec stopAllVocalsAndAnimations)
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          // Prochain exercice
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          // Dernier exercice terminé
          setFinalScore(score + 1);
          setShowCompletionModal(true);
          saveProgress(score + 1, exercises.length);
        }
      }, 1500);
      
      // Célébrer avec Sam le Pirate (mais sans bloquer le passage automatique)
      celebrateCorrectAnswer(); // Pas de await pour éviter les blocages
    } else if (!correct) {
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
    
    // Reset du mini-jeu
    setRevealedAnswers(new Set());
  };

  // JSX pour le bouton "Écouter l'énoncé"
  const ListenQuestionButtonJSX = () => (
    <button
      id="listen-question-button"
      onClick={startExerciseExplanation}
      disabled={isPlayingVocal}
      className={`px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all shadow-lg ${
        highlightedElement === 'listen-question-button'
          ? 'bg-yellow-400 text-black ring-8 ring-yellow-300 animate-bounce scale-125 shadow-2xl border-4 border-orange-500'
          : isPlayingVocal
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : exerciseStarted
              ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-xl hover:scale-105'
              : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-xl hover:scale-105'
      } disabled:opacity-50`}
    >
      {isPlayingVocal ? '🎤 Énoncé en cours...' : exerciseStarted ? '🔄 Réécouter l\'énoncé' : '🎤 Écouter l\'énoncé'}
    </button>
  );

  // JSX pour l'introduction de Sam le Pirate dans les exercices
  const SamPirateIntroJSX = () => (
    <div className="flex justify-center p-1 mt-2">
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
              : 'bg-gradient-to-r from-purple-500 via-red-500 to-pink-500 text-white hover:from-purple-600 hover:via-red-600 hover:to-pink-600 hover:scale-110 shadow-2xl hover:shadow-3xl animate-pulse border-4 border-yellow-300'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Animation CSS personnalisée pour les icônes */}
      <style dangerouslySetInnerHTML={{
        __html: `
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
        `
      }} />
      
      {/* Bouton STOP flottant - apparaît quand Sam parle OU pendant les animations */}
      {(isPlayingVocal || animatingDecomposition || animatingExample || animatingCircles || highlightedElement) && (
        <button
          onClick={stopAllVocalsAndAnimations}
          className="fixed top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse"
          title="🛑 Arrêter Sam le Pirate et les animations"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h12v12H6z"/>
          </svg>
        </button>
      )}
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-nombres-jusqu-20" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            onClick={stopAllVocalsAndAnimations}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-2 sm:p-4 shadow-lg text-center">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              🔢 Dizaines et unités
            </h1>
            <p className="text-lg text-gray-600 hidden sm:block">
              Apprends à décomposer les nombres en dizaines et unités !
            </p>
          </div>
        </div>





        {/* Navigation entre cours et exercices - MOBILE OPTIMISÉE */}
        <div className="flex justify-center mb-3 sm:mb-2">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                if (!isPlayingVocal) {
                  stopAllVocalsAndAnimations();
                  setShowExercises(false);
                }
              }}
              disabled={isPlayingVocal}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                isPlayingVocal
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : !showExercises 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                if (!isPlayingVocal) {
                  stopAllVocalsAndAnimations();
                  setShowExercises(true);
                }
              }}
              disabled={isPlayingVocal}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                isPlayingVocal
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : showExercises 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS - MOBILE OPTIMISÉ */
          <div className="space-y-3 sm:space-y-6">
            {/* Image de Sam le Pirate avec bouton DÉMARRER */}
            <div className="flex items-center justify-center gap-4 p-4 mb-6">
                {/* Image de Sam le Pirate */}
              <div className={`relative transition-all duration-500 border-2 border-blue-300 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 ${
                isPlayingVocal
                  ? 'w-20 sm:w-24 h-20 sm:h-24' // When speaking - agrandi mobile
                  : samSizeExpanded
                    ? 'w-16 sm:w-32 h-16 sm:h-32' // Enlarged - agrandi mobile
                    : 'w-16 sm:w-20 h-16 sm:h-20' // Initial - agrandi mobile
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
                
              {/* Bouton Démarrer */}
              <div className="text-center">
                <button
                onClick={explainChapter}
                  disabled={isPlayingVocal}
                  className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 sm:px-12 py-3 sm:py-6 rounded-xl font-bold text-base sm:text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                }`}
              >
                  <Play className="inline w-5 h-5 sm:w-8 sm:h-8 mr-2 sm:mr-4" />
                  {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                </button>
            </div>
              </div>

            {/* Qu'est-ce que les dizaines et unités ? */}
            <div 
              id="example-section"
              className={`bg-white rounded-xl p-3 sm:p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'example-section' ? 'ring-4 ring-blue-400 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  🤔 Qu'est-ce que les dizaines et unités ?
                </h2>
                {/* Bouton d'animation à côté du titre */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-purple-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-purple-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                     title="🎬 Animation des dizaines et unités ! Cliquez pour voir l'explication animée."
                     onClick={async () => {
                       if (!isPlayingVocal) {
                         stopAllVocalsAndAnimations();
                         await new Promise(resolve => setTimeout(resolve, 100));
                         
                         stopSignalRef.current = false;
                         setIsPlayingVocal(true);
                         setHighlightedElement('example-section');
                         setAnimatingExample(true);
                         
                         try {
                           await playAudio("Regardez bien ! Je vais vous expliquer les dizaines et unités avec le nombre 15 !");
                           if (stopSignalRef.current) return;
                           await wait(1000);
                           
                           setHighlightDigit('left');
                           await playAudio("Le chiffre de gauche, le 1, représente les dizaines !");
                           if (stopSignalRef.current) return;
                           await wait(1500);
                           
                           setAnimatingCircles('dizaines');
                           await playAudio("Une dizaine, c'est un groupe de 10 objets !");
                           if (stopSignalRef.current) return;
                           await wait(1500);
                           
                           setHighlightDigit('right');
                           setAnimatingCircles('unites');
                           await playAudio("Le chiffre de droite, le 5, représente les unités !");
                           if (stopSignalRef.current) return;
                           await wait(1500);
                           
                           setHighlightDigit(null);
                           setAnimatingCircles('all');
                           await playAudio("Donc 15 égale 1 dizaine plus 5 unités !");
                           if (stopSignalRef.current) return;
                           await wait(1500);
                           
                         } catch (error) {
                           console.error('Erreur animation titre:', error);
                         } finally {
                           setIsPlayingVocal(false);
                           setHighlightedElement(null);
                           setAnimatingExample(false);
                           setHighlightDigit(null);
                           setAnimatingCircles(null);
                         }
                       }
                     }}
                >
                  🎬
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                <p className="text-sm sm:text-lg text-center text-purple-800 font-semibold mb-2 sm:mb-4">
                  Chaque nombre a des dizaines (groupes de 10) et des unités (ce qui reste) !
                </p>
                
                <div className="bg-white rounded-lg p-2 sm:p-4">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-purple-600 mb-2 sm:mb-4">
                      Exemple avec le nombre :
                </div>
                    
                    {/* Affichage animé du nombre 15 */}
                    <div className="flex justify-center items-center mb-3 sm:mb-6">
                      <div className={`text-5xl sm:text-8xl font-bold transition-all duration-700 ${
                        highlightDigit === 'left' ? 'text-blue-500 scale-125 animate-bounce' : 
                        animatingExample ? 'text-purple-600' : 'text-gray-600'
                      }`}>
                        1
                      </div>
                      <div className={`text-5xl sm:text-8xl font-bold transition-all duration-700 ${
                        highlightDigit === 'right' ? 'text-red-500 scale-125 animate-bounce' : 
                        animatingExample ? 'text-purple-600' : 'text-gray-600'
                      }`}>
                        5
              </div>
            </div>

                    {/* Explications positionnelles */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4">
                      <div className={`p-2 sm:p-3 rounded-lg transition-all duration-500 ${
                        highlightDigit === 'left' ? 'bg-blue-200 ring-4 ring-blue-400' : 'bg-blue-50'
                      }`}>
                        <div className="text-xs sm:text-sm text-blue-800 font-bold">↑ Chiffre de GAUCHE</div>
                        <div className="text-xs sm:text-sm text-blue-600">= DIZAINES</div>
                      </div>
                      <div className={`p-2 sm:p-3 rounded-lg transition-all duration-500 ${
                        highlightDigit === 'right' ? 'bg-red-200 ring-4 ring-red-400' : 'bg-red-50'
                      }`}>
                        <div className="text-xs sm:text-sm text-red-800 font-bold">↑ Chiffre de DROITE</div>
                        <div className="text-xs sm:text-sm text-red-600">= UNITÉS</div>
                      </div>
                    </div>
                    
                    {/* Représentation réaliste */}
                    <div className="flex justify-center gap-2 sm:gap-4 mb-2 sm:mb-4 flex-wrap">
                      {/* Dizaine = groupe de 10 */}
                      <div className={`transition-all duration-700 ${
                        animatingCircles === 'dizaines' || animatingCircles === 'all' ? 
                        'scale-110 ring-4 ring-blue-400' : ''
                      }`}>
                        <div className="grid grid-cols-5 gap-1 p-2 sm:p-3 rounded-lg border-2 border-blue-400 bg-blue-100">
                          {Array.from({ length: 10 }, (_, i) => (
                            <div
                              key={i}
                              className="w-3 sm:w-5 h-3 sm:h-5 rounded-full bg-blue-600"
                            />
                          ))}
                          <div className="col-span-5 text-center text-xs sm:text-sm font-bold text-blue-700 mt-1 sm:mt-2">
                            1 dizaine = 10
                          </div>
                        </div>
                      </div>
                      
                      {/* Unités individuelles */}
                      <div className={`flex gap-1 items-center transition-all duration-700 ${
                        animatingCircles === 'unites' || animatingCircles === 'all' ? 
                        'scale-125 ring-4 ring-red-300 rounded-lg p-1 sm:p-2' : ''
                      }`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className="w-4 sm:w-6 h-4 sm:h-6 rounded-full bg-red-600"
                          />
                        ))}
                        <div className="ml-1 sm:ml-2 text-xs sm:text-sm font-bold text-red-700">
                          5 unités
                        </div>
                      </div>
                </div>
                
                    <div className="text-base sm:text-xl font-bold text-gray-700">
                      1 dizaine + 5 unités = 15
                    </div>
                  </div>
                </div>
              </div>
                </div>
                
            {/* Comprendre avec les objets */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-3 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  🎯 Comprendre avec des objets
                </h2>
                {/* Bouton d'animation pour les objets */}
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-orange-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-orange-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                     title="🎯 Animation des objets ! Cliquez pour voir les groupes de 10 s'animer."
                     onClick={async () => {
                       if (!isPlayingVocal) {
                         stopAllVocalsAndAnimations();
                         await new Promise(resolve => setTimeout(resolve, 100));
                         
                         stopSignalRef.current = false;
                         setIsPlayingVocal(true);
                         
                         try {
                           await playAudio("Regardez ! Une dizaine, c'est toujours 10 objets groupés ensemble !");
                           if (stopSignalRef.current) return;
                           await wait(1500);
                           
                           await playAudio("Et les unités, ce sont les objets tout seuls, pas dans un groupe !");
                           if (stopSignalRef.current) return;
                           await wait(1500);
                           
                           await playAudio("C'est comme ça qu'on comprend tous les nombres !");
                           if (stopSignalRef.current) return;
                           await wait(1000);
                           
                         } catch (error) {
                           console.error('Erreur animation objets:', error);
                         } finally {
                           setIsPlayingVocal(false);
                         }
                       }
                     }}
                >
                  🎯
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">
                    🔵 Une dizaine = 10 unités groupées
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="grid grid-cols-5 gap-1 justify-center mb-2">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full bg-red-600"
                          />
                        ))}
                              </div>
                      <div className="text-lg font-bold">10 unités = 1 dizaine</div>
                      <div className="text-lg">⬇️</div>
                      <div className="border-2 border-blue-400 rounded p-2 bg-blue-100 inline-block">
                        <div className="grid grid-cols-5 gap-1">
                          {Array.from({ length: 10 }, (_, i) => (
                            <div
                              key={i}
                                                             className="w-3 h-3 rounded-full bg-blue-600"
                            />
                          ))}
                        </div>
                        <div className="text-xs text-blue-700 font-bold mt-1">1 dizaine</div>
                      </div>
                    </div>
                            </div>
                          </div>
                        
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-800">
                    🔴 Les unités = objets individuels
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold mb-2">Dans 13 :</div>
                      <div className="flex justify-center gap-2 mb-2">
                        {/* 1 dizaine */}
                        <div className="border-2 border-blue-400 rounded p-1 bg-blue-100">
                          <div className="grid grid-cols-5 gap-1">
                            {Array.from({ length: 10 }, (_, i) => (
                              <div
                                key={i}
                                                                 className="w-2 h-2 rounded-full bg-blue-600"
                              />
                            ))}
                                  </div>
                                  </div>
                        {/* 3 unités */}
                        {Array.from({ length: 3 }, (_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full bg-red-600"
                          />
                        ))}
                      </div>
                      <div className="text-lg">1 dizaine + 3 unités</div>
                    </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
            {/* Sélecteur de nombre */}
            <div 
              id="number-choice"
              className={`bg-white rounded-xl p-4 sm:p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'number-choice' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-3 mb-3 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  🎯 Choisis un nombre à analyser
                </h2>
                {/* Bouton d'animation pour le choix de nombre */}
                <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-green-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-green-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                     title="🔢 Animation du choix ! Cliquez pour une démonstration rapide."
                     onClick={async () => {
                       if (!isPlayingVocal) {
                         stopAllVocalsAndAnimations();
                         await new Promise(resolve => setTimeout(resolve, 100));
                         
                         stopSignalRef.current = false;
                         setIsPlayingVocal(true);
                         setHighlightedElement('number-choice');
                         
                         try {
                           await playAudio("Clique sur n'importe quel nombre et je te montrerai sa décomposition !");
                           if (stopSignalRef.current) return;
                           await wait(1500);
                           
                           await playAudio("Les nombres orange 7 et 8 sont spéciaux : ils n'ont que des unités !");
                           if (stopSignalRef.current) return;
                           await wait(2000);
                           
                           await playAudio("Les nombres gris ont des dizaines ET des unités !");
                           if (stopSignalRef.current) return;
                           await wait(1500);
                           
                         } catch (error) {
                           console.error('Erreur animation choix:', error);
                         } finally {
                           setIsPlayingVocal(false);
                           setHighlightedElement(null);
                         }
                       }
                     }}
                >
                  🔢
                </div>
              </div>
              
              <div className="grid grid-cols-6 gap-3 mb-6">
                {/* Nombres à 1 chiffre (exemples spéciaux) */}
                {[7, 8].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setSelectedNumber(num);
                      explainNumber(num);
                    }}
                    className={`p-3 rounded-lg font-bold text-xl transition-all border-2 border-orange-300 ${
                      selectedNumber === num
                        ? 'bg-orange-500 text-white shadow-lg scale-105'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                
                {/* Nombres à 2 chiffres */}
                {Array.from({ length: 10 }, (_, i) => i + 11).map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setSelectedNumber(num);
                      explainNumber(num);
                    }}
                    className={`p-3 rounded-lg font-bold text-xl transition-all ${
                      selectedNumber === num
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              
              {/* Légende pour expliquer les couleurs */}
              <div className="flex justify-center gap-6 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded"></div>
                  <span className="text-orange-700 font-semibold">Nombres à 1 chiffre (0 dizaine)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded"></div>
                  <span className="text-gray-700 font-semibold">Nombres à 2 chiffres</span>
                </div>
              </div>
                </div>

            {/* Affichage de l'analyse */}
            <div 
              id="number-analysis"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                animatingDecomposition ? 'ring-4 ring-orange-400 bg-orange-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Analyse de {selectedNumber}
              </h2>
              
              {(() => {
                const { dizaines, unites } = analyzeNumber(selectedNumber);
                const numberStr = selectedNumber.toString();
                return (
                  <div className="bg-indigo-50 rounded-lg p-6">
                    <div className="text-center space-y-6">
                      {/* Affichage du nombre avec position des chiffres */}
                      <div className="flex justify-center items-center mb-6">
                        {numberStr.length === 2 ? (
                          <>
                            <div className="text-6xl font-bold text-blue-500 mr-2">
                              {numberStr[0]}
                            </div>
                            <div className="text-6xl font-bold text-red-500">
                              {numberStr[1]}
                            </div>
                          </>
                        ) : (
                          <div className="text-6xl font-bold text-red-500">
                            {numberStr[0]}
                          </div>
                        )}
                      </div>

                      {numberStr.length === 2 ? (
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-blue-100 rounded-lg p-3">
                            <div className="text-blue-800 font-bold">↑ GAUCHE = DIZAINES</div>
                            <div className="text-3xl font-bold text-blue-600">{numberStr[0]}</div>
                          </div>
                          <div className="bg-red-100 rounded-lg p-3">
                            <div className="text-red-800 font-bold">↑ DROITE = UNITÉS</div>
                            <div className="text-3xl font-bold text-red-600">{numberStr[1]}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-blue-100 rounded-lg p-3 opacity-50">
                            <div className="text-blue-800 font-bold">DIZAINES</div>
                            <div className="text-3xl font-bold text-blue-600">0</div>
                            <div className="text-xs text-blue-600">Aucune dizaine</div>
                          </div>
                          <div className="bg-red-100 rounded-lg p-3 ring-4 ring-red-300">
                            <div className="text-red-800 font-bold">UNITÉS</div>
                            <div className="text-3xl font-bold text-red-600">{numberStr[0]}</div>
                            <div className="text-xs text-red-600">Le chiffre unique</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-2xl font-bold text-indigo-600 mb-4">
                        {selectedNumber} = {dizaines} dizaine{dizaines > 1 ? 's' : ''} + {unites} unité{unites > 1 ? 's' : ''}
                  </div>
                  
                      <div className="bg-white rounded-lg p-6">
                        <div className="flex justify-center gap-4 mb-6 flex-wrap items-center">
                          {renderCircles(dizaines, unites)}
                  </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                          <div className={`bg-blue-100 rounded-lg p-4 transition-all duration-700 ${
                            animatingCircles === 'dizaines' || animatingCircles === 'all' ? 
                            'ring-4 ring-blue-400 bg-blue-200' : ''
                          }`}>
                            <div className="font-bold text-blue-800">Dizaines :</div>
                            <div className="flex justify-center gap-1 my-2">
                              {Array.from({ length: dizaines }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-6 h-6 rounded-full bg-blue-600 transition-all duration-700 ${
                                    animatingDecomposition && (animatingCircles === 'dizaines' || animatingCircles === 'all') ? 
                                    'scale-125 ring-2 ring-blue-300 animate-pulse' : 
                                    animatingDecomposition ? 'scale-110 ring-2 ring-blue-300' : ''
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="font-bold text-blue-800">{dizaines} × 10 = {dizaines * 10}</div>
                </div>

                          <div className={`bg-red-100 rounded-lg p-4 transition-all duration-700 ${
                            animatingCircles === 'unites' || animatingCircles === 'all' ? 
                            'ring-4 ring-red-400 bg-red-200' : ''
                          }`}>
                            <div className="font-bold text-red-800">Unités :</div>
                            <div className="flex justify-center gap-1 my-2">
                              {Array.from({ length: unites }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-6 h-6 rounded-full bg-red-600 transition-all duration-700 ${
                                    animatingDecomposition && (animatingCircles === 'unites' || animatingCircles === 'all') ? 
                                    'scale-125 ring-2 ring-red-300 animate-pulse' : 
                                    animatingDecomposition ? 'scale-110 ring-2 ring-red-300' : ''
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="font-bold text-red-800">{unites} × 1 = {unites}</div>
                        </div>
                      </div>
                        
                        <div className={`mt-6 text-2xl font-bold transition-all duration-700 ${
                          animatingCircles === 'all' ? 'text-purple-600 scale-110' : 'text-gray-700'
                        }`}>
                          {dizaines * 10} + {unites} = {selectedNumber}
                    </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
                  </div>
                  


            {/* Conseils */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-3 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  💡 Trucs pour retenir
                </h2>
                {/* Bouton d'animation pour les conseils */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-yellow-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-yellow-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                     title="💡 Animation des conseils ! Cliquez pour entendre les astuces."
                     onClick={async () => {
                       if (!isPlayingVocal) {
                         stopAllVocalsAndAnimations();
                         await new Promise(resolve => setTimeout(resolve, 100));
                         
                         stopSignalRef.current = false;
                         setIsPlayingVocal(true);
                         
                         try {
                           await playAudio("Voici mes conseils de pirate pour retenir les dizaines et unités !");
                           if (stopSignalRef.current) return;
                           await wait(1500);
                           
                           await playAudio("Pour les dizaines : compte par groupes de 10, comme tes 10 doigts !");
                           if (stopSignalRef.current) return;
                           await wait(2000);
                           
                           await playAudio("Pour les unités : ce qui reste après avoir fait les groupes de 10 !");
                           if (stopSignalRef.current) return;
                           await wait(2000);
                           
                           await playAudio("Retiens bien : chiffre de gauche égale dizaines, chiffre de droite égale unités !");
                           if (stopSignalRef.current) return;
                           await wait(2000);
                           
                           await playAudio("Avec ça, tu vas devenir un expert des nombres, matelot !");
                           if (stopSignalRef.current) return;
                           await wait(1500);
                           
                         } catch (error) {
                           console.error('Erreur animation conseils:', error);
                         } finally {
                           setIsPlayingVocal(false);
                         }
                       }
                     }}
                >
                  💡
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">
                    🔵 Pour les dizaines
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Compte par groupes de 10</li>
                    <li>• Utilise tes 10 doigts</li>
                    <li>• 1 dizaine = 10 unités</li>
                    <li>• Regarde le chiffre de gauche</li>
              </ul>
            </div>
                
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-800">
                    🔴 Pour les unités
                  </h3>
                  <ul className="space-y-2 text-red-700">
                    <li>• Ce qui reste après les dizaines</li>
                    <li>• Toujours moins de 10</li>
                    <li>• Regarde le chiffre de droite</li>
                    <li>• Compte un par un</li>
                  </ul>
          </div>
                </div>
              </div>

            {/* Mini-jeu */}
            <div className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">🎮 Mini-jeu : Trouve les dizaines et unités !</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { number: '7', answer: '0 dizaine + 7 unités' },
                  { number: '8', answer: '0 dizaine + 8 unités' },
                  { number: '14', answer: '1 dizaine + 4 unités' },
                  { number: '18', answer: '1 dizaine + 8 unités' },
                  { number: '20', answer: '2 dizaines + 0 unité' },
                  { number: '16', answer: '1 dizaine + 6 unités' }
                ].map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                    <div className="font-bold mb-2">{item.number} = ?</div>
                    {revealedAnswers.has(index) ? (
                      <div className="text-sm font-bold text-yellow-200">{item.answer}</div>
                    ) : (
                      <button
                        onClick={() => {
                          setRevealedAnswers(prev => {
                            const newSet = new Set(prev);
                            newSet.add(index);
                            return newSet;
                          });
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-purple-900 px-3 py-1 rounded-lg text-sm font-bold transition-all hover:scale-105"
                      >
                        👁️ Voir la réponse
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Bouton pour révéler toutes les réponses */}
              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setRevealedAnswers(new Set([0, 1, 2, 3, 4, 5]));
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-purple-900 px-6 py-2 rounded-lg font-bold transition-all hover:scale-105"
                >
                  🎯 Révéler toutes les réponses
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES - RESPONSIVE MOBILE OPTIMISÉ (HISTORIQUE) */
          <div className="space-y-6">
            {/* Introduction de Sam le Pirate - toujours visible */}
            {SamPirateIntroJSX()}

            {/* Header exercices - caché sur mobile */}
            <div className="bg-white rounded-xl p-2 shadow-lg mt-8 hidden sm:block">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-bold text-gray-900">
                  Exercice {currentExercise + 1}
                </h2>
                
                <div className="text-sm font-bold text-purple-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
            </div>

            {/* Indicateur de progression mobile - sticky sur la page */}
            <div className="sticky top-0 bg-white z-10 px-3 py-2 border-b border-gray-200 sm:hidden mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-700">Exercice {currentExercise + 1}/{exercises.length}</span>
                <span className="font-bold text-purple-600">Score : {score}/{exercises.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question - LAYOUT NORMAL AVEC SCROLL DE PAGE */}
            <div className="bg-white rounded-xl shadow-lg text-center p-4 sm:p-6 md:p-8 mt-4 sm:mt-8">
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 sm:mb-6 md:mb-8 gap-4">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 flex-1">
                  {exercises[currentExercise]?.question || "Décompose en dizaines et unités"}
                </h3>
                {ListenQuestionButtonJSX()}
              </div>
              
              {/* Affichage du nombre avec explication si erreur */}
              <div className={`bg-white border-2 rounded-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 transition-all duration-500 ${
                isExplainingError ? 'border-yellow-400 bg-yellow-50 ring-4 ring-yellow-300' : 'border-purple-200'
              }`}>
                <div className="py-6 sm:py-8 md:py-10">
                  {/* Affichage du nombre avec animation positionnelle */}
                  <div className="mb-4">
                    {(() => {
                      const numberStr = exercises[currentExercise]?.number.toString() || "";
                      if (numberStr.length === 2) {
                        return (
                          <div className="flex justify-center items-center gap-2">
                            {/* Chiffre de gauche (dizaines) */}
                            <div className={`text-6xl sm:text-8xl font-bold transition-all duration-500 ${
                              highlightDigit === 'left' 
                                ? 'text-blue-600 bg-blue-100 ring-4 ring-blue-400 rounded-lg px-4 py-2 scale-110 shadow-lg' 
                                : 'text-purple-600'
                            }`}>
                              {numberStr[0]}
                            </div>
                            {/* Chiffre de droite (unités) */}
                            <div className={`text-6xl sm:text-8xl font-bold transition-all duration-500 ${
                              highlightDigit === 'right' 
                                ? 'text-red-600 bg-red-100 ring-4 ring-red-400 rounded-lg px-4 py-2 scale-110 shadow-lg' 
                                : 'text-purple-600'
                            }`}>
                              {numberStr[1]}
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-6xl sm:text-8xl font-bold text-purple-600">
                            {exercises[currentExercise]?.number}
                          </div>
                        );
                      }
                    })()}
                    
                    {/* Étiquettes d'explication pendant l'animation */}
                    {highlightDigit && (
                      <div className="flex justify-center mt-4">
                        <div className="grid grid-cols-2 gap-8 max-w-md">
                          <div className={`text-center transition-all duration-500 ${
                            highlightDigit === 'left' ? 'opacity-100' : 'opacity-30'
                          }`}>
                            <div className="text-blue-800 font-bold text-lg">↑ Chiffre de GAUCHE</div>
                            <div className="text-blue-600 font-semibold">= DIZAINES</div>
                          </div>
                          <div className={`text-center transition-all duration-500 ${
                            highlightDigit === 'right' ? 'opacity-100' : 'opacity-30'
                          }`}>
                            <div className="text-red-800 font-bold text-lg">↑ Chiffre de DROITE</div>
                            <div className="text-red-600 font-semibold">= UNITÉS</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  

                  
                  <p className="text-sm sm:text-lg text-gray-700 font-semibold mb-6 hidden sm:block">
                    Décompose ce nombre en dizaines et unités !
                  </p>
                  
                  {/* Message d'explication avec la bonne réponse en rouge */}
                  {isExplainingError && (
                    <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 mb-4">
                      <div className="text-lg font-bold text-red-800 mb-2">
                        🏴‍☠️ Explication de Sam le Pirate
                      </div>
                      <div className="text-red-700 text-lg">
                        La bonne réponse est <span className="font-bold text-xl text-red-800">{exercises[currentExercise]?.correctDizaines} dizaines et {exercises[currentExercise]?.correctUnites} unités</span> !
                      </div>
                      <div className="text-sm text-red-600 mt-2">
                        Le nombre {exercises[currentExercise]?.number} se décompose en {exercises[currentExercise]?.correctDizaines} dizaines et {exercises[currentExercise]?.correctUnites} unités !
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Champs de réponse - Dizaines et Unités */}
              <div className="mb-8 sm:mb-12">
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className={`transition-all duration-500 ${
                    highlightedElement === 'answer-input' ? 'ring-8 ring-yellow-400 bg-yellow-100 rounded-lg p-4 scale-110 shadow-2xl animate-pulse' : ''
                  }`}>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Dizaines</label>
                    <input
                      id="dizaines-input"
                      type="number"
                      value={userAnswer.split(',')[0] || ''}
                      onChange={(e) => {
                        const unites = userAnswer.split(',')[1] || '';
                        setUserAnswer(e.target.value + ',' + unites);
                      }}
                      onClick={() => stopAllVocalsAndAnimations()}
                      disabled={isCorrect !== null || isPlayingVocal}
                      className="w-full px-4 py-3 text-xl font-bold text-center border-4 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="?"
                      min="0"
                      max="2"
                    />
                  </div>
                  
                  <div className={`transition-all duration-500 ${
                    highlightedElement === 'answer-input' ? 'ring-8 ring-yellow-400 bg-yellow-100 rounded-lg p-4 scale-110 shadow-2xl animate-pulse' : ''
                  }`}>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Unités</label>
                    <input
                      id="unites-input"
                      type="number"
                      value={userAnswer.split(',')[1] || ''}
                      onChange={(e) => {
                        const dizaines = userAnswer.split(',')[0] || '';
                        setUserAnswer(dizaines + ',' + e.target.value);
                      }}
                      onClick={() => stopAllVocalsAndAnimations()}
                      disabled={isCorrect !== null || isPlayingVocal}
                      className="w-full px-4 py-3 text-xl font-bold text-center border-4 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="?"
                      min="0"
                      max="9"
                    />
                  </div>
                </div>
              </div>
              
              {/* Boutons Valider et Suivant */}
              <div className="flex gap-4 justify-center mt-6">
                <button
                  id="validate-button"
                  onClick={() => handleAnswerSubmit(userAnswer)}
                  disabled={!userAnswer.trim() || userAnswer.split(',').length !== 2 || isCorrect !== null || isPlayingVocal}
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
                      Bravo ! {exercises[currentExercise].number} = {exercises[currentExercise].correctDizaines} dizaines et {exercises[currentExercise].correctUnites} unités !
                    </span>
                  </div>
                </div>
              )}
              
              </div>
            </div>
          </div>
        )}

        {/* Modale de fin */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Expert des dizaines et unités !", message: "Tu maîtrises parfaitement !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux maîtriser !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-purple-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 12 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Comprendre les dizaines et unités est très important !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors"
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

        {/* Bouton flottant Sam pour arrêter les vocaux */}
        {isPlayingVocal && (
          <div className="fixed top-4 right-4 z-[60]">
            <button
              onClick={stopAllVocalsAndAnimations}
              className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
              title="Arrêter Sam"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50">
                <img 
                  src="/image/pirate-small.png" 
                  alt="Sam le Pirate" 
                  className="w-full h-full object-cover"
                />
              </div>
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