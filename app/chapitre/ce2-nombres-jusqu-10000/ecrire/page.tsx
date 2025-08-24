'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Play, Pause, Volume2 } from 'lucide-react';

export default function EcrireNombresCE2Page() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
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
  const [isAnimating, setIsAnimating] = useState(false);


  // États pour l'animation des exemples
  const [exampleAnimating, setExampleAnimating] = useState<string | null>(null);
  const [exampleStep, setExampleStep] = useState(0);

  // États pour le glisser-déposer interactif
  const [dragDropExercise, setDragDropExercise] = useState<{written: string, number: string} | null>(null);
  const [draggedElements, setDraggedElements] = useState<{[key: string]: string}>({});
  const [completedDropZones, setCompletedDropZones] = useState<string[]>([]);
  const [showFinalConstruction, setShowFinalConstruction] = useState(false);
  
  // États pour le support tactile mobile et drag visuel
  const [touchDragElement, setTouchDragElement] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);

  // Refs pour contrôler les vocaux
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);



  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'ecrire',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('ce2-nombres-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'ecrire');
      
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

    localStorage.setItem('ce2-nombres-progress', JSON.stringify(allProgress));
  };

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    if (currentAudioRef.current) {
      speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
    setIsPlayingVocal(false);
    setIsAnimating(false);
    setHighlightedElement(null);
    
    // Réinitialiser les états d'animation des exemples
    setExampleAnimating(null);
    setExampleStep(0);
    
    // Réinitialiser le signal d'arrêt après un court délai pour permettre de nouvelles animations
    setTimeout(() => {
      stopSignalRef.current = false;
    }, 100);
    
    // Nettoyer les illuminations de glisser-déposer
    document.querySelectorAll('[data-drag-part]').forEach(element => {
      (element as HTMLElement).style.boxShadow = '';
      (element as HTMLElement).style.transform = '';
    });
    
    // Nettoyer les illuminations des zones de dépôt
    document.querySelectorAll('[data-drop-zone]').forEach(element => {
      (element as HTMLElement).style.boxShadow = '';
      (element as HTMLElement).style.transform = '';
      (element as HTMLElement).style.borderColor = '';
      (element as HTMLElement).style.borderWidth = '';
    });
    
    // Nettoyer les encadrés de valeurs positionnelles créés dynamiquement
    document.querySelectorAll('[id*="-value-box-"]').forEach(element => {
      element.remove();
    });
    
    // Nettoyer les états tactiles et de drag visuel
    setTouchDragElement(null);
    setIsDragging(false);
    setDraggedElementId(null);
    setDragOffset({ x: 0, y: 0 });
    setDragPosition({ x: 0, y: 0 });
    
    // Supprimer l'élément de drag visuel s'il existe
    const dragElement = document.getElementById('visual-drag-element');
    if (dragElement) {
      document.body.removeChild(dragElement);
    }
    
    // Nettoyer les styles tactiles sur les éléments draggables
    document.querySelectorAll('[data-drag-part]').forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.opacity = '';
      htmlElement.style.zIndex = '';
    });
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

  // Fonction pour jouer un audio avec voix Minecraft
  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;    // Légèrement plus lent
      utterance.pitch = 1.1;   // Légèrement plus aigu
      utterance.lang = 'fr-FR';
      
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
      speechSynthesis.speak(utterance);
    });
  };

  // Fonction pour expliquer le chapitre (tutoriel vocal)
  const explainChapter = async () => {
    stopSignalRef.current = false;
    setHasStarted(true);
    setCharacterSizeExpanded(true);

    // Détecter les voix Chrome pour une meilleure qualité
    if ('speechSynthesis' in window) {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Attendre que les voix se chargent
        await new Promise<SpeechSynthesisVoice[]>((resolve) => {
          const checkVoices = () => {
            const voices = speechSynthesis.getVoices();
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
      await playAudio("Salut petit architecte ! Bienvenue dans l'atelier de construction des nombres !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Objectif de ta mission : transformer les mots magiques en chiffres précis !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Voici tes outils de construction :");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (stopSignalRef.current) return;
      scrollToElement('score-section');
      await playAudio("D'abord, ton compteur de réussites ! Chaque nombre construit correctement te donne des points !");
      if (stopSignalRef.current) return;
      highlightElement('score-display', 3000);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('exercise-question');
      await playAudio("Ensuite, tu verras les mots magiques à transformer, comme un sort à décoder !");
      if (stopSignalRef.current) return;
      highlightElement('word-number', 2500);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Écris le nombre en chiffres dans le champ de construction !");
      if (stopSignalRef.current) return;
      highlightElement('answer-input', 2500);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Le bouton Effacer, c'est ta gomme magique pour recommencer !");
      if (stopSignalRef.current) return;
      highlightElement('erase-button', 2500);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('navigation-buttons');
      // Détection dynamique du texte du bouton
      const buttonText = isCorrect === null ? 'Vérifier' : 'Suivant';
      const buttonExplanation = isCorrect === null 
        ? "Le bouton Vérifier, c'est pour valider ta construction comme un contrôle qualité !" 
        : "Le bouton Suivant, c'est pour passer au prochain défi une fois réussi !";
      await playAudio(`${buttonExplanation} Et Précédent pour revenir en arrière !`);
      if (stopSignalRef.current) return;
      await highlightElementsSequentially(['next-button', 'previous-button'], 1000);
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('tab-navigation');
      await playAudio("N'oublie pas, tu peux retourner au Cours en haut pour réviser les règles !");
      if (stopSignalRef.current) return;
      await highlightElementsSequentially(['tab-cours', 'tab-exercices'], 1000);
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Allez petit constructeur, montre-moi tes talents ! C'est parti pour l'aventure !");
      
    } else {
      // Mode d'emploi pour le cours
      if (stopSignalRef.current) return;
      await playAudio("Salut petit bâtisseur ! Bienvenue dans l'école de construction des nombres !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Objectif : apprendre à transformer les mots en chiffres jusqu'à 10000 comme un vrai architecte !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Voici ta boîte à outils :");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (stopSignalRef.current) return;
      scrollToElement('rules-section');
      await playAudio("D'abord, les règles de construction ! Milliers, centaines, dizaines et unités, comme des étages à assembler !");
      if (stopSignalRef.current) return;
      highlightElement('rules-section', 3000);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('examples-section');
      await playAudio("Ensuite, des exemples de constructions réussies ! Clique pour voir comment ça marche !");
      if (stopSignalRef.current) return;
      highlightElement('examples-section', 3000);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('interactive-section');
      await playAudio("Et enfin, ton atelier personnel ! Choisis un mot et vois sa transformation en chiffres !");
      if (stopSignalRef.current) return;
      highlightElement('interactive-section', 3000);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('tab-navigation');
      await playAudio("En haut, tu as Cours pour apprendre et Exercices pour t'entraîner !");
      if (stopSignalRef.current) return;
      await highlightElementsSequentially(['tab-cours', 'tab-exercices'], 1000);
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Alors petit architecte, prêt à construire des nombres ? C'est parti pour l'aventure !");
    }
  };

  // Fonction pour décomposer un nombre en parties pour le glisser-déposer (spécifique CE2)
  const decomposeDragDropNumber = (written: string, number: string) => {
    const num = parseInt(number);
    const milliers = Math.floor(num / 1000);
    const centaines = Math.floor((num % 1000) / 100);
    const dizaines = Math.floor((num % 100) / 10);
    const unites = num % 10;

    // Décomposition des mots français
    const parts = [];
    
    // Traitement des milliers (spécifique CE2)
    if (milliers > 0) {
      let millierText = '';
      if (milliers === 1) {
        millierText = 'mille';
      } else {
        const millierWords = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
        millierText = `${millierWords[milliers]} mille`;
      }
      parts.push({
        text: millierText,
        value: milliers.toString(),
        position: 'milliers',
        color: 'red'
      });
    }
    
    // Traitement des centaines
    if (centaines > 0) {
      let centaineText = '';
      if (centaines === 1) {
        centaineText = 'cent';
      } else {
        const centaineWords = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
        centaineText = `${centaineWords[centaines]} cent`;
      }
      parts.push({
        text: centaineText,
        value: centaines.toString(),
        position: 'centaines',
        color: 'green'
      });
    }

    // Traitement des dizaines
    if (dizaines > 0) {
      let dizaineText = '';
      if (dizaines === 1) {
        dizaineText = 'dix';
      } else if (dizaines === 2) {
        dizaineText = 'vingt';
      } else if (dizaines === 3) {
        dizaineText = 'trente';
      } else if (dizaines === 4) {
        dizaineText = 'quarante';
      } else if (dizaines === 5) {
        dizaineText = 'cinquante';
      } else if (dizaines === 6) {
        dizaineText = 'soixante';
      } else if (dizaines === 7) {
        dizaineText = 'soixante-dix';
      } else if (dizaines === 8) {
        dizaineText = 'quatre-vingt';
      } else if (dizaines === 9) {
        dizaineText = 'quatre-vingt-dix';
      }
      
      parts.push({
        text: dizaineText,
        value: dizaines.toString(),
        position: 'dizaines',
        color: 'blue'
      });
    }

    // Traitement des unités
    if (unites > 0) {
      const uniteWords = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
      parts.push({
        text: uniteWords[unites],
        value: unites.toString(),
        position: 'unites',
        color: 'green'
      });
    }

    return parts;
  };

  // Fonctions de glisser-déposer
  const handleDragStart = (e: React.DragEvent, part: any) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(part));
    e.dataTransfer.effectAllowed = 'move';
    
    // Créer un élément fantôme personnalisé
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';  // Hors écran pour éviter un flash
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 20, 10);  // Valeurs fixes plus petites pour mieux coller au curseur
    
    // Nettoyer l'élément fantôme après un délai
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPosition: string) => {
    e.preventDefault();
    const partData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    if (partData.position === targetPosition) {
      setDraggedElements(prev => ({
        ...prev,
        [targetPosition]: partData.value
      }));
      
      setCompletedDropZones(prev => [...prev, targetPosition]);
      
      // Vérifier si tous les éléments sont placés
      const allParts = decomposeDragDropNumber(dragDropExercise!.written, dragDropExercise!.number);
      if (completedDropZones.length + 1 >= allParts.length) {
        setTimeout(() => {
          setShowFinalConstruction(true);
        }, 500);
      }
    }
  };

  // Fonctions de support tactile pour mobile
  const handleTouchStart = (e: React.TouchEvent, part: any) => {
    if (completedDropZones.includes(part.position)) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    
    setTouchDragElement(part);
    setIsDragging(true);
    setDraggedElementId(`drag-part-${part.position}`);
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top - rect.height / 2 // Ajustement pour centrer verticalement
    });
    setDragPosition({
      x: touch.clientX - dragOffset.x,
      y: touch.clientY - dragOffset.y
    });
    
    // Créer un élément de drag visuel
    const dragElement = element.cloneNode(true) as HTMLElement;
    dragElement.id = 'visual-drag-element';
    dragElement.style.position = 'fixed';
    dragElement.style.pointerEvents = 'none';
    dragElement.style.zIndex = '9999';
    dragElement.style.transform = 'scale(1.1) rotate(5deg)';
    dragElement.style.opacity = '0.9';
    dragElement.style.left = `${touch.clientX - 20}px`;  // Décalage fixe de 20px à gauche du doigt
    dragElement.style.top = `${touch.clientY - 20}px`;   // Décalage fixe de 20px au-dessus du doigt
    dragElement.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    document.body.appendChild(dragElement);
    
    // Masquer l'élément original pendant le drag
    element.style.opacity = '0.3';
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !touchDragElement) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    
    // Mettre à jour la position de l'élément de drag visuel
    const dragElement = document.getElementById('visual-drag-element');
    if (dragElement) {
      dragElement.style.left = `${touch.clientX - 20}px`;  // Décalage fixe de 20px à gauche du doigt
      dragElement.style.top = `${touch.clientY - 20}px`;   // Décalage fixe de 20px au-dessus du doigt
    }
    
    // Trouver l'élément sous le doigt
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('[data-drop-zone]');
    
    // Illuminer la zone de dépôt si elle correspond
    document.querySelectorAll('[data-drop-zone]').forEach(zone => {
      const zoneElement = zone as HTMLElement;
      if (zone === dropZone && zone.getAttribute('data-drop-zone') === touchDragElement.position) {
        zoneElement.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.6)';
        zoneElement.style.transform = 'scale(1.02)';
        zoneElement.style.borderColor = '#22c55e';
        zoneElement.style.borderWidth = '3px';
      } else {
        zoneElement.style.boxShadow = '';
        zoneElement.style.transform = '';
        zoneElement.style.borderColor = '';
        zoneElement.style.borderWidth = '';
      }
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || !touchDragElement) return;
    
    e.preventDefault();
    const touch = e.changedTouches[0];
    
    // Supprimer l'élément de drag visuel
    const dragElement = document.getElementById('visual-drag-element');
    if (dragElement) {
      document.body.removeChild(dragElement);
    }
    
    // Restaurer l'élément original
    const originalElement = e.currentTarget as HTMLElement;
    originalElement.style.opacity = '';
    
    // Trouver l'élément sous le doigt
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('[data-drop-zone]');
    const targetPosition = dropZone?.getAttribute('data-drop-zone');
    
    // Nettoyer les illuminations
    document.querySelectorAll('[data-drop-zone]').forEach(zone => {
      const zoneElement = zone as HTMLElement;
      zoneElement.style.boxShadow = '';
      zoneElement.style.transform = '';
      zoneElement.style.borderColor = '';
      zoneElement.style.borderWidth = '';
    });
    
    // Effectuer le dépôt si la zone est correcte
    if (targetPosition && targetPosition === touchDragElement.position) {
      setDraggedElements(prev => ({
        ...prev,
        [targetPosition]: touchDragElement.value
      }));
      
      setCompletedDropZones(prev => [...prev, targetPosition]);
      
      // Vérifier si tous les éléments sont placés
      const allParts = decomposeDragDropNumber(dragDropExercise!.written, dragDropExercise!.number);
      if (completedDropZones.length + 1 >= allParts.length) {
        setTimeout(() => {
          setShowFinalConstruction(true);
        }, 500);
      }
    }
    
    // Réinitialiser les États tactiles
    setTouchDragElement(null);
    setIsDragging(false);
    setDraggedElementId(null);
    setDragOffset({ x: 0, y: 0 });
    setDragPosition({ x: 0, y: 0 });
  };

  // Réinitialiser l'exercice de glisser-déposer
  const resetDragDrop = () => {
    setDraggedElements({});
    setCompletedDropZones([]);
    setShowFinalConstruction(false);
    
    // Réinitialiser les états tactiles et de drag visuel
    setTouchDragElement(null);
    setIsDragging(false);
    setDraggedElementId(null);
    setDragOffset({ x: 0, y: 0 });
    setDragPosition({ x: 0, y: 0 });
    
    // Supprimer l'élément de drag visuel s'il existe encore
    const dragElement = document.getElementById('visual-drag-element');
    if (dragElement) {
      document.body.removeChild(dragElement);
    }
    
    // Nettoyer les illuminations de glisser-déposer
    document.querySelectorAll('[data-drag-part]').forEach(element => {
      (element as HTMLElement).style.boxShadow = '';
      (element as HTMLElement).style.transform = '';
    });
    
    // Nettoyer les illuminations des zones de dépôt
    document.querySelectorAll('[data-drop-zone]').forEach(element => {
      (element as HTMLElement).style.boxShadow = '';
      (element as HTMLElement).style.transform = '';
      (element as HTMLElement).style.borderColor = '';
      (element as HTMLElement).style.borderWidth = '';
    });
  };

  // Mode d'emploi vocal court pour le glisser-déposer sans donner la réponse
  const playDragDropInstructions = async (selectedNumber: string, numberData: {written: string, number: string}) => {
    stopSignalRef.current = false;
    
    // Partie 1: Introduction
    await playAudio(`Parfait ! Tu as choisi ${selectedNumber}.`);
    if (stopSignalRef.current) return;
    
    // Attendre un peu
    await new Promise(resolve => setTimeout(resolve, 300));
    if (stopSignalRef.current) return;
    
    // Partie 2: Expliquer la décomposition sans donner les réponses
    await playAudio(`J'ai décomposé le mot en parties colorées pour toi.`);
    if (stopSignalRef.current) return;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    if (stopSignalRef.current) return;
    
          await playAudio(`Regarde bien les couleurs : rouge pour les milliers, vert pour les centaines, bleu pour les dizaines, et violet pour les unités.`);
    if (stopSignalRef.current) return;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    if (stopSignalRef.current) return;
    
    // Instructions finales - laisser l'élève découvrir
    await playAudio(`À toi de jouer ! Fais glisser chaque partie colorée vers la bonne colonne du tableau !`);
    if (stopSignalRef.current) return;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    if (stopSignalRef.current) return;
    
    await playAudio(`Réfléchis bien : où va chaque couleur ?`);
  };

  const examples = [
    { written: 'Deux-mille-trois-cent-quarante-cinq', number: '2345' },
    { written: 'Mille-quatre-vingt-sept', number: '1087' },
    { written: 'Trois-mille-deux-cents', number: '3200' }
  ];

  const exercises = [
    // Mix de différents types de nombres (différents des exemples)
    { written: 'Mille-cinq-cent-vingt-trois', number: '1523' },
    { written: 'Deux-mille-quatre-vingts', number: '2080' },
    { written: 'Trois-mille-six-cents', number: '3600' },
    { written: 'Quatre-mille-vingt-trois', number: '4023' },
    { written: 'Cinq-mille-six-cent-sept', number: '5607' },
    { written: 'Six-mille-quatre-vingt-dix', number: '6090' },
    { written: 'Sept-mille-huit', number: '7008' },
    { written: 'Huit-mille-trois-cent-cinquante', number: '8350' },
    { written: 'Neuf-mille-quatre-vingt-deux', number: '9082' },
    { written: 'Mille-sept-cent-soixante-cinq', number: '1765' },
    { written: 'Quatre-mille-cent', number: '4100' },
    { written: 'Six-mille-quatre-cent-trente', number: '6430' }
  ];

  // 🎯 ANIMATION AVEC TABLEAU PÉDAGOGIQUE SPÉCIFIQUE CE2 (AVEC MILLIERS)
  const animateTableExample = async (exampleType: string) => {
    if (isAnimating) return;
    
    // Réinitialiser le signal d'arrêt pour permettre la nouvelle animation
    stopSignalRef.current = false;
    
    setExampleAnimating(exampleType);
    setExampleStep(0);
    setIsAnimating(true);
    
    // Scroll vers l'exemple en cours d'animation
    setTimeout(() => scrollToElement(`${exampleType}-container`), 100);
    
    const examples = {
      'deux-mille-trois-cent-quarante-cinq': {
        text: 'Deux-mille-trois-cent-quarante-cinq',
        number: '2345',
        digits: [
          { value: '2', position: 'milliers', word: 'deux mille', vocal: 'deux mille' },
          { value: '3', position: 'centaines', word: 'trois cent', vocal: 'trois cent' },
          { value: '4', position: 'dizaines', word: 'quarante', vocal: 'quarante' },
          { value: '5', position: 'unités', word: 'cinq', vocal: 'cinq' }
        ]
      },
      'mille-quatre-vingt-sept': {
        text: 'Mille-quatre-vingt-sept',
        number: '1087',
        digits: [
          { value: '1', position: 'milliers', word: 'mille', vocal: 'mille' },
          { value: '0', position: 'centaines', word: '', vocal: '' },
          { value: '8', position: 'dizaines', word: 'quatre-vingt', vocal: 'quatre-vingt' },
          { value: '7', position: 'unités', word: 'sept', vocal: 'sept' }
        ]
      },
      'trois-mille-deux-cents': {
        text: 'Trois-mille-deux-cents',
        number: '3200',
        digits: [
          { value: '3', position: 'milliers', word: 'trois mille', vocal: 'trois mille' },
          { value: '2', position: 'centaines', word: 'deux cent', vocal: 'deux cent' },
          { value: '0', position: 'dizaines', word: '', vocal: '' },
          { value: '0', position: 'unités', word: '', vocal: '' }
        ]
      }
    };
    
    const example = examples[exampleType as keyof typeof examples];
    if (!example) return;
    
    try {
      // Étape 1: Affichage du mot complet avec explication vocale
      setExampleStep(1);
      
      // Introduction vocale spécifique à chaque exemple
      if (exampleType === 'cent-vingt-trois') {
        await playAudio("Regardons ensemble comment décomposer 'Cent vingt-trois' !");
      } else if (exampleType === 'quatre-vingt-sept') {
        await playAudio("Découvrons comment décomposer 'Quatre-vingt-sept' !");
      } else if (exampleType === 'deux-cent-soixante-sept') {
        await playAudio("Explorons ensemble comment décomposer 'Deux cent soixante-sept' !");
      }
      
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Étape 2: Faire glisser les chiffres vers le tableau avec explication
      setExampleStep(2);
      await playAudio("Regardons chaque chiffre se placer dans sa colonne : milliers, centaines, dizaines et unités !");
      if (stopSignalRef.current) return;
      
      for (let i = 0; i < example.digits.length; i++) {
        if (stopSignalRef.current) break;
          await new Promise(resolve => setTimeout(resolve, 600));
          
        const digitElement = document.getElementById(`${exampleType}-digit-${i}`);
        const targetElement = document.getElementById(`${exampleType}-table-${example.digits[i].position}`);
        
        if (digitElement && targetElement) {
          // Animation de glissement
          digitElement.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          digitElement.style.transform = 'translateY(-20px) scale(1.2)';
          digitElement.style.background = 'linear-gradient(45deg, #3b82f6, #8b5cf6)';
          digitElement.style.color = 'white';
          digitElement.style.borderRadius = '8px';
          digitElement.style.padding = '8px';
          digitElement.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Étape 3: Illumination séquentielle EN COMMENÇANT PAR LES MILLIERS
      setExampleStep(3);
      await playAudio("Parfait ! Analysons chaque position et sa valeur !");
      if (stopSignalRef.current) return;
      
      // STRICTEMENT dans l'ordre pour CE2 : MILLIERS → CENTAINES → DIZAINES → UNITÉS
      // Note: Cet ordre est spécifique au CE2, le CE1 commence par les centaines
      const orderedPositions = ['milliers', 'centaines', 'dizaines', 'unités'];
      
      for (const position of orderedPositions) {
        if (stopSignalRef.current) break;
        
        const digit = example.digits.find(d => d.position === position);
        if (digit) { // Traiter tous les chiffres, même les zéros
          // ILLUMINER D'ABORD LE CHIFFRE SPÉCIFIQUE ET AFFICHER L'ENCADRÉ
          const digitElement = document.getElementById(`${exampleType}-table-${position}`);
          const columnElement = document.getElementById(`${exampleType}-column-${position}`);
          
          if (digitElement) {
            digitElement.style.transition = 'all 0.8s ease';
            digitElement.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
            digitElement.style.transform = 'scale(1.3)';
            digitElement.style.boxShadow = '0 0 30px rgba(251, 191, 36, 0.8)';
            digitElement.style.borderRadius = '8px';
            digitElement.style.color = 'white';
            digitElement.style.fontWeight = 'bold';
          }
          
          // AFFICHER L'ENCADRÉ DE VALEUR POSITIONNELLE IMMÉDIATEMENT (sauf pour les zéros)
          if (columnElement && digit.value !== '0') {
            let positionalValue = '';
            let colorClass = '';
            
            if (position === 'milliers') {
              positionalValue = `${digit.value}000`;
              colorClass = 'text-red-500 bg-red-100';
            } else if (position === 'centaines') {
              positionalValue = `${digit.value}00`;
              colorClass = 'text-green-500 bg-green-100';
            } else if (position === 'dizaines') {
              positionalValue = `${digit.value}0`;
              colorClass = 'text-blue-500 bg-blue-100';
            } else if (position === 'unites') {
              positionalValue = digit.value;
              colorClass = 'text-purple-500 bg-purple-100';
            }
            
            // Créer et afficher l'encadré de valeur
            const valueBox = document.createElement('div');
            valueBox.className = `text-lg font-semibold ${colorClass} px-2 py-1 rounded mb-2`;
            valueBox.textContent = positionalValue;
            valueBox.id = `${exampleType}-value-box-${position}`;
            
            // Insérer l'encadré au bon endroit dans la colonne
            const digitContainer = columnElement.querySelector(`#${exampleType}-table-${position}`);
            if (digitContainer && digitContainer.parentNode) {
              digitContainer.parentNode.insertBefore(valueBox, digitContainer);
            }
          } else if (digit.value === '0' && position === 'centaines' && columnElement) {
            // Pour les centaines à 0, afficher un tiret ou vide au lieu d'un encadré
            const valueBox = document.createElement('div');
            valueBox.className = `text-sm text-gray-400 mb-2`;
            valueBox.textContent = '-';
            valueBox.id = `${exampleType}-value-box-${position}`;
            
            // Insérer l'élément au bon endroit dans la colonne
            const digitContainer = columnElement.querySelector(`#${exampleType}-table-${position}`);
            if (digitContainer && digitContainer.parentNode) {
              digitContainer.parentNode.insertBefore(valueBox, digitContainer);
            }
          }
          
          // Attendre 300ms pour que l'utilisateur voie l'illumination ET l'encadré AVANT la parole
          await new Promise(resolve => setTimeout(resolve, 300));
          if (stopSignalRef.current) break;
          
          // PUIS lecture vocale détaillée de la valeur positionnelle
          if (digit.value !== '0') {
            let positionalText = '';
            
            if (position === 'milliers') {
              positionalText = `Dans la colonne des milliers, j'ai le chiffre ${digit.value}. Cela représente ${digit.value} millier${digit.value > '1' ? 's' : ''}, ce qui vaut ${digit.value}000 !`;
            } else if (position === 'centaines') {
              positionalText = `Dans la colonne des centaines, j'ai le chiffre ${digit.value}. Cela représente ${digit.value} centaine${digit.value > '1' ? 's' : ''}, ce qui vaut ${digit.value}00 !`;
            } else if (position === 'dizaines') {
              positionalText = `Dans la colonne des dizaines, j'ai le chiffre ${digit.value}. Cela représente ${digit.value} dizaine${digit.value > '1' ? 's' : ''}, ce qui vaut ${digit.value}0 !`;
            } else if (position === 'unités') {
              positionalText = `Dans la colonne des unités, j'ai le chiffre ${digit.value}. Cela représente ${digit.value} unité${digit.value > '1' ? 's' : ''}, ce qui vaut ${digit.value} !`;
            }
            
            // Lecture vocale détaillée
            await playAudio(positionalText);
            if (stopSignalRef.current) break;
          } else if (digit.value === '0') {
            if (position === 'milliers') {
              await playAudio("Dans la colonne des milliers, j'ai zéro. Cela signifie qu'il n'y a pas de milliers dans ce nombre !");
            } else if (position === 'centaines') {
              await playAudio("Dans la colonne des centaines, j'ai zéro. Cela signifie qu'il n'y a pas de centaines dans ce nombre !");
            } else if (position === 'dizaines') {
              await playAudio("Dans la colonne des dizaines, j'ai zéro. Cela signifie qu'il n'y a pas de dizaines dans ce nombre !");
            } else if (position === 'unités') {
              await playAudio("Dans la colonne des unités, j'ai zéro. Cela signifie qu'il n'y a pas d'unités dans ce nombre !");
            }
            if (stopSignalRef.current) break;
          }
          
          // Attendre un peu avant de désilluminer
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Désilluminer le chiffre
          if (digitElement) {
            digitElement.style.background = '';
            digitElement.style.transform = 'scale(1)';
            digitElement.style.boxShadow = '';
            digitElement.style.borderRadius = '';
            digitElement.style.color = '';
          }
          
          await new Promise(resolve => setTimeout(resolve, 400));
        }
      }
      
      // Étape 4: Construction finale du nombre complet
      setExampleStep(4);
      
      // Explication de l'addition finale selon l'exemple avec plus de détails
      if (exampleType === 'cent-vingt-trois') {
        await playAudio("Excellent ! Faisons le grand calcul final !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 800));
        await playAudio("J'additionne toutes les valeurs : cent plus vingt plus trois égale cent vingt-trois !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        await playAudio("Le mot 'Cent vingt-trois' devient le nombre 1-2-3 ! Fantastique !");
      } else if (exampleType === 'quatre-vingt-sept') {
        await playAudio("Parfait ! C'est l'heure du grand calcul final !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 800));
        await playAudio("J'additionne toutes les valeurs : zéro plus quatre-vingt plus sept égale quatre-vingt-sept !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        await playAudio("Le mot 'Quatre-vingt-sept' devient le nombre 8-7 ! Bravo !");
      } else if (exampleType === 'deux-cent-soixante-sept') {
        await playAudio("Magnifique ! Place au calcul final le plus impressionnant !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 800));
        await playAudio("J'additionne toutes les valeurs : deux cent plus soixante plus sept égale deux cent soixante-sept !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        await playAudio("Le mot 'Deux cent soixante-sept' devient le nombre 2-6-7 ! Incroyable !");
      }
      
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur animation tableau:', error);
    } finally {
      // Réinitialiser tous les états d'animation après un délai
      setTimeout(() => {
        setIsAnimating(false);
        setExampleAnimating(null);
        setExampleStep(0);
      }, 2000); // Laisser 2 secondes pour voir le résultat final
    }
  };

  const handleNext = () => {
    // Si aucune réponse vérifiée encore, on vérifie
    if (isCorrect === null) {
      const correct = userAnswer.trim() === exercises[currentExercise].number;
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
      <style jsx global>{`
        .pulse-interactive {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        .pulse-interactive-green {
          animation: pulseGlowGreen 2s ease-in-out infinite;
        }
        .pulse-interactive-yellow {
          animation: pulseGlowYellow 2s ease-in-out infinite;
        }
        .pulse-interactive-gray {
          animation: pulseGlowGray 2s ease-in-out infinite;
        }
      `}</style>
      
      {/* Bouton STOP flottant global */}
      {(isPlayingVocal || isAnimating) && (
        <button
          onClick={stopAllVocalsAndAnimations}
          className="fixed top-4 right-4 z-[60] bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all flex items-center gap-2"
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

      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bravo ! Tu as terminé !
            </h2>
            <div className="text-xl text-blue-600 font-bold mb-6">
              Score final : {finalScore}/{exercises.length}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  resetAll();
                }}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                Recommencer
              </button>
              <Link
                href="/chapitre/ce2-nombres-jusqu-10000"
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
              >
                Retour au chapitre
              </Link>
            </div>
          </div>
        </div>
      )}

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
                        <Link href="/chapitre/ce2-nombres-jusqu-10000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4" onClick={stopAllVocalsAndAnimations}>
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
                          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              🔤➡️🔢 Écrire les nombres jusqu'à 10000
            </h1>
            <p className="text-lg text-gray-600 hidden sm:block">
              Transforme les mots en chiffres jusqu'à 10000 !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div id="tab-navigation" className="flex justify-center mb-4 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              id="tab-cours"
              onClick={() => setShowExercises(false)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all pulse-interactive ${
                !showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              } ${highlightedElement === 'tab-cours' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''}`}
            >
              📖 Cours
            </button>
            <button
              id="tab-exercices"
              onClick={() => setShowExercises(true)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all pulse-interactive ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              } ${highlightedElement === 'tab-exercices' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''}`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-3 sm:space-y-8">
            {/* Personnage Minecraft avec bouton DÉMARRER */}
            <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 p-2 sm:p-4 mb-3 sm:mb-6">
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
                  onClick={() => {
                    setHasStarted(true);
                    setCharacterSizeExpanded(true);
                    explainChapter();
                  }}
                  disabled={isPlayingVocal}
                  className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-xl shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all transform hover:scale-105 pulse-interactive ${
                    isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                  }`}
                >
                  <Play className="inline w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                </button>
              </div>
            </div>

            {/* Règles de base */}
            <div id="rules-section" className={`bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg ${
              highlightedElement === 'rules-section' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse' : ''
            }`}>
              <h2 className="text-base sm:text-2xl font-bold text-center mb-2 sm:mb-4 text-gray-900">
                📝 Les règles pour écrire un nombre
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-4">
                <div className="bg-red-50 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2">1️⃣</div>
                  <h3 className="font-bold text-red-800 text-sm sm:text-base mb-0.5 sm:mb-1">Les milliers</h3>
                  <p className="text-xs sm:text-sm text-red-700">Mille, deux mille, trois mille...</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2">2️⃣</div>
                  <h3 className="font-bold text-green-800 text-sm sm:text-base mb-0.5 sm:mb-1">Les centaines</h3>
                  <p className="text-xs sm:text-sm text-green-700">Cent, deux cent, trois cent...</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2">3️⃣</div>
                  <h3 className="font-bold text-blue-800 text-sm sm:text-base mb-0.5 sm:mb-1">Les dizaines</h3>
                  <p className="text-xs sm:text-sm text-blue-700">Vingt, trente, quarante...</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2">4️⃣</div>
                  <h3 className="font-bold text-purple-800 text-sm sm:text-base mb-0.5 sm:mb-1">Les unités</h3>
                  <p className="text-xs sm:text-sm text-purple-700">Un, deux, trois...</p>
                </div>
              </div>
            </div>

            {/* Animation avec tableau centaines/dizaines/unités */}
            <div id="examples-section" className={`bg-gradient-to-r from-blue-50 to-green-50 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border border-blue-200 ${
              highlightedElement === 'examples-section' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse' : ''
            }`}>
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-blue-800">
                🎯 Tableau de placement des nombres jusqu'à 10000
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Clique sur "Démarre" pour voir comment placer les milliers, centaines, dizaines et unités !
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Exemple 1: Deux mille trois cent quarante-cinq */}
                <div 
                  id="deux-mille-trois-cent-quarante-cinq-container" 
                  className={`bg-white rounded-lg p-4 shadow-lg transition-all transform hover:scale-105 hover:shadow-xl pulse-interactive ${
                    exampleAnimating === 'deux-mille-trois-cent-quarante-cinq' ? 'border-2 border-blue-400 bg-blue-50 scale-105 shadow-2xl' : 'border-2 border-blue-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-blue-700 mb-2">Deux mille trois cent quarante-cinq</h3>
                    
                    {/* Bouton Démarre */}
                    <button
                      onClick={() => animateTableExample('deux-mille-trois-cent-quarante-cinq')}
                      disabled={isAnimating || isPlayingVocal}
                      className={`mb-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 pulse-interactive ${
                        isAnimating || isPlayingVocal ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Play className="inline w-4 h-4 mr-1" />
                      {exampleAnimating === 'deux-mille-trois-cent-quarante-cinq' ? '🎬 En cours...' : '🎯 Démarre'}
                    </button>
                    
                    {/* Chiffres à placer - N'apparaissent qu'à l'étape 2 */}
                    {exampleStep >= 2 && exampleAnimating === 'deux-mille-trois-cent-quarante-cinq' && (
                      <div className="flex justify-center gap-2 mb-4 mt-3">
                        <div id="deux-mille-trois-cent-quarante-cinq-digit-0" className="w-8 h-8 bg-red-200 rounded flex items-center justify-center font-bold text-red-800">2</div>
                        <div id="deux-mille-trois-cent-quarante-cinq-digit-1" className="w-8 h-8 bg-green-200 rounded flex items-center justify-center font-bold text-green-800">3</div>
                        <div id="deux-mille-trois-cent-quarante-cinq-digit-2" className="w-8 h-8 bg-blue-200 rounded flex items-center justify-center font-bold text-blue-800">4</div>
                        <div id="deux-mille-trois-cent-quarante-cinq-digit-3" className="w-8 h-8 bg-purple-200 rounded flex items-center justify-center font-bold text-purple-800">5</div>
                    </div>
                    )}
                    
                    {/* Tableau de placement */}
                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-4 bg-gray-100">
                        <div className="p-2 text-xs font-bold text-red-700 border-r border-gray-300">Milliers</div>
                        <div className="p-2 text-xs font-bold text-green-700 border-r border-gray-300">Centaines</div>
                        <div className="p-2 text-xs font-bold text-blue-700 border-r border-gray-300">Dizaines</div>
                        <div className="p-2 text-xs font-bold text-purple-700">Unités</div>
                      </div>
                      <div className="grid grid-cols-4 bg-white min-h-[4rem]">
                        <div id="deux-mille-trois-cent-quarante-cinq-column-milliers" className="p-2 border-r border-gray-300 flex flex-col items-center justify-center">
                          {exampleStep >= 2 && exampleAnimating === 'deux-mille-trois-cent-quarante-cinq' && (
                              <div id="deux-mille-trois-cent-quarante-cinq-table-milliers" className="text-2xl font-bold text-red-600 mb-2">2</div>
                          )}
                        </div>
                        <div id="deux-mille-trois-cent-quarante-cinq-column-centaines" className="p-2 border-r border-gray-300 flex flex-col items-center justify-center">
                          {exampleStep >= 2 && exampleAnimating === 'deux-mille-trois-cent-quarante-cinq' && (
                              <div id="deux-mille-trois-cent-quarante-cinq-table-centaines" className="text-2xl font-bold text-green-600 mb-2">3</div>
                          )}
                        </div>
                        <div id="deux-mille-trois-cent-quarante-cinq-column-dizaines" className="p-2 border-r border-gray-300 flex flex-col items-center justify-center">
                          {exampleStep >= 2 && exampleAnimating === 'deux-mille-trois-cent-quarante-cinq' && (
                              <div id="deux-mille-trois-cent-quarante-cinq-table-dizaines" className="text-2xl font-bold text-blue-600 mb-2">4</div>
                          )}
                        </div>
                        <div id="deux-mille-trois-cent-quarante-cinq-column-unités" className="p-2 flex flex-col items-center justify-center">
                          {exampleStep >= 2 && exampleAnimating === 'deux-mille-trois-cent-quarante-cinq' && (
                              <div id="deux-mille-trois-cent-quarante-cinq-table-unités" className="text-2xl font-bold text-purple-600 mb-2">5</div>
                          )}
                        </div>
                      </div>
                    </div>
                
                    {exampleStep >= 4 && exampleAnimating === 'deux-mille-trois-cent-quarante-cinq' && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-700 mb-2">Construction du nombre :</div>
                          <div className="text-xl font-bold text-blue-600">2000 + 300 + 40 + 5 = 2345</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                    
                {/* Exemple 2: Mille quatre-vingt-sept */}
                <div 
                  id="mille-quatre-vingt-sept-container"
                  className={`bg-white rounded-lg p-4 shadow-lg transition-all transform hover:scale-105 hover:shadow-xl pulse-interactive ${
                    exampleAnimating === 'mille-quatre-vingt-sept' ? 'border-2 border-orange-400 bg-orange-50 scale-105 shadow-2xl' : 'border-2 border-orange-200 hover:border-orange-300'
                  }`}
                >
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-orange-700 mb-2">Mille quatre-vingt-sept</h3>
                    
                    {/* Bouton Démarre */}
                    <button
                      onClick={() => animateTableExample('mille-quatre-vingt-sept')}
                      disabled={isAnimating || isPlayingVocal}
                      className={`mb-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 pulse-interactive ${
                        isAnimating || isPlayingVocal ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Play className="inline w-4 h-4 mr-1" />
                      {exampleAnimating === 'mille-quatre-vingt-sept' ? '🎬 En cours...' : '🎯 Démarre'}
                    </button>
                    
                    {/* Chiffres à placer - N'apparaissent qu'à l'étape 2 */}
                    {exampleStep >= 2 && exampleAnimating === 'mille-quatre-vingt-sept' && (
                      <div className="flex justify-center gap-2 mb-4 mt-3">
                        <div id="mille-quatre-vingt-sept-digit-0" className="w-8 h-8 bg-red-200 rounded flex items-center justify-center font-bold text-red-800">1</div>
                        <div id="mille-quatre-vingt-sept-digit-1" className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-500">0</div>
                        <div id="mille-quatre-vingt-sept-digit-2" className="w-8 h-8 bg-blue-200 rounded flex items-center justify-center font-bold text-blue-800">8</div>
                        <div id="mille-quatre-vingt-sept-digit-3" className="w-8 h-8 bg-purple-200 rounded flex items-center justify-center font-bold text-purple-800">7</div>
                    </div>
                    )}
                    
                    {/* Tableau de placement */}
                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-4 bg-gray-100">
                        <div className="p-2 text-xs font-bold text-red-700 border-r border-gray-300">Milliers</div>
                        <div className="p-2 text-xs font-bold text-green-700 border-r border-gray-300">Centaines</div>
                        <div className="p-2 text-xs font-bold text-blue-700 border-r border-gray-300">Dizaines</div>
                        <div className="p-2 text-xs font-bold text-purple-700">Unités</div>
                      </div>
                      <div className="grid grid-cols-4 bg-white min-h-[4rem]">
                        <div id="mille-quatre-vingt-sept-column-milliers" className="p-2 border-r border-gray-300 flex flex-col items-center justify-center">
                          {exampleStep >= 2 && exampleAnimating === 'mille-quatre-vingt-sept' && (
                              <div id="mille-quatre-vingt-sept-table-milliers" className="text-2xl font-bold text-red-600 mb-2">1</div>
                          )}
                        </div>
                        <div id="mille-quatre-vingt-sept-column-centaines" className="p-2 border-r border-gray-300 flex flex-col items-center justify-center">
                          {exampleStep >= 2 && exampleAnimating === 'mille-quatre-vingt-sept' && (
                              <div id="mille-quatre-vingt-sept-table-centaines" className="text-2xl font-bold text-gray-400 mb-2">0</div>
                          )}
                        </div>
                        <div id="mille-quatre-vingt-sept-column-dizaines" className="p-2 border-r border-gray-300 flex flex-col items-center justify-center">
                          {exampleStep >= 2 && exampleAnimating === 'mille-quatre-vingt-sept' && (
                              <div id="mille-quatre-vingt-sept-table-dizaines" className="text-2xl font-bold text-blue-600 mb-2">8</div>
                          )}
                        </div>
                        <div id="mille-quatre-vingt-sept-column-unités" className="p-2 flex flex-col items-center justify-center">
                          {exampleStep >= 2 && exampleAnimating === 'mille-quatre-vingt-sept' && (
                              <div id="mille-quatre-vingt-sept-table-unités" className="text-2xl font-bold text-purple-600 mb-2">7</div>
                          )}
                        </div>
                      </div>
                    </div>
                
                    {exampleStep >= 4 && exampleAnimating === 'mille-quatre-vingt-sept' && (
                      <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-700 mb-2">Construction du nombre :</div>
                          <div className="text-xl font-bold text-orange-600">1000 + 0 + 80 + 7 = 1087</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                    
                {/* Exemple 3: Trois mille deux cents */}
                <div 
                  id="trois-mille-deux-cents-container"
                  className={`bg-white rounded-lg p-4 shadow-lg transition-all transform hover:scale-105 hover:shadow-xl pulse-interactive ${
                    exampleAnimating === 'trois-mille-deux-cents' ? 'border-2 border-purple-400 bg-purple-50 scale-105 shadow-2xl' : 'border-2 border-purple-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-purple-700 mb-2">Trois mille deux cents</h3>
                    
                    {/* Bouton Démarre */}
                    <button
                      onClick={() => animateTableExample('trois-mille-deux-cents')}
                      disabled={isAnimating || isPlayingVocal}
                      className={`mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 pulse-interactive ${
                        isAnimating || isPlayingVocal ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Play className="inline w-4 h-4 mr-1" />
                      {exampleAnimating === 'trois-mille-deux-cents' ? '🎬 En cours...' : '🎯 Démarre'}
                    </button>
                    
                    {/* Chiffres à placer - N'apparaissent qu'à l'étape 2 */}
                    {exampleStep >= 2 && exampleAnimating === 'trois-mille-deux-cents' && (
                      <div className="flex justify-center gap-2 mb-4 mt-3">
                        <div id="trois-mille-deux-cents-digit-0" className="w-8 h-8 bg-red-200 rounded flex items-center justify-center font-bold text-red-800">3</div>
                        <div id="trois-mille-deux-cents-digit-1" className="w-8 h-8 bg-green-200 rounded flex items-center justify-center font-bold text-green-800">2</div>
                        <div id="trois-mille-deux-cents-digit-2" className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-500">0</div>
                        <div id="trois-mille-deux-cents-digit-3" className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-500">0</div>
                    </div>
                    )}
                    
                    {/* Tableau de placement */}
                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-4 bg-gray-100">
                        <div className="p-2 text-xs font-bold text-red-700 border-r border-gray-300">Milliers</div>
                        <div className="p-2 text-xs font-bold text-green-700 border-r border-gray-300">Centaines</div>
                        <div className="p-2 text-xs font-bold text-blue-700 border-r border-gray-300">Dizaines</div>
                        <div className="p-2 text-xs font-bold text-purple-700">Unités</div>
                      </div>
                      <div className="grid grid-cols-4 bg-white min-h-[4rem]">
                        <div id="trois-mille-deux-cents-column-milliers" className="p-2 border-r border-gray-300 flex flex-col items-center justify-center">
                          {exampleStep >= 2 && exampleAnimating === 'trois-mille-deux-cents' && (
                              <div id="trois-mille-deux-cents-table-milliers" className="text-2xl font-bold text-red-600 mb-2">3</div>
                          )}
                        </div>
                        <div id="trois-mille-deux-cents-column-centaines" className="p-2 border-r border-gray-300 flex flex-col items-center justify-center">
                          {exampleStep >= 2 && exampleAnimating === 'trois-mille-deux-cents' && (
                              <div id="trois-mille-deux-cents-table-centaines" className="text-2xl font-bold text-green-600 mb-2">2</div>
                          )}
                        </div>
                        <div id="trois-mille-deux-cents-column-dizaines" className="p-2 border-r border-gray-300 flex flex-col items-center justify-center">
                          {exampleStep >= 2 && exampleAnimating === 'trois-mille-deux-cents' && (
                              <div id="trois-mille-deux-cents-table-dizaines" className="text-2xl font-bold text-gray-400 mb-2">0</div>
                          )}
                        </div>
                        <div id="trois-mille-deux-cents-column-unités" className="p-2 flex flex-col items-center justify-center">
                          {exampleStep >= 2 && exampleAnimating === 'trois-mille-deux-cents' && (
                              <div id="trois-mille-deux-cents-table-unités" className="text-2xl font-bold text-gray-400 mb-2">0</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {exampleStep >= 4 && exampleAnimating === 'trois-mille-deux-cents' && (
                      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-700 mb-2">Construction du nombre :</div>
                          <div className="text-xl font-bold text-purple-600">3000 + 200 + 0 + 0 = 3200</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm text-blue-600 font-medium">
                  🎯 Clique sur "Démarre" et regarde les chiffres se placer avec une explication vocale complète !
                </p>
              </div>
            </div>

            {/* Section interactive - Glisser-déposer */}
            <div id="interactive-section" className={`bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg ${
              highlightedElement === 'interactive-section' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse' : ''
            }`}>
              <h2 className="text-base sm:text-2xl font-bold text-center mb-2 sm:mb-6 text-gray-900">
                🎯 Atelier de glisser-déposer
              </h2>
              <p className="text-center text-xs sm:text-base text-gray-600 mb-2 sm:mb-6">
                Fais glisser chaque partie du nombre vers sa colonne et regarde la transformation !
              </p>
              
              {/* Sélecteur de nombres pour glisser-déposer - Toujours visible */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {[
                  { written: 'Deux-mille-trois-cent-quarante-cinq', number: '2345' },
                  { written: 'Mille-quatre-vingt-sept', number: '1087' },
                  { written: 'Trois-mille-deux-cents', number: '3200' },
                  { written: 'Quatre-mille-huit-cent-cinquante', number: '4850' },
                  { written: 'Cinq-mille-trois', number: '5003' },
                  { written: 'Sept-mille-quatre-vingt-dix', number: '7090' }
                ].map((exercise, index) => (
                  <button
                    key={index}
                    onClick={async () => {
                      const isNewSelection = !dragDropExercise || dragDropExercise.written !== exercise.written;
                      
                      setDragDropExercise(exercise);
                      resetDragDrop();
                      setTimeout(() => scrollToElement('drag-drop-area'), 100);
                      
                      // Jouer le mode d'emploi vocal court seulement si c'est un nouveau nombre
                      if (isNewSelection) {
                        await playDragDropInstructions(exercise.written, exercise);
                      }
                    }}
                    disabled={isPlayingVocal}
                    className={`bg-gradient-to-br from-purple-500 to-pink-500 text-white p-3 sm:p-4 rounded-lg font-bold text-sm sm:text-base hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 pulse-interactive min-h-[4rem] flex items-center justify-center ${
                      dragDropExercise?.written === exercise.written ? 'ring-4 ring-yellow-400 scale-110' : ''
                    } ${isPlayingVocal ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {exercise.written}
                  </button>
                ))}
              </div>
              
              <div className="text-center text-xs sm:text-sm text-gray-500 mb-6">
                {isPlayingVocal ? 
                  '🎤 Mode d\'emploi en cours... Écoute bien !' : 
                  'Choisis un nombre pour commencer l\'exercice de glisser-déposer ! ✨'
                }
              </div>

              {/* Zone de glisser-déposer - Apparaît seulement si un nombre est sélectionné */}
              {dragDropExercise && (
                <div id="drag-drop-area" className="space-y-6">
                  {/* Titre du nombre sélectionné */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-purple-700 mb-2">
                      {dragDropExercise.written}
                    </h3>
                    <p className="text-gray-600">Fais glisser chaque partie colorée du nombre vers la zone qui convient !</p>
                  </div>
                  
                  {/* Parties à glisser */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-700 mb-3 text-center">Parties du nombre :</h4>
                    <div className="text-sm text-gray-600 mb-3 text-center">
                      💡 <span className="font-medium">Sur mobile :</span> Appuie et maintiens pour faire glisser
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {decomposeDragDropNumber(dragDropExercise.written, dragDropExercise.number).map((part, index) => (
                        <div
                          key={index}
                          data-drag-part={index}
                          draggable
                          onDragStart={(e) => handleDragStart(e, part)}
                          onTouchStart={(e) => handleTouchStart(e, part)}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                          className={`px-4 py-2 rounded-lg font-bold cursor-grab active:cursor-grabbing transition-all duration-300 transform hover:scale-105 touch-manipulation ${
                            part.color === 'red' 
                              ? 'bg-red-200 text-red-800 border-2 border-red-300' 
                              : part.color === 'blue'
                              ? 'bg-blue-200 text-blue-800 border-2 border-blue-300'
                              : 'bg-purple-200 text-purple-800 border-2 border-purple-300'
                          } ${completedDropZones.includes(part.position) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          style={{
                            display: completedDropZones.includes(part.position) ? 'none' : 'block',
                            touchAction: 'none'
                          }}
                        >
                          {part.text}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tableau de placement */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <h4 className="font-bold text-gray-700 mb-4 text-center">Tableau de placement :</h4>
                    <div className="grid grid-cols-4 gap-4">
                      {/* Colonne Milliers (spécifique CE2) */}
                      <div 
                        data-drop-zone="milliers"
                        className="bg-white rounded-lg p-4 min-h-[120px] border-2 border-dashed border-red-300 flex flex-col items-center justify-center transition-all duration-300 touch-manipulation"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'milliers')}
                        onTouchMove={handleTouchMove}
                        style={{
                          backgroundColor: draggedElements.milliers ? '#fee2e2' : 'white',
                          borderColor: draggedElements.milliers ? '#ef4444' : '#fca5a5',
                          touchAction: 'none'
                        }}
                      >
                        <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Milliers</div>
                        {draggedElements.milliers ? (
                          <>
                            <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1 sm:mb-2">
                              {draggedElements.milliers}
                            </div>
                            <div className="text-base sm:text-lg font-semibold text-red-500 bg-red-100 px-2 py-1 rounded">
                              {draggedElements.milliers}000
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-400 text-center text-xs sm:text-sm">
                            Glisse ici<br/>les milliers
                          </div>
                        )}
                      </div>
                      
                      {/* Colonne Centaines */}
                      <div 
                        data-drop-zone="centaines"
                        className="bg-white rounded-lg p-4 min-h-[120px] border-2 border-dashed border-green-300 flex flex-col items-center justify-center transition-all duration-300 touch-manipulation"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'centaines')}
                        onTouchMove={handleTouchMove}
                        style={{
                          backgroundColor: draggedElements.centaines ? '#dcfce7' : 'white',
                          borderColor: draggedElements.centaines ? '#22c55e' : '#86efac',
                          touchAction: 'none'
                        }}
                      >
                        <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Centaines</div>
                        {draggedElements.centaines ? (
                          <>
                            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                              {draggedElements.centaines}
                            </div>
                            <div className="text-base sm:text-lg font-semibold text-green-500 bg-green-100 px-2 py-1 rounded">
                              {draggedElements.centaines}00
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-400 text-center text-xs sm:text-sm">
                            Glisse ici<br/>les centaines
                          </div>
                        )}
                      </div>
                      
                      {/* Colonne Dizaines */}
                      <div 
                        data-drop-zone="dizaines"
                        className="bg-white rounded-lg p-4 min-h-[120px] border-2 border-dashed border-blue-300 flex flex-col items-center justify-center transition-all duration-300 touch-manipulation"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'dizaines')}
                        onTouchMove={handleTouchMove}
                        style={{
                          backgroundColor: draggedElements.dizaines ? '#dbeafe' : 'white',
                          borderColor: draggedElements.dizaines ? '#3b82f6' : '#93c5fd',
                          touchAction: 'none'
                        }}
                      >
                        <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Dizaines</div>
                        {draggedElements.dizaines ? (
                          <>
                            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                              {draggedElements.dizaines}
                            </div>
                            <div className="text-base sm:text-lg font-semibold text-blue-500 bg-blue-100 px-2 py-1 rounded">
                              {draggedElements.dizaines}0
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-400 text-center text-xs sm:text-sm">
                            Glisse ici<br/>les dizaines
                          </div>
                        )}
                      </div>
                      
                      {/* Colonne Unités */}
                      <div 
                        data-drop-zone="unites"
                        className="bg-white rounded-lg p-4 min-h-[120px] border-2 border-dashed border-purple-300 flex flex-col items-center justify-center transition-all duration-300 touch-manipulation"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'unites')}
                        onTouchMove={handleTouchMove}
                        style={{
                          backgroundColor: draggedElements.unites ? '#f3e8ff' : 'white',
                          borderColor: draggedElements.unites ? '#a855f7' : '#d8b4fe',
                          touchAction: 'none'
                        }}
                      >
                        <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Unités</div>
                        {draggedElements.unites ? (
                          <>
                            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
                              {draggedElements.unites}
                            </div>
                            <div className="text-base sm:text-lg font-semibold text-purple-500 bg-purple-100 px-2 py-1 rounded">
                              {draggedElements.unites}
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-400 text-center text-xs sm:text-sm">
                            Glisse ici<br/>les unités
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Construction finale */}
                  {showFinalConstruction && (
                    <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300 animate-pulse">
                      <h4 className="font-bold text-gray-700 mb-3 text-center">🎉 Construction finale :</h4>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-700 mb-2">
                          {draggedElements.milliers ? `${draggedElements.milliers}000` : '0'} + {draggedElements.centaines ? `${draggedElements.centaines}00` : '0'} + {draggedElements.dizaines ? `${draggedElements.dizaines}0` : '0'} + {draggedElements.unites || '0'} = {dragDropExercise.number}
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          Bravo ! {dragDropExercise.written} = {dragDropExercise.number}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Boutons d'action */}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={resetDragDrop}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                    >
                      Recommencer
                    </button>
                    <button
                      onClick={() => {
                        setDragDropExercise(null);
                        resetDragDrop();
                        stopAllVocalsAndAnimations();
                        
                        // Scroll vers le titre de l'atelier sur mobile
                        setTimeout(() => {
                          const interactiveSection = document.getElementById('interactive-section');
                          if (interactiveSection) {
                            // Détection mobile
                            const isMobile = window.innerWidth <= 768;
                            if (isMobile) {
                              interactiveSection.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start',
                                inline: 'nearest'
                              });
                            }
                          }
                        }, 100);
                      }}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-600 transition-colors"
                    >
                      Choisir un autre nombre
                    </button>
                  </div>
                </div>
              )}
            </div>



            {/* Conseils */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-3 sm:p-6 text-white">
              <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3">💡 Astuces pour réussir</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-base">
                <li>• Écoute bien chaque partie du nombre</li>
                <li>• Commence par les milliers (1000, 2000, 3000...)</li>
                <li>• Puis les centaines (100, 200, 300...)</li>
                <li>• Ensuite les dizaines (20, 30, 40...)</li>
                <li>• Et enfin les unités (1, 2, 3...)</li>
                <li>• N'oublie pas : "Mille" tout seul s'écrit 1000</li>
                <li>• Attention aux zéros intermédiaires (2003, 3040...)</li>
              </ul>
            </div>

            {/* Tableau de référence */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <h3 className="text-base sm:text-xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                📊 Tableau de référence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-6">
                <div>
                  <h4 className="font-bold text-red-600 mb-2 sm:mb-3 text-center md:text-left text-sm sm:text-base">Milliers</h4>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-0.5 sm:gap-1 text-xs sm:text-sm text-gray-800 text-center md:text-left">
                    <div>Mille = 1000</div>
                    <div>Deux mille = 2000</div>
                    <div>Trois mille = 3000</div>
                    <div>Quatre mille = 4000</div>
                    <div>Cinq mille = 5000</div>
                    <div>Six mille = 6000</div>
                    <div>Sept mille = 7000</div>
                    <div>Huit mille = 8000</div>
                    <div>Neuf mille = 9000</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-green-600 mb-2 sm:mb-3 text-center md:text-left text-sm sm:text-base">Centaines</h4>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-0.5 sm:gap-1 text-xs sm:text-sm text-gray-800 text-center md:text-left">
                    <div>Cent = 100</div>
                    <div>Deux cent = 200</div>
                    <div>Trois cent = 300</div>
                    <div>Quatre cent = 400</div>
                    <div>Cinq cent = 500</div>
                    <div>Six cent = 600</div>
                    <div>Sept cent = 700</div>
                    <div>Huit cent = 800</div>
                    <div>Neuf cent = 900</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-blue-600 mb-2 sm:mb-3 text-center md:text-left text-sm sm:text-base">Dizaines</h4>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-0.5 sm:gap-1 text-xs sm:text-sm text-gray-800 text-center md:text-left">
                    <div>Dix = 10</div>
                    <div>Vingt = 20</div>
                    <div>Trente = 30</div>
                    <div>Quarante = 40</div>
                    <div>Cinquante = 50</div>
                    <div>Soixante = 60</div>
                    <div>Soixante-dix = 70</div>
                    <div>Quatre-vingts = 80</div>
                    <div>Quatre-vingt-dix = 90</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-purple-600 mb-2 sm:mb-3 text-center md:text-left text-sm sm:text-base">Unités</h4>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-0.5 sm:gap-1 text-xs sm:text-sm text-gray-800 text-center md:text-left">
                    <div>Un = 1</div>
                    <div>Deux = 2</div>
                    <div>Trois = 3</div>
                    <div>Quatre = 4</div>
                    <div>Cinq = 5</div>
                    <div>Six = 6</div>
                    <div>Sept = 7</div>
                    <div>Huit = 8</div>
                    <div>Neuf = 9</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-3 sm:space-y-8">
            {/* Personnage Minecraft avec bouton DÉMARRER */}
            <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 p-2 sm:p-4 mb-3 sm:mb-6">
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
                  onClick={() => {
                    setHasStarted(true);
                    setCharacterSizeExpanded(true);
                    explainChapter();
                  }}
                  disabled={isPlayingVocal}
                  className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-xl shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all transform hover:scale-105 pulse-interactive ${
                    isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                  }`}
                >
                  <Play className="inline w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                </button>
              </div>
            </div>

            {/* Header exercices */}
            <div id="score-section" className={`bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg ${
              highlightedElement === 'score-section' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
            }`}>
              <div className="flex flex-row justify-between items-center mb-4">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                {/* Score sur la même ligne */}
                <div className={`text-sm sm:text-lg font-bold text-green-600 ${
                  highlightedElement === 'score-display' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
                }`}>
                  Score : {score}/{exercises.length}
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div 
                  className="bg-green-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div id="exercise-question" className={`bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 shadow-lg text-center ${
              highlightedElement === 'exercise-question' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
            }`}>
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900">
                ✏️ Écris ce nombre en chiffres
              </h3>
              
              <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                <div id="word-number" className={`text-2xl sm:text-3xl font-bold text-blue-900 mb-2 sm:mb-4 ${
                  highlightedElement === 'word-number' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
                }`}>
                  {exercises[currentExercise].written}
                </div>
              </div>
              
              <div className="max-w-xs sm:max-w-md mx-auto mb-4 sm:mb-6">
                <input
                  id="answer-input"
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Écris le nombre en chiffres..."
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className={`w-full p-3 sm:p-4 border-2 border-gray-300 rounded-lg text-center text-lg sm:text-xl font-bold focus:border-blue-500 focus:outline-none bg-white text-gray-900 ${
                    highlightedElement === 'answer-input' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
                  }`}
                />
              </div>
              
              <div className="flex justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">

                <button
                  id="erase-button"
                  onClick={resetExercise}
                  className={`bg-gray-500 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base pulse-interactive ${
                    highlightedElement === 'erase-button' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
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
                        <span className="font-bold">Parfait ! Tu as trouvé {exercises[currentExercise].number} !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span className="font-bold">
                          Pas tout à fait... La bonne réponse est : {exercises[currentExercise].number}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div id="navigation-buttons" className="flex flex-col sm:flex-row justify-centrime la regle er space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  id="previous-button"
                  onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                  disabled={currentExercise === 0 || isPlayingVocal}
                  className={`bg-gray-300 text-gray-700 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50 text-sm sm:text-base pulse-interactive-gray ${
                    highlightedElement === 'previous-button' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
                  }`}
                >
                  ← Précédent
                </button>
                <button
                  id="next-button"
                  onClick={handleNext}
                  disabled={(!userAnswer.trim() && isCorrect === null) || isPlayingVocal}
                  className={`bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm sm:text-base pulse-interactive ${
                    highlightedElement === 'next-button' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
                  }`}
                >
                  {isCorrect === null ? 'Vérifier' : 'Suivant →'}
                </button>
              </div>
            </div>


          </div>
        )}
      </div>
    </div>
    </>
  );
} 