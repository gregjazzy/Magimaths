// SAUVEGARDE DES SEQUENCES AUDIO - CP Nombres jusqu'à 20 - Reconnaissance
// Créé le $(date) pour conserver les séquences audio importantes

// =========== AUDIO COURS (À CONSERVER) ===========

// Fonction pour expliquer le chapitre - COURS
const explainChapter = async () => {
  if (stopSignalRef.current) return;
  
  console.log('🔄 explainChapter - stopSignalRef forcé à false');
  stopSignalRef.current = false;
  
  setIsPlayingVocal(true);
  setHasStarted(true);
  setSamSizeExpanded(true); // Agrandir Sam dès le clic

  try {
    await playAudio("Bonjour, je suis Sam, Sam le pirate, avec mon ami Robotech, bienvenue dans le chapitre sur les nombres jusqu'à 20 !");
    if (stopSignalRef.current) return;
    
    await wait(1000);
    if (stopSignalRef.current) return;
    
    await playAudio("Nous allons t'apprendre à reconnaître les nombres !");
    if (stopSignalRef.current) return;
    
    await wait(500);
    if (stopSignalRef.current) return;
    
    await playAudio("Après avoir présenté les objectifs, je vais te faire une animation pour expliquer le comptage jusqu'à 3.");
    if (stopSignalRef.current) return;
    
    await wait(1000);
    if (stopSignalRef.current) return;
    
    // Animation du nombre 3
    setHighlightNumber3(true);
    await playAudio("Regarde ! Je compte jusqu'à 3. Un, deux, 3. C'est le nombre 3 !");
    if (stopSignalRef.current) return;
    
    await wait(2000);
    setHighlightNumber3(false);
    if (stopSignalRef.current) return;
    
    // Scroller vers la grille de nombres
    await wait(500);
    if (stopSignalRef.current) return;
    
    const gridElement = document.getElementById('numbers-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    await wait(1000);
    if (stopSignalRef.current) return;
    
    // Illuminer la grille
    setHighlightedElement('numbers-grid');
    await playAudio("Ensuite tu peux essayer de regarder pour compter d'autres nombres.");
    if (stopSignalRef.current) return;
    
    await wait(1500);
    setHighlightedElement(null);
    if (stopSignalRef.current) return;
    
    // Scroller vers les méthodes de calcul
    const methodsElement = document.getElementById('counting-methods');
    if (methodsElement) {
      methodsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    await wait(1000);
    if (stopSignalRef.current) return;
    
    setHighlightedElement('counting-methods');
    await playAudio("Pour t'aider tu peux utiliser des techniques de calcul très pratiques.");
    if (stopSignalRef.current) return;
    
    await wait(500);
    if (stopSignalRef.current) return;
    
    // Illuminer la méthode avec les doigts
    setHighlightedElement('fingers-section');
    await playAudio("Avec tes doigts, clique dessus si tu veux les voir.");
    if (stopSignalRef.current) return;
    
    await wait(1500);
    if (stopSignalRef.current) return;
    
    // Illuminer la méthode par groupes de 5
    setHighlightedElement('groups-section');
    await playAudio("Et par groupe de 5 car 5 c'est le nombre de doigts d'une main.");
    if (stopSignalRef.current) return;
    
    await wait(1500);
    setHighlightedElement(null);
    if (stopSignalRef.current) return;
    
    // Retour vers la grille
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    await wait(1000);
    if (stopSignalRef.current) return;
    
    await playAudio("À toi de jouer !");
    
  } catch (error) {
    console.error('Erreur dans explainChapter:', error);
  } finally {
    setIsPlayingVocal(false);
  }
};

// Fonction pour expliquer un nombre choisi - COURS
const explainNumber = async (number: string) => {
  if (stopSignalRef.current || isPlayingVocal) return;
  
  const num = parseInt(number);
  console.log('🔢 Explication du nombre:', number);
  
  setIsPlayingVocal(true);
  setSelectedNumber(number);
  setAnimatingPoints([]);
  setCountingNumber(num);

  try {
    await playAudio(`Très bien ! Tu as choisi le nombre ${number} !`);
    if (stopSignalRef.current) return;
    
    await wait(1000);
    if (stopSignalRef.current) return;
    
    await playAudio(`Voici le nombre ${number} !`);
    if (stopSignalRef.current) return;
    
    // Scroller vers l'illustration
    scrollToIllustration();
    await wait(1500);
    if (stopSignalRef.current) return;
    
    await playAudio("Maintenant, comptons ensemble pour voir combien ça fait !");
    if (stopSignalRef.current) return;
    
    await wait(800);
    if (stopSignalRef.current) return;
    
    await playAudio("Je vais compter et les points vont s'illuminer un par un !");
    if (stopSignalRef.current) return;
    
    await wait(1000);
    if (stopSignalRef.current) return;
    
    // Animation de comptage
    for (let i = 1; i <= num; i++) {
      if (stopSignalRef.current) return;
      
      setAnimatingPoints(prev => [...prev, i]);
      await playAudio(i.toString());
      
      if (stopSignalRef.current) return;
      await wait(800);
    }
    
    if (stopSignalRef.current) return;
    
    await playAudio(`Et voilà ! Nous avons compté ${num} points ! C'est le nombre ${number} !`);
    if (stopSignalRef.current) return;
    
    await wait(1000);
    
    await playAudio("Tu peux maintenant choisir un autre nombre pour continuer à apprendre !");
    
  } catch (error) {
    console.error('Erreur dans explainNumber:', error);
  } finally {
    setIsPlayingVocal(false);
    setCountingNumber(null);
  }
};

// Animation avec les doigts - COURS
const explainWithFingers = async () => {
  if (stopSignalRef.current) return;
  
  setIsPlayingVocal(true);
  setAnimatingFingers(true);
  setFingerCount(0);

  try {
    await playAudio("Avec tes doigts, tu peux compter jusqu'à 10 !");
    if (stopSignalRef.current) return;
    
    await wait(1000);
    if (stopSignalRef.current) return;
    
    await playAudio("Une main égale 5 doigts ! Regardons :");
    if (stopSignalRef.current) return;
    
    await wait(500);
    if (stopSignalRef.current) return;
    
    // Compter jusqu'à 5
    for (let i = 1; i <= 5; i++) {
      if (stopSignalRef.current) return;
      
      setFingerCount(i);
      await playAudio(i.toString());
      
      if (stopSignalRef.current) return;
      await wait(600);
    }
    
    await playAudio("Cinq doigts sur une main !");
    if (stopSignalRef.current) return;
    
    await wait(1500);
    if (stopSignalRef.current) return;
    
    await playAudio("Maintenant, deux mains égalent 10 doigts ! Comptons :");
    if (stopSignalRef.current) return;
    
    await wait(500);
    if (stopSignalRef.current) return;
    
    // Compter jusqu'à 10
    for (let i = 6; i <= 10; i++) {
      if (stopSignalRef.current) return;
      
      setFingerCount(i);
      await playAudio(i.toString());
      
      if (stopSignalRef.current) return;
      await wait(600);
    }
    
    await playAudio("Dix doigts avec les deux mains ! C'est pratique pour compter jusqu'à 10 !");
    
  } catch (error) {
    console.error('Erreur dans explainWithFingers:', error);
  } finally {
    setIsPlayingVocal(false);
    setAnimatingFingers(false);
    setFingerCount(0);
  }
};

// Animation par groupes de 5 - COURS
const explainWithGroups = async () => {
  if (stopSignalRef.current) return;
  
  setIsPlayingVocal(true);
  setAnimatingGroups(true);
  setAnimatingStep('start');

  try {
    await playAudio("Avec des groupes de 5, c'est plus facile !");
    if (stopSignalRef.current) return;
    
    await wait(1000);
    if (stopSignalRef.current) return;
    
    await playAudio("Pourquoi 5 ? Parce que 5, c'est comme une main avec 5 doigts !");
    if (stopSignalRef.current) return;
    
    await wait(1000);
    setAnimatingStep('group1');
    if (stopSignalRef.current) return;
    
    await playAudio("Regarde : ce premier groupe de 5, c'est comme une main !");
    if (stopSignalRef.current) return;
    
    await wait(1500);
    setAnimatingStep('group2');
    if (stopSignalRef.current) return;
    
    await playAudio("Ce deuxième groupe de 5, c'est comme une autre main !");
    if (stopSignalRef.current) return;
    
    await wait(1500);
    setAnimatingStep('group3');
    if (stopSignalRef.current) return;
    
    await playAudio("Et ces 2 derniers, ça fait 5 plus 5 plus 2 égale 12 !");
    if (stopSignalRef.current) return;
    
    await wait(1500);
    setAnimatingStep('explanation');
    if (stopSignalRef.current) return;
    
    await playAudio("C'est pour ça que quand on compte avec des points, on aime bien les regrouper par 5 !");
    if (stopSignalRef.current) return;
    
    await wait(800);
    if (stopSignalRef.current) return;
    
    await playAudio("Car on peut les représenter avec une main !");
    if (stopSignalRef.current) return;
    
    await wait(800);
    setAnimatingStep('show-hands');
    if (stopSignalRef.current) return;
    
    await playAudio("Regardez : une main pour ce groupe de 5...");
    if (stopSignalRef.current) return;
    
    await wait(1000);
    if (stopSignalRef.current) return;
    
    await playAudio("...et une autre main pour cet autre groupe de 5 !");
    if (stopSignalRef.current) return;
    
    await wait(1000);
    if (stopSignalRef.current) return;
    
    await playAudio("C'est beaucoup plus facile de compter comme ça !");
    
  } catch (error) {
    console.error('Erreur dans explainWithGroups:', error);
  } finally {
    setIsPlayingVocal(false);
    setAnimatingGroups(false);
    setAnimatingStep(null);
  }
};

// =========== AUDIO EXERCICES (À SUPPRIMER) ===========

// Fonction pour l'introduction vocale de Sam le Pirate - EXERCICES
const startPirateIntro = async () => {
  if (stopSignalRef.current || pirateIntroStarted) return;
  
  console.log('🏴‍☠️ Démarrage introduction Sam le Pirate');
  setIsPlayingVocal(true);
  setPirateIntroStarted(true);
  
  try {
    await playAudio("Hey c'est Sam le Pirate, voici des exercices qui vont te permettre de t'entrainer.");
    if (stopSignalRef.current) return;
    
    await wait(800);
    if (stopSignalRef.current) return;
    
    await playAudio("et tu peux mettre ta réponse dans la case réponse");
    if (stopSignalRef.current) return;
    
    // Illuminer la case réponse
    setHighlightedElement('answer-input');
    await wait(1500);
    setHighlightedElement(null);
    
    if (stopSignalRef.current) return;
    
    await playAudio("en avant toutes !");
    if (stopSignalRef.current) return;
    
    await wait(800);
    if (stopSignalRef.current) return;
    
    // Illuminer le bouton "Écouter l'énoncé"
    setHighlightedElement('listen-question-button');
    setShowExercisesList(true);
    
  } catch (error) {
    console.error('Erreur dans startPirateIntro:', error);
  } finally {
    setIsPlayingVocal(false);
  }
};

// Fonction pour commencer l'explication de l'exercice - EXERCICES
const startExerciseExplanation = async () => {
  if (stopSignalRef.current || isExplainingError) return;
  
  console.log('🎤 Démarrage explication exercice');
  setIsPlayingVocal(true);
  setExerciseStarted(true);
  
  try {
    // Énoncé de l'exercice
    await playAudio(exercises[currentExercise].question);
    if (stopSignalRef.current) return;
    
    await wait(500);
    if (stopSignalRef.current) return;
    
    // Illuminer la case réponse
    setHighlightedElement('answer-input');
    await playAudio("écrit ta réponse à cet endroit");
    if (stopSignalRef.current) return;
    
    await wait(1000);
    setHighlightedElement(null);
    
  } catch (error) {
    console.error('Erreur dans startExerciseExplanation:', error);
  } finally {
    setIsPlayingVocal(false);
  }
};

// Fonction pour animer l'explication d'une mauvaise réponse - EXERCICES
const explainWrongAnswer = async () => {
  if (stopSignalRef.current) return;
  
  console.log('❌ Explication mauvaise réponse pour exercice', currentExercise + 1);
  setIsExplainingError(true);
  setIsPlayingVocal(true);
  
  try {
    // Expression de pirate personnalisée
    const pirateExpression = pirateExpressions[currentExercise] || "Mille sabords";
    await playAudio(pirateExpression + " !");
    if (stopSignalRef.current) return;
    
    await wait(800);
    if (stopSignalRef.current) return;
    
    await playAudio("Laisse-moi t'expliquer avec les pièces d'or !");
    if (stopSignalRef.current) return;
    
    // Animation des trésors pour compter
    const targetNumber = parseInt(exercises[currentExercise].correctAnswer);
    const pirateObjectName = getPirateObjectName();
    
    setAnimatingPoints([]);
    await wait(500);
    
    // Compter une par une
    for (let i = 1; i <= targetNumber; i ++) {
      if (stopSignalRef.current) return;
      
      setAnimatingPoints(prev => [...prev, i]);
      await playAudio(`${i}`);
      
      if (stopSignalRef.current) return;
      await wait(600);
    }
    
    if (stopSignalRef.current) return;
    
    await playAudio(`Et voilà ! ${targetNumber} ${pirateObjectName} en tout !`);
    if (stopSignalRef.current) return;
    
    await wait(500);
    if (stopSignalRef.current) return;
    
    // Ajouter le récap vocal de la bonne réponse
    await playAudio(`Donc la bonne réponse était ${targetNumber} !`);
    if (stopSignalRef.current) return;
    
    await wait(1000);
    if (stopSignalRef.current) return;
    
    // Bouton suivant
    setShowNextButton(true);
    setHighlightNextButton(true);
    
    await wait(300); // Laisser le bouton apparaître
    if (stopSignalRef.current) return;
    
    await playAudio("appuie sur le bouton suivant pour passer au prochain exercice quand tu es prêt");
    if (stopSignalRef.current) return;
    
    // Scroll vers le bouton suivant
    setTimeout(() => {
      const nextButton = document.querySelector('.animate-pulse[class*="scale-110"]');
      if (nextButton) {
        nextButton.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 500);
    
  } catch (error) {
    console.error('Erreur dans explainWrongAnswer:', error);
  } finally {
    setIsPlayingVocal(false);
    setIsExplainingError(false);
    setAnimatingPoints([]);
  }
};