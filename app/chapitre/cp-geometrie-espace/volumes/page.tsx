'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import dynamic from 'next/dynamic';

// Import dynamique du composant 3D pour éviter les problèmes de SSR
const Volume3DViewer = dynamic(
  () => import('./components/Volume3DViewer'),
  { ssr: false }
);

interface MatchingItem {
  id: string;
  type: 'object' | 'shape';
  image: string;
  name: string;
  matches: string;
}

const matchingItems: MatchingItem[] = [
  {
    id: 'cube-shape',
    type: 'shape',
    image: '/images/solides et formes/formecube.png',
    name: 'Cube',
    matches: 'cube-object'
  },
  {
    id: 'cone-shape',
    type: 'shape',
    image: '/images/solides et formes/formecone.jpg',
    name: 'Cône',
    matches: 'cone-object'
  },
  {
    id: 'pyramide-object',
    type: 'object',
    image: '/images/solides et formes/pyramideegypte.png',
    name: 'Pyramide d\'Égypte',
    matches: 'pyramide-shape'
  },
  {
    id: 'parallelepipede-shape',
    type: 'shape',
    image: '/images/solides et formes/formeparallelep.png',
    name: 'Parallélépipède',
    matches: 'parallelepipede-object'
  },
  {
    id: 'cone-object',
    type: 'object',
    image: '/images/solides et formes/coneobjet.png',
    name: 'Cône de signalisation',
    matches: 'cone-shape'
  },
  {
    id: 'cube-object',
    type: 'object',
    image: '/images/solides et formes/dé2.png',
    name: 'Dé',
    matches: 'cube-shape'
  },
  {
    id: 'parallelepipede-object',
    type: 'object',
    image: '/images/solides et formes/paquetcadeau.png',
    name: 'Paquet Cadeau',
    matches: 'parallelepipede-shape'
  },
  {
    id: 'pyramide-shape',
    type: 'shape',
    image: '/images/solides et formes/formepyramide.png',
    name: 'Pyramide',
    matches: 'pyramide-object'
  }
];

export default function VolumesCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentExample, setCurrentExample] = useState<number | null>(0); // Commencer avec le premier volume
  const [showingProcess, setShowingProcess] = useState<'observation' | 'characteristics' | 'result' | null>('observation');
  const [animatingShape, setAnimatingShape] = useState(true);
  const [rotationProgress, setRotationProgress] = useState<number>(0);

  // États pour les exercices
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // États pour le jeu de matching
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);

  // Fonction pour la synthèse vocale
  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // États pour le memory
  const [memoryCards, setMemoryCards] = useState(() => {
    // Fonction de mélange Fisher-Yates
    const shuffleArray = <T extends unknown>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Créer toutes les cartes possibles
    const allCards = [
      { id: 'cube-name', type: 'name', content: 'cube', isFlipped: false, isMatched: false },
      { id: 'cube-shape', type: 'shape', content: 'cube', isFlipped: false, isMatched: false },
      { id: 'pave-name', type: 'name', content: 'pavé droit', isFlipped: false, isMatched: false },
      { id: 'pave-shape', type: 'shape', content: 'pavé droit', isFlipped: false, isMatched: false },
      { id: 'sphere-name', type: 'name', content: 'sphère', isFlipped: false, isMatched: false },
      { id: 'sphere-shape', type: 'shape', content: 'sphère', isFlipped: false, isMatched: false },
      { id: 'cylindre-name', type: 'name', content: 'cylindre', isFlipped: false, isMatched: false },
      { id: 'cylindre-shape', type: 'shape', content: 'cylindre', isFlipped: false, isMatched: false }
    ];

    // Mélanger les cartes avec l'algorithme Fisher-Yates
    return shuffleArray(allCards);
  });
  const [memoryMatchedPairs, setMemoryMatchedPairs] = useState<Set<string>>(new Set());
  const [memoryAttempts, setMemoryAttempts] = useState(0);
  const [showMemorySuccess, setShowMemorySuccess] = useState(false);
  const [firstCard, setFirstCard] = useState<number | null>(null);
  const [canFlip, setCanFlip] = useState(true);

  const handleMemoryCardClick = (index: number) => {
    if (!canFlip || memoryCards[index].isFlipped || memoryCards[index].isMatched) return;

    const newCards = [...memoryCards];
    newCards[index].isFlipped = true;
    setMemoryCards(newCards);

    // Lecture vocale automatique quand on retourne une carte avec un nom
    if (memoryCards[index].type === 'name') {
      playAudio(memoryCards[index].content);
    }

    if (firstCard === null) {
      setFirstCard(index);
    } else {
      setCanFlip(false);
      setMemoryAttempts(prev => prev + 1);

      const firstCardContent = memoryCards[firstCard].content;
      const secondCardContent = memoryCards[index].content;
      
      if (firstCardContent === secondCardContent) {
        // Match trouvé
        setTimeout(() => {
          const newCards = [...memoryCards];
          newCards[firstCard].isMatched = true;
          newCards[index].isMatched = true;
          setMemoryCards(newCards);
          setMemoryMatchedPairs(prev => new Set([...prev, firstCardContent]));
          setFirstCard(null);
          setCanFlip(true);

          // Message personnalisé selon la forme trouvée
          const messages = {
            'cube': "Super ! Tu as trouvé le cube !",
            'pavé droit': "Super ! Tu as trouvé le pavé droit !",
            'sphère': "Super ! Tu as trouvé la sphère !",
            'cylindre': "Super ! Tu as trouvé le cylindre !"
          };

          // Vérifier si toutes les paires sont trouvées
          if (memoryMatchedPairs.size + 1 === volumes3D.length) {
            setShowMemorySuccess(true);
            playAudio("Bravo ! Tu as trouvé toutes les paires !");
          } else {
            playAudio(messages[firstCardContent]);
          }
        }, 1000);
      } else {
        // Pas de match
        setTimeout(() => {
          const newCards = [...memoryCards];
          newCards[firstCard].isFlipped = false;
          newCards[index].isFlipped = false;
          setMemoryCards(newCards);
          setFirstCard(null);
          setCanFlip(true);
        }, 1500);
      }
    }
  };



  const handleItemClick = (itemId: string) => {
    if (matchedPairs.has(itemId)) return;

    if (selectedItem === null) {
      setSelectedItem(itemId);
      return;
    }

    const selectedItemData = matchingItems.find(item => item.id === selectedItem);
    const clickedItemData = matchingItems.find(item => item.id === itemId);

    if (!selectedItemData || !clickedItemData) return;

    setAttempts(prev => prev + 1);

    if (selectedItemData.matches === itemId) {
      // Correct match
      setMatchedPairs(prev => new Set([...prev, selectedItem, itemId]));
    }

    setSelectedItem(null);
  };

  // Volumes 3D à apprendre
  const volumes3D = [
    {
      name: 'cube',
      emoji: '🎲',
      story: 'Un cube est comme une boîte avec 6 faces carrées identiques',
      characteristics: [
        'Il a 6 faces carrées égales',
        'Il a 8 sommets',
        'Il a 12 arêtes de même longueur'
      ],
      proprietes: [
        'Toutes ses faces sont des carrés 🟦',
        'Il peut tenir debout sur n\'importe quelle face',
        'Il ne roule pas'
      ],
      explications: 'Le cube est comme un dé : tous ses côtés sont pareils ! C\'est la forme parfaite pour construire des blocs.',
      examples: ['🎲 dé', '📦 boîte', '🧊 glaçon', '🎁 cadeau', '🗄️ casier']
    },
    {
      name: 'pavé droit',
      emoji: '📦',
      story: 'Un pavé droit est comme une boîte de chaussures avec 6 faces rectangulaires',
      characteristics: [
        'Il a 6 faces rectangulaires',
        'Il a 8 sommets',
        'Il a 12 arêtes (certaines plus longues que d\'autres)'
      ],
      proprietes: [
        'Ses faces sont des rectangles 📏',
        'Il a une longueur, une largeur et une hauteur',
        'Il peut tenir debout comme une boîte'
      ],
      explications: 'Le pavé droit est comme une boîte à chaussures : elle est plus longue que large ! On en voit partout dans la maison.',
      examples: ['📱 téléphone', '📚 livre', '🏠 maison', '📺 télé', '🚌 bus']
    },
    {
      name: 'sphère',
      emoji: '⚽',
      story: 'Une sphère est ronde comme une balle, pareille de tous les côtés',
      characteristics: [
        'Elle est parfaitement ronde',
        'Elle roule dans toutes les directions',
        'Elle n\'a ni faces, ni sommets, ni arêtes'
      ],
      proprietes: [
        'Elle est toute ronde comme une balle ⚽',
        'Elle roule dans tous les sens',
        'Elle n\'a pas de coins pointus'
      ],
      explications: 'La sphère est la forme la plus ronde qui existe ! Comme un ballon de foot, elle roule parfaitement dans toutes les directions.',
      examples: ['⚽ ballon', '🌍 Terre', '🍊 orange', '🎱 bille', '🪀 yoyo']
    },
    {
      name: 'cylindre',
      emoji: '🥫',
      story: 'Un cylindre est comme une boîte de conserve avec deux faces rondes',
      characteristics: [
        'Il a 2 faces rondes (cercles)',
        'Il a une surface courbe',
        'Il roule sur le côté'
      ],
      proprietes: [
        'Il a deux faces rondes aux bouts ⭕',
        'Il roule seulement sur le côté',
        'Il peut tenir debout sur ses faces rondes'
      ],
      explications: 'Le cylindre est comme un rouleau de papier toilette : il a deux bouts ronds et peut rouler sur le côté ! On peut aussi le poser debout.',
      examples: ['🥫 conserve', '📏 crayon', '🧻 rouleau', '🥤 verre', '🪣 seau']
    }
  ];

  // Exercices sur les volumes
  const exercises = [
    { 
      question: 'Quelle forme a 6 faces carrées égales ?', 
      correctAnswer: 'cube',
      choices: ['pavé droit', 'cube', 'sphère'],
      hint: 'Comme un dé à jouer...'
    },
    { 
      question: 'Combien de faces a un pavé droit ?', 
      correctAnswer: '6',
      choices: ['4', '6', '8'],
      visual: '📦'
    },
    { 
      question: 'Quelle forme n\'a ni faces, ni sommets ?', 
      correctAnswer: 'sphère',
      choices: ['cylindre', 'cube', 'sphère'],
      hint: 'Elle est parfaitement ronde...'
    },
    { 
      question: 'Un cylindre a combien de faces rondes ?', 
      correctAnswer: '2',
      choices: ['1', '2', '3'],
      visual: '🥫'
    },
    { 
      question: 'Quelle forme roule dans toutes les directions ?', 
      correctAnswer: 'sphère',
      choices: ['cube', 'cylindre', 'sphère'],
      hint: 'Comme un ballon de foot...'
    },
    { 
      question: 'Combien de sommets a un cube ?', 
      correctAnswer: '8',
      choices: ['6', '8', '12'],
      visual: '🎲'
    },
    { 
      question: 'Quelle forme roule seulement sur le côté ?', 
      correctAnswer: 'cylindre',
      choices: ['sphère', 'cube', 'cylindre'],
      hint: 'Comme une boîte de conserve...'
    },
    { 
      question: 'Un pavé droit a des faces...', 
      correctAnswer: 'rectangulaires',
      choices: ['carrées', 'rectangulaires', 'rondes'],
      visual: '📦'
    },
    { 
      question: 'Quelle forme ressemble à une balle ?', 
      correctAnswer: 'sphère',
      choices: ['cube', 'cylindre', 'sphère'],
      hint: '⚽ Elle est ronde comme un ballon...'
    },
    { 
      question: 'Toutes ces formes ont des faces SAUF...', 
      correctAnswer: 'la sphère',
      choices: ['le cube', 'la sphère', 'le cylindre'],
      hint: 'Une forme parfaitement ronde...'
    }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effet pour gérer les changements d'onglet
  useEffect(() => {
    stopAllAnimations();
  }, [showExercises]);

  // Fonction pour arrêter toutes les animations et vocaux
  const stopAllAnimations = () => {
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setShowingProcess(null);
    setAnimatingShape(false);
    setRotationProgress(0);
  };


  // Animation d'observation d'un volume
  const animateVolumeObservation = async (volume: typeof volumes3D[0]) => {
    if (stopSignalRef.current) return;
    
    setAnimatingShape(true);
    setShowingProcess('observation');
    setCurrentExample(volumes3D.indexOf(volume));
    setRotationProgress(0);
    
    await playAudio(`Découvrons le ${volume.name}. ${volume.story}`);
    
    if (stopSignalRef.current) return;
    
    // Animation de rotation
    await playAudio('Observons-le sous tous les angles !');
    
    for (let angle = 0; angle < 360; angle += 45) {
      if (stopSignalRef.current) return;
      setRotationProgress(angle);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setRotationProgress(0);
    
    if (stopSignalRef.current) return;
    
    // Phase des caractéristiques
    setShowingProcess('characteristics');
    setHighlightedElement('characteristics');
    
    await playAudio(`Voici les caractéristiques du ${volume.name} :`);
    
    for (let i = 0; i < volume.characteristics.length; i++) {
      if (stopSignalRef.current) return;
      
      setHighlightedElement(`characteristic-${i}`);
      
      await playAudio(volume.characteristics[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (stopSignalRef.current) return;
    
    // Exemples dans la vie
    setShowingProcess('result');
    setHighlightedElement('examples');
    
    await playAudio(`Tu peux trouver des ${volume.name}s partout autour de toi !`);
    
    const exampleText = volume.examples.join(', ');
    await playAudio(`Par exemple : ${exampleText}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAnimatingShape(false);
    setShowingProcess(null);
    setHighlightedElement(null);
    setRotationProgress(0);
  };

  // Démarrer la leçon complète
  const startLesson = async () => {
    if (isAnimationRunning) {
      stopAllAnimations();
      return;
    }
    
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setIsPlayingVocal(true);
    setHasStarted(true);
    
    try {
      // Introduction
      setHighlightedElement('introduction');
      await playAudio('Bonjour petit explorateur ! Aujourd\'hui, nous allons découvrir les volumes, ces formes en 3 dimensions qui nous entourent !');
      
      if (stopSignalRef.current) return;
      
      setHighlightedElement('volumes-explanation');
      await playAudio('Nous allons apprendre 4 volumes magiques : le cube, le pavé droit, la sphère et le cylindre. Chaque volume a ses secrets !');
      
      if (stopSignalRef.current) return;
      
      // Démonstration de chaque volume
      for (const volume of volumes3D) {
        if (stopSignalRef.current) return;
        await animateVolumeObservation(volume);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (stopSignalRef.current) return;
      
      // Récapitulatif
      setHighlightedElement('summary');
      await playAudio('Bravo ! Tu connais maintenant les 4 volumes de base. Tu es devenu un vrai expert des formes en 3D !');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Exercices
      setHighlightedElement('exercises');
      await playAudio('Maintenant, amusons-nous à reconnaître les volumes avec des exercices passionnants !');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowExercises(true);
      
    } catch (error) {
      console.error('Erreur dans la leçon:', error);
    } finally {
      setIsAnimationRunning(false);
      setIsPlayingVocal(false);
      setHighlightedElement(null);
    }
  };

  // Gestion des exercices
  const handleAnswerSubmit = async () => {
    if (!userAnswer) return;
    
    const currentEx = exercises[currentExercise];
    const correct = userAnswer === currentEx.correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setAnsweredCorrectly(prev => new Set(Array.from(prev).concat([currentExercise])));
      await playAudio('Excellent ! Tu reconnais parfaitement les volumes !');
    } else {
      await playAudio(`Pas tout à fait ! La bonne réponse était "${currentEx.correctAnswer}". ${currentEx.hint || 'Observe bien les caractéristiques de chaque volume !'}`);
    }
    
    setTimeout(() => {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setUserAnswer('');
        setIsCorrect(null);
      } else {
        // Fin des exercices
        const finalScore = ((score + (correct ? 1 : 0)) / exercises.length) * 100;
        setFinalScore(Math.round(finalScore));
        setShowCompletionModal(true);
      }
    }, 2000);
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setShowExercises(false);
  };

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-geometrie-espace" 
            onClick={stopAllAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la géométrie et espace</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📦 Les volumes
            </h1>
            <p className="text-lg text-gray-600">
              Découvre les formes en 3D : cube, pavé droit, sphère et cylindre !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                stopAllAnimations();
                setShowExercises(false);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-purple-100 text-purple-800 shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📚 Cours
            </button>
            <button
              onClick={() => {
                stopAllAnimations();
                setShowExercises(true);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-purple-100 text-purple-800 shadow-md' 
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

            {/* Explication du concept */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'introduction' ? 'ring-4 ring-purple-400 bg-purple-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Qu'est-ce qu'un volume ?
              </h2>
              
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-purple-800 font-semibold mb-6">
                  Les volumes sont des formes en 3D qui occupent de l'espace ! Apprends à les reconnaître comme un vrai architecte !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-purple-600 mb-4">
                      {currentExample !== null ? 
                        `Découvrons : ${volumes3D[currentExample].name} ${volumes3D[currentExample].emoji}` 
                        : 'Les 4 volumes magiques 🎨'
                      }
                    </div>
                  </div>
                
                  {/* Démonstrations des volumes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                    {volumes3D.map((volume, index) => (
                      <div 
                        key={index} 
                        className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all"
                      >
                        <div className="flex flex-col h-full">
                          {/* En-tête avec emoji et nom */}
                          <div className="text-center mb-2">
                            <div className="text-3xl mb-1">{volume.emoji}</div>
                            <h4 className="font-bold text-purple-700 text-base">{volume.name}</h4>
                            <div className="bg-white rounded-lg p-1">
                              <p className="text-xs text-gray-700">{volume.characteristics[0]}</p>
                            </div>
                          </div>

                          {/* Visualisation 3D interactive */}
                          <div className="h-[220px] flex items-center justify-center mb-2">
                            <Volume3DViewer
                              volumeType={volume.name === 'cube' ? 'cube' : 
                                        volume.name === 'pavé droit' ? 'pave' :
                                        volume.name === 'sphère' ? 'sphere' : 'cylindre'}
                              width={200}
                              height={200}
                            />
                          </div>

                          {/* Propriété principale avec animation */}
                          <div 
                            className="bg-white rounded-xl p-3 mb-4 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                            onClick={() => playAudio(volume.proprietes[0])}
                          >
                            <div className="flex items-center justify-center text-lg text-gray-700">
                              <span className="animate-bounce mr-2">👆</span>
                              {volume.proprietes[0]}
                            </div>
                          </div>

                          {/* Exemples interactifs */}
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            {volume.examples.slice(0, 3).map((example, idx) => (
                              <div
                                key={idx}
                                className="group bg-purple-50 p-2 rounded-lg text-center cursor-pointer hover:bg-purple-100 transition-all transform hover:scale-105"
                              >
                                <div className="text-2xl">{example.split(' ')[0]}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Zone d'animation pour chaque volume */}
                        {currentExample === index && animatingShape && (
                          <div className="mt-4">
                            {/* Caractéristiques */}
                            {showingProcess === 'characteristics' && (
                              <div className="bg-purple-100 rounded-lg p-3 mt-2">
                                <h5 className="font-bold text-purple-800 mb-2 text-xs">Caractéristiques :</h5>
                                <ul className="space-y-1">
                                  {volume.characteristics.map((char, charIndex) => (
                                    <li
                                      key={charIndex}
                                      className={`text-xs transition-all duration-500 ${
                                        highlightedElement === `characteristic-${charIndex}`
                                          ? 'text-purple-800 font-bold' 
                                          : 'text-purple-600'
                                      }`}
                                    >
                                      • {char}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Exemples */}
                            {showingProcess === 'result' && highlightedElement === 'examples' && (
                              <div className="bg-green-100 rounded-lg p-3 mt-2 animate-pulse">
                                <h5 className="font-bold text-green-800 mb-2 text-xs">Tu peux voir des {volume.name}s :</h5>
                                <div className="flex flex-wrap gap-1">
                                  {volume.examples.map((example, exIndex) => (
                                    <span
                                      key={exIndex}
                                      className="bg-white px-1 py-0.5 rounded text-xs text-green-700"
                                    >
                                      {example}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                
                  {/* Récapitulatif */}
                  <div className={`mt-6 p-4 rounded-xl transition-all duration-500 ${
                    highlightedElement === 'summary' ? 'bg-green-200 scale-110' : 'bg-gray-100'
                  }`}>
                    <p className="text-center font-medium text-purple-800">
                      🔍 <strong>Maintenant tu peux :</strong> Reconnaître tous les volumes autour de toi !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activité 1: Jeu de matching */}
            <div className="bg-white rounded-xl p-6 shadow-lg mt-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
                Activité 1 : Trouve les objets qui correspondent !
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Clique sur deux images qui vont ensemble : l'objet et sa forme géométrique
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {matchingItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`
                      relative h-[200px] bg-white rounded-lg shadow-sm cursor-pointer
                      transition-all transform hover:scale-102
                      ${matchedPairs.has(item.id) ? 'opacity-50' : ''}
                      ${selectedItem === item.id ? 'ring-2 ring-purple-500' : ''}
                    `}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <Image
                        src={item.image || ''}
                        alt={item.name}
                        width={140}
                        height={140}
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-gray-600">
                Paires trouvées : {matchedPairs.size / 2} sur {matchingItems.length / 2} • Essais : {attempts}
              </div>
            </div>

            {/* Activité 2: Memory des Volumes */}
            <div className="bg-white rounded-xl p-6 shadow-lg mt-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
                Activité 2 : Memory des Volumes 🎴
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Retrouve les paires en associant le nom du volume et sa forme !
                Clique sur le nom pour l'entendre 🔊
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {memoryCards.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => handleMemoryCardClick(index)}
                    className={`
                      h-32 sm:h-40 bg-gradient-to-br cursor-pointer
                      transition-all transform perspective-1000
                      ${card.isFlipped ? 'rotate-y-180' : ''}
                      ${card.isMatched ? 'opacity-50' : 'hover:scale-102'}
                      ${!card.isFlipped ? 'from-purple-500 to-indigo-600' : 'bg-white'}
                      rounded-xl shadow-md flex items-center justify-center
                    `}
                  >
                    <div className={`w-full h-full flex items-center justify-center transition-all duration-300 ${card.isFlipped ? '' : 'text-white'}`}>
                      {!card.isFlipped ? (
                        <span className="text-2xl">❔</span>
                      ) : (
                        <div className="w-full h-full p-2">
                          {card.type === 'name' ? (
                            <div className="w-full h-full flex items-center justify-center text-center bg-purple-50 rounded-lg">
                              <span className="text-sm font-bold text-purple-800">{card.content}</span>
                            </div>
                          ) : (
                            <Image
                              src={card.content === 'pavé droit' 
                                ? '/images/solides et formes/formeparallelep.png'
                                : card.content === 'cube'
                                ? '/images/solides et formes/formecube.png'
                                : card.content === 'cylindre'
                                ? '/images/solides et formes/boiteconserve.png'
                                : '/images/solides et formes/ballon.png'}
                              alt={card.content}
                              width={60}
                              height={60}
                              className="object-contain w-full h-full"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-gray-600">
                Paires trouvées : {memoryMatchedPairs.size / 2} sur {memoryCards.length / 4} • Essais : {memoryAttempts}
              </div>
              {showMemorySuccess && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg text-center animate-bounce">
                  Bravo ! Tu as trouvé toutes les paires ! 🎉
                </div>
              )}
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-purple-800 mb-4 text-center">
                🎁 Conseils pour reconnaître les volumes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">👀</div>
                  <h4 className="font-bold text-purple-700 mb-2">Observe les faces</h4>
                  <p className="text-purple-600">Compte les faces et leur forme</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">📐</div>
                  <h4 className="font-bold text-purple-700 mb-2">Regarde les arêtes</h4>
                  <p className="text-purple-600">Droites ou courbes ? Combien ?</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🔄</div>
                  <h4 className="font-bold text-purple-700 mb-2">Fais-le rouler</h4>
                  <p className="text-purple-600">Comment se déplace-t-il ?</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🔍</div>
                  <h4 className="font-bold text-purple-700 mb-2">Cherche autour de toi</h4>
                  <p className="text-purple-600">Les volumes sont partout !</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="bg-white rounded-xl p-8 shadow-lg">
            {!showCompletionModal ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-purple-800">
                    🔍 Exercice {currentExercise + 1}/{exercises.length}
                  </h3>
                  <div className="text-purple-600">
                    Score: {score}/{exercises.length}
                  </div>
                </div>
              
                <div className="mb-6">
                  <div className="bg-purple-50 rounded-xl p-6 mb-4">
                    <h4 className="text-lg font-semibold text-purple-800 mb-4">
                      {exercises[currentExercise].question}
                    </h4>
                    
                    {/* Visualisation de l'exercice */}
                    {exercises[currentExercise].visual && (
                      <div className="text-6xl text-center mb-4">
                        {exercises[currentExercise].visual}
                      </div>
                    )}
                    
                    {/* Indice */}
                    {exercises[currentExercise].hint && (
                      <div className="bg-yellow-100 rounded-lg p-3 mt-4">
                        <p className="text-sm text-yellow-800">
                          💡 <strong>Indice :</strong> {exercises[currentExercise].hint}
                        </p>
                      </div>
                    )}
                  </div>
              
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {exercises[currentExercise].choices.map((choice, index) => (
                      <button
                        key={index}
                        onClick={() => setUserAnswer(choice)}
                        className={`p-4 rounded-xl border-2 transition-all text-center font-medium ${
                          userAnswer === choice
                            ? 'border-purple-400 bg-purple-100 text-purple-800'
                            : 'border-gray-200 bg-white hover:border-purple-300 text-gray-700 hover:bg-purple-50'
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={!userAnswer}
                    className="bg-purple-100 hover:bg-purple-200 disabled:bg-gray-100 text-purple-800 disabled:text-gray-500 px-6 py-3 rounded-xl font-bold transition-all disabled:cursor-not-allowed"
                  >
                    Valider
                  </button>
                </div>

                {isCorrect !== null && (
                  <div className={`mt-4 p-4 rounded-xl text-center ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isCorrect ? (
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 mr-2" />
                        Excellent ! Tu reconnais parfaitement les volumes !
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <XCircle className="w-6 h-6 mr-2" />
                        La bonne réponse était : {exercises[currentExercise].correctAnswer}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {finalScore >= 80 ? '🏆' : finalScore >= 60 ? '🎉' : '💪'}
                </div>
                <h3 className="text-2xl font-bold text-purple-800 mb-4">
                  {finalScore >= 80 ? 'Expert des volumes !' : finalScore >= 60 ? 'Bravo explorateur !' : 'Continue à explorer !'}
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  Tu as obtenu {score}/{exercises.length} bonnes réponses
                  <br />
                  Score : {finalScore}%
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={resetExercises}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-6 py-3 rounded-xl font-bold transition-all"
                  >
                    <RotateCcw className="inline w-5 h-5 mr-2" />
                    Recommencer
                  </button>
                  <Link
                    href="/chapitre/cp-geometrie-espace"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold transition-all inline-block"
                  >
                    Retour au chapitre
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}