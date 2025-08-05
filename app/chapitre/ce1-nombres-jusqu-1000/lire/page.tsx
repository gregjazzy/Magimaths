'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';

export default function LireNombresCE1Page() {
  const [selectedNumber, setSelectedNumber] = useState('234');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [exerciseResults, setExerciseResults] = useState<boolean[]>([]);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // États pour le système audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [characterSizeExpanded, setCharacterSizeExpanded] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  
  // Refs pour contrôler les vocaux
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    if (currentAudioRef.current) {
      speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
    setIsPlayingVocal(false);
    setIsAnimating(false); // Arrêter aussi l'animation visuelle
    setHighlightedElement(null); // Arrêter la mise en évidence
  };

  // Fonction pour scroller vers un élément
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  // Fonction pour mettre en évidence un élément
  const highlightElement = (elementId: string, duration: number = 3000) => {
    setHighlightedElement(elementId);
    setTimeout(() => {
      if (!stopSignalRef.current) {
        setHighlightedElement(null);
      }
    }, duration);
  };

  // Fonction pour faire clignoter plusieurs éléments un par un
  const highlightElementsSequentially = async (elementIds: string[], delayBetween: number = 800) => {
    for (const elementId of elementIds) {
      if (stopSignalRef.current) break;
      setHighlightedElement(elementId);
      await new Promise(resolve => setTimeout(resolve, delayBetween));
    }
    if (!stopSignalRef.current) {
      setHighlightedElement(null);
    }
  };

  // Fonction pour jouer un audio
  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9; // Un peu plus lent pour les explications
      utterance.pitch = 1.1; // Un peu plus aigu pour le style Minecraft
      
      currentAudioRef.current = utterance;

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = () => {
        console.error('Erreur synthèse vocale');
        resolve();
      };

      if (!stopSignalRef.current) {
        speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  // Fonction pour expliquer le chapitre au démarrage
  const explainChapter = async () => {
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);
    setCharacterSizeExpanded(true); // Agrandir le personnage de façon permanente

    try {
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      console.log('Début explainChapter - Chrome:', isChrome);
      
      if (isChrome) {
        speechSynthesis.cancel();
        await new Promise(resolve => setTimeout(resolve, 200));
        
        let voices = speechSynthesis.getVoices();
        if (voices.length === 0) {
          console.log('Attente des voix Chrome...');
          await new Promise((resolve) => {
            const checkVoices = () => {
              voices = speechSynthesis.getVoices();
              if (voices.length > 0) {
                console.log('Voix Chrome chargées:', voices.length);
                resolve(voices);
              } else {
                setTimeout(checkVoices, 100);
              }
            };
            checkVoices();
          });
        }
      }

      if (showExercises) {
        // Mode d'emploi pour les exercices
        if (stopSignalRef.current) return;
        await playAudio("Salut petit mineur ! Bienvenue dans l'arène d'entraînement aux nombres jusqu'à 1000 !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (stopSignalRef.current) return;
        await playAudio("Objectif de ta quête : maîtriser la lecture des grands nombres comme un vrai pro !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (stopSignalRef.current) return;
        await playAudio("Voici tes outils de mineur :");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (stopSignalRef.current) return;
        scrollToElement('exercise-question');
        await playAudio("D'abord, tu verras un nombre mystère à déchiffrer, comme un coffre à ouvrir !");
        if (stopSignalRef.current) return;
        highlightElement('mystery-number', 2500);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (stopSignalRef.current) return;
        await playAudio("Ensuite, tape ta réponse dans le bloc de texte avec ton clavier magique !");
        if (stopSignalRef.current) return;
        highlightElement('answer-input', 2500);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (stopSignalRef.current) return;
        await playAudio("Le bouton Effacer, c'est comme ta gomme enchantée pour recommencer !");
        if (stopSignalRef.current) return;
        highlightElement('erase-button', 2500);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (stopSignalRef.current) return;
        scrollToElement('navigation-buttons');
        // Détection dynamique du texte du bouton
        const buttonText = isCorrect === null ? 'Vérifier' : 'Suivant';
        const buttonExplanation = isCorrect === null 
          ? "Le bouton Vérifier, c'est pour valider ta réponse comme un sort de vérité !" 
          : "Le bouton Suivant, c'est pour passer à l'exercice suivant une fois que tu as réussi !";
        await playAudio(`${buttonExplanation} Et Précédent pour revenir en arrière !`);
        if (stopSignalRef.current) return;
        await highlightElementsSequentially(['next-button', 'previous-button'], 1000);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (stopSignalRef.current) return;
        scrollToElement('score-section');
        await playAudio("Et le score en haut à droite, c'est ton compteur d'expérience ! Plus tu réussis, plus tu gagnes de points !");
        if (stopSignalRef.current) return;
        highlightElement('score-display', 3000);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (stopSignalRef.current) return;
        await playAudio("Allez petit aventurier, montre-moi tes talents de lecture ! Que l'aventure commence !");
        
      } else {
        // Mode d'emploi pour le cours
        if (stopSignalRef.current) return;
        await playAudio("Salut petit crafteur ! Bienvenue dans l'atelier des nombres jusqu'à 1000 !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (stopSignalRef.current) return;
        await playAudio("Objectif de ta mission : apprendre à lire les grands nombres comme un maître builder !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (stopSignalRef.current) return;
        await playAudio("Voici ta table de craft magique :");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (stopSignalRef.current) return;
        scrollToElement('number-selector');
        await playAudio("En haut, tu peux choisir un nombre dans ton inventaire ! Clique sur les blocs colorés !");
        if (stopSignalRef.current) return;
        // Faire clignoter les boutons de nombres un par un
        const numberButtons = numbers.map((_, index) => `number-btn-${index}`);
        await highlightElementsSequentially(numberButtons, 600);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (stopSignalRef.current) return;
        scrollToElement('animation-section');
        await playAudio("Le bouton bleu Voir le placement, c'est comme une potion de vision ! Il te montre où placer chaque chiffre dans le tableau !");
        if (stopSignalRef.current) return;
        highlightElement('animation-button', 2500);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (stopSignalRef.current) return;
        scrollToElement('reading-section');
        await playAudio("Le bouton jaune Écouter, c'est ton perroquet magique ! Il te dit comment prononcer le nombre !");
        if (stopSignalRef.current) return;
        highlightElement('listen-button', 2500);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (stopSignalRef.current) return;
        scrollToElement('tab-navigation');
        await playAudio("En haut, tu as deux onglets : Cours pour apprendre, et Exercices pour t'entraîner !");
        if (stopSignalRef.current) return;
        await highlightElementsSequentially(['tab-cours', 'tab-exercices'], 1000);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (stopSignalRef.current) return;
        await playAudio("Alors petit explorateur, prêt à découvrir les secrets des grands nombres ? C'est parti pour l'aventure !");
      }

    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'lire',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('ce1-nombres-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'lire');
      
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

    localStorage.setItem('ce1-nombres-progress', JSON.stringify(allProgress));
  };

  const numbers = [
    { value: '234', label: '234', reading: 'Deux-cent-trente-quatre' },
    { value: '89', label: '89', reading: 'Quatre-vingt-neuf' },
    { value: '345', label: '345', reading: 'Trois-cent-quarante-cinq' },
    { value: '37', label: '37', reading: 'Trente-sept' },
    { value: '694', label: '694', reading: 'Six-cent-quatre-vingt-quatorze' },
    { value: '978', label: '978', reading: 'Neuf-cent-soixante-dix-huit' }
  ];

  const exercises = [
    { number: '145', reading: 'Cent-quarante-cinq' },
    { number: '267', reading: 'Deux-cent-soixante-sept' },
    { number: '389', reading: 'Trois-cent-quatre-vingt-neuf' },
    { number: '512', reading: 'Cinq-cent-douze' },
    { number: '634', reading: 'Six-cent-trente-quatre' },
    { number: '758', reading: 'Sept-cent-cinquante-huit' },
    { number: '823', reading: 'Huit-cent-vingt-trois' },
    { number: '946', reading: 'Neuf-cent-quarante-six' },
    { number: '207', reading: 'Deux-cent-sept' },
    { number: '350', reading: 'Trois-cent-cinquante' },
    { number: '284', reading: 'Deux-cent-quatre-vingt-quatre' },
    { number: '837', reading: 'Huit-cent-trente-sept' },
    { number: '37', reading: 'Trente-sept' },
    { number: '98', reading: 'Quatre-vingt-dix-huit' },
    { number: '456', reading: 'Quatre-cent-cinquante-six' }
  ];

  const formatNumber = (num: string) => {
    return num;
  };

  const speakNumber = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const animateNumber = async () => {
    setIsAnimating(true);
    stopSignalRef.current = false; // Réinitialiser le signal d'arrêt
    
    // Nettoyer d'abord le tableau
    const tableElements = {
      unites: document.getElementById('unites-value'),
      dizaines: document.getElementById('dizaines-value'),
      centaines: document.getElementById('centaines-value')
    };

    // Masquer temporairement les chiffres dans le tableau
    Object.values(tableElements).forEach(el => {
      if (el) {
        el.style.opacity = '0';
      }
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // Créer l'animation de glissement pour chaque chiffre
    const animateDigit = async (digitIndex: number, targetId: string, delay: number) => {
      const sourceElement = document.getElementById(`source-digit-${digitIndex}`);
      const targetElement = document.getElementById(targetId);
      
      if (!sourceElement || !targetElement) return;

      // Créer un chiffre volant
      const flyingDigit = sourceElement.cloneNode(true) as HTMLElement;
      flyingDigit.id = `flying-digit-${digitIndex}`;
      flyingDigit.style.position = 'absolute';
      flyingDigit.style.zIndex = '1000';
      flyingDigit.style.backgroundColor = '#FEF3C7'; // bg-yellow-100
      flyingDigit.style.transform = 'scale(1.2)';
      flyingDigit.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
      
      // Positionner le chiffre volant à la position source
      const sourceRect = sourceElement.getBoundingClientRect();
      const containerRect = document.body.getBoundingClientRect();
      flyingDigit.style.left = `${sourceRect.left - containerRect.left}px`;
      flyingDigit.style.top = `${sourceRect.top - containerRect.top}px`;
      
      document.body.appendChild(flyingDigit);

      // Attendre le délai
      await new Promise(resolve => setTimeout(resolve, delay));

      // Mettre en surbrillance le chiffre source
      sourceElement.classList.add('animate-pulse', 'bg-yellow-200', 'scale-110');

      await new Promise(resolve => setTimeout(resolve, 500));

      // Calculer la position de destination
      const targetRect = targetElement.getBoundingClientRect();
      const deltaX = targetRect.left - sourceRect.left;
      const deltaY = targetRect.top - sourceRect.top;

      // Animer le déplacement
      flyingDigit.style.transition = 'transform 1.5s ease-in-out';
      flyingDigit.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.5)`;

      // Attendre que l'animation soit terminée
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Révéler le chiffre dans le tableau avec animation
      const targetValueElement = document.getElementById(targetId);
      if (targetValueElement) {
        targetValueElement.style.opacity = '1';
        targetValueElement.style.transform = 'scale(1.2)';
        targetValueElement.style.color = '#059669'; // text-green-600
        
        // Mettre en surbrillance la cellule
        const cellId = targetId.replace('-value', '-cell');
        const targetCell = document.getElementById(cellId);
        if (targetCell) {
          targetCell.classList.add('bg-yellow-200', 'animate-pulse');
        }
      }

      // Supprimer le chiffre volant
      document.body.removeChild(flyingDigit);

      // Remettre le chiffre source normal
      sourceElement.classList.remove('animate-pulse', 'bg-yellow-200', 'scale-110');

      await new Promise(resolve => setTimeout(resolve, 800));

      // Remettre les styles normaux
      if (targetValueElement) {
        targetValueElement.style.transform = 'scale(1)';
        targetValueElement.style.color = '#065F46'; // text-green-900
      }
      
      const cellId = targetId.replace('-value', '-cell');
      const targetCell = document.getElementById(cellId);
      if (targetCell) {
        targetCell.classList.remove('bg-yellow-200', 'animate-pulse');
      }
    };

    // Animer dans l'ordre : unités, dizaines, centaines
    const digits = selectedNumber.split('');
    
    // Fonction pour convertir les chiffres en français
    const digitToFrench = (digit: string) => {
      const map: {[key: string]: string} = {
        '0': 'zéro', '1': 'un', '2': 'deux', '3': 'trois', '4': 'quatre',
        '5': 'cinq', '6': 'six', '7': 'sept', '8': 'huit', '9': 'neuf'
      };
      return map[digit] || digit;
    };

    // Fonction pour convertir les dizaines en français
    const tensToFrench = (digit: string) => {
      const map: {[key: string]: string} = {
        '0': 'zéro', '1': 'dix', '2': 'vingt', '3': 'trente', '4': 'quarante',
        '5': 'cinquante', '6': 'soixante', '7': 'soixante-dix', '8': 'quatre-vingts', '9': 'quatre-vingt-dix'
      };
      return map[digit] || digit;
    };

    // Fonction pour l'explication des dizaines
    const getTensExplanation = (digit: string) => {
      if (digit === '0') return 'zéro dizaine égale zéro';
      if (digit === '1') return '1 dizaine égale dix';
      return `${digit} dizaines égale ${tensToFrench(digit)}`;
    };

    // Fonction pour convertir les centaines en français
    const hundredsToFrench = (digit: string) => {
      if (digit === '1') return 'cent';
      if (digit === '0') return 'zéro cent';
      return digitToFrench(digit) + ' cents';
    };

    // Fonction pour l'explication des unités
    const getUnitsExplanation = (digit: string) => {
      const unitText = digitToFrench(digit);
      if (digit === '1') return '1 unité égale un';
      return `${digit} unités égale ${unitText}`;
    };

    // Fonction pour l'explication des centaines
    const getHundredsExplanation = (digit: string) => {
      if (digit === '0') return 'zéro centaine égale zéro cent';
      if (digit === '1') return '1 centaine égale cent';
      const hundredText = hundredsToFrench(digit);
      return `${digit} centaines égale ${hundredText}`;
    };
    
    // 1. Unités (dernier chiffre)
    await animateDigit(digits.length - 1, 'unites-value', 0);
    if (!stopSignalRef.current) {
      setIsPlayingVocal(true);
      const unitDigit = digits[digits.length - 1];
      const explanation = getUnitsExplanation(unitDigit);
      await playAudio(explanation);
      setIsPlayingVocal(false);
      if (!stopSignalRef.current) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    // 2. Dizaines (avant-dernier chiffre)
    if (digits.length >= 2 && !stopSignalRef.current) {
      await animateDigit(digits.length - 2, 'dizaines-value', 0);
      if (!stopSignalRef.current) {
        setIsPlayingVocal(true);
        const tenDigit = digits[digits.length - 2];
        const explanation = getTensExplanation(tenDigit);
        await playAudio(explanation);
        setIsPlayingVocal(false);
        if (!stopSignalRef.current) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }
    
    // 3. Centaines (premier chiffre)
    if (digits.length >= 3 && !stopSignalRef.current) {
      await animateDigit(digits.length - 3, 'centaines-value', 0);
      if (!stopSignalRef.current) {
        setIsPlayingVocal(true);
        const hundredDigit = digits[digits.length - 3];
        const explanation = getHundredsExplanation(hundredDigit);
        await playAudio(explanation);
        setIsPlayingVocal(false);
        if (!stopSignalRef.current) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }

    // Conclusion vocale avec le nombre complet
    if (!stopSignalRef.current) {
      setIsPlayingVocal(true);
      const completeReading = numbers.find(n => n.value === selectedNumber)?.reading || selectedNumber;
      const conclusionText = `Et donc, ${selectedNumber} se lit ${completeReading} !`;
      await playAudio(conclusionText);
      setIsPlayingVocal(false);
    }

    // Remettre l'opacité normale pour tous les chiffres
    Object.values(tableElements).forEach(el => {
      if (el) {
        el.style.opacity = '1';
      }
    });
    
    setIsAnimating(false);
  };

  const handleNext = () => {
    // Si aucune réponse vérifiée encore, on vérifie
    if (isCorrect === null) {
      const normalizeText = (text: string) => {
        // Supprimer les espaces en début et fin, mettre en minuscules
        return text.toLowerCase().trim().replace(/\s+/g, ' ');
      };

      const createVariants = (text: string) => {
        const normalized = normalizeText(text);
        // Version avec tirets (nouvelle orthographe)
        const withDashes = normalized.replace(/\s/g, '-');
        // Version sans tirets (ancienne orthographe)  
        const withoutDashes = normalized.replace(/-/g, ' ').replace(/\s+/g, ' ');
        return [normalized, withDashes, withoutDashes];
      };

      const userNormalized = normalizeText(userAnswer);
      const correctVariants = createVariants(exercises[currentExercise].reading);
      
      // Accepter si la réponse correspond à l'une des variantes officielles
      const correct = correctVariants.some(variant => 
        userNormalized === variant || 
        userNormalized === variant.replace(/-/g, ' ').replace(/\s+/g, ' ')
      );
      setIsCorrect(correct);
      
      if (correct && !answeredCorrectly.has(currentExercise)) {
        setScore(prevScore => prevScore + 1);
        setAnsweredCorrectly(prev => {
          const newSet = new Set(prev);
          newSet.add(currentExercise);
          return newSet;
        });
        const newResults = [...exerciseResults];
        newResults[currentExercise] = true;
        setExerciseResults(newResults);
      } else {
        const newResults = [...exerciseResults];
        newResults[currentExercise] = false;
        setExerciseResults(newResults);
      }

      // Si bonne réponse → passage automatique après 1.5s
      if (correct) {
        setTimeout(() => {
          if (currentExercise + 1 < exercises.length) {
            setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
            setUserAnswer('');
            setIsCorrect(null);
          } else {
            // Dernier exercice terminé, afficher la modale
            const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
            setFinalScore(finalScoreValue);
            setShowCompletionModal(true);
            
            // Sauvegarder les progrès
            saveProgress(finalScoreValue, exercises.length);
          }
        }, 1500);
      }
      // Si mauvaise réponse, on affiche la correction et on attend le clic suivant
    } else {
      // Réponse déjà vérifiée, on passe au suivant
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
        setUserAnswer('');
        setIsCorrect(null);
      } else {
        // Dernier exercice, afficher la modale
        setFinalScore(score);
        setShowCompletionModal(true);
        
        // Sauvegarder les progrès
        saveProgress(score, exercises.length);
      }
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setIsCorrect(null);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setExerciseResults([]);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  // Effet pour arrêter les vocaux lors du changement cours ↔ exercices
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.3), 0 0 16px rgba(59, 130, 246, 0.1);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.5), 0 0 24px rgba(59, 130, 246, 0.2);
            transform: scale(1.02);
          }
        }
        
        @keyframes pulseGlowGreen {
          0%, 100% {
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.3), 0 0 16px rgba(34, 197, 94, 0.1);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 12px rgba(34, 197, 94, 0.5), 0 0 24px rgba(34, 197, 94, 0.2);
            transform: scale(1.02);
          }
        }
        
        @keyframes pulseGlowYellow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(234, 179, 8, 0.3), 0 0 16px rgba(234, 179, 8, 0.1);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 12px rgba(234, 179, 8, 0.5), 0 0 24px rgba(234, 179, 8, 0.2);
            transform: scale(1.02);
          }
        }
        
        @keyframes pulseGlowGray {
          0%, 100% {
            box-shadow: 0 0 8px rgba(107, 114, 128, 0.3), 0 0 16px rgba(107, 114, 128, 0.1);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 12px rgba(107, 114, 128, 0.5), 0 0 24px rgba(107, 114, 128, 0.2);
            transform: scale(1.02);
          }
        }
        
        .pulse-interactive {
          animation: pulseGlow 2.5s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        
        .pulse-interactive-green {
          animation: pulseGlowGreen 2.5s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        
        .pulse-interactive-yellow {
          animation: pulseGlowYellow 2.5s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        
        .pulse-interactive-gray {
          animation: pulseGlowGray 2.5s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        
        .flying-digit {
          animation: slideIn 0.5s ease-out;
        }
        
        .pulse-interactive:hover,
        .pulse-interactive-green:hover,
        .pulse-interactive-yellow:hover,
        .pulse-interactive-gray:hover {
          animation-duration: 1.5s;
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/chapitre/ce1-nombres-jusqu-1000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4" onClick={stopAllVocalsAndAnimations}>
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au chapitre</span>
            </Link>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                👁️ Apprendre à lire les nombres
              </h1>
              <p className="text-lg text-gray-600 hidden sm:block">
                Découvre comment lire tous les nombres jusqu'à 1000 !
              </p>
            </div>
          </div>

          {/* Navigation entre cours et exercices */}
          <div id="tab-navigation" className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <button
                id="tab-cours"
                onClick={() => setShowExercises(false)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  !showExercises 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                } ${highlightedElement === 'tab-cours' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''}`}
              >
                📖 Cours
              </button>
              <button
                id="tab-exercices"
                onClick={() => setShowExercises(true)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  showExercises 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                } ${highlightedElement === 'tab-exercices' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''}`}
              >
                ✏️ Exercices ({score}/{exercises.length})
              </button>
            </div>
          </div>

          {!showExercises ? (
            /* COURS */
            <div className="space-y-4 sm:space-y-8">
              {/* Personnage Minecraft avec bouton DÉMARRER */}
              <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 p-3 sm:p-4 mb-4 sm:mb-6">
                {/* Image du personnage Minecraft */}
                <div className={`relative transition-all duration-500 border-4 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg ${
                  isPlayingVocal
                    ? 'w-20 sm:w-24 h-20 sm:h-24' // When speaking - encore plus gros
                    : characterSizeExpanded
                      ? 'w-16 sm:w-20 h-16 sm:h-20' // After start - taille normale
                      : 'w-12 sm:w-16 h-12 sm:h-16' // Initial - plus petit
                }`}>
                  <img 
                    src="/image/Minecraftstyle.png" 
                    alt="Personnage Minecraft" 
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
                
                            {/* Bouton DÉMARRER */}
            <div className="text-center">
              <button
                onClick={explainChapter}
                disabled={isPlayingVocal}
                className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-xl shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                }`}
              >
                <Play className="inline w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
              </button>
              

            </div>
              </div>

              {/* Sélecteur de nombre */}
              <div id="number-selector" className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                <h2 className="text-lg sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                  🎯 Choisis un nombre à découvrir
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {numbers.map((num, index) => (
                    <button
                      key={num.value}
                      id={`number-btn-${index}`}
                      onClick={() => {
                        setSelectedNumber(num.value);
                        // Scroll automatique vers l'animation
                        setTimeout(() => scrollToElement('animation-section'), 100);
                      }}
                      className={`p-2 sm:p-4 rounded-md sm:rounded-lg font-bold text-base sm:text-xl transition-all pulse-interactive flex items-center justify-center min-h-[3rem] sm:min-h-[4rem] ${
                        selectedNumber === num.value
                          ? 'bg-green-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${highlightedElement === `number-btn-${index}` ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-110 animate-pulse' : ''}`}
                    >
                      {num.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Affichage du nombre */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 shadow-lg text-center">
                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900">
                  📊 Regardons le nombre {selectedNumber}
                </h3>
                
                {/* Nombre avec animation */}
                <div className="flex justify-center items-center space-x-1 sm:space-x-2 mb-4 sm:mb-8">
                  {selectedNumber.split('').map((digit, index) => (
                    <div
                      key={index}
                      id={`digit-${index}`}
                      className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center text-lg sm:text-3xl font-bold text-blue-900 transition-all duration-300"
                    >
                      {digit}
                    </div>
                  ))}
                </div>

                {/* Décomposition avec vrai tableau */}
                <div id="animation-section" className="bg-green-50 rounded-lg p-2 sm:p-6 mb-3 sm:mb-6">
                  <h4 className="text-sm sm:text-lg font-bold mb-2 sm:mb-4 text-green-800">
                    🧩 Décomposition dans un tableau :
                  </h4>
                  <p className="text-xs sm:text-sm text-green-700 mb-2 sm:mb-4 font-semibold">
                    📝 On commence toujours par placer les unités, puis les dizaines, puis les centaines !
                  </p>
                  
                  {/* Nombre source pour l'animation */}
                  <div className="flex justify-center mb-3 sm:mb-6">
                    <div className="bg-white rounded-lg p-2 sm:p-4 shadow-lg border-2 border-blue-300">
                      <p className="text-xs sm:text-sm text-blue-700 font-semibold mb-1 sm:mb-2 text-center">Nombre à décomposer :</p>
                      
                      {/* Conteneur pour centrer les chiffres par rapport au bouton */}
                      <div className="flex flex-col items-center">
                        <div className="flex space-x-1 sm:space-x-2 mb-2 sm:mb-4 justify-center">
                          {selectedNumber.split('').map((digit, index) => (
                            <div
                              key={index}
                              id={`source-digit-${index}`}
                              className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center text-lg sm:text-2xl font-bold text-blue-900 transition-all duration-1000"
                            >
                              {digit}
                            </div>
                          ))}
                        </div>
                        
                        {/* Bouton d'animation */}
                        <button
                          id="animation-button"
                          onClick={animateNumber}
                          disabled={isAnimating || isPlayingVocal}
                          className={`bg-blue-500 text-white px-3 sm:px-6 py-1 sm:py-3 rounded-md sm:rounded-lg font-bold text-xs sm:text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 mb-2 sm:mb-3 pulse-interactive flex items-center justify-center min-h-[2rem] sm:min-h-[3rem] ${
                            highlightedElement === 'animation-button' ? 'ring-4 ring-yellow-400 bg-blue-400 scale-110 animate-pulse' : ''
                          }`}
                        >
                          {isAnimating ? (
                            <>
                              <Pause className="inline w-4 h-4 mr-2" />
                              {isPlayingVocal ? 'J\'explique...' : 'Placement en cours...'}
                            </>
                          ) : (
                            <>
                              <Play className="inline w-4 h-4 mr-2" />
                              Voir le placement dans le tableau
                            </>
                          )}
                        </button>
                        

                        
                        {/* Explication pour l'animation */}
                        <div className="bg-blue-50 rounded-lg p-2 sm:p-3 border-2 border-blue-300">
                          <p className="text-xs sm:text-xs text-blue-700 font-semibold text-center">
                            💡 Clique sur le bouton pour voir comment on place les chiffres un par un !
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vrai tableau HTML */}
                  <div className="flex justify-center mb-2 sm:mb-4 overflow-x-auto">
                    <table className="border-collapse border-2 border-green-600 bg-white rounded-md sm:rounded-lg overflow-hidden shadow-lg w-full max-w-sm sm:max-w-full sm:min-w-0">
                      <thead>
                        <tr className="bg-green-200">
                          <th className="border-2 border-green-600 px-2 sm:px-6 py-1 sm:py-3 text-green-800 font-bold text-xs sm:text-lg">
                            Centaines
                          </th>
                          <th className="border-2 border-green-600 px-2 sm:px-6 py-1 sm:py-3 text-green-800 font-bold text-xs sm:text-lg">
                            Dizaines
                          </th>
                          <th className="border-2 border-green-600 px-2 sm:px-6 py-1 sm:py-3 text-green-800 font-bold text-xs sm:text-lg">
                            Unités
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-2 border-green-600 px-2 sm:px-6 py-2 sm:py-4 text-center bg-green-100 transition-all duration-300" id="centaines-cell">
                            <div className="text-lg sm:text-3xl font-bold text-green-900" id="centaines-value">
                              {selectedNumber.length >= 3 ? selectedNumber[selectedNumber.length - 3] : '0'}
                            </div>
                          </td>
                          <td className="border-2 border-green-600 px-2 sm:px-6 py-2 sm:py-4 text-center bg-green-100 transition-all duration-300" id="dizaines-cell">
                            <div className="text-lg sm:text-3xl font-bold text-green-900" id="dizaines-value">
                              {selectedNumber.length >= 2 ? selectedNumber[selectedNumber.length - 2] : '0'}
                            </div>
                          </td>
                          <td className="border-2 border-green-600 px-2 sm:px-6 py-2 sm:py-4 text-center bg-green-100 transition-all duration-300" id="unites-cell">
                            <div className="text-lg sm:text-3xl font-bold text-green-900" id="unites-value">
                              {selectedNumber[selectedNumber.length - 1]}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Explication du placement */}
                  <div className="bg-white rounded-lg p-2 sm:p-4 border-2 border-green-300">
                    <h5 className="font-bold text-green-800 mb-1 sm:mb-2 text-xs sm:text-base">
                      📍 Comment placer les chiffres :
                    </h5>
                    <div className="space-y-0.5 sm:space-y-2 text-xs sm:text-sm text-green-700">
                      <p><span className="font-bold text-blue-600">1.</span> On place le chiffre des <span className="font-bold text-green-800">unités</span> (dernier à droite)</p>
                      <p><span className="font-bold text-blue-600">2.</span> Puis le chiffre des <span className="font-bold text-green-800">dizaines</span> (au milieu)</p>
                      <p><span className="font-bold text-blue-600">3.</span> Enfin le chiffre des <span className="font-bold text-green-800">centaines</span> (premier à gauche)</p>
                    </div>
                  </div>
                </div>

                {/* Lecture du nombre - maintenant à la fin */}
                <div id="reading-section" className="bg-yellow-50 rounded-lg p-2 sm:p-6 mb-3 sm:mb-6">
                  <h4 className="text-xs sm:text-lg font-bold mb-2 sm:mb-3 text-yellow-800">
                    🗣️ Comment le lire :
                  </h4>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                    <p className="text-sm sm:text-2xl font-bold text-yellow-900 text-center">
                      {numbers.find(n => n.value === selectedNumber)?.reading}
                    </p>
                    <button
                      id="listen-button"
                      onClick={() => speakNumber(numbers.find(n => n.value === selectedNumber)?.reading || '')}
                      disabled={isPlayingVocal}
                      className={`bg-yellow-500 text-white px-2 sm:px-4 py-1 sm:py-3 rounded-md sm:rounded-lg font-bold text-xs sm:text-base hover:bg-yellow-600 transition-colors disabled:opacity-50 pulse-interactive-yellow flex items-center justify-center ${
                        highlightedElement === 'listen-button' ? 'ring-4 ring-yellow-400 bg-yellow-400 scale-110 animate-pulse' : ''
                      }`}
                    >
                      <Volume2 className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Écouter
                    </button>
                  </div>
                </div>
              </div>

              {/* Conseils */}
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg sm:rounded-xl p-3 sm:p-6 text-white">
                <h3 className="text-sm sm:text-xl font-bold mb-2 sm:mb-3">💡 Astuces pour bien lire</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-base">
                  <li>• Commence toujours par les centaines</li>
                  <li>• Puis les dizaines</li>
                  <li>• Et enfin les unités</li>
                  <li>• N'oublie pas de dire "cent" quand il y en a !</li>
                </ul>
              </div>
            </div>
          ) : (
            /* EXERCICES */
            <div className="space-y-4 sm:space-y-8">
              {/* Personnage Minecraft avec bouton DÉMARRER */}
              <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 p-3 sm:p-4 mb-4 sm:mb-6">
                {/* Image du personnage Minecraft */}
                <div className={`relative transition-all duration-500 border-4 border-blue-300 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 shadow-lg ${
                  isPlayingVocal
                    ? 'w-20 sm:w-24 h-20 sm:h-24' // When speaking - encore plus gros
                    : characterSizeExpanded
                      ? 'w-16 sm:w-20 h-16 sm:h-20' // After start - taille normale
                      : 'w-12 sm:w-16 h-12 sm:h-16' // Initial - plus petit
                }`}>
                  <img 
                    src="/image/Minecraftstyle.png" 
                    alt="Personnage Minecraft" 
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
                
                {/* Bouton DÉMARRER */}
                <div className="text-center">
                  <button
                    onClick={explainChapter}
                    disabled={isPlayingVocal}
                    className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-xl shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all transform hover:scale-105 ${
                      isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                    }`}
                  >
                    <Play className="inline w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                    {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                  </button>
                  

                </div>
              </div>

              {/* Header exercices */}
              <div id="score-section" className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 gap-3 sm:gap-0">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
                    ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                  </h2>
                  <button
                    onClick={resetAll}
                    disabled={isPlayingVocal}
                    className="bg-gray-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg font-bold text-sm sm:text-base hover:bg-gray-600 transition-colors disabled:opacity-50 pulse-interactive-gray flex items-center justify-center"
                  >
                    <RotateCcw className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Recommencer
                  </button>
                </div>
                
                {/* Barre de progression */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                  ></div>
                </div>
                
                {/* Score sous la barre */}
                <div className="text-center">
                  <div id="score-display" className={`text-lg font-bold text-blue-600 ${
                    highlightedElement === 'score-display' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-110 animate-pulse p-2 rounded-lg' : ''
                  }`}>
                    Score : {score}/{exercises.length}
                  </div>
                </div>
              </div>

              {/* Question */}
              <div id="exercise-question" className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 shadow-lg text-center">
                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900">
                  📝 Écris ce nombre en lettres
                </h3>
                
                <div id="mystery-number" className={`text-4xl sm:text-6xl font-bold text-blue-600 mb-6 sm:mb-8 ${
                  highlightedElement === 'mystery-number' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-110 animate-pulse p-2 sm:p-4 rounded-lg' : ''
                }`}>
                  {exercises[currentExercise].number}
                </div>
                
                <div className="max-w-xs sm:max-w-md mx-auto mb-4 sm:mb-6">
                  <input
                    id="answer-input"
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Écris comment tu lis ce nombre..."
                    className={`w-full px-3 sm:px-4 py-3 sm:py-3 border-2 border-gray-300 rounded-md sm:rounded-lg text-center text-base sm:text-lg focus:border-blue-500 focus:outline-none bg-white text-gray-900 ${
                      highlightedElement === 'answer-input' ? 'ring-4 ring-yellow-400 bg-yellow-100 scale-105' : ''
                    }`}
                  />
                </div>
                
                <div className="flex justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <button
                    id="erase-button"
                    onClick={resetExercise}
                    disabled={isPlayingVocal}
                    className={`bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md sm:rounded-lg font-bold text-sm sm:text-base hover:bg-gray-600 transition-colors disabled:opacity-50 pulse-interactive-gray flex items-center justify-center ${
                      highlightedElement === 'erase-button' ? 'ring-4 ring-yellow-400 bg-gray-400 scale-110 animate-pulse' : ''
                    }`}
                  >
                    Effacer
                  </button>
                </div>
                
                {/* Résultat */}
                {isCorrect !== null && (
                  <div className={`p-4 rounded-lg mb-6 ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <div className="flex items-center justify-center space-x-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          <span className="font-bold">Excellent ! C'est la bonne réponse !</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6" />
                          <span className="font-bold">
                            Pas tout à fait... La bonne réponse est : "{exercises[currentExercise].reading}"
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Navigation */}
                <div id="navigation-buttons" className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    id="previous-button"
                    onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                    disabled={currentExercise === 0 || isPlayingVocal}
                    className={`bg-gray-300 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-md sm:rounded-lg font-bold text-sm sm:text-base hover:bg-gray-400 transition-colors disabled:opacity-50 pulse-interactive-gray flex items-center justify-center ${
                      highlightedElement === 'previous-button' ? 'ring-4 ring-yellow-400 bg-gray-200 scale-110 animate-pulse' : ''
                    }`}
                  >
                    ← Précédent
                  </button>
                  <button
                    id="next-button"
                    onClick={handleNext}
                    disabled={(!userAnswer.trim() && isCorrect === null) || isPlayingVocal}
                    className={`bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md sm:rounded-lg font-bold text-sm sm:text-base hover:bg-green-600 transition-colors disabled:opacity-50 pulse-interactive-green flex items-center justify-center ${
                      highlightedElement === 'next-button' ? 'ring-4 ring-yellow-400 bg-green-400 scale-110 animate-pulse' : ''
                    }`}
                  >
                    {isCorrect === null ? 'Vérifier' : 'Suivant →'}
                  </button>
                </div>
              </div>


            </div>
          )}

          {/* Modale de fin d'exercices */}
          {showCompletionModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all">
                {(() => {
                  const percentage = Math.round((finalScore / exercises.length) * 100);
                  const getMessage = () => {
                    if (percentage >= 90) return { title: "🎉 Excellent !", message: "Tu maîtrises parfaitement la lecture des nombres jusqu'à 1000 !", emoji: "🎉" };
                    if (percentage >= 70) return { title: "👏 Bien joué !", message: "Tu sais bien lire les nombres ! Continue comme ça !", emoji: "👏" };
                    if (percentage >= 50) return { title: "👍 C'est un bon début !", message: "Tu progresses bien. Entraîne-toi encore un peu !", emoji: "😊" };
                    return { title: "💪 Continue à t'entraîner !", message: "Recommence les exercices pour mieux maîtriser la lecture des nombres.", emoji: "📚" };
                  };
                  const result = getMessage();
                  return (
                    <>
                      <div className="text-6xl mb-4">{result.emoji}</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                      <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                      <div className="bg-gray-100 rounded-lg p-4 mb-6">
                        <p className="text-xl font-bold text-gray-900">
                          Score final : {finalScore}/{exercises.length} ({percentage}%)
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={resetAll}
                          disabled={isPlayingVocal}
                          className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50 pulse-interactive-green flex items-center justify-center"
                        >
                          Recommencer
                        </button>
                        <button
                          onClick={() => setShowCompletionModal(false)}
                          disabled={isPlayingVocal}
                          className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors disabled:opacity-50 pulse-interactive-gray flex items-center justify-center"
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
        
        {/* Bouton flottant Minecraft pour arrêter les vocaux */}
        {(isPlayingVocal || isAnimating) && (
          <div className="fixed top-4 right-4 z-[60]">
            <button
              onClick={stopAllVocalsAndAnimations}
              className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
              title="Arrêter l'explication"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50">
                <img 
                  src="/image/Minecraftstyle.png" 
                  alt="Personnage Minecraft" 
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
    </>
  );
} 