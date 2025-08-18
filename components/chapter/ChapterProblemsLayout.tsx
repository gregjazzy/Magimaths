'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Book, Target, CheckCircle, XCircle, Trophy, Star } from 'lucide-react';

// 🔧 Fonction pour formater les nombres de manière consistante
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Composant Spinner pour les loading states
const Spinner = ({ size = "w-4 h-4" }: { size?: string }) => (
  <div className={`${size} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
);

// Composant Animation sonore pour les états playing
const SoundWave = ({ size = "w-4 h-4" }: { size?: string }) => (
  <div className={`${size} flex items-center justify-center gap-0.5`}>
    <div className="w-0.5 h-3 bg-white animate-pulse"></div>
    <div className="w-0.5 h-4 bg-white animate-pulse" style={{ animationDelay: '0.1s' }}></div>
    <div className="w-0.5 h-2 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-0.5 h-4 bg-white animate-pulse" style={{ animationDelay: '0.3s' }}></div>
  </div>
);

interface ProblemExample {
  id: string;
  title: string;
  story: string;
  first: number;
  second: number;
  result: number;
  item: string;
  color1: string;
  color2: string;
}

interface Exercise {
  story: string;
  visual: string;
  answer: number;
}

interface ChapterProblemsLayoutProps {
  config: {
    id: string;
    title: string;
    description: string;
    level: string;
    theme?: {
      primary: string;
      secondary: string;
      accent: string;
      gradient: string;
      bgGradient: string;
      characterBg: string;
      boxBg: string;
      buttonColors: {
        course: string;
        exercises: string;
      };
      animationButtons: {
        gradient: string;
        ring: string;
      };
    };
    character?: {
      name: string;
      image: string;
      expressions?: string[];
    };
    backLink: string;
    backText: string;
    course: {
      introduction: {
        title: string;
        content: string;
      };
      method: {
        title: string;
        steps: Array<{
          number: number;
          title: string;
          description: string;
          color: string;
        }>;
      };
      demonstration: {
        title: string;
        example: {
          story: string;
          numbers: number[];
        };
      };
      examples: ProblemExample[];
    };
    exercises: Exercise[];
  };
}

export default function ChapterProblemsLayout({ 
  config, 
  customExamplesSection 
}: ChapterProblemsLayoutProps & { 
  customExamplesSection?: React.ReactNode; 
}) {
  // États pour la navigation et les animations
  const [showExercises, setShowExercises] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isLoadingVocal, setIsLoadingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedExamples, setHighlightedExamples] = useState<number[]>([]);


  // États pour les exercices
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showExerciseAnimation, setShowExerciseAnimation] = useState(false);
  const [exerciseAnimationStep, setExerciseAnimationStep] = useState<string | null>(null);
  const [exercisesHasStarted, setExercisesHasStarted] = useState(false);
  const [exercisesIsPlayingVocal, setExercisesIsPlayingVocal] = useState(false);
  const [exercisesIsLoadingVocal, setExercisesIsLoadingVocal] = useState(false);
  
  // États pour l'animation de correction
  const [showCorrectionAnimation, setShowCorrectionAnimation] = useState(false);
  const [correctionAnimationStep, setCorrectionAnimationStep] = useState(0);
  const [correctionNumber, setCorrectionNumber] = useState<number | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);
  
  // 💾 LocalStorage - Sauvegarde progression
  const [progressData, setProgressData] = useState({
    hasStartedCourse: false,
    hasStartedExercises: false,
    currentExample: 0,
    completedSteps: [] as string[],
    lastVisited: Date.now(),
    userAnswers: {} as Record<string, string>
  });

  // 🏗️ Extraction hiérarchie depuis l'URL
  const extractHierarchy = () => {
    if (typeof window === 'undefined') return null;
    
    const pathname = window.location.pathname;
    const parts = pathname.split('/').filter(Boolean);
    
    if (parts[0] !== 'chapitre') return null;
    
    const fullPath = parts[1] || '';
    const levelMatch = fullPath.match(/^(cp|ce1|ce2|cm1|cm2|6eme|5eme|4eme|3eme|2nde|1ere|terminale)/);
    
    return {
      level: levelMatch ? levelMatch[1] : null,
      theme: parts[1] || null,
      chapter: parts[2] || null,
      subChapter: parts[3] || null,
      fullPath: pathname
    };
  };

  // 🔢 Score animé
  const [animatedScore, setAnimatedScore] = useState(0);
  



  
  // États pour l'addition posée 
  const [calculationStep, setCalculationStep] = useState<'setup' | 'units' | 'carry' | 'tens' | 'hundreds' | 'result' | null>(null);
  const [showingCarry, setShowingCarry] = useState(false);
  const [partialResults, setPartialResults] = useState<{units: string | null, tens: string | null, hundreds: string | null}>({units: null, tens: null, hundreds: null});
  
  // États pour le personnage
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [highlightCourseButton, setHighlightCourseButton] = useState(false);
  const [highlightExerciseButton, setHighlightExerciseButton] = useState(false);
  const [isCharacterCelebrating, setIsCharacterCelebrating] = useState(false);

  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Refs pour les sections
  const introSectionRef = useRef<HTMLDivElement>(null);
  const methodSectionRef = useRef<HTMLDivElement>(null);
  const examplesSectionRef = useRef<HTMLDivElement>(null);
  const exerciseTabRef = useRef<HTMLButtonElement>(null);

  // 💾 Fonctions LocalStorage
  const saveProgress = (updates: Partial<typeof progressData>) => {
    const newProgress = { ...progressData, ...updates, lastVisited: Date.now() };
    setProgressData(newProgress);
    localStorage.setItem(`chapter-progress-${config.id}`, JSON.stringify(newProgress));
  };

  // 🏗️ Sauvegarde XP hiérarchique
  const saveXpHierarchy = (finalScore: number, totalExercises: number) => {
    const hierarchy = extractHierarchy();
    if (!hierarchy || !hierarchy.level) return;

    const xpEarned = Math.round((finalScore / totalExercises) * 1000);
    const maxXp = 1000;

    try {
      // Récupérer la structure XP existante
      const existingXp = JSON.parse(localStorage.getItem('xp-hierarchy') || '{}');
      
      // Construire le chemin hiérarchique
      const levelData = existingXp[hierarchy.level] || {};
      const themeData = levelData[hierarchy.theme || ''] || {};
      
      // Sauvegarder au niveau le plus profond
      if (hierarchy.subChapter) {
        // 4 niveaux : level/theme/chapter/subChapter
        const chapterData = themeData[hierarchy.chapter || ''] || {};
        chapterData[hierarchy.subChapter] = { xp: xpEarned, maxXp, completed: finalScore === totalExercises };
        themeData[hierarchy.chapter || ''] = chapterData;
      } else if (hierarchy.chapter) {
        // 3 niveaux : level/theme/chapter
        themeData[hierarchy.chapter] = { xp: xpEarned, maxXp, completed: finalScore === totalExercises };
      } else {
        // 2 niveaux : level/theme
        levelData[hierarchy.theme || ''] = { xp: xpEarned, maxXp, completed: finalScore === totalExercises };
      }

      levelData[hierarchy.theme || ''] = themeData;
      existingXp[hierarchy.level] = levelData;

      // Calculer les XP agrégés pour les niveaux supérieurs
      calculateAggregatedXp(existingXp, hierarchy);

      localStorage.setItem('xp-hierarchy', JSON.stringify(existingXp));
      
      console.log('🎯 XP sauvegardé:', {
        hierarchy,
        xpEarned,
        finalScore,
        totalExercises
      });
    } catch (error) {
      console.error('Erreur sauvegarde XP hiérarchique:', error);
    }
  };

  // 📊 Calcul XP agrégés
  const calculateAggregatedXp = (xpData: any, hierarchy: any) => {
    if (!hierarchy.level) return;

    const levelData = xpData[hierarchy.level];
    if (!levelData) return;

    // Calculer XP du thème (somme des chapitres)
    if (hierarchy.theme && levelData[hierarchy.theme]) {
      const themeData = levelData[hierarchy.theme];
      let themeXp = 0;
      let themeMaxXp = 0;

      Object.values(themeData).forEach((item: any) => {
        if (typeof item === 'object' && item.xp !== undefined) {
          themeXp += item.xp || 0;
          themeMaxXp += item.maxXp || 0;
        } else if (typeof item === 'object') {
          // Niveau chapitre avec sous-chapitres
          Object.values(item).forEach((subItem: any) => {
            if (typeof subItem === 'object' && subItem.xp !== undefined) {
              themeXp += subItem.xp || 0;
              themeMaxXp += subItem.maxXp || 0;
            }
          });
        }
      });

      // Sauvegarder les totaux du thème
      levelData[`${hierarchy.theme}_total`] = { xp: themeXp, maxXp: themeMaxXp };
    }

    // Calculer XP du niveau (somme des thèmes)
    let levelXp = 0;
    let levelMaxXp = 0;
    Object.entries(levelData).forEach(([key, value]: [string, any]) => {
      if (key.endsWith('_total') && typeof value === 'object') {
        levelXp += value.xp || 0;
        levelMaxXp += value.maxXp || 0;
      }
    });

    xpData[`${hierarchy.level}_total`] = { xp: levelXp, maxXp: levelMaxXp };
  };

  const loadProgress = () => {
    try {
      const saved = localStorage.getItem(`chapter-progress-${config.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProgressData(parsed);
        
        // Restaurer les états depuis la sauvegarde
        if (parsed.hasStartedCourse) setHasStarted(true);
        if (parsed.hasStartedExercises) setExercisesHasStarted(true);
        if (parsed.currentExample !== undefined) setCurrentExample(parsed.currentExample);
        // Ne pas restaurer les réponses utilisateur pour garder la zone de saisie vide
        // Les réponses sont sauvegardées mais pas restaurées pour une meilleure UX
      }
    } catch (error) {
      console.warn('Erreur lors du chargement de la progression:', error);
    }
  };



  // 🔢 Animation progressive du score
  const animateScore = (newScore: number) => {
    const startScore = animatedScore;
    const duration = 800; // 800ms
    const startTime = Date.now();
    
    const updateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.round(startScore + (newScore - startScore) * easeOut);
      
      setAnimatedScore(currentScore);
      
      if (progress < 1) {
        requestAnimationFrame(updateScore);
      }
    };
    
    requestAnimationFrame(updateScore);
  };

  // 💾 Charger la progression au montage du composant
  useEffect(() => {
    loadProgress();
  }, []);

  // 🔢 Animer le score quand il change
  useEffect(() => {
    if (score !== animatedScore) {
      animateScore(score);
    }
  }, [score]);

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    // Arrêter complètement la synthèse vocale
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      console.log('🔇 speechSynthesis.cancel() appelé');
    }
    
    // Réinitialiser les états d'animation
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setHighlightedExamples([]);
    setHighlightCourseButton(false);
    setHighlightExerciseButton(false);
    
    // Réinitialiser les états
    setIsPlayingVocal(false);
    setIsLoadingVocal(false);
    setExercisesIsPlayingVocal(false);
    setExercisesIsLoadingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setHighlightedExamples([]);

    setShowExerciseAnimation(false);
    setExerciseAnimationStep(null);
    setCalculationStep(null);
    setShowingCarry(false);
    setPartialResults({units: null, tens: null, hundreds: null});
    
    // Réinitialiser les états de correction
    setShowCorrectionAnimation(false);
    setCorrectionAnimationStep(0);
    setCorrectionNumber(null);
    setShowNextButton(false);
    
    // Réinitialiser les surbrillances des boutons
    setHighlightCourseButton(false);
    setHighlightExerciseButton(false);
    
    console.log('✅ Tous les états réinitialisés');
  };

  

  // Fonction pour jouer l'audio avec voix féminine française
  const playAudio = async (text: string, slowMode = false) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      // Arrêter toute synthèse en cours
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      currentAudioRef.current = utterance;
      
      // Configuration de la voix
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.7 : 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;

      // Essayer de sélectionner une voix française féminine
      const voices = speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => 
        voice.lang.startsWith('fr') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => voice.lang.startsWith('fr'));
      
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }

      utterance.onend = () => {
        currentAudioRef.current = null;
        resolve();
      };

      utterance.onerror = () => {
        currentAudioRef.current = null;
        resolve();
      };

      speechSynthesis.speak(utterance);
    });
  };

  // Fonction d'attente
  const wait = async (ms: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (stopSignalRef.current) {
          resolve();
          return;
        }
        resolve();
      }, ms);
    });
  };

  // Fonction pour scroller vers une section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  // Fonction pour animer un bouton d'exemple spécifique
  const animateExampleButton = async (number: number) => {
    console.log('🔧 animateExampleButton appelé avec:', number);
    
    const button = document.querySelector(`button[data-number="${number}"]`) as HTMLButtonElement;
    console.log('🔧 Bouton trouvé:', !!button);
    if (button) {
      console.log('🔧 Mise en évidence du bouton...');
      // Mettre en évidence le bouton
      button.style.cssText += `
        ring: 4px solid #facc15 !important;
        animation: pulse 1s ease-in-out infinite !important;
        transform: scale(1.1) !important;
        box-shadow: 0 0 20px rgba(250, 204, 21, 0.5) !important;
      `;
      
      await wait(1500);
      
      console.log('🔧 Clic automatique...');
      // Déclencher le clic automatiquement
      button.click();
      
      await wait(1000);
      
      console.log('🔧 Nettoyage des styles...');
      // Nettoyer les styles
      button.style.cssText = button.style.cssText.replace(/ring:.*?!important;|animation:.*?!important;|transform:.*?!important;|box-shadow:.*?!important;/g, '');
    } else {
      console.log('🔧 Aucun bouton trouvé avec data-number="' + number + '"');
      // Lister tous les boutons disponibles
      const allButtons = document.querySelectorAll('button[data-number]');
      console.log('🔧 Boutons disponibles:', Array.from(allButtons).map(b => b.getAttribute('data-number')));
    }
  };

  // Fonction pour expliquer le chapitre avec le personnage
  const explainChapterWithSam = async () => {
    if (isPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);
    setSamSizeExpanded(true);
    setHighlightCourseButton(true);
    
    try {
      // Introduction et objectif
      const welcomeText = config.character?.expressions?.[0] 
        ? `${config.character.expressions[0]} ! Bienvenue dans l'aventure des ${config.title.toLowerCase()} !`
        : `Bienvenue dans l'aventure des ${config.title.toLowerCase()} !`;
      
      await playAudio(welcomeText);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await playAudio("Aujourd'hui, tu vas apprendre à être un vrai détective des nombres !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      if (stopSignalRef.current) return;
      
      // Présentation de l'introduction
      await playAudio(`D'abord, nous allons voir ${config.course.introduction.title.toLowerCase()}...`);
      if (stopSignalRef.current) return;
      
      // Scroll vers l'introduction et surbrillance
      scrollToSection(introSectionRef);
      setHighlightedElement('intro');
      await wait(500);
      
      await playAudio("Regarde bien cette section ! Tu peux cliquer sur l'icône pour voir une animation !");
      if (stopSignalRef.current) return;
      
      await wait(2000);
      if (stopSignalRef.current) return;
      
      // Présentation de la méthode
      await playAudio(`Ensuite, nous verrons ${config.course.method.title.toLowerCase()}...`);
      if (stopSignalRef.current) return;
      
      // Scroll vers la méthode et surbrillance
      scrollToSection(methodSectionRef);
      setHighlightedElement('method');
      await wait(500);
      
      const methodText = config.character?.expressions?.[1] 
        ? `${config.character.expressions[1]} ! Voici ma méthode secrète ! N'oublie pas de tester l'animation !`
        : "Voici ma méthode secrète ! N'oublie pas de tester l'animation !";
      
      await playAudio(methodText);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      if (stopSignalRef.current) return;
      
      // Présentation des exemples/animations
      await playAudio("Et maintenant, la partie la plus amusante : les animations interactives !");
      if (stopSignalRef.current) return;
      
      // Scroll vers les exemples et surbrillance
      scrollToSection(examplesSectionRef);
      setHighlightedElement('examples');
      await wait(500);
      
      await playAudio("Tu peux cliquer sur n'importe quel nombre de 1 à 9 pour voir son complément à 10 s'animer !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      await playAudio("Essaie par exemple de cliquer sur le nombre 3...");
      if (stopSignalRef.current) return;
      
      // Animer le bouton 3 s'il existe
      await animateExampleButton(3);
      
      await wait(2000);
      await playAudio("Tu vois ? L'animation te montre que 3 + 7 = 10 !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Tu peux essayer avec tous les autres nombres aussi !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      await playAudio("Chaque nombre a son complément secret pour faire 10. C'est magique !");
      if (stopSignalRef.current) return;
      
      await wait(2000);
      if (stopSignalRef.current) return;
      
      // Mention de la section exercices
      await playAudio("Quand tu seras prêt, tu pourras aussi aller à la section exercices...");
      if (stopSignalRef.current) return;
      
      // Scroll vers l'onglet exercices et surbrillance
      setHighlightedElement(null);
      setHighlightExerciseButton(true);
      if (exerciseTabRef.current) {
        exerciseTabRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      await wait(500);
      
      await playAudio(`Là-bas, ${config.exercises.length} problèmes t'attendent pour tester tes nouvelles compétences !`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      if (stopSignalRef.current) return;
      
      // Encouragement final
      const finalText = config.character?.expressions?.[2] 
        ? `${config.character.expressions[2]} ! L'aventure commence maintenant !`
        : "Bon courage ! L'aventure commence maintenant !";
      
      await playAudio(finalText);
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainChapterWithSam:', error);
    } finally {
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
      setHighlightedElement(null);
      setHighlightCourseButton(false);
      setHighlightExerciseButton(false);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour expliquer les exercices
  const explainExercisesWithSam = async () => {
    if (exercisesIsPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setExercisesIsPlayingVocal(true);
    setExercisesHasStarted(true);
    setSamSizeExpanded(true);
    
    try {
      const welcomeText = config.character?.expressions?.[0] 
        ? `${config.character.expressions[0]} ! C'est l'heure de t'entraîner avec les exercices !`
        : "C'est l'heure de t'entraîner avec les exercices !";
      
      await playAudio(welcomeText);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      const exerciseText = config.character?.expressions?.[1] 
        ? `Tu vas résoudre ${config.exercises.length} problèmes différents, ${config.character.expressions[1]} !`
        : `Tu vas résoudre ${config.exercises.length} problèmes différents !`;
      
      await playAudio(exerciseText);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      if (stopSignalRef.current) return;
      
      // Mettre en évidence le bouton "Lire l'énoncé"
      setHighlightedElement('read-story-button');
      await playAudio("Pour chaque exercice, tu peux lire l'énoncé en cliquant sur le bouton 'Lire l'énoncé' !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      if (stopSignalRef.current) return;
      
      // Mettre en évidence la zone de réponse
      setHighlightedElement('answer-input');
      await playAudio("Ensuite, tu saisis ta réponse dans la zone de réponse !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      if (stopSignalRef.current) return;
      
      // Mettre en évidence le bouton Vérifier
      setHighlightedElement('validate-button');
      await playAudio("Et pour finir, tu appuies sur le bouton 'Vérifier' pour vérifier ta réponse !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      setHighlightedElement(null);
      const helpText = config.character?.expressions?.[2] 
        ? `Si tu te trompes, je t'aiderai avec une animation pour comprendre ! En avant, ${config.character.expressions[2]} !`
        : "Si tu te trompes, je t'aiderai avec une animation pour comprendre ! En avant !";
      
      await playAudio(helpText);
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainExercisesWithSam:', error);
    } finally {
      setExercisesIsPlayingVocal(false);
      setSamSizeExpanded(false);
      setHighlightedElement(null);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour lire l'énoncé actuel
  const readCurrentStory = async () => {
    if (exercisesIsPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await wait(200);
    stopSignalRef.current = false;
    setExercisesIsPlayingVocal(true);
    
    try {
      await playAudio(config.exercises[currentExercise].story, true);
    } catch (error) {
      console.error('Erreur dans readCurrentStory:', error);
    } finally {
      setExercisesIsPlayingVocal(false);
    }
  };

  // Fonction pour expliquer l'introduction avec animation
  const explainIntroduction = async () => {
    if (isPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHighlightedElement('intro');
    
    try {
      await playAudio(`Voici l'introduction : ${config.course.introduction.content}`);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      await playAudio("Cette section t'explique les bases avant de commencer !");
    } catch (error) {
      console.error('Erreur dans explainIntroduction:', error);
    } finally {
      setIsPlayingVocal(false);
      setHighlightedElement(null);
    }
  };

  // Fonction pour expliquer la méthode avec animation
  const explainMethod = async () => {
    if (isPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHighlightedElement('method');
    
    try {
      await playAudio(`Voici ${config.course.method.title.toLowerCase()} :`);
      if (stopSignalRef.current) return;
      
      // Expliquer chaque étape
      for (let i = 0; i < config.course.method.steps.length; i++) {
        if (stopSignalRef.current) return;
        
        const step = config.course.method.steps[i];
        setAnimatingStep(`step${step.number}`);
        
        await playAudio(`Étape ${step.number} : ${step.title}`);
        if (stopSignalRef.current) return;
        
        await wait(1500);
        setAnimatingStep(null);
        await wait(500);
      }
      
      await playAudio("Voilà ma méthode secrète ! Tu peux maintenant l'utiliser !");
    } catch (error) {
      console.error('Erreur dans explainMethod:', error);
    } finally {
      setIsPlayingVocal(false);
      setHighlightedElement(null);
      setAnimatingStep(null);
    }
  };

  // Fonction pour expliquer une étape spécifique
  const explainStep = async (stepNumber: number) => {
    if (isPlayingVocal) return;
    
    const step = config.course.method.steps.find(s => s.number === stepNumber);
    if (!step) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setAnimatingStep(`step${stepNumber}`);
    
    try {
      await playAudio(`Étape ${step.number} : ${step.title}`);
      if (stopSignalRef.current) return;
      
      if (step.description) {
        await wait(800);
        await playAudio(step.description);
      }
    } catch (error) {
      console.error('Erreur dans explainStep:', error);
    } finally {
      setIsPlayingVocal(false);
      setAnimatingStep(null);
    }
  };

  // Fonction générique pour déclencher l'animation de correction
  const startCorrectionAnimation = (number: number) => {
    setCorrectionNumber(number);
    setShowCorrectionAnimation(true);
    setCorrectionAnimationStep(0);
    setShowNextButton(false);
    
    // 🎯 SCROLL AUTOMATIQUE vers la zone de correction (TEMPLATE MODULAIRE)
    // Cette fonctionnalité est intégrée au template pour tous les types d'exercices
    setTimeout(() => {
      const correctionElement = document.getElementById('correction-animation-zone');
      if (correctionElement) {
        correctionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        console.log('📍 Scroll automatique vers la zone de correction');
      }
    }, 200);
    
    // Animation progressive (adaptable selon le type d'exercice)
    setTimeout(() => setCorrectionAnimationStep(1), 300);
    setTimeout(() => setCorrectionAnimationStep(2), 1000);
    setTimeout(() => {
      setCorrectionAnimationStep(3);
      setShowNextButton(true);
      console.log('✅ Animation de correction terminée, bouton Suivant affiché');
    }, 1800);
  };

  // Fonction pour passer à l'exercice suivant après correction
  const goToNextExercise = () => {
    setShowCorrectionAnimation(false);
    setCorrectionAnimationStep(0);
    setCorrectionNumber(null);
    setShowNextButton(false);
    setIsCorrect(null);
    setUserAnswer('');
    
    if (currentExercise < config.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      setShowCompletionModal(true);
    }
  };

  // Fonction pour vérifier la réponse
  const checkAnswer = () => {
    const userNum = parseInt(userAnswer);
    const correctAnswer = config.exercises[currentExercise].answer;
    
    // 💾 Sauvegarder la réponse utilisateur
    const exerciseKey = `exercise-${currentExercise}`;
    saveProgress({ 
      userAnswers: { 
        ...progressData.userAnswers, 
        [exerciseKey]: userAnswer 
      } 
    });
    
    if (userNum === correctAnswer) {
      setIsCorrect(true);
      setScore(score + 1);
      
      // 🎉 Déclencher la célébration du personnage
      setIsCharacterCelebrating(true);
      setTimeout(() => setIsCharacterCelebrating(false), 2000);
      setTimeout(() => {
        if (currentExercise < config.exercises.length - 1) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          setShowCompletionModal(true);
        }
      }, 2000);
    } else {
      setIsCorrect(false);
      
      // Extraire le nombre de l'énoncé pour l'animation de correction
      const exerciseStory = config.exercises[currentExercise].story;
      const numberMatch = exerciseStory.match(/\d+/);
      if (numberMatch) {
        const number = parseInt(numberMatch[0]);
        // Déclencher l'animation de correction après un court délai
        setTimeout(() => {
          startCorrectionAnimation(number);
        }, 1000);
      } else {
        // Si pas de nombre trouvé, utiliser les propriétés firstNumber ou secondNumber
        const exercise = config.exercises[currentExercise];
        const number = (exercise as any).firstNumber || (exercise as any).secondNumber;
        if (number) {
          setTimeout(() => {
            startCorrectionAnimation(number);
          }, 1000);
        }
      }
    }
  };

  // Gestion des événements pour arrêter les vocaux
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
      stopAllVocalsAndAnimations();
    };

    // Écouter les changements de visibilité (onglet caché, etc.)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Écouter avant la fermeture/rechargement de la page
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Écouter la navigation (bouton retour du navigateur)
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      stopAllVocalsAndAnimations();
    };
  }, []);

  // Styles par chapitre (avec fallback par niveau)
  const getChapterStyles = () => {
    // Si un thème personnalisé est défini, l'utiliser
    if (config.theme) {
      return {
        gradient: config.theme.gradient,
        bgGradient: config.theme.bgGradient,
        characterBg: config.theme.characterBg,
        boxBg: config.theme.boxBg,
        buttonColors: config.theme.buttonColors,
        animationButtons: config.theme.animationButtons
      };
    }

    // Sinon, utiliser les thèmes par défaut selon le niveau
    switch (config.level) {
      case 'CP':
        return {
          gradient: 'from-blue-400 via-purple-500 to-pink-500',
          bgGradient: 'from-slate-50 via-gray-50 to-slate-50',
          characterBg: 'from-blue-100 to-purple-100',
          boxBg: 'bg-orange-50',
          buttonColors: {
            course: 'bg-orange-500 hover:bg-orange-600',
            exercises: 'bg-blue-500 hover:bg-blue-600'
          },
          animationButtons: {
            gradient: 'from-orange-500 to-orange-600',
            ring: 'ring-orange-300'
          }
        };
      case 'CE1':
        return {
          gradient: 'from-green-400 via-emerald-500 to-teal-500',
          bgGradient: 'from-slate-50 via-gray-50 to-slate-50',
          characterBg: 'from-green-100 to-emerald-100',
          boxBg: 'bg-emerald-50',
          buttonColors: {
            course: 'bg-emerald-500 hover:bg-emerald-600',
            exercises: 'bg-teal-500 hover:bg-teal-600'
          },
          animationButtons: {
            gradient: 'from-emerald-500 to-emerald-600',
            ring: 'ring-emerald-300'
          }
        };
      case 'CM1':
        return {
          gradient: 'from-indigo-400 via-blue-500 to-cyan-500',
          bgGradient: 'from-slate-50 via-gray-50 to-slate-50',
          characterBg: 'from-indigo-100 to-blue-100',
          boxBg: 'bg-indigo-50',
          buttonColors: {
            course: 'bg-indigo-500 hover:bg-indigo-600',
            exercises: 'bg-cyan-500 hover:bg-cyan-600'
          },
          animationButtons: {
            gradient: 'from-indigo-500 to-indigo-600',
            ring: 'ring-indigo-300'
          }
        };
    }
  };

  const styles = getChapterStyles() || {
    bgGradient: 'from-blue-50 to-purple-50',
    gradient: 'from-blue-500 to-purple-500',
    characterBg: 'bg-blue-100',
    boxBg: 'bg-white',
    customBoxBg: undefined,
    buttonColors: {
      course: 'bg-gradient-to-r from-blue-500 to-purple-500',
      exercises: 'bg-gradient-to-r from-green-500 to-blue-500'
    },
    animationButtons: {
      gradient: 'from-green-500 to-blue-500',
      ring: 'ring-green-400'
    }
  };

  // Styles pour les animations de correction
  const animationStyles = `
    @keyframes fillUp {
      from { width: 0%; }
      to { width: 100%; }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    @keyframes slideIn {
      from { transform: translateX(-50px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    .fill-up { animation: fillUp 1s ease-in-out; }
    .bounce { animation: bounce 0.6s ease-in-out; }
    .pulse { animation: pulse 1s ease-in-out infinite; }
    .slide-in { animation: slideIn 0.5s ease-out; }
  `;

  // Fonction pour rendre les barres visuelles de correction
  const renderCorrectionBar = (filled: number, complement: number) => {
    const isComplement100 = config.id.includes('complements-100');
    
    if (isComplement100) {
      // Pour les compléments à 100, utiliser une barre de progression
      const percentage = (filled / 100) * 100;
      const complementPercentage = (complement / 100) * 100;
      
      return (
        <div className="w-full bg-gray-200 rounded-full h-8 mb-4 overflow-hidden">
          <div className="flex h-full">
            <div 
              className="bg-blue-500 flex items-center justify-center text-gray-800 font-bold text-sm slide-in"
              style={{ width: `${percentage}%` }}
            >
              {filled}
            </div>
            <div 
              className={`bg-green-500 flex items-center justify-center text-gray-800 font-bold text-sm ${
                correctionAnimationStep >= 2 ? 'slide-in' : 'opacity-0'
              }`}
              style={{ width: `${complementPercentage}%` }}
            >
              +{complement}
            </div>
          </div>
        </div>
      );
    } else {
      // Pour les compléments à 10, utiliser les petites barres
      return (
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: filled }, (_, i) => (
            <div
              key={`filled-${i}`}
              className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded border-2 border-blue-500 flex items-center justify-center text-gray-800 font-bold text-xs sm:text-base slide-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              ●
            </div>
          ))}
          {Array.from({ length: complement }, (_, i) => (
            <div 
              key={`complement-${i}`} 
              className={`w-6 h-6 sm:w-8 sm:h-8 bg-red-400 rounded border-2 border-red-500 flex items-center justify-center text-gray-800 font-bold text-xs sm:text-base ${
                correctionAnimationStep >= 2 ? 'slide-in' : 'opacity-0'
              }`} 
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {filled + i + 1}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${styles.bgGradient} relative overflow-hidden`} role="main" aria-label={`Chapitre ${config.title}`}>
      <style jsx>{animationStyles}</style>
      {/* Zone d'annonces pour les screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isLoadingVocal && "Préparation de l'audio du cours en cours..."}
        {exercisesIsLoadingVocal && "Préparation de l'audio des exercices en cours..."}
        {isPlayingVocal && "Audio du cours en cours de lecture"}
        {exercisesIsPlayingVocal && "Audio des exercices en cours de lecture"}
        {isCorrect === true && "Bonne réponse ! Bravo !"}
        {isCorrect === false && "Réponse incorrecte, essayez encore"}
        {animatedScore > 0 && `Score actuel : ${animatedScore} sur ${config.exercises.length}`}
        {showCompletionModal && `Exercices terminés ! Score final : ${animatedScore} sur ${config.exercises.length}`}
      </div>



      {/* Bouton Stop unique avec personnage - visible quand une animation est en cours */}
      {(isPlayingVocal || exercisesIsPlayingVocal || isLoadingVocal || exercisesIsLoadingVocal || isAnimationRunning) && config.character && (
        <div className="fixed top-2 sm:top-4 right-2 sm:right-4 z-50 animate-fade-in">
          <button
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-red-500 hover:bg-red-600 hover:shadow-xl hover:-translate-y-1 hover:ring-4 hover:ring-red-300/60 text-gray-800 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 active:shadow-inner active:translate-y-0 active:ring-2 focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 relative overflow-hidden"
            aria-label="Arrêter tous les audios et animations en cours"
            title="Arrêter tous les audios et animations"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center">
              {!imageError && (
                <img
                  src={config.character.image}
                  alt={`Personnage ${config.character.name}`}
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setImageError(true)}
                />
              )}
              {imageError && (
                <div className="text-sm">🏴‍☠️</div>
              )}
            </div>
            <span className="font-semibold text-xs sm:text-sm">Stop</span> 
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <rect x="6" y="4" width="2" height="12" />
              <rect x="12" y="4" width="2" height="12" />
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={config.backLink}
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{config.backText}</span>
          </Link>
          
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-xl sm:text-4xl font-bold text-gray-900 mb-4">
              {config.title}
            </h1>
            <p className="text-lg text-gray-600 hidden sm:block">
              {config.description}
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Mobile optimisé */}
        <div className="flex justify-center space-x-2 sm:space-x-4 mb-6 sm:mb-8" role="tablist" aria-label="Navigation entre cours et exercices">
          <button
            ref={exerciseTabRef}
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(false);
            }}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all duration-200 text-sm sm:text-base cursor-pointer focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transform relative overflow-hidden ${
              !showExercises 
                ? `${styles.buttonColors.course} text-gray-800 shadow-lg scale-105 active:scale-100 active:shadow-inner` 
                : 'bg-white text-gray-700 border-2 border-pink-200 hover:border-pink-400 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:text-pink-700 hover:scale-105 hover:shadow-md active:scale-95 active:bg-pink-100 scale-100'
            } ${highlightCourseButton ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
            role="tab"
            aria-selected={!showExercises}
            aria-controls="course-content"
            aria-label="Afficher le contenu du cours"
          >
            <Book className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" aria-hidden="true" />
            Cours
          </button>
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(true);
            }}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all duration-200 text-sm sm:text-base cursor-pointer focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transform relative overflow-hidden ${
              showExercises 
                ? `${styles.buttonColors.exercises} text-gray-800 shadow-lg scale-105 active:scale-100 active:shadow-inner` 
                : 'bg-white text-gray-700 border-2 border-rose-200 hover:border-rose-400 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-700 hover:scale-105 hover:shadow-md active:scale-95 active:bg-rose-100 scale-100'
            } ${highlightExerciseButton ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
            role="tab"
            aria-selected={showExercises}
            aria-controls="exercises-content"
            aria-label="Afficher les exercices pratiques"
          >
            <Target className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" aria-hidden="true" />
            Exercices
          </button>
        </div>

        {!showExercises ? (
          /* COURS - MOBILE OPTIMISÉ */
          <div 
            className="space-y-4 sm:space-y-6 animate-in fade-in duration-300"
            id="course-content" 
            role="tabpanel" 
            aria-labelledby="course-tab"
          >
            {/* Image du personnage avec bouton DÉMARRER */}
            {config.character && (
              <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
                {/* Image du personnage */}
                <div className={`relative transition-all duration-700 ease-out border-2 border-orange-300 rounded-full bg-gradient-to-br ${styles.characterBg} ${
                  isPlayingVocal
                    ? 'w-16 h-16 sm:w-24 sm:h-24 shadow-2xl scale-110 border-orange-400' 
                    : samSizeExpanded 
                      ? 'w-14 h-14 sm:w-20 sm:h-20 shadow-xl scale-105 border-orange-350' 
                      : 'w-12 h-12 sm:w-16 sm:h-16 shadow-lg scale-100'
                }`}>
                  <img 
                    src={config.character.image}
                    alt={`Personnage ${config.character.name}`}
                    className="w-full h-full object-cover rounded-full transition-all duration-500"
                    onError={() => setImageError(true)}
                  />
                  
                  {/* Megaphone animé quand le personnage parle */}
                  {isPlayingVocal && (
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 rounded-full p-1 sm:p-2 shadow-lg animate-bounce">
                      <svg className="w-2 h-2 sm:w-4 sm:h-4 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h3.763l7.79 3.894A1 1 0 0018 15V3zM14 8.59c0 1.2.8 2.27 2 2.27v.64c-1.77 0-3.2-1.4-3.2-3.14 0-1.74 1.43-3.14 3.2-3.14v.64c-1.2 0-2 1.07-2 2.27z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Bouton DÉMARRER */}
                <button
                  onClick={async () => {
                    setIsLoadingVocal(true);
                    setHasStarted(true);
                    // 💾 Sauvegarder le démarrage du cours
                    saveProgress({ hasStartedCourse: true });
                    
                    // Simulation du loading
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    setIsLoadingVocal(false);
                    setIsPlayingVocal(true);
                    
                    // Lancer la vraie présentation avec audio et animations
                    await explainChapterWithSam();
                    
                    setIsPlayingVocal(false);
                  }}
                  disabled={isPlayingVocal || isLoadingVocal}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-gray-800 shadow-lg transition-all text-sm sm:text-base h-10 sm:h-12 flex items-center justify-center min-w-fit focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 relative overflow-hidden ${
                    isLoadingVocal
                      ? 'bg-teal-400 cursor-wait'
                      : isPlayingVocal 
                        ? 'bg-red-500 hover:bg-red-600 active:scale-95 active:shadow-inner' 
                        : hasStarted 
                          ? 'bg-green-500 hover:bg-green-600 hover:scale-105 active:scale-95 active:shadow-inner active:bg-green-700' 
                          : 'bg-teal-500 hover:bg-teal-600 hover:scale-125 hover:shadow-2xl hover:shadow-teal-500/50 hover:-translate-y-2 hover:ring-4 hover:ring-teal-300/60 active:scale-95 active:shadow-inner active:translate-y-0 active:ring-2 active:bg-teal-700 transform transition-all duration-200'
                  }`}
                  style={!isPlayingVocal && !hasStarted && !isLoadingVocal ? { animation: 'moderate-pulse 2s ease-in-out infinite' } : {}}
                  aria-label={`${hasStarted ? 'Recommencer' : 'Démarrer'} le cours sur ${config.title}`}
                  aria-describedby="course-description"
                >
                  {isLoadingVocal ? (
                    <>
                      <Spinner size="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-1 sm:ml-2">Préparation...</span>
                    </>
                  ) : isPlayingVocal ? (
                    <>
                      <SoundWave size="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-1 sm:ml-2">En cours...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                      <span className="transition-all duration-500 ease-in-out">
                        {hasStarted ? 'RECOMMENCER' : 'DÉMARRER LE COURS'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Introduction */}
            <div 
              ref={introSectionRef}
              className={`${'customBoxBg' in styles && styles.customBoxBg ? '' : styles.boxBg} border-2 border-gray-200 rounded-xl shadow-lg p-3 sm:p-6 transition-all duration-1000 ${
                highlightedElement === 'intro' ? 'ring-4 ring-orange-400 bg-orange-50 scale-105' : ''
              }`}
              style={'customBoxBg' in styles && styles.customBoxBg ? { backgroundColor: styles.customBoxBg } : {}}
            >
              <div className="flex items-center gap-1 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1 sm:p-2 bg-orange-100 rounded-lg">
                  <Book className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">{config.course.introduction.title}</h2>
                {/* Bouton d'animation avec thème du chapitre */}
                <button 
                  onClick={explainIntroduction}
                  disabled={isPlayingVocal || isLoadingVocal}
                  className={`bg-gradient-to-r ${styles.animationButtons.gradient} text-gray-800 rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 hover:rotate-12 cursor-pointer transition-all duration-200 ${styles.animationButtons.ring} ring-2 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-opacity-60 active:scale-90 active:rotate-0 active:shadow-inner drop-shadow-lg focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 relative before:content-[''] before:absolute before:inset-0 before:w-11 before:h-11 before:sm:w-12 before:sm:h-12 before:rounded-full before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:z-10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:rotate-0 ${
                    highlightedElement === 'intro' ? 'ring-4 ring-yellow-400 animate-pulse scale-110 shadow-2xl' : ''
                  }`}
                  style={{
                    animation: !isPlayingVocal && highlightedElement !== 'intro' ? 'moderate-pulse 2s ease-in-out infinite' : 'none'
                  }} 
                  title="Cliquer pour écouter cette section"
                  aria-label="Écouter l'explication audio de cette section"
                >
                  {isPlayingVocal && highlightedElement === 'intro' ? '🔊' : '🎯'}
                </button>
              </div>
              <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
                {config.course.introduction.content}
              </p>
            </div>

            {/* Méthode en étapes */}
            <div 
              ref={methodSectionRef}
              className={`${'customBoxBg' in styles && styles.customBoxBg ? '' : styles.boxBg} border-2 border-gray-200 rounded-xl shadow-lg p-3 sm:p-6 transition-all duration-1000 ${
                highlightedElement === 'method' ? 'ring-4 ring-purple-400 bg-purple-50 scale-105' : ''
              }`}
              style={'customBoxBg' in styles && styles.customBoxBg ? { backgroundColor: styles.customBoxBg } : {}}
            >
              <div className="flex items-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <div className="p-1 sm:p-2 bg-purple-100 rounded-lg">
                  <Target className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">{config.course.method.title}</h2>
                {/* Bouton d'animation pour la méthode */}
                <button 
                  onClick={explainMethod}
                  disabled={isPlayingVocal || isLoadingVocal}
                  className={`bg-gradient-to-r ${styles.animationButtons.gradient} text-gray-800 rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 hover:rotate-12 cursor-pointer transition-all duration-200 ${styles.animationButtons.ring} ring-2 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-opacity-60 active:scale-90 active:rotate-0 active:shadow-inner drop-shadow-lg focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 relative before:content-[''] before:absolute before:inset-0 before:w-11 before:h-11 before:sm:w-12 before:sm:h-12 before:rounded-full before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:z-10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:rotate-0 ${
                    highlightedElement === 'method' ? 'ring-4 ring-yellow-400 animate-pulse scale-110 shadow-2xl' : ''
                  }`}
                  style={{
                    animation: !isPlayingVocal && highlightedElement !== 'method' ? 'moderate-pulse 2s ease-in-out infinite' : 'none'
                  }} 
                  title="Cliquer pour écouter cette section"
                  aria-label="Écouter l'explication audio de cette section"
                >
                  {isPlayingVocal && highlightedElement === 'method' ? '🔊' : '🎯'}
                </button>
              </div>
              
              <div className="space-y-4">
                {config.course.method.steps.map((step) => (
                  <div key={step.number} className={`flex items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg transition-all ${
                    animatingStep === `step${step.number}` ? `bg-${step.color}-100 ring-2 ring-${step.color}-400` : 'bg-gray-100'
                  }`}>
                    <button 
                      onClick={() => {
                        console.log('🖱️ CLIC détecté sur le bouton', step.number);
                        alert(`Clic sur l'étape ${step.number}: ${step.title}`);
                        explainStep(step.number);
                      }}
                      className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-blue-600 transition-all duration-200"
                      title="Cliquer pour écouter cette étape"
                    >
                      {step.number}
                    </button>
                    <p className="text-sm sm:text-lg text-gray-800">{step.title}</p>
                  </div>
                ))}
              </div>
            </div>



            {/* Section Exemples - Personnalisable ou par défaut */}
            {customExamplesSection ? (
              <div ref={examplesSectionRef} className={`transition-all duration-1000 ${
                highlightedElement === 'examples' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105 rounded-xl' : ''
              }`}>
                {customExamplesSection}
              </div>
            ) : (
              /* Exemples par défaut */
              <div 
                ref={examplesSectionRef}
                className={`${styles.boxBg} border-2 border-gray-200 rounded-xl shadow-lg p-3 sm:p-6 transition-all duration-1000 ${
                  highlightedElement === 'examples' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
                }`}
              >
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">
                  🎯 Choisis un problème à résoudre ensemble !
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {config.course.examples.map((example, index) => (
                  <div
                    key={example.id}
                    className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      highlightedExamples.includes(index) 
                        ? 'border-yellow-400 bg-yellow-50 shadow-lg scale-105' 
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                    }`}
                    onClick={() => {
                      setCurrentExample(index);
                      // 💾 Sauvegarder l'exemple sélectionné
                      saveProgress({ currentExample: index });
                    }}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{example.item}</div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{example.title}</h3>
                      <div className="text-sm text-gray-600 mb-4">
                        {example.story}
                      </div>
                      <button 
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 drop-shadow-md cursor-pointer hover:scale-105 focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 relative overflow-hidden ${
                          currentExample === index 
                            ? `bg-gradient-to-r ${styles.animationButtons.gradient} text-gray-800 shadow-lg ring-2 ${styles.animationButtons.ring} ring-opacity-50 active:scale-95 active:shadow-inner` 
                            : `bg-gradient-to-r ${styles.animationButtons.gradient} text-gray-800 shadow-lg hover:shadow-xl hover:ring-2 ${styles.animationButtons.ring} hover:ring-opacity-40 active:scale-95 active:shadow-inner hover:-translate-y-1`
                        }`}
                      style={currentExample !== index ? {
                        animation: 'moderate-pulse 2s ease-in-out infinite'
                      } : undefined}
                      aria-label={`${currentExample === index ? 'Exemple sélectionné' : 'Sélectionner l\'exemple'}: ${example.title}`}>
                        {currentExample === index ? '✅ Sélectionné' : '👆 Cliquer pour voir'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>
        ) : (
          /* Section Exercices */
          <div 
            className="space-y-5 sm:space-y-6 animate-in fade-in duration-300"
            id="exercises-content" 
            role="tabpanel" 
            aria-labelledby="exercises-tab"
          >
            {/* Image du personnage avec bouton DÉMARRER pour les exercices */}
            {config.character && (
              <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
                {/* Image du personnage */}
                <div className={`relative transition-all duration-700 ease-out border-2 border-blue-300 rounded-full bg-gradient-to-br ${styles.characterBg} ${
                  exercisesIsPlayingVocal
                    ? 'w-16 h-16 sm:w-24 sm:h-24 shadow-2xl scale-110 border-blue-400' 
                    : samSizeExpanded 
                      ? 'w-14 h-14 sm:w-20 sm:h-20 shadow-xl scale-105 border-blue-350' 
                      : 'w-12 h-12 sm:w-16 sm:h-16 shadow-lg scale-100'
                }`}>
                  <img 
                    src={config.character.image}
                    alt={`Personnage ${config.character.name}`}
                    className="w-full h-full object-cover rounded-full transition-all duration-500"
                    onError={() => setImageError(true)}
                  />
                  
                  {/* Megaphone animé quand le personnage parle */}
                  {exercisesIsPlayingVocal && (
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 rounded-full p-1 sm:p-2 shadow-lg animate-bounce">
                      <svg className="w-2 h-2 sm:w-4 sm:h-4 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h3.763l7.79 3.894A1 1 0 0018 15V3zM14 8.59c0 1.2.8 2.27 2 2.27v.64c-1.77 0-3.2-1.4-3.2-3.14 0-1.74 1.43-3.14 3.2-3.14v.64c-1.2 0-2 1.07-2 2.27z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Bouton DÉMARRER */}
                <button
                  onClick={async () => {
                    setExercisesIsLoadingVocal(true);
                    setExercisesHasStarted(true);
                    // 💾 Sauvegarder le démarrage des exercices
                    saveProgress({ hasStartedExercises: true });
                    
                    // Simulation du loading
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    setExercisesIsLoadingVocal(false);
                    setExercisesIsPlayingVocal(true);
                    
                    // Lancer la vraie présentation des exercices avec audio et animations
                    await explainExercisesWithSam();
                    
                    setExercisesIsPlayingVocal(false);
                  }}
                  disabled={exercisesIsPlayingVocal || exercisesIsLoadingVocal}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-gray-800 shadow-lg transition-all text-sm sm:text-base h-10 sm:h-12 flex items-center justify-center min-w-fit focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 relative overflow-hidden ${
                    exercisesIsLoadingVocal
                      ? 'bg-cyan-400 cursor-wait'
                      : exercisesIsPlayingVocal 
                        ? 'bg-red-500 hover:bg-red-600 active:scale-95 active:shadow-inner' 
                        : exercisesHasStarted 
                          ? 'bg-green-500 hover:bg-green-600 hover:scale-105 active:scale-95 active:shadow-inner active:bg-green-700' 
                          : 'bg-cyan-500 hover:bg-cyan-600 hover:scale-125 hover:shadow-2xl hover:shadow-cyan-500/50 hover:-translate-y-2 hover:ring-4 hover:ring-cyan-300/60 active:scale-95 active:shadow-inner active:translate-y-0 active:ring-2 active:bg-cyan-700 transform transition-all duration-200'
                  }`}
                  style={!exercisesIsPlayingVocal && !exercisesHasStarted && !exercisesIsLoadingVocal ? { animation: 'moderate-pulse 2s ease-in-out infinite' } : {}}
                  aria-label="Démarrer les exercices pratiques avec explications audio"
                  aria-describedby="exercises-description"
                >
                  {exercisesIsLoadingVocal ? (
                    <>
                      <Spinner size="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-1 sm:ml-2">Préparation...</span>
                    </>
                  ) : exercisesIsPlayingVocal ? (
                    <>
                      <SoundWave size="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-1 sm:ml-2">Sam explique...</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                      <span className="transition-all duration-500 ease-in-out">
                        {exercisesHasStarted ? 'RECOMMENCER LES EXERCICES' : 'DÉMARRER LES EXERCICES'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}



            <div className={`${styles.boxBg} rounded-xl shadow-lg p-3 sm:p-6`}>
              <div className="flex justify-between items-center mb-3 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 transition-all duration-300 ease-in-out">
                  Exercice <span className="inline-block transition-all duration-500 ease-out transform">{currentExercise + 1}</span> / {config.exercises.length}
                </h2>
                <div className="text-sm sm:text-lg font-semibold text-blue-600 transition-all duration-300 ease-in-out">
                  Score : <span className="inline-block transition-all duration-500 ease-out transform">{animatedScore}</span> / {config.exercises.length}
                </div>
              </div>
              
              {/* Barre d'avancement discrète */}
              <div className="w-full bg-gray-200 border border-gray-300 rounded-full h-1.5 sm:h-2 mb-4 sm:mb-6 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ 
                    width: `${((currentExercise + 1) / config.exercises.length) * 100}%` 
                  }}
                >
                  {/* Effet de brillance animé */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>

              {!showCompletionModal ? (
                <div className="space-y-3 sm:space-y-6 transition-all duration-500 ease-in-out">
                  {/* Icône visuelle */}
                  <div className="text-center">
                    <div className="text-4xl sm:text-6xl mb-2 sm:mb-4 transition-all duration-500 ease-in-out transform hover:scale-110" aria-hidden="true">
                      {config.exercises[currentExercise].visual}
                    </div>
                  </div>

                  {/* Énoncé du problème */}
                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg shadow-md transition-all duration-300 ease-in-out">
                    <div className="text-base sm:text-xl text-center text-gray-900 font-semibold mb-2 sm:mb-4 transition-all duration-500 ease-in-out">
                      {config.exercises[currentExercise].story}
                    </div>
                    
                    {/* Bouton Lire l'énoncé */}
                    <div className="text-center">
                      <button
                        id="read-story-button"
                        className={`px-3 sm:px-4 py-2 sm:py-2 bg-green-500 text-gray-800 rounded-lg font-semibold hover:bg-green-600 transition-all text-sm sm:text-base focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 ${
                          highlightedElement === 'read-story-button' ? 'ring-4 ring-yellow-400 animate-pulse bg-yellow-500 text-gray-900' : ''
                        }`}
                        aria-label="Écouter l'énoncé du problème lu à voix haute"
                      >
                        🔊 Lire l'énoncé
                      </button>
                    </div>
                  </div>



                  {/* Zone de réponse */}
                  <div className="text-center space-y-4">
                    <input
                      id="answer-input"
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="?"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      className={`text-center text-lg sm:text-xl font-bold border-2 border-gray-300 rounded-lg px-2 sm:px-4 py-1 sm:py-2 w-24 sm:w-32 transition-all duration-200 focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:border-blue-500 hover:border-blue-400 hover:shadow-md focus:scale-105 focus:shadow-lg ${
                        highlightedElement === 'answer-input' ? 'ring-4 ring-yellow-400 animate-pulse border-yellow-500' : ''
                      }`}
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                      aria-label="Saisir votre réponse au problème d'addition"
                      aria-describedby="exercise-instructions"
                    />
                    <div>
                      <button
                        id="validate-button"
                        onClick={checkAnswer}
                        disabled={!userAnswer}
                        className={`bg-blue-500 text-gray-800 px-4 sm:px-6 py-2 sm:py-2 rounded-lg font-semibold hover:bg-blue-600 hover:scale-105 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-none active:scale-95 active:shadow-inner active:translate-y-0 transition-all duration-200 text-sm sm:text-base focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 relative overflow-hidden ${
                          highlightedElement === 'validate-button' ? 'ring-4 ring-yellow-400 animate-pulse bg-yellow-500' : ''
                        }`}
                        aria-label="Vérifier votre réponse et obtenir le résultat"
                      >
                        Vérifier
                      </button>
                    </div>
                    
                    {/* 🎯 ZONE DE CORRECTION MODULAIRE - Template intégré pour tous les exercices */}
                    {/* Cette zone apparaît automatiquement sous le bouton Valider quand la réponse est fausse */}
                    {/* Le scroll automatique vers cette zone est intégré au template modulaire */}
                    {isCorrect === false && showCorrectionAnimation && correctionNumber !== null && (
                      <div 
                        id="correction-animation-zone"
                        className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500"
                        role="region"
                        aria-label="Zone d'explication de la correction"
                      >
                        <h4 className="text-center text-red-800 font-bold mb-4">
                          💡 Laisse-moi t'expliquer :
                        </h4>
                        
                        {/* Animation de correction */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="text-center mb-4">
                            <h5 className="text-base sm:text-lg font-bold text-gray-800">
                              {config.id.includes('complements-100') 
                                ? `Complément de ${correctionNumber} à 100`
                                : `Complément de ${correctionNumber} à 10`
                              }
                            </h5>
                          </div>

                          <div className="space-y-4">
                            {/* Visualisation avec barres */}
                            <div>
                              <p className="text-center text-gray-600 mb-2 text-sm sm:text-base">
                                J'ai {correctionNumber} :
                              </p>
                              {correctionAnimationStep >= 1 && renderCorrectionBar(
                                correctionNumber, 
                                config.id.includes('complements-100') ? 100 - correctionNumber : 10 - correctionNumber
                              )}
                            </div>

                            {/* Équation */}
                            {correctionAnimationStep >= 2 && (
                              <div className="text-center">
                                <div className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">
                                  {config.id.includes('complements-100') 
                                    ? `${correctionNumber} + ${100 - correctionNumber} = 100`
                                    : `${correctionNumber} + ${10 - correctionNumber} = 10`
                                  }
                                </div>
                              </div>
                            )}

                            {/* Résultat final */}
                            {correctionAnimationStep >= 3 && (
                              <div className="text-center">
                                <div className="bg-green-100 rounded-lg p-3 inline-block">
                                  <div className="text-green-800 font-bold text-sm sm:text-lg">
                                    🎉 Le complément de {correctionNumber} à {config.id.includes('complements-100') ? '100' : '10'} est {config.id.includes('complements-100') ? 100 - correctionNumber : 10 - correctionNumber} !
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Bouton Suivant */}
                        {showNextButton && (
                          <div className="text-center">
                            <button
                              onClick={goToNextExercise}
                              className="bg-blue-500 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:scale-105 transition-all duration-200 animate-in fade-in zoom-in delay-300"
                            >
                              Suivant →
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Feedback avec morphing fluide */}
                  {isCorrect !== null && (
                    <div className={`text-center p-4 rounded-lg transition-all duration-500 ease-in-out transform animate-in fade-in slide-in-from-bottom-4 ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? (
                        <div className="animate-in zoom-in duration-300 delay-100">
                          <CheckCircle className="w-8 h-8 mx-auto mb-2 animate-spin-in text-green-600" />
                          <p className="font-bold animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300">
                            Bravo ! C'est correct !
                          </p>
                        </div>
                      ) : (
                        <div className="animate-in zoom-in duration-300 delay-100">
                          <XCircle className="w-8 h-8 mx-auto mb-2 animate-shake text-red-600" />
                          <p className="font-bold animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300">
                            Pas tout à fait... Essaie encore !
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Modale de fin avec XP et messages adaptatifs */
                <div className="text-center p-8 animate-in fade-in zoom-in duration-700 ease-out">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500 animate-bounce" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 animate-in slide-in-from-top duration-500 delay-200">
                    Félicitations !
                  </h3>
                  
                  {/* Score et XP */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 mb-6 shadow-lg animate-in zoom-in duration-500 delay-300">
                    <p className="text-xl font-bold text-gray-900 mb-3">
                      Score : <span className="inline-block transition-all duration-1000 ease-out">{animatedScore}</span>/{config.exercises.length}
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-2xl">⭐</span>
                      <p className="text-lg font-semibold text-purple-700">
                        XP gagnés : <span className="inline-block transition-all duration-1000 ease-out text-2xl font-bold">
                          +{formatNumber(Math.round((animatedScore / config.exercises.length) * 1000))}
                        </span> XP / 1 000 XP
                      </p>
                      <span className="text-2xl">⭐</span>
                    </div>
                    
                    {/* Barre XP visuelle */}
                    <div className="w-full bg-gray-200 border border-gray-300 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                        style={{ 
                          width: `${(animatedScore / config.exercises.length) * 100}%` 
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Message adaptatif selon performance */}
                  <div className={`p-4 rounded-lg mb-6 animate-in slide-in-from-bottom duration-500 delay-500 ${
                    (animatedScore / config.exercises.length) === 1 
                      ? 'bg-green-100 text-green-800' 
                      : (animatedScore / config.exercises.length) >= 0.8 
                        ? 'bg-blue-100 text-blue-800'
                        : (animatedScore / config.exercises.length) >= 0.6 
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                  }`}>
                    <p className="text-lg font-semibold">
                      {(animatedScore / config.exercises.length) === 1 
                        ? '🌟 Bravo ! Tu maîtrises parfaitement !'
                        : (animatedScore / config.exercises.length) >= 0.8 
                          ? '👍 Bien joué ! Tu peux encore t\'améliorer !'
                          : (animatedScore / config.exercises.length) >= 0.6 
                            ? '📚 Cours à revoir pour mieux comprendre !'
                            : '🔄 Recommence après avoir revu le cours !'
                      }
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      // 🏗️ Sauvegarder XP hiérarchique avant de fermer
                      saveXpHierarchy(animatedScore, config.exercises.length);
                      
                      setShowCompletionModal(false);
                      setCurrentExercise(0);
                      setScore(0);
                      setUserAnswer('');
                      setIsCorrect(null);
                    }}
                    className="bg-blue-500 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Recommencer
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
